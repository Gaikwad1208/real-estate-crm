export const FUNNEL_STAGES = [
  { key: "new", label: "New", color: "bg-blue-500", lightColor: "bg-blue-50 text-blue-700 border-blue-200" },
  { key: "contacted", label: "Contacted", color: "bg-cyan-500", lightColor: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { key: "qualified", label: "Qualified", color: "bg-emerald-500", lightColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { key: "consultation_scheduled", label: "Consultation", color: "bg-violet-500", lightColor: "bg-violet-50 text-violet-700 border-violet-200" },
  { key: "site_visit_done", label: "Site Visit", color: "bg-amber-500", lightColor: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "negotiation", label: "Negotiation", color: "bg-orange-500", lightColor: "bg-orange-50 text-orange-700 border-orange-200" },
  { key: "under_contract", label: "Under Contract", color: "bg-pink-500", lightColor: "bg-pink-50 text-pink-700 border-pink-200" },
  { key: "closed_won", label: "Won", color: "bg-green-600", lightColor: "bg-green-50 text-green-700 border-green-200" },
  { key: "closed_lost", label: "Lost", color: "bg-red-500", lightColor: "bg-red-50 text-red-700 border-red-200" },
  { key: "on_hold", label: "On Hold", color: "bg-gray-400", lightColor: "bg-gray-50 text-gray-600 border-gray-200" },
  { key: "junk", label: "Junk", color: "bg-gray-600", lightColor: "bg-gray-100 text-gray-600 border-gray-300" },
];

export const KANBAN_STAGES = FUNNEL_STAGES.filter(s => !["on_hold", "junk"].includes(s.key));

export const SOURCE_TYPES = [
  { key: "facebook_ads", label: "Facebook Ads", color: "bg-blue-100 text-blue-800" },
  { key: "instagram_ads", label: "Instagram Ads", color: "bg-pink-100 text-pink-800" },
  { key: "google_ads", label: "Google Ads", color: "bg-yellow-100 text-yellow-800" },
  { key: "youtube_ads", label: "YouTube Ads", color: "bg-red-100 text-red-800" },
  { key: "portal_99acres", label: "99acres", color: "bg-green-100 text-green-800" },
  { key: "portal_magicbricks", label: "MagicBricks", color: "bg-orange-100 text-orange-800" },
  { key: "website_landing_page", label: "Website", color: "bg-indigo-100 text-indigo-800" },
  { key: "walkin", label: "Walk-in", color: "bg-teal-100 text-teal-800" },
  { key: "referral", label: "Referral", color: "bg-purple-100 text-purple-800" },
  { key: "csv_import", label: "CSV Import", color: "bg-gray-100 text-gray-800" },
  { key: "other", label: "Other", color: "bg-slate-100 text-slate-800" },
];

export const TEMPERATURE_CONFIG = {
  hot: { label: "Hot", color: "text-red-600", bg: "bg-red-50 border-red-200", icon: "🔥" },
  warm: { label: "Warm", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: "☀️" },
  cold: { label: "Cold", color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: "❄️" },
};

export const PROPERTY_TYPES = [
  { key: "apartment", label: "Apartment" },
  { key: "villa", label: "Villa" },
  { key: "plot", label: "Plot" },
  { key: "commercial", label: "Commercial" },
  { key: "other", label: "Other" },
];

export const TASK_TYPES = [
  { key: "followup_call", label: "Follow-up Call" },
  { key: "whatsapp_followup", label: "WhatsApp Follow-up" },
  { key: "email_followup", label: "Email Follow-up" },
  { key: "site_visit", label: "Site Visit" },
  { key: "documentation", label: "Documentation" },
  { key: "payment_followup", label: "Payment Follow-up" },
  { key: "generic", label: "Generic" },
];

export function formatINR(amount) {
  if (!amount && amount !== 0) return "—";
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

export function formatBudgetRange(min, max) {
  if (!min && !max) return "—";
  if (min && max) return `${formatINR(min)} - ${formatINR(max)}`;
  if (min) return `${formatINR(min)}+`;
  return `Up to ${formatINR(max)}`;
}

export function getStageConfig(stage) {
  return FUNNEL_STAGES.find(s => s.key === stage) || FUNNEL_STAGES[0];
}

export function getSourceConfig(source) {
  return SOURCE_TYPES.find(s => s.key === source) || SOURCE_TYPES[SOURCE_TYPES.length - 1];
}

export function timeAgo(dateStr) {
  if (!dateStr) return "Never";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export const ROLE_CAPABILITIES = {
  admin: ["view_all_leads", "edit_all_leads", "delete_leads", "manage_teams", "manage_users", "manage_automation", "view_reports", "import_leads", "manage_properties"],
  team_lead: ["view_team_leads", "edit_team_leads", "manage_team_tasks", "view_reports", "import_leads", "manage_properties"],
  agent: ["view_own_leads", "edit_own_leads", "manage_own_tasks", "view_own_reports"],
  telecaller: ["view_own_leads", "edit_own_leads", "manage_own_tasks"],
  viewer: ["view_all_leads", "view_reports"],
};

export function hasCapability(userRole, capability) {
  return (ROLE_CAPABILITIES[userRole] || []).includes(capability);
}