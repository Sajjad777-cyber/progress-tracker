import "server-only";

import { createClient } from "@/lib/supabase/server";
import { calculateMilestoneProgress, calculateTaskProgress } from "@/lib/progress/calculations";

export type DashboardTracker = {
  id: string;
  name: string;
  category: string | null;
  mode: "task" | "numeric" | "milestone" | "manual" | "habit" | "mixed";
  status: "active" | "completed" | "archived";
  progress: number;
  detail: string;
  nextMilestone: string | null;
  targetDate: string | null;
  tasks: Array<{ status: "todo" | "in_progress" | "done" | "cancelled"; due_date: string | null }>;
  milestones: Array<{ name: string; status: "planned" | "in_progress" | "completed" | "cancelled"; weight: number; due_date: string | null }>;
};

export type DashboardData = {
  trackers: DashboardTracker[];
  eventCount: number;
  recentEvents: Array<{ event_type: string; created_at: string }>;
};

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const supabase = await createClient();
    const [{ data: trackers, error: trackerError }, { data: events, error: eventError }] = await Promise.all([
      supabase.from("trackers").select("id, name, category, mode, status, target_date, tasks(status, due_date), milestones(name, status, weight, due_date)").neq("status", "archived").order("updated_at", { ascending: false }).limit(24),
      supabase.from("progress_events").select("event_type, created_at").order("created_at", { ascending: false }).limit(8),
    ]);
    if (trackerError || eventError) return { trackers: [], eventCount: 0, recentEvents: [] };

    const normalized = (trackers ?? []).map((tracker) => {
      const tasks = (tracker.tasks ?? []) as DashboardTracker["tasks"];
      const milestones = ((tracker.milestones ?? []) as Array<{ name: string; status: DashboardTracker["milestones"][number]["status"]; weight: number | string; due_date: string | null }>).map((milestone) => ({ ...milestone, weight: Number(milestone.weight) }));
      const taskProgress = calculateTaskProgress(tasks);
      const milestoneProgress = calculateMilestoneProgress(milestones);
      const progress = tracker.mode === "milestone" ? milestoneProgress.displayPercent : taskProgress.displayPercent;
      const next = milestones.find((milestone) => milestone.status !== "completed" && milestone.status !== "cancelled") ?? null;
      return { id: tracker.id, name: tracker.name, category: tracker.category, mode: tracker.mode, status: tracker.status, progress, detail: tracker.mode === "milestone" ? `${milestoneProgress.displayPercent}% of milestone weight` : `${taskProgress.denominator} eligible tasks`, nextMilestone: next?.name ?? null, targetDate: tracker.target_date, tasks, milestones };
    });
    return { trackers: normalized, eventCount: (events ?? []).length, recentEvents: events ?? [] };
  } catch {
    return { trackers: [], eventCount: 0, recentEvents: [] };
  }
}
