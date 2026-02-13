import React from "react";
import { KANBAN_STAGES } from "./constants";

export default function FunnelChart({ leads = [] }) {
  const stageCounts = KANBAN_STAGES.map(stage => ({
    ...stage,
    count: leads.filter(l => l.funnel_stage === stage.key).length,
  }));

  const maxCount = Math.max(...stageCounts.map(s => s.count), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Funnel Overview</h3>
      <div className="space-y-2.5">
        {stageCounts.map((stage, i) => {
          const prev = i === 0 ? stage.count : stageCounts[i - 1].count;
          const convRate = prev > 0 ? ((stage.count / prev) * 100).toFixed(0) : 0;
          return (
            <div key={stage.key} className="flex items-center gap-3">
              <div className="w-24 text-xs font-medium text-slate-600 text-right truncate">{stage.label}</div>
              <div className="flex-1 h-7 bg-slate-50 rounded-md overflow-hidden relative">
                <div
                  className={`h-full ${stage.color} rounded-md transition-all duration-700 ease-out opacity-80`}
                  style={{ width: `${Math.max((stage.count / maxCount) * 100, 2)}%` }}
                />
                <span className="absolute inset-0 flex items-center px-3 text-xs font-semibold text-slate-700">
                  {stage.count}
                </span>
              </div>
              {i > 0 && (
                <span className="text-[10px] text-slate-400 w-10 text-right">{convRate}%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}