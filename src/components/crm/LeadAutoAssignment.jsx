// Auto-assignment logic for new leads

export async function autoAssignLead(lead, base44) {
  // Don't reassign if already assigned
  if (lead.assigned_agent_id) return lead;

  // Get all active users and teams
  const users = await base44.entities.User.list("-created_date", 100);
  const teams = await base44.entities.Team.list("-created_date", 50);
  const allLeads = await base44.entities.Lead.list("-created_date", 1000);

  // Strategy 1: Round-robin by city
  if (lead.preferred_city) {
    const agents = users.filter(u => u.user_role === "agent" || u.user_role === "team_lead");
    
    // Find agents with least leads in this city
    const agentLoads = agents.map(agent => ({
      agent,
      count: allLeads.filter(l => 
        l.assigned_agent_id === agent.id && 
        l.preferred_city === lead.preferred_city &&
        !["closed_won", "closed_lost", "junk"].includes(l.funnel_stage)
      ).length
    }));

    agentLoads.sort((a, b) => a.count - b.count);
    
    if (agentLoads.length > 0) {
      const selectedAgent = agentLoads[0].agent;
      await base44.entities.Lead.update(lead.id, {
        assigned_agent_id: selectedAgent.id,
      });

      // Create notification
      await base44.entities.LeadActivity.create({
        lead_id: lead.id,
        type: "system_automation",
        direction: "system",
        note: `Auto-assigned to ${selectedAgent.full_name || selectedAgent.email}`,
      });

      return { ...lead, assigned_agent_id: selectedAgent.id };
    }
  }

  // Strategy 2: Source-based assignment (high-value sources to senior agents)
  const highValueSources = ["referral", "walkin"];
  if (highValueSources.includes(lead.source_type)) {
    const teamLeads = users.filter(u => u.user_role === "team_lead");
    if (teamLeads.length > 0) {
      const randomLead = teamLeads[Math.floor(Math.random() * teamLeads.length)];
      await base44.entities.Lead.update(lead.id, {
        assigned_agent_id: randomLead.id,
      });
      return { ...lead, assigned_agent_id: randomLead.id };
    }
  }

  return lead;
}

export async function detectDuplicate(lead, allLeads) {
  // Check for duplicate phone number
  const phoneMatch = allLeads.find(l => 
    l.id !== lead.id && 
    l.primary_phone === lead.primary_phone &&
    !l.merged_into_lead_id
  );

  if (phoneMatch) {
    return { isDuplicate: true, existingLead: phoneMatch, matchType: "phone" };
  }

  // Check for duplicate email
  if (lead.email) {
    const emailMatch = allLeads.find(l => 
      l.id !== lead.id && 
      l.email && 
      l.email.toLowerCase() === lead.email.toLowerCase() &&
      !l.merged_into_lead_id
    );

    if (emailMatch) {
      return { isDuplicate: true, existingLead: emailMatch, matchType: "email" };
    }
  }

  // Check for similar name + city (fuzzy match)
  if (lead.full_name && lead.preferred_city) {
    const nameMatch = allLeads.find(l => 
      l.id !== lead.id &&
      l.full_name?.toLowerCase() === lead.full_name.toLowerCase() &&
      l.preferred_city?.toLowerCase() === lead.preferred_city.toLowerCase() &&
      !l.merged_into_lead_id
    );

    if (nameMatch) {
      return { isDuplicate: true, existingLead: nameMatch, matchType: "name_city" };
    }
  }

  return { isDuplicate: false };
}