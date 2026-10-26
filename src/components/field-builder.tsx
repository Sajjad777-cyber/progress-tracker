"use client";

import { useState } from "react";
import { saveTrackerFields } from "@/app/actions/trackers";

const fieldTypes = ["text", "long_text", "number", "boolean", "date", "single_select", "multi_select", "url", "currency", "percentage", "rating", "checkbox", "status"];
type BuilderField = { name: string; fieldKey: string; fieldType: string; isRequired: boolean; position: number };

export function FieldBuilder({ trackerId, initialFields = [] }: { trackerId: string; initialFields?: BuilderField[] }) {
  const [fields, setFields] = useState(initialFields);
  const [message, setMessage] = useState<string | null>(null);
  function addField() { setFields((current) => [...current, { name: "New field", fieldKey: `field_${current.length + 1}`, fieldType: "text", isRequired: false, position: current.length }]); }
  function updateField(index: number, patch: Partial<BuilderField>) { setFields((current) => current.map((field, fieldIndex) => fieldIndex === index ? { ...field, ...patch } : field)); }
  function removeField(index: number) { setFields((current) => current.filter((_, fieldIndex) => fieldIndex !== index).map((field, position) => ({ ...field, position }))); }
  async function submit() { const result = await saveTrackerFields({ trackerId, fields }); setMessage(result.error ?? "Fields saved."); }

  return <div className="rounded-xl border bg-white p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-lg font-bold">Custom fields</h2><p className="mt-1 text-sm text-[var(--muted)]">Shape the information this tracker collects.</p></div><button type="button" onClick={addField} className="rounded-full border px-3 py-2 text-sm font-bold text-[var(--primary)] hover:bg-[var(--surface-muted)]">Add field</button></div><div className="mt-6 space-y-3">{fields.length === 0 && <p className="rounded-lg bg-[var(--surface-muted)] p-4 text-sm text-[var(--muted)]">No custom fields yet.</p>}{fields.map((field, index) => <div key={`${field.fieldKey}-${index}`} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_auto_auto]"><input value={field.name} onChange={(event) => updateField(index, { name: event.target.value })} className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-[var(--primary)]" aria-label="Field name" /><select value={field.fieldType} onChange={(event) => updateField(index, { fieldType: event.target.value })} className="rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]" aria-label="Field type">{fieldTypes.map((type) => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}</select><label className="flex items-center gap-2 px-2 text-xs font-semibold text-[var(--muted)]"><input type="checkbox" checked={field.isRequired} onChange={(event) => updateField(index, { isRequired: event.target.checked })} />Required</label><button type="button" onClick={() => removeField(index)} className="px-2 text-sm font-semibold text-[var(--danger)]">Remove</button></div>)}</div><div className="mt-5 flex items-center justify-between gap-4"><p className="text-xs text-[var(--muted)]">Existing records are preserved when fields change.</p><button type="button" onClick={submit} className="rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white hover:bg-[var(--primary-deep)]">Save fields</button></div>{message && <p role="status" className="mt-3 text-sm text-[var(--primary)]">{message}</p>}</div>;
}
