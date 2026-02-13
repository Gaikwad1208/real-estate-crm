import React from "react";
import { SOURCE_TYPES } from "./constants";

export default function SourceBreakdown({ leads = [] }) {
  const sourceCounts = SOURCE_TYPES.map(source => ({
    ...source,
    count: leads.filter(l => l.source_type === source.key).length,
    won: leads.filter(l => l.source_type === source.key && l.funnel_stage === "closed_won").length,
  })).filter(s => s.count > 0).sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Leads by Source</h3>
      {sourceCounts.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-6">No lead data yet</p>
      ) : (
        <div className="space-y-2">
          {sourceCounts.map(source => (
            <div key={source.key} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${source.color}`}>
                  {source.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="font-semibold text-slate-700">{source.count}</span>
                {source.won > 0 && (
                  <span className="text-green-600 font-medium">{source.won} won</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}