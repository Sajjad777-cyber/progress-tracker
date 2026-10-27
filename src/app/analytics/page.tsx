import { AnalyticsChart } from "@/components/analytics-chart";
import { AppShell } from "@/components/app-shell";
import { getAnalyticsData } from "@/lib/analytics/data";

export const instant = false;

export default async function AnalyticsPage() {
	const data = await getAnalyticsData();
	return <AppShell><div className="mx-auto max-w-5xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[.15em] text-[var(--primary)]">Patterns over time</p><h1 className="mt-3 font-display metric-value text-3xl font-bold tracking-[-0.04em]">Analytics</h1><p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">See activity from your recorded progress events. Empty periods stay empty rather than being invented.</p></div><select className="rounded-lg border bg-[var(--surface)] px-3 py-2.5 text-sm font-semibold"><option>All time</option><option>Last 30 days</option><option>Last 7 days</option></select></div><section className="mt-8 surface-card p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-display text-lg font-bold">Recorded activity</h2><p className="mt-1 text-sm text-[var(--muted)]">Progress events by day</p></div><span className="font-mono text-sm text-[var(--primary)]">{data.reduce((sum, point) => sum + point.events, 0)} events</span></div><div className="mt-6"><AnalyticsChart data={data} /></div></section><p className="mt-5 text-center text-xs text-[var(--muted)]">Charts are based on authorized records from your workspace.</p></div></AppShell>;
}
