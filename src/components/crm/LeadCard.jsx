import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { formatBudgetRange, getSourceConfig, TEMPERATURE_CONFIG, timeAgo } from "./constants";
import { Phone, Clock } from "lucide-react";
import QuickActions from "./QuickActions";

export default function LeadCard({ lead, compact = false }) {
  const source = getSourceConfig(lead.source_type);
  const temp = TEMPERATURE_CONFIG[lead.lead_temperature] || TEMPERATURE_CONFIG.cold;

  return (
    <Link
      to={createPageUrl("LeadDetail") + `?id=${lead.id}`}
      className="block bg-white rounded-lg border border-slate-200/80 p-3 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">{temp.icon}</span>
            <p className="text-sm font-semibold text-slate-800 truncate">{lead.full_name}</p>
          </div>
          {!compact && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {lead.preferred_city}{lead.preferred_area ? `, ${lead.preferred_area}` : ""}
              {lead.property_type ? ` · ${lead.property_type}` : ""}
            </p>
          )}
        </div>
        {lead.lead_score > 0 && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
            lead.lead_score >= 70 ? "bg-green-50 text-green-700" :
            lead.lead_score >= 40 ? "bg-amber-50 text-amber-700" :
            "bg-slate-50 text-slate-500"
          }`}>
            {lead.lead_score}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs font-medium text-slate-600">
          {formatBudgetRange(lead.budget_min, lead.budget_max)}
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${source.color}`}>
          {source.label}
        </span>
      </div>

      {!compact && (
        <>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {timeAgo(lead.last_contacted_at || lead.created_date)}
            </span>
            <span className="flex items-center gap-0.5">
              <Phone className="w-3 h-3" />
              {lead.primary_phone}
            </span>
          </div>
          <QuickActions lead={lead} />
        </>
      )}
    </Link>
  );
}