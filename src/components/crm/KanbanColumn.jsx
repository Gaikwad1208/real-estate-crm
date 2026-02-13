import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import LeadCard from "./LeadCard";
import { formatINR } from "./constants";

export default function KanbanColumn({ stage, leads }) {
  const pipelineValue = leads.reduce((sum, l) => sum + (l.budget_max || l.budget_min || 0), 0);

  return (
    <div className="flex flex-col min-w-[280px] max-w-[300px] bg-slate-50/80 rounded-xl">
      <div className="px-3 py-3 border-b border-slate-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
            <span className="text-xs font-semibold text-slate-700">{stage.label}</span>
          </div>
          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded-md text-slate-500 font-medium border border-slate-200">
            {leads.length}
          </span>
        </div>
        {pipelineValue > 0 && (
          <p className="text-[10px] text-slate-400 mt-1 ml-[18px]">{formatINR(pipelineValue)}</p>
        )}
      </div>

      <Droppable droppableId={stage.key}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 space-y-2 min-h-[60px] overflow-y-auto max-h-[calc(100vh-260px)] transition-colors ${
              snapshot.isDraggingOver ? "bg-indigo-50/50" : ""
            }`}
          >
            {leads.map((lead, index) => (
              <Draggable key={lead.id} draggableId={lead.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? "opacity-90 rotate-1" : ""}
                  >
                    <LeadCard lead={lead} compact />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}