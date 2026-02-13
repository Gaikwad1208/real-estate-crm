import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROPERTY_TYPES } from "./constants";

export default function PropertyForm({ initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initialData || {
    title: "", project_name: "", developer_name: "", rera_id: "",
    city: "", area: "", pin_code: "", property_type: "apartment",
    configuration: "", carpet_area: "", super_builtup_area: "",
    area_unit: "sqft", price: "", price_sqft: "",
    status: "available",
  });

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form };
    ["carpet_area", "super_builtup_area", "price", "price_sqft"].forEach(k => {
      if (data[k]) data[k] = Number(data[k]);
    });
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-slate-600">Title *</Label>
          <Input value={form.title} onChange={e => set("title", e.target.value)} required className="mt-1" placeholder="Property title" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Project Name</Label>
          <Input value={form.project_name} onChange={e => set("project_name", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Developer</Label>
          <Input value={form.developer_name} onChange={e => set("developer_name", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">RERA ID</Label>
          <Input value={form.rera_id} onChange={e => set("rera_id", e.target.value)} className="mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-xs text-slate-600">City *</Label>
          <Input value={form.city} onChange={e => set("city", e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Area</Label>
          <Input value={form.area} onChange={e => set("area", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Pin Code</Label>
          <Input value={form.pin_code} onChange={e => set("pin_code", e.target.value)} className="mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label className="text-xs text-slate-600">Type</Label>
          <Select value={form.property_type} onValueChange={v => set("property_type", v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map(p => <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-slate-600">Config (BHK)</Label>
          <Input value={form.configuration} onChange={e => set("configuration", e.target.value)} className="mt-1" placeholder="2BHK" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Status</Label>
          <Select value={form.status} onValueChange={v => set("status", v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="under_negotiation">Under Negotiation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-slate-600">Area Unit</Label>
          <Select value={form.area_unit} onValueChange={v => set("area_unit", v)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sqft">sqft</SelectItem>
              <SelectItem value="sqm">sqm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label className="text-xs text-slate-600">Carpet Area</Label>
          <Input type="number" value={form.carpet_area} onChange={e => set("carpet_area", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Super Built-up</Label>
          <Input type="number" value={form.super_builtup_area} onChange={e => set("super_builtup_area", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Price (₹)</Label>
          <Input type="number" value={form.price} onChange={e => set("price", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs text-slate-600">Price/sqft</Label>
          <Input type="number" value={form.price_sqft} onChange={e => set("price_sqft", e.target.value)} className="mt-1" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
          {loading ? "Saving..." : initialData?.id ? "Update" : "Add Property"}
        </Button>
      </div>
    </form>
  );
}