import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Phone, MessageSquare, Mail, MapPin, Pencil, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { FUNNEL_STAGES, getStageConfig, getSourceConfig, TEMPERATURE_CONFIG, formatBudgetRange, formatINR, timeAgo } from "../components/crm/constants";
import LeadForm from "../components/crm/LeadForm";
import ActivityTimeline from "../components/crm/ActivityTimeline";

export default function LeadDetail() {
  const id = new URLSearchParams(window.location.search).get("id");
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: lead, isLoading } = useQuery({
    queryKey: ["lead", id],
    queryFn: () => base44.entities.Lead.filter({ id }),
    select: data => data?.[0],
    enabled: !!id,
  });

  const { data: activities = [] } = useQuery({
    queryKey: ["activities", id],
    queryFn: () => base44.entities.LeadActivity.filter({ lead_id: id }, "-created_date", 100),
    enabled: !!id,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["lead-tasks", id],
    queryFn: () => base44.entities.Task.filter({ lead_id: id }, "-created_date", 50),
    enabled: !!id,
  });

  const { data: matches = [] } = useQuery({
    queryKey: ["lead-matches", id],
    queryFn: () => base44.entities.LeadPropertyMatch.filter({ lead_id: id }, "-match_score", 20),
    enabled: !!id,
  });

  const { data: allProperties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: () => base44.entities.Property.list("-created_date", 200),
  });

  const generateMatches = useMutation({
    mutationFn: async () => {
      const { findTopMatches } = await import("../components/crm/PropertyMatcher");
      const topMatches = findTopMatches(allProperties, lead, 5);
      
      for (const match of topMatches) {
        const existing = await base44.entities.LeadPropertyMatch.filter({
          lead_id: id, property_id: match.property.id,
        });
        if (existing.length === 0 && match.score >= 40) {
          await base44.entities.LeadPropertyMatch.create({
            lead_id: id,
            property_id: match.property.id,
            match_score: match.score,
            status: "suggested",
            lead_name: lead.full_name,
            property_title: match.property.title,
          });
        }
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lead-matches", id] }),
  });

  const updateLead = useMutation({
    mutationFn: (data) => base44.entities.Lead.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", id] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setEditing(false);
    },
  });

  const changeStage = async (newStage) => {
    const oldStage = lead.funnel_stage;
    await base44.entities.Lead.update(id, { funnel_stage: newStage, last_stage_changed_at: new Date().toISOString() });
    await base44.entities.LeadActivity.create({
      lead_id: id, type: "status_change", direction: "system",
      note: `Stage changed from ${oldStage} to ${newStage}`,
      old_value: oldStage, new_value: newStage,
    });
    queryClient.invalidateQueries({ queryKey: ["lead", id] });
    queryClient.invalidateQueries({ queryKey: ["activities", id] });
  };

  const completeTask = useMutation({
    mutationFn: async (task) => {
      await base44.entities.Task.update(task.id, { status: "completed" });
      await base44.entities.LeadActivity.create({
        lead_id: id, type: "task", direction: "system",
        note: `Task completed: ${task.title}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-tasks", id] });
      queryClient.invalidateQueries({ queryKey: ["activities", id] });
    },
  });

  if (isLoading || !lead) {
    return <div className="p-8 text-center text-slate-400">Loading...</div>;
  }

  const stg = getStageConfig(lead.funnel_stage);
  const src = getSourceConfig(lead.source_type);
  const temp = TEMPERATURE_CONFIG[lead.lead_temperature] || TEMPERATURE_CONFIG.cold;

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to={createPageUrl("Leads")} className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">{lead.full_name}</h1>
            <span className="text-lg">{temp.icon}</span>
            {lead.lead_score > 0 && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                lead.lead_score >= 70 ? "bg-green-100 text-green-700" : lead.lead_score >= 40 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
              }`}>Score: {lead.lead_score}</span>
            )}
          </div>
          <p className="text-sm text-slate-500">{lead.primary_phone} · {lead.preferred_city}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1.5 text-xs">
          <Pencil className="w-3 h-3" /> Edit
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Core info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Stage selector */}
          <div className="bg-white rounded-xl border border-slate-200/60 p-5 space-y-4">
            <div>
              <label className="text-[10px] uppercase font-medium text-slate-400">Funnel Stage</label>
              <Select value={lead.funnel_stage} onValueChange={changeStage}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FUNNEL_STAGES.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Source</span>
                <Badge className={`mt-1 ${src.color} border text-[10px]`}>{src.label}</Badge>
              </div>
              <div>
                <span className="text-slate-400">Temperature</span>
                <p className={`mt-1 font-medium ${temp.color}`}>{temp.icon} {temp.label}</p>
              </div>
              <div>
                <span className="text-slate-400">Budget</span>
                <p className="mt-1 font-semibold text-slate-700">{formatBudgetRange(lead.budget_min, lead.budget_max)}</p>
              </div>
              <div>
                <span className="text-slate-400">Property</span>
                <p className="mt-1 text-slate-700 capitalize">{lead.property_type || "—"} {lead.bedrooms ? `${lead.bedrooms}BHK` : ""}</p>
              </div>
              <div>
                <span className="text-slate-400">Purpose</span>
                <p className="mt-1 text-slate-700 capitalize">{lead.purpose?.replace(/_/g, " ") || "—"}</p>
              </div>
              <div>
                <span className="text-slate-400">Timeline</span>
                <p className="mt-1 text-slate-700 capitalize">{lead.timeline?.replace(/_/g, " ") || "—"}</p>
              </div>
              <div>
                <span className="text-slate-400">Financing</span>
                <p className="mt-1 text-slate-700 capitalize">{lead.financing_status?.replace(/_/g, " ") || "—"}</p>
              </div>
              <div>
                <span className="text-slate-400">Last Contact</span>
                <p className="mt-1 text-slate-700">{timeAgo(lead.last_contacted_at)}</p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <a href={`tel:${lead.primary_phone}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1"><Phone className="w-3 h-3" /> Call</Button>
              </a>
              <a href={`https://wa.me/${(lead.whatsapp_number || lead.primary_phone || "").replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1"><MessageSquare className="w-3 h-3" /> WhatsApp</Button>
              </a>
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1"><Mail className="w-3 h-3" /> Email</Button>
                </a>
              )}
            </div>
          </div>

          {lead.notes && (
            <div className="bg-white rounded-xl border border-slate-200/60 p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Notes</h3>
              <p className="text-sm text-slate-700">{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Right: Tabs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200/60 p-5">
            <Tabs defaultValue="activity">
              <TabsList className="mb-4">
                <TabsTrigger value="activity">Activity ({activities.length})</TabsTrigger>
                <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
                <TabsTrigger value="matches">Matches ({matches.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="activity">
                <ActivityTimeline leadId={id} activities={activities} />
              </TabsContent>

              <TabsContent value="tasks">
                <div className="space-y-2">
                  {tasks.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-6">No tasks</p>
                  ) : tasks.map(t => (
                    <div key={t.id} className={`flex items-center justify-between p-3 rounded-lg border ${t.status === "completed" ? "bg-green-50/50 border-green-200" : "border-slate-200"}`}>
                      <div>
                        <p className={`text-sm font-medium ${t.status === "completed" ? "line-through text-slate-400" : "text-slate-700"}`}>{t.title}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{t.type?.replace(/_/g, " ")} · {t.due_at ? new Date(t.due_at).toLocaleDateString("en-IN") : "No due date"}</p>
                      </div>
                      {t.status === "pending" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => completeTask.mutate(t)}>
                          Complete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="matches">
                <div className="space-y-2">
                  {matches.length === 0 ? (
                    <div className="text-center py-6">
                      <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400 mb-3">No property matches yet</p>
                      <Button size="sm" onClick={() => generateMatches.mutate()} disabled={generateMatches.isPending} className="bg-indigo-600">
                        {generateMatches.isPending ? "Finding Matches..." : "Generate Property Matches"}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-end mb-2">
                        <Button size="sm" variant="outline" onClick={() => generateMatches.mutate()} disabled={generateMatches.isPending} className="h-7 text-xs">
                          {generateMatches.isPending ? "Refreshing..." : "Refresh Matches"}
                        </Button>
                      </div>
                      {matches.map(m => (
                        <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                          <div>
                            <p className="text-sm font-medium text-slate-700">{m.property_title || "Property"}</p>
                            <p className="text-[10px] text-slate-400 capitalize">{m.status?.replace(/_/g, " ")}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            m.match_score >= 70 ? "bg-green-100 text-green-700" : m.match_score >= 40 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                          }`}>{m.match_score}%</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Lead</DialogTitle></DialogHeader>
          <LeadForm initialData={lead} onSubmit={data => updateLead.mutate(data)} onCancel={() => setEditing(false)} loading={updateLead.isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
}