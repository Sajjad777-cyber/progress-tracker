"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AnalyticsPoint } from "@/lib/analytics/data";

export function AnalyticsChart({ data }: { data: AnalyticsPoint[] }) {
  if (data.length === 0) return <div className="flex h-72 items-center justify-center rounded-lg bg-[var(--surface-muted)] px-6 text-center text-sm text-[var(--muted)]">Progress events will appear here after you record activity.</div>;
  return <div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}><CartesianGrid stroke="#dce3dc" strokeDasharray="4 4" vertical={false} /><XAxis dataKey="date" tick={{ fill: "#657169", fontSize: 11 }} tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tick={{ fill: "#657169", fontSize: 11 }} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #dce3dc", boxShadow: "0 8px 20px rgba(24,33,27,.08)" }} /><Line type="monotone" dataKey="events" stroke="#176b63" strokeWidth={3} dot={{ r: 3, fill: "#176b63" }} activeDot={{ r: 5 }} /></LineChart></ResponsiveContainer></div>;
}
