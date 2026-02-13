import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Phone, MessageSquare, Mail, StickyNote, Check } from "lucide-react";

export default function QuickActions({ lead, onUpdate }) {
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const logCall = async () => {
    await base44.entities.LeadActivity.create({
      lead_id: lead.id,
      type: "call_outbound",
      direction: "outbound",
      note: "Quick call logged",
      contact_channel: "phone",
    });
    await base44.entities.Lead.update(lead.id, {
      last_contacted_at: new Date().toISOString(),
      last_outbound_activity_at: new Date().toISOString(),
    });
    if (onUpdate) onUpdate();
  };

  const saveNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    await base44.entities.LeadActivity.create({
      lead_id: lead.id,
      type: "note",
      direction: "system",
      note,
    });
    setNote("");
    setShowNote(false);
    setSaving(false);
    if (onUpdate) onUpdate();
  };

  return (
    <div className="flex gap-1 mt-2">
      <a href={`tel:${lead.primary_phone}`} onClick={logCall}>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="Call">
          <Phone className="w-3 h-3" />
        </Button>
      </a>
      <a href={`https://wa.me/${(lead.whatsapp_number || lead.primary_phone || "").replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="WhatsApp">
          <MessageSquare className="w-3 h-3" />
        </Button>
      </a>
      {lead.email && (
        <a href={`mailto:${lead.email}`}>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="Email">
            <Mail className="w-3 h-3" />
          </Button>
        </a>
      )}
      <Popover open={showNote} onOpenChange={setShowNote}>
        <PopoverTrigger asChild>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" title="Add Note">
            <StickyNote className="w-3 h-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            <p className="text-xs font-medium">Quick Note</p>
            <Textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder="Add a quick note..."
              className="text-xs"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setShowNote(false)} className="h-7 text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={saveNote} disabled={!note.trim() || saving} className="h-7 text-xs bg-indigo-600">
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}