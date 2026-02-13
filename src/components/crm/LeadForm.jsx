import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SOURCE_TYPES, PROPERTY_TYPES, FUNNEL_STAGES } from "./constants";

export default function LeadForm({ initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initialData || {
    full_name: "",
    primary_phone: "",
    email: "",
    whatsapp_number: "",
    source_type: "other",
    preferred_city: "",
    preferred_area: "",
    property_type: "",
    bedrooms: "",
    budget_min: "",
    budget_max: "",
    purpose: "",
    timeline: "",
    financing_status: "",
    funnel_stage: "new",
    lead_temperature: "cold",
    notes: "",
  });

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form };
    if (data.budget_min) data.budget_min = Number(data.budget_min);
    if (data.budget_max) data.budget_max = Number(data.budget_max);
    if (data.bedrooms) data.bedrooms = Number(data.bedrooms);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-slate-600">Full Name *</Label>
          <Input value={form.full_name} onChange={e => set("full_name", e.target.value)} required className="mt-1" placeholder="Enter name" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Phone *</Label>
          <Input value={form.primary_phone} onChange={e => set("primary_phone", e.target.value)} required className="mt-1" placeholder="+91..." />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Email</Label>
          <Input value={form.email} onChange={e => set("email", e.target.value)} className="mt-1" placeholder="email@example.com" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">WhatsApp</Label>
          <Input value={form.whatsapp_number} onChange={e => set("whatsapp_number", e.target.value)} className="mt-1" placeholder="+91..." />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label className="text-xs text-slate-600">Source</Label>
          <Select value={form.source_type} onValueChange={v => set("source_type", v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SOURCE_TYPES.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-slate-600">Stage</Label>
          <Select value={form.funnel_stage} onValueChange={v => set("funnel_stage", v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FUNNEL_STAGES.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-slate-600">Temperature</Label>
          <Select value={form.lead_temperature} onValueChange={v => set("lead_temperature", v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hot">🔥 Hot</SelectItem>
              <SelectItem value="warm">☀️ Warm</SelectItem>
              <SelectItem value="cold">❄️ Cold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-slate-600">Property Type</Label>
          <Select value={form.property_type || "none"} onValueChange={v => set("property_type", v === "none" ? "" : v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select</SelectItem>
              {PROPERTY_TYPES.map(p => <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label className="text-xs text-slate-600">City</Label>
          <Input value={form.preferred_city} onChange={e => set("preferred_city", e.target.value)} className="mt-1" placeholder="Mumbai" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Area</Label>
          <Input value={form.preferred_area} onChange={e => set("preferred_area", e.target.value)} className="mt-1" placeholder="Bandra" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Budget Min (₹)</Label>
          <Input type="number" value={form.budget_min} onChange={e => set("budget_min", e.target.value)} className="mt-1" placeholder="5000000" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Budget Max (₹)</Label>
          <Input type="number" value={form.budget_max} onChange={e => set("budget_max", e.target.value)} className="mt-1" placeholder="10000000" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label className="text-xs text-slate-600">Bedrooms</Label>
          <Input type="number" value={form.bedrooms} onChange={e => set("bedrooms", e.target.value)} className="mt-1" placeholder="2" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Purpose</Label>
          <Select value={form.purpose || "none"} onValueChange={v => set("purpose", v === "none" ? "" : v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select</SelectItem>
              <SelectItem value="end_use">End Use</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
              <SelectItem value="flip">Flip</SelectItem>
              <SelectItem value="rental">Rental</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-slate-600">Timeline</Label>
          <Select value={form.timeline || "none"} onValueChange={v => set("timeline", v === "none" ? "" : v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select</SelectItem>
              <SelectItem value="immediate_0_30">Immediate (0-30d)</SelectItem>
              <SelectItem value="short_30_90">Short (30-90d)</SelectItem>
              <SelectItem value="mid_3_6_months">3-6 months</SelectItem>
              <SelectItem value="long_6plus">6+ months</SelectItem>
              <SelectItem value="just_exploring">Just Exploring</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-slate-600">Financing</Label>
          <Select value={form.financing_status || "none"} onValueChange={v => set("financing_status", v === "none" ? "" : v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="loan_required">Loan Required</SelectItem>
              <SelectItem value="preapproved_loan">Pre-approved</SelectItem>
              <SelectItem value="unsure">Unsure</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs text-slate-600">Notes</Label>
        <Textarea value={form.notes} onChange={e => set("notes", e.target.value)} className="mt-1" rows={2} placeholder="Any additional notes..." />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        )}
        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
          {loading ? "Saving..." : initialData?.id ? "Update Lead" : "Create Lead"}
        </Button>
      </div>
    </form>
  );
}