"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type TrackerHistoryPoint = { date: string; events: number };

export function TrackerHistoryChart({ data }: { data: TrackerHistoryPoint[] }) {
  if (data.length === 0) return <div className="flex h-56 items-center justify-center rounded-[var(--radius-control)] bg-[var(--surface-muted)] px-6 text-center text-sm text-[var(--muted)]">Progress history will appear after tasks, milestones, or entries change.</div>;
  return <div className="h-56 w-full" role="img" aria-label="Tracker progress activity over time"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}><CartesianGrid stroke="var(--line)" strokeDasharray="4 4" vertical={false} /><XAxis dataKey="date" tick={{ fill: "var(--muted)", fontSize: 10 }} tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tick={{ fill: "var(--muted)", fontSize: 10 }} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--foreground)" }} labelStyle={{ color: "var(--muted)" }} /><Line type="monotone" dataKey="events" name="Activity" stroke="var(--primary)" strokeWidth={3} dot={{ r: 3, fill: "var(--primary)" }} activeDot={{ r: 5 }} /></LineChart></ResponsiveContainer></div>;
}