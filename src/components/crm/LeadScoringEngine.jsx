// Lead Scoring Algorithm
// Scores leads 0-100 based on various factors

export function calculateLeadScore(lead, activities = []) {
  let score = 0;

  // 1. Budget Score (0-25 points) - Higher budget = higher score
  if (lead.budget_max || lead.budget_min) {
    const budget = lead.budget_max || lead.budget_min;
    if (budget >= 50000000) score += 25; // 5Cr+
    else if (budget >= 30000000) score += 20; // 3-5Cr
    else if (budget >= 15000000) score += 15; // 1.5-3Cr
    else if (budget >= 5000000) score += 10; // 50L-1.5Cr
    else score += 5; // Below 50L
  }

  // 2. Timeline Score (0-20 points) - Urgency matters
  const timelineScores = {
    immediate_0_30: 20,
    short_30_90: 15,
    mid_3_6_months: 10,
    long_6plus: 5,
    just_exploring: 2,
  };
  score += timelineScores[lead.timeline] || 0;

  // 3. Financing Score (0-15 points) - Ready to buy?
  const financingScores = {
    cash: 15,
    preapproved_loan: 12,
    loan_required: 8,
    unsure: 3,
  };
  score += financingScores[lead.financing_status] || 0;

  // 4. Source Quality Score (0-10 points)
  const sourceScores = {
    referral: 10,
    walkin: 9,
    google_ads: 7,
    website_landing_page: 7,
    facebook_ads: 6,
    instagram_ads: 6,
    portal_99acres: 6,
    portal_magicbricks: 6,
    youtube_ads: 5,
    csv_import: 3,
    other: 3,
  };
  score += sourceScores[lead.source_type] || 0;

  // 5. Engagement Score (0-20 points) - Based on activities
  const outboundActivities = activities.filter(a => a.direction === "outbound").length;
  const inboundActivities = activities.filter(a => a.direction === "inbound").length;
  const siteVisits = activities.filter(a => a.type === "site_visit").length;

  score += Math.min(inboundActivities * 3, 10); // Inbound engagement (max 10)
  score += Math.min(siteVisits * 5, 5); // Site visits (max 5)
  score += Math.min(outboundActivities * 1, 5); // Our outreach (max 5)

  // 6. Recency Score (0-10 points) - Recent activity
  if (lead.last_contacted_at || lead.last_inbound_activity_at) {
    const lastActivity = new Date(lead.last_contacted_at || lead.last_inbound_activity_at);
    const daysSince = (new Date() - lastActivity) / (1000 * 60 * 60 * 24);
    if (daysSince <= 1) score += 10;
    else if (daysSince <= 3) score += 7;
    else if (daysSince <= 7) score += 5;
    else if (daysSince <= 14) score += 3;
    else score += 1;
  }

  return Math.min(Math.round(score), 100);
}

export function determineTemperature(score) {
  if (score >= 70) return "hot";
  if (score >= 40) return "warm";
  return "cold";
}

export function suggestNextAction(lead, activities = []) {
  const score = lead.lead_score || 0;
  const stage = lead.funnel_stage;
  const lastContact = lead.last_contacted_at ? new Date(lead.last_contacted_at) : null;
  const daysSinceContact = lastContact ? (new Date() - lastContact) / (1000 * 60 * 60 * 24) : 999;

  // Hot leads
  if (score >= 70) {
    if (stage === "new" || stage === "contacted") return "Schedule site visit immediately";
    if (stage === "qualified") return "Send property matches and schedule consultation";
    if (stage === "consultation_scheduled") return "Confirm site visit and prepare property presentation";
    if (stage === "site_visit_done") return "Follow up within 24 hours to discuss feedback";
    if (stage === "negotiation") return "Close the deal - send final offer";
  }

  // Warm leads
  if (score >= 40) {
    if (daysSinceContact > 3) return "Follow-up call or WhatsApp message needed";
    if (stage === "new") return "Initial call to qualify the lead";
    if (stage === "contacted") return "Share property options matching their budget";
    if (stage === "qualified") return "Schedule consultation call";
  }

  // Cold leads
  if (daysSinceContact > 7) return "Nurture campaign - send market updates";
  return "Continue nurturing with valuable content";
}