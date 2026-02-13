import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Upload, List, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import LeadFilters from "../components/crm/LeadFilters";
import LeadForm from "../components/crm/LeadForm";
import LeadCard from "../components/crm/LeadCard";
import { getStageConfig, getSourceConfig, TEMPERATURE_CONFIG, formatBudgetRange, timeAgo } from "../components/crm/constants";

export default function Leads() {
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [filters, setFilters] = useState({ search: "", stage: "", source: "", temperature: "", city: "", property_type: "" });
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => base44.entities.Lead.list("-created_date", 500),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Calculate lead score
      const { calculateLeadScore, determineTemperature } = await import("../components/crm/LeadScoringEngine");
      const score = calculateLeadScore(data, []);
      const temp = determineTemperature(score);
      
      return base44.entities.Lead.create({ ...data, lead_score: score, lead_temperature: temp });
    },
    onSuccess: async (newLead) => {
      // Auto-create first task
      await base44.entities.Task.create({
        lead_id: newLead.id,
        title: "First call follow-up",
        type: "followup_call",
        due_at: new Date(Date.now() + 3600000).toISOString(),
        status: "pending",
        priority: "high",
        lead_name: newLead.full_name,
      });
      await base44.entities.LeadActivity.create({
        lead_id: newLead.id,
        type: "note",
        direction: "system",
        note: "Lead created",
      });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setShowForm(false);
    },
  });

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (![l.full_name, l.primary_phone, l.email].some(v => v && v.toLowerCase().includes(s))) return false;
      }
      if (filters.stage && l.funnel_stage !== filters.stage) return false;
      if (filters.source && l.source_type !== filters.source) return false;
      if (filters.temperature && l.lead_temperature !== filters.temperature) return false;
      if (filters.city && l.preferred_city && !l.preferred_city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.property_type && l.property_type !== filters.property_type) return false;
      return true;
    });
  }, [leads, filters]);

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} of {leads.length} leads</p>
        </div>
        <div className="flex gap-2">
          <Link to={createPageUrl("ImportLeads")}>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
              <Upload className="w-3.5 h-3.5" /> Import
            </Button>
          </Link>
          <Button size="sm" className="h-9 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowForm(true)}>
            <Plus className="w-3.5 h-3.5" /> New Lead
          </Button>
        </div>
      </div>

      <LeadFilters filters={filters} setFilters={setFilters} />

      <div className="flex items-center gap-1 mb-2">
        <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-slate-200" : "hover:bg-slate-100"}`}>
          <List className="w-4 h-4 text-slate-600" />
        </button>
        <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-slate-200" : "hover:bg-slate-100"}`}>
          <LayoutGrid className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-sm text-slate-400">Loading leads...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-slate-400">No leads found</p>
          <Button size="sm" className="mt-4 bg-indigo-600" onClick={() => setShowForm(true)}>Create your first lead</Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(l => <LeadCard key={l.id} lead={l} />)}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Stage</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Source</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Budget</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">City</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Last Contact</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => {
                  const stg = getStageConfig(lead.funnel_stage);
                  const src = getSourceConfig(lead.source_type);
                  const temp = TEMPERATURE_CONFIG[lead.lead_temperature] || TEMPERATURE_CONFIG.cold;
                  return (
                    <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer" onClick={() => window.location.href = createPageUrl("LeadDetail") + `?id=${lead.id}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">{temp.icon}</span>
                          <span className="font-medium text-slate-800">{lead.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{lead.primary_phone}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${stg.lightColor}`}>{stg.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${src.color}`}>{src.label}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatBudgetRange(lead.budget_min, lead.budget_max)}</td>
                      <td className="px-4 py-3 text-slate-600">{lead.preferred_city || "—"}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{timeAgo(lead.last_contacted_at || lead.created_date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Lead</DialogTitle>
          </DialogHeader>
          <LeadForm onSubmit={data => createMutation.mutate(data)} onCancel={() => setShowForm(false)} loading={createMutation.isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
}