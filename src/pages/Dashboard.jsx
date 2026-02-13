import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useCurrentUser } from "../components/crm/useCurrentUser";
import { formatINR } from "../components/crm/constants";
import StatCard from "../components/crm/StatCard";
import FunnelChart from "../components/crm/FunnelChart";
import SourceBreakdown from "../components/crm/SourceBreakdown";
import { Target, Users, TrendingUp, Flame, DollarSign, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

export default function Dashboard() {
  const { user } = useCurrentUser();
  const { data: leads = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: () => base44.entities.Lead.list("-created_date", 500),
  });
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => base44.entities.Task.list("-created_date", 200),
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const newToday = leads.filter(l => new Date(l.created_date) >= today).length;
  const thisMonth = leads.filter(l => {
    const d = new Date(l.created_date);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });
  const activeLeads = leads.filter(l => !["closed_won", "closed_lost", "junk"].includes(l.funnel_stage));
  const hotLeads = leads.filter(l => l.lead_temperature === "hot" && !["closed_won", "closed_lost", "junk"].includes(l.funnel_stage));
  const pipelineValue = activeLeads.reduce((sum, l) => sum + (l.budget_max || l.budget_min || 0), 0);
  const closedWonMonth = thisMonth.filter(l => l.funnel_stage === "closed_won");
  const closedValue = closedWonMonth.reduce((sum, l) => sum + (l.budget_max || l.budget_min || 0), 0);
  const overdueTasks = tasks.filter(t => t.status === "pending" && t.due_at && new Date(t.due_at) < new Date());
  const todayTasks = tasks.filter(t => t.status === "pending" && t.due_at && new Date(t.due_at).toDateString() === new Date().toDateString());

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {user?.full_name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-sm text-slate-500 mt-1">Here's your real estate pipeline at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="New Today" value={newToday} icon={Target} color="blue" />
        <StatCard title="This Month" value={thisMonth.length} icon={TrendingUp} color="indigo" />
        <StatCard title="Active" value={activeLeads.length} icon={Users} color="purple" />
        <StatCard title="Hot Leads" value={hotLeads.length} icon={Flame} color="red" />
        <StatCard title="Pipeline" value={formatINR(pipelineValue)} icon={DollarSign} color="amber" />
        <StatCard title="Won (Month)" value={formatINR(closedValue)} subtitle={`${closedWonMonth.length} deals`} icon={CheckCircle2} color="green" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <FunnelChart leads={leads} />
        <SourceBreakdown leads={leads} />
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Overdue tasks */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Tasks Due Today ({todayTasks.length})</h3>
            <Link to={createPageUrl("Tasks")} className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          {todayTasks.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No tasks due today</p>
          ) : (
            <div className="space-y-2">
              {todayTasks.slice(0, 5).map(t => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{t.title}</p>
                    {t.lead_name && <p className="text-xs text-slate-400">{t.lead_name}</p>}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    t.priority === "high" ? "bg-red-50 text-red-600" : t.priority === "medium" ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500"
                  }`}>{t.priority}</span>
                </div>
              ))}
            </div>
          )}
          {overdueTasks.length > 0 && (
            <div className="mt-3 px-3 py-2 bg-red-50 rounded-lg">
              <p className="text-xs text-red-600 font-medium">⚠ {overdueTasks.length} overdue tasks need attention</p>
            </div>
          )}
        </div>

        {/* Hot leads */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Hot Leads ({hotLeads.length})</h3>
            <Link to={createPageUrl("Leads")} className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          {hotLeads.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No hot leads yet</p>
          ) : (
            <div className="space-y-2">
              {hotLeads.slice(0, 5).map(l => (
                <Link
                  key={l.id}
                  to={createPageUrl("LeadDetail") + `?id=${l.id}`}
                  className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded px-1 -mx-1"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-700">{l.full_name}</p>
                    <p className="text-xs text-slate-400">{l.preferred_city} · {l.property_type}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{formatINR(l.budget_max || l.budget_min)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}