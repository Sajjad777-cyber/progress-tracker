import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getOrCreateWorkspace } from "@/app/actions/trackers";
import { createClient } from "@/lib/supabase/server";
import { aiTrackerProposalSchema } from "@/lib/ai/schemas";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Sign in before approving an AI proposal." }, { status: 401 });
    const body = await request.json();
    const parsed = aiTrackerProposalSchema.safeParse(body?.proposal);
    if (!parsed.success) return NextResponse.json({ error: "The proposal is no longer valid. Generate a new draft." }, { status: 400 });
    const workspaceId = await getOrCreateWorkspace(user.id);
    const supabase = await createClient();
    const { data: tracker, error: trackerError } = await supabase.from("trackers").insert({ workspace_id: workspaceId, created_by: user.id, name: parsed.data.name, description: parsed.data.description, category: parsed.data.category, mode: parsed.data.mode, configuration: { aiGenerated: true } }).select("id").single();
    if (trackerError || !tracker) return NextResponse.json({ error: "The approved tracker could not be saved." }, { status: 500 });
    const { error: fieldError } = await supabase.from("tracker_fields").insert(parsed.data.fields.map((field) => ({ tracker_id: tracker.id, name: field.name, field_key: field.fieldKey, field_type: field.fieldType, is_required: field.isRequired, position: field.position })));
    const { error: taskError } = await supabase.from("tasks").insert(parsed.data.tasks.map((title) => ({ tracker_id: tracker.id, created_by: user.id, title })));
    const { error: milestoneError } = await supabase.from("milestones").insert(parsed.data.milestones.map((milestone) => ({ tracker_id: tracker.id, created_by: user.id, name: milestone.name, description: milestone.description, weight: milestone.weight })));
    if (fieldError || taskError || milestoneError) {
      await supabase.from("trackers").delete().eq("id", tracker.id);
      return NextResponse.json({ error: "The approved tracker could not be completed." }, { status: 500 });
    }
    return NextResponse.json({ trackerId: tracker.id });
  } catch {
    return NextResponse.json({ error: "The AI proposal could not be approved." }, { status: 500 });
  }
}