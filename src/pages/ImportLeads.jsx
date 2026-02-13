import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

const FIELD_MAP = [
  { target: "full_name", label: "Full Name" },
  { target: "primary_phone", label: "Phone" },
  { target: "email", label: "Email" },
  { target: "whatsapp_number", label: "WhatsApp" },
  { target: "preferred_city", label: "City" },
  { target: "preferred_area", label: "Area" },
  { target: "property_type", label: "Property Type" },
  { target: "budget_min", label: "Budget Min" },
  { target: "budget_max", label: "Budget Max" },
  { target: "bedrooms", label: "Bedrooms" },
  { target: "source_type", label: "Source" },
  { target: "notes", label: "Notes" },
];

export default function ImportLeads() {
  const [step, setStep] = useState("upload"); // upload, map, preview, result
  const [fileUrl, setFileUrl] = useState(null);
  const [extractedData, setExtractedData] = useState([]);
  const [mapping, setMapping] = useState({});
  const [columns, setColumns] = useState([]);
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const queryClient = useQueryClient();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFileUrl(file_url);

    // Extract column headers using LLM
    const extracted = await base44.integrations.Core.ExtractDataFromUploadedFile({
      file_url,
      json_schema: {
        type: "object",
        properties: {
          columns: { type: "array", items: { type: "string" }, description: "Column header names" },
          rows: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
            },
            description: "First 5 rows of data as objects with column headers as keys",
          },
        },
      },
    });

    if (extracted.status === "success" && extracted.output) {
      const cols = extracted.output.columns || Object.keys(extracted.output.rows?.[0] || {});
      setColumns(cols);
      setExtractedData(extracted.output.rows || []);

      // Auto-map columns
      const autoMap = {};
      cols.forEach(col => {
        const colLower = col.toLowerCase().replace(/[^a-z]/g, "");
        FIELD_MAP.forEach(f => {
          const targetLower = f.target.replace(/_/g, "");
          if (colLower.includes(targetLower) || colLower.includes(f.label.toLowerCase().replace(/\s/g, ""))) {
            autoMap[f.target] = col;
          }
          if (colLower === "name" || colLower === "fullname") autoMap["full_name"] = col;
          if (colLower === "phone" || colLower === "mobile" || colLower === "phonenumber") autoMap["primary_phone"] = col;
          if (colLower === "city") autoMap["preferred_city"] = col;
          if (colLower === "area" || colLower === "locality") autoMap["preferred_area"] = col;
        });
      });
      setMapping(autoMap);
      setStep("map");
    }
    setUploading(false);
  };

  const handleImport = async () => {
    setImporting(true);
    // Full extraction
    const schema = { type: "object", properties: {} };
    Object.entries(mapping).forEach(([target, source]) => {
      if (source) {
        schema.properties[target] = { type: "string", description: `Map from column: ${source}` };
      }
    });

    const fullExtract = await base44.integrations.Core.ExtractDataFromUploadedFile({
      file_url: fileUrl,
      json_schema: {
        type: "object",
        properties: {
          leads: {
            type: "array",
            items: { type: "object", properties: schema.properties },
          },
        },
      },
    });

    if (fullExtract.status === "success" && fullExtract.output?.leads) {
      const rows = fullExtract.output.leads;
      let success = 0, errors = 0, duplicates = 0;

      // Create batch
      const batch = await base44.entities.ImportBatch.create({
        name: `Import ${new Date().toLocaleDateString("en-IN")}`,
        source_type: "csv",
        total_rows: rows.length,
        status: "processing",
      });

      // Get all existing leads for duplicate check
      const existingLeads = await base44.entities.Lead.list("-created_date", 2000);
      const { detectDuplicate } = await import("../components/crm/LeadAutoAssignment");
      const { calculateLeadScore, determineTemperature } = await import("../components/crm/LeadScoringEngine");

      for (const row of rows) {
        const data = { ...row, source_type: row.source_type || "csv_import", funnel_stage: "new" };
        if (data.budget_min) data.budget_min = Number(data.budget_min) || 0;
        if (data.budget_max) data.budget_max = Number(data.budget_max) || 0;
        if (data.bedrooms) data.bedrooms = Number(data.bedrooms) || 0;

        if (!data.full_name || !data.primary_phone) {
          errors++;
          continue;
        }

        // Check for duplicates
        const dupCheck = await detectDuplicate(data, existingLeads);
        if (dupCheck.isDuplicate) {
          duplicates++;
          continue;
        }

        // Calculate score
        const score = calculateLeadScore(data, []);
        const temp = determineTemperature(score);
        data.lead_score = score;
        data.lead_temperature = temp;

        await base44.entities.Lead.create(data);
        success++;
      }

      await base44.entities.ImportBatch.update(batch.id, {
        success_count: success, error_count: errors, duplicate_count: duplicates, status: "completed",
      });

      setResult({ total: rows.length, success, errors, duplicates });
      setStep("result");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    }
    setImporting(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[800px] mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to={createPageUrl("Leads")} className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Import Leads</h1>
      </div>

      {step === "upload" && (
        <div className="bg-white rounded-xl border border-slate-200/60 p-10 text-center">
          <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Upload CSV or Excel file</h2>
          <p className="text-sm text-slate-500 mb-6">Supported: .csv, .xlsx, .xls</p>
          <label className="inline-block">
            <Input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
            <Button asChild disabled={uploading}>
              <span className="cursor-pointer gap-2">
                <Upload className="w-4 h-4" />
                {uploading ? "Processing..." : "Choose File"}
              </span>
            </Button>
          </label>
        </div>
      )}

      {step === "map" && (
        <div className="bg-white rounded-xl border border-slate-200/60 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-800">Map Columns</h2>
          <p className="text-sm text-slate-500">Map your file columns to lead fields</p>

          <div className="space-y-3">
            {FIELD_MAP.map(field => (
              <div key={field.target} className="flex items-center gap-4">
                <span className="text-sm text-slate-700 w-32 text-right">{field.label}</span>
                <span className="text-slate-400">→</span>
                <Select value={mapping[field.target] || "none"} onValueChange={v => setMapping(prev => ({ ...prev, [field.target]: v === "none" ? "" : v }))}>
                  <SelectTrigger className="w-52 h-8 text-xs"><SelectValue placeholder="Select column" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Skip —</SelectItem>
                    {columns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {extractedData.length > 0 && (
            <div className="overflow-x-auto max-h-48 border rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    {columns.map(c => <th key={c} className="px-3 py-2 text-left text-slate-500">{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {extractedData.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-t">
                      {columns.map(c => <td key={c} className="px-3 py-1.5 text-slate-600">{row[c] || ""}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setStep("upload")}>Back</Button>
            <Button onClick={handleImport} disabled={importing || !mapping.full_name} className="bg-indigo-600 hover:bg-indigo-700">
              {importing ? "Importing..." : "Import Leads"}
            </Button>
          </div>
        </div>
      )}

      {step === "result" && result && (
        <div className="bg-white rounded-xl border border-slate-200/60 p-10 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
          <h2 className="text-lg font-semibold text-slate-800">Import Complete</h2>
          <div className="flex justify-center gap-8 text-sm">
            <div><span className="font-bold text-slate-900">{result.total}</span><br /><span className="text-slate-500">Total</span></div>
            <div><span className="font-bold text-green-600">{result.success}</span><br /><span className="text-slate-500">Imported</span></div>
            {result.errors > 0 && <div><span className="font-bold text-red-600">{result.errors}</span><br /><span className="text-slate-500">Errors</span></div>}
          </div>
          <Link to={createPageUrl("Leads")}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 mt-4">View Leads</Button>
          </Link>
        </div>
      )}
    </div>
  );
}