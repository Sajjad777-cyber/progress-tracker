import "server-only";

import { createClient } from "@/lib/supabase/server";

export type TrackerDetail = {
  id: string;
  name: string;
  description: string | null;
  mode: string;
  status: string;
  start_date: string | null;
  target_date: string | null;
  tasks: Array<{ id: string; title: string; status: "todo" | "in_progress" | "done" | "cancelled"; priority: string; due_date: string | null }>;
  milestones: Array<{ id: string; name: string; status: "planned" | "in_progress" | "completed" | "cancelled"; weight: number; due_date: string | null }>;
  progress_events: Array<{ event_type: string; created_at: string }>;
};

export async function getTrackerDetail(trackerId: string): Promise<TrackerDetail | null> {
  try {
    const supabase = await createClient();
    const { data: tracker, error } = await supabase.from("trackers").select("id, name, description, mode, status, start_date, target_date, tasks(id, title, status, priority, due_date), milestones(id, name, status, weight, due_date), progress_events(event_type, created_at)").eq("id", trackerId).maybeSingle();
    if (error || !tracker) return null;
    return tracker as TrackerDetail;
  } catch {
    return null;
  }
}
