import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { FUNNEL_STAGES, SOURCE_TYPES, PROPERTY_TYPES } from "./constants";

export default function LeadFilters({ filters, setFilters, teams = [], agents = [] }) {
  const [expanded, setExpanded] = React.useState(false);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value === "all" ? "" : value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", stage: "", source: "", temperature: "", city: "", property_type: "", team_id: "", agent_id: "" });
  };

  const activeCount = Object.values(filters).filter(v => v && v !== "").length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search name, phone, email..."
            value={filters.search || ""}
            onChange={e => updateFilter("search", e.target.value)}
            className="pl-9 h-9 text-sm bg-white"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="h-9 gap-1.5 text-xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeCount > 0 && (
            <span className="bg-indigo-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
              {activeCount}
            </span>
          )}
        </Button>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-xs text-slate-500">
            <X className="w-3 h-3 mr-1" /> Clear
          </Button>
        )}
      </div>

      {expanded && (
        <div className="flex flex-wrap gap-3 p-4 bg-white rounded-lg border border-slate-200">
          <Select value={filters.stage || "all"} onValueChange={v => updateFilter("stage", v)}>
            <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Stage" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {FUNNEL_STAGES.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filters.source || "all"} onValueChange={v => updateFilter("source", v)}>
            <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {SOURCE_TYPES.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filters.temperature || "all"} onValueChange={v => updateFilter("temperature", v)}>
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Temperature" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="hot">🔥 Hot</SelectItem>
              <SelectItem value="warm">☀️ Warm</SelectItem>
              <SelectItem value="cold">❄️ Cold</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.property_type || "all"} onValueChange={v => updateFilter("property_type", v)}>
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Property" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {PROPERTY_TYPES.map(p => <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Input
            placeholder="City"
            value={filters.city || ""}
            onChange={e => updateFilter("city", e.target.value)}
            className="w-28 h-8 text-xs"
          />
        </div>
      )}
    </div>
  );
}