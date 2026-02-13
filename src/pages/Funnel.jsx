import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "../components/crm/KanbanColumn";
import LeadFilters from "../components/crm/LeadFilters";
import { KANBAN_STAGES } from "../components/crm/constants";

export default function Funnel() {
  const [filters, setFilters] = useState({ search: "", source: "", temperature: "", city: "", property_type: "" });
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => base44.entities.Lead.list("-created_date", 500),
  });

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (![l.full_name, l.primary_phone, l.email].some(v => v && v.toLowerCase().includes(s))) return false;
      }
      if (filters.source && l.source_type !== filters.source) return false;
      if (filters.temperature && l.lead_temperature !== filters.temperature) return false;
      if (filters.city && l.preferred_city && !l.preferred_city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.property_type && l.property_type !== filters.property_type) return false;
      return true;
    });
  }, [leads, filters]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStage = destination.droppableId;
    const lead = leads.find(l => l.id === draggableId);
    if (!lead || lead.funnel_stage === newStage) return;

    const oldStage = lead.funnel_stage;

    // Optimistic update
    queryClient.setQueryData(["leads"], prev =>
      prev.map(l => l.id === draggableId ? { ...l, funnel_stage: newStage } : l)
    );

    await base44.entities.Lead.update(draggableId, {
      funnel_stage: newStage,
      last_stage_changed_at: new Date().toISOString(),
    });
    await base44.entities.LeadActivity.create({
      lead_id: draggableId,
      type: "status_change",
      direction: "system",
      note: `Stage changed: ${oldStage} → ${newStage}`,
      old_value: oldStage,
      new_value: newStage,
    });
    queryClient.invalidateQueries({ queryKey: ["leads"] });
  };

  return (
    <div className="p-6 lg:p-8 space-y-5 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sales Funnel</h1>
        <p className="text-sm text-slate-500 mt-0.5">Drag leads between stages</p>
      </div>

      <LeadFilters filters={filters} setFilters={setFilters} />

      {isLoading ? (
        <div className="text-center py-20 text-sm text-slate-400">Loading funnel...</div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-3 min-h-[400px]">
              {KANBAN_STAGES.map(stage => (
                <KanbanColumn
                  key={stage.key}
                  stage={stage}
                  leads={filteredLeads.filter(l => l.funnel_stage === stage.key)}
                />
              ))}
            </div>
          </div>
        </DragDropContext>
      )}
    </div>
  );
}