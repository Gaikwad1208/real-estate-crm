// Property Matching Algorithm
// Scores properties 0-100 based on lead requirements

export function matchPropertyToLead(property, lead) {
  let score = 0;

  // 1. Location Match (0-30 points)
  if (property.city && lead.preferred_city) {
    if (property.city.toLowerCase() === lead.preferred_city.toLowerCase()) {
      score += 20;
      // Area match bonus
      if (property.area && lead.preferred_area) {
        if (property.area.toLowerCase().includes(lead.preferred_area.toLowerCase()) ||
            lead.preferred_area.toLowerCase().includes(property.area.toLowerCase())) {
          score += 10;
        }
      }
    }
  }

  // 2. Property Type Match (0-20 points)
  if (property.property_type && lead.property_type) {
    if (property.property_type === lead.property_type) {
      score += 20;
    }
  }

  // 3. Budget Match (0-30 points)
  if (property.price) {
    const leadBudgetMin = lead.budget_min || 0;
    const leadBudgetMax = lead.budget_max || Infinity;
    
    if (property.price >= leadBudgetMin && property.price <= leadBudgetMax) {
      score += 30; // Perfect match
    } else if (property.price <= leadBudgetMax * 1.1) {
      score += 20; // Within 10% over budget
    } else if (property.price >= leadBudgetMin * 0.9) {
      score += 15; // Within 10% under budget
    } else if (property.price <= leadBudgetMax * 1.2) {
      score += 10; // Within 20% over budget
    }
  }

  // 4. Configuration Match (0-15 points)
  if (property.configuration && lead.bedrooms) {
    const propBedrooms = parseInt(property.configuration) || 0;
    if (propBedrooms === lead.bedrooms) {
      score += 15;
    } else if (Math.abs(propBedrooms - lead.bedrooms) === 1) {
      score += 8; // Off by 1 bedroom
    }
  }

  // 5. Availability (0-5 points)
  if (property.status === "available") {
    score += 5;
  } else if (property.status === "under_negotiation") {
    score += 2;
  }

  return Math.min(Math.round(score), 100);
}

export function findTopMatches(properties, lead, limit = 5) {
  return properties
    .filter(p => p.status === "available" || p.status === "under_negotiation")
    .map(property => ({
      property,
      score: matchPropertyToLead(property, lead),
    }))
    .filter(m => m.score >= 40) // Only show decent matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export async function autoMatchLeadsToProperties(base44) {
  // This would be called periodically (e.g., via automation rule)
  // to auto-create property matches for new leads
  
  const leads = await base44.entities.Lead.filter({ 
    funnel_stage: { $in: ["new", "contacted", "qualified"] } 
  }, "-created_date", 100);
  
  const properties = await base44.entities.Property.filter({ 
    status: { $in: ["available", "under_negotiation"] } 
  }, "-created_date", 200);

  for (const lead of leads) {
    const matches = findTopMatches(properties, lead, 3);
    
    for (const match of matches) {
      if (match.score >= 60) { // Only auto-create high-quality matches
        // Check if match already exists
        const existing = await base44.entities.LeadPropertyMatch.filter({
          lead_id: lead.id,
          property_id: match.property.id,
        });

        if (existing.length === 0) {
          await base44.entities.LeadPropertyMatch.create({
            lead_id: lead.id,
            property_id: match.property.id,
            match_score: match.score,
            status: "suggested",
            lead_name: lead.full_name,
            property_title: match.property.title,
          });
        }
      }
    }
  }
}