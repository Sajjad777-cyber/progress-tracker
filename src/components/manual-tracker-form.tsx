"use client";

import { useActionState } from "react";
import { createTracker } from "@/app/actions/trackers";

type TrackerFormState = { error?: string; fieldErrors?: Record<string, string[]> } | undefined;

export function ManualTrackerForm({ templateId, initialName, initialCategory, initialMode }: { templateId?: string; initialName?: string; initialCategory?: string; initialMode?: string }) {
  const [state, formAction, pending] = useActionState<TrackerFormState, FormData>(createTracker, undefined);
  return <form action={formAction} className="mt-8 space-y-6 rounded-xl border bg-white p-6 sm:p-8"><input type="hidden" name="templateId" value={templateId ?? ""} />
    <div className="grid gap-5 sm:grid-cols-2"><Field name="name" label="Name" placeholder="e.g. Learn web development" defaultValue={initialName} error={state?.fieldErrors?.name?.[0]} /><Field name="category" label="Category" placeholder="Learning, work, health" defaultValue={initialCategory} error={state?.fieldErrors?.category?.[0]} /></div>
    <label className="block text-sm font-semibold" htmlFor="description">Description<textarea id="description" name="description" rows={3} className="mt-2 w-full resize-y rounded-lg border px-3 py-3 font-normal outline-none focus:border-[var(--primary)]" placeholder="What does progress look like here?" /></label>
    <label className="block text-sm font-semibold" htmlFor="mode">Tracking method<select id="mode" name="mode" defaultValue={initialMode ?? "task"} className="mt-2 w-full rounded-lg border bg-white px-3 py-3 font-normal outline-none focus:border-[var(--primary)]"><option value="task">Tasks</option><option value="numeric">Numeric target</option><option value="milestone">Milestones</option><option value="manual">Manual percentage</option><option value="habit">Habit</option><option value="mixed">Mixed</option></select></label>
    <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold" htmlFor="startDate">Start date<input id="startDate" name="startDate" type="date" className="mt-2 w-full rounded-lg border px-3 py-3 font-normal outline-none focus:border-[var(--primary)]" /></label><label className="block text-sm font-semibold" htmlFor="targetDate">Target date<input id="targetDate" name="targetDate" type="date" className="mt-2 w-full rounded-lg border px-3 py-3 font-normal outline-none focus:border-[var(--primary)]" />{state?.fieldErrors?.targetDate?.[0] && <span className="mt-1.5 block text-xs font-normal text-[var(--danger)]">{state.fieldErrors.targetDate[0]}</span>}</label></div>
    {state?.error && <p role="alert" className="rounded-lg bg-[#fff1e9] px-3 py-2.5 text-sm text-[var(--danger)]">{state.error}</p>}
    <div className="flex justify-end"><button type="submit" disabled={pending} className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--primary-deep)] disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Creating..." : "Create tracker"}</button></div>
  </form>;
}

function Field({ name, label, placeholder, defaultValue, error }: { name: string; label: string; placeholder: string; defaultValue?: string; error?: string }) {
  return <label className="block text-sm font-semibold" htmlFor={name}>{label}<input id={name} name={name} defaultValue={defaultValue} className="mt-2 w-full rounded-lg border px-3 py-3 font-normal outline-none focus:border-[var(--primary)]" placeholder={placeholder} aria-invalid={Boolean(error)} />{error && <span className="mt-1.5 block text-xs font-normal text-[var(--danger)]">{error}</span>}</label>;
}
