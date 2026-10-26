import { getCurrentUser } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const trackerId = new URL(request.url).searchParams.get("trackerId");
  if (!trackerId) return new Response("trackerId is required", { status: 400 });

  const supabase = await createClient();
  const { data: tracker, error: trackerError } = await supabase.from("trackers").select("id, name, mode, status, start_date, target_date, tasks(title, status, priority, due_date), milestones(name, status, weight, due_date)").eq("id", trackerId).maybeSingle();
  if (trackerError || !tracker) return new Response("Tracker not found", { status: 404 });

  const rows = [["tracker", "type", "title", "status", "priority", "weight", "due_date"], ...(tracker.tasks ?? []).map((task) => [tracker.name, "task", task.title, task.status, task.priority, "", task.due_date ?? ""]), ...(tracker.milestones ?? []).map((milestone) => [tracker.name, "milestone", milestone.name, milestone.status, "", milestone.weight, milestone.due_date ?? ""])] as unknown[][];
  const body = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  return new Response(body, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${tracker.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "tracker"}.csv"` } });
}
