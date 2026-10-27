import { Check, Circle } from "lucide-react";

export function ProgressRing({ value, label = "complete", size = "md" }: { value: number; label?: string; size?: "sm" | "md" | "lg" }) {
  const clamped = Math.min(100, Math.max(0, value));
  const sizes = { sm: "h-16 w-16", md: "h-28 w-28", lg: "h-40 w-40" };
  const inner = { sm: "h-11 w-11", md: "h-20 w-20", lg: "h-28 w-28" };
  return <div className={`flex ${sizes[size]} items-center justify-center rounded-full bg-[conic-gradient(var(--primary)_0_${clamped}%,var(--surface-muted)_${clamped}%_100%)]`} role="img" aria-label={`${Math.round(clamped)} percent ${label}`}><div className={`flex ${inner[size]} flex-col items-center justify-center rounded-full bg-[var(--surface)] shadow-inner`}><span className="font-display metric-value text-xl font-bold">{Math.round(clamped)}%</span><span className="text-[10px] text-[var(--muted)]">{label}</span></div></div>;
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const clamped = Math.min(100, Math.max(0, value));
  return <div><div className="flex items-center justify-between gap-3">{label && <span className="text-xs font-semibold text-[var(--muted)]">{label}</span>}<span className="ml-auto font-mono text-xs font-bold text-[var(--primary)]">{Math.round(clamped)}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]"><div className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary),#b19bff)] transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${clamped}%` }} /></div></div>;
}

export function MilestoneTimeline({ milestones }: { milestones: Array<{ name: string; status: string; due_date: string | null }> }) {
  if (milestones.length === 0) return <p className="rounded-[var(--radius-control)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--muted)]">No milestones have been added yet.</p>;
  return <div className="space-y-4">{milestones.map((milestone, index) => { const complete = milestone.status === "completed"; return <div key={`${milestone.name}-${index}`} className="relative flex gap-3"><div className="flex flex-col items-center">{complete ? <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--success)]"><Check className="h-3.5 w-3.5" /></span> : <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]"><Circle className="h-2.5 w-2.5" /></span>}{index < milestones.length - 1 && <span className="mt-1 h-full w-px bg-[var(--line)]" />}</div><div className="min-w-0 pb-3"><p className="text-sm font-bold">{milestone.name}</p><p className="mt-1 text-xs capitalize text-[var(--muted)]">{milestone.status.replaceAll("_", " ")}{milestone.due_date ? ` · Due ${milestone.due_date}` : ""}</p></div></div>; })}</div>;
}