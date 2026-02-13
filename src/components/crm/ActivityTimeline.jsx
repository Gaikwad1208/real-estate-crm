import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Phone, PhoneIncoming, MessageSquare, Mail, MapPin,
  FileText, ArrowRightLeft, Clock, Send, Plus, Zap
} from "lucide-react";
import { timeAgo } from "./constants";

const TYPE_ICONS = {
  call_outbound: Phone,
  call_inbound: PhoneIncoming,
  whatsapp: MessageSquare,
  sms: MessageSquare,
  email: Mail,
  meeting: Clock,
  site_visit: MapPin,
  note: FileText,
  status_change: ArrowRightLeft,
  task: Clock,
  system_automation: Zap,
  import_log: FileText,
};

const TYPE_COLORS = {
  call_outbound: "bg-green-100 text-green-600",
  call_inbound: "bg-blue-100 text-blue-600",
  whatsapp: "bg-emerald-100 text-emerald-600",
  sms: "bg-purple-100 text-purple-600",
  email: "bg-orange-100 text-orange-600",
  meeting: "bg-indigo-100 text-indigo-600",
  site_visit: "bg-amber-100 text-amber-600",
  note: "bg-slate-100 text-slate-600",
  status_change: "bg-pink-100 text-pink-600",
  task: "bg-cyan-100 text-cyan-600",
  system_automation: "bg-violet-100 text-violet-600",
  import_log: "bg-gray-100 text-gray-600",
};

export default function ActivityTimeline({ leadId, activities = [] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [actType, setActType] = useState("note");
  const [note, setNote] = useState("");
  const queryClient = useQueryClient();

  const addActivity = useMutation({
    mutationFn: (data) => base44.entities.LeadActivity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities", leadId] });
      base44.entities.Lead.update(leadId, { last_contacted_at: new Date().toISOString() });
      setNote("");
      setShowAdd(false);
    },
  });

  const handleAdd = () => {
    addActivity.mutate({
      lead_id: leadId,
      type: actType,
      direction: ["call_outbound", "whatsapp", "sms", "email", "meeting", "site_visit"].includes(actType) ? "outbound" : "system",
      note,
      contact_channel: actType.includes("call") ? "phone" : actType === "whatsapp" ? "whatsapp" : actType === "email" ? "email" : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Activity</h3>
        <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)} className="h-7 text-xs gap-1">
          <Plus className="w-3 h-3" /> Add
        </Button>
      </div>

      {showAdd && (
        <div className="bg-slate-50 rounded-lg p-4 space-y-3">
          <Select value={actType} onValueChange={setActType}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="note">Note</SelectItem>
              <SelectItem value="call_outbound">Outbound Call</SelectItem>
              <SelectItem value="call_inbound">Inbound Call</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="site_visit">Site Visit</SelectItem>
            </SelectContent>
          </Select>
          <Textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Add notes..." className="text-sm" />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)} className="h-7 text-xs">Cancel</Button>
            <Button size="sm" onClick={handleAdd} disabled={!note.trim()} className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 gap-1">
              <Send className="w-3 h-3" /> Save
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-0">
        {activities.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No activity yet</p>
        ) : (
          activities.map((act, i) => {
            const Icon = TYPE_ICONS[act.type] || FileText;
            const colorClass = TYPE_COLORS[act.type] || TYPE_COLORS.note;
            return (
              <div key={act.id} className="flex gap-3 py-3 relative">
                {i < activities.length - 1 && (
                  <div className="absolute left-[15px] top-[42px] bottom-0 w-px bg-slate-200" />
                )}
                <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0 z-10`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-700 capitalize">
                      {act.type.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-slate-400">{timeAgo(act.created_date)}</span>
                  </div>
                  {act.note && <p className="text-xs text-slate-600 mt-0.5">{act.note}</p>}
                  {act.type === "status_change" && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {act.old_value} → <span className="font-medium">{act.new_value}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}