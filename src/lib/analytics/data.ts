import "server-only";

import { createClient } from "@/lib/supabase/server";

export type AnalyticsPoint = { date: string; events: number };

export async function getAnalyticsData(): Promise<AnalyticsPoint[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("progress_events").select("created_at").order("created_at", { ascending: true }).limit(500);
    if (error || !data) return [];
    const grouped = new Map<string, number>();
    data.forEach((event) => { const date = event.created_at.slice(0, 10); grouped.set(date, (grouped.get(date) ?? 0) + 1); });
    return Array.from(grouped, ([date, events]) => ({ date, events }));
  } catch {
    return [];
  }
}
