"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";
import { trackerFieldsSchema } from "@/lib/trackers/field-schema";
import { milestoneInputSchema, taskInputSchema, trackerInputSchema } from "@/lib/trackers/schemas";
import { templateCatalog } from "@/lib/templates/catalog";

type TrackerActionState = { error?: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function getOrCreateWorkspace(userId: string) {
  const supabase = await createClient();
  const { data: membership } = await supabase.from("workspace_members").select("workspace_id").eq("user_id", userId).order("created_at").limit(1).maybeSingle();
  if (membership?.workspace_id) return membership.workspace_id;

  const slug = `personal-${userId.slice(0, 8)}`;
  const { data: workspace, error: workspaceError } = await supabase.from("workspaces").insert({ name: "Personal workspace", slug, created_by: userId }).select("id").single();
  if (workspaceError || !workspace) throw new Error("Could not create a personal workspace.");
  const { error: memberError } = await supabase.from("workspace_members").insert({ workspace_id: workspace.id, user_id: userId, role: "owner" });
  if (memberError) throw new Error("Could not initialize workspace membership.");
  return workspace.id;
}

export async function createTracker(_state: TrackerActionState, formData: FormData): Promise<TrackerActionState> {
  const parsed = trackerInputSchema.safeParse({ name: formData.get("name"), description: formData.get("description") || undefined, category: formData.get("category") || undefined, mode: formData.get("mode"), templateId: formData.get("templateId") || undefined, startDate: formData.get("startDate") || undefined, targetDate: formData.get("targetDate") || undefined });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in before creating a tracker." };

  let trackerId: string;
  try {
    const workspaceId = await getOrCreateWorkspace(user.id);
    const supabase = await createClient();
    const template = parsed.data.templateId ? templateCatalog.find((item) => item.id === parsed.data.templateId) : undefined;
    const { data, error } = await supabase.from("trackers").insert({ workspace_id: workspaceId, created_by: user.id, name: parsed.data.name, description: parsed.data.description || null, category: parsed.data.category || null, mode: parsed.data.mode, start_date: parsed.data.startDate || null, target_date: parsed.data.targetDate || null, configuration: template ? { templateId: template.id, suggestedTasks: template.suggestedTasks } : {} }).select("id").single();
    if (error || !data) return { error: "The tracker could not be saved." };
    if (template) {
      const { error: fieldError } = await supabase.from("tracker_fields").insert(template.fields.map((field) => ({ tracker_id: data.id, name: field.name, field_key: field.fieldKey, field_type: field.fieldType, is_required: field.isRequired, position: field.position })));
      const { error: taskError } = await supabase.from("tasks").insert(template.suggestedTasks.map((title) => ({ tracker_id: data.id, created_by: user.id, title })));
      if (fieldError || taskError) {
        await supabase.from("trackers").delete().eq("id", data.id);
        return { error: "The tracker could not be created from that template." };
      }
    }
    trackerId = data.id;
  } catch {
    return { error: "Tracker creation is unavailable until Supabase is configured." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/trackers");
  redirect(`/trackers/${trackerId}`);
}

export async function createTask(formData: FormData) {
  const parsed = taskInputSchema.safeParse({ trackerId: formData.get("trackerId"), title: formData.get("title"), description: formData.get("description") || undefined, priority: formData.get("priority") || "medium", dueDate: formData.get("dueDate") || undefined });
  if (!parsed.success) throw new Error("Invalid task details.");
  const user = await getCurrentUser();
  if (!user) throw new Error("Sign in before creating a task.");
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").insert({ tracker_id: parsed.data.trackerId, created_by: user.id, title: parsed.data.title, description: parsed.data.description || null, priority: parsed.data.priority, due_date: parsed.data.dueDate || null });
  if (error) throw new Error("The task could not be saved.");
  revalidatePath(`/trackers/${parsed.data.trackerId}`);
}

export async function createMilestone(formData: FormData) {
  const parsed = milestoneInputSchema.safeParse({ trackerId: formData.get("trackerId"), name: formData.get("name"), description: formData.get("description") || undefined, dueDate: formData.get("dueDate") || undefined, weight: formData.get("weight") });
  if (!parsed.success) throw new Error("Invalid milestone details.");
  const user = await getCurrentUser();
  if (!user) throw new Error("Sign in before creating a milestone.");
  const supabase = await createClient();
  const { error } = await supabase.from("milestones").insert({ tracker_id: parsed.data.trackerId, created_by: user.id, name: parsed.data.name, description: parsed.data.description || null, due_date: parsed.data.dueDate || null, weight: parsed.data.weight });
  if (error) throw new Error("The milestone could not be saved.");
  revalidatePath(`/trackers/${parsed.data.trackerId}`);
}

export async function archiveTracker(trackerId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Sign in before changing a tracker.");
  const supabase = await createClient();
  const { error } = await supabase.from("trackers").update({ status: "archived", archived_at: new Date().toISOString() }).eq("id", trackerId);
  if (error) throw new Error("The tracker could not be archived.");
  revalidatePath("/dashboard");
  revalidatePath("/trackers");
  revalidatePath(`/trackers/${trackerId}`);
}

export async function saveTrackerFields(input: { trackerId: string; fields: unknown }) {
  const parsed = trackerFieldsSchema.safeParse(input.fields);
  if (!parsed.success || !/^[0-9a-f-]{36}$/i.test(input.trackerId)) return { error: "Please check the field definitions." };
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in before editing tracker fields." };

  const supabase = await createClient();
  const { error: deleteError } = await supabase.from("tracker_fields").delete().eq("tracker_id", input.trackerId);
  if (deleteError) return { error: "You do not have permission to edit these fields." };
  if (parsed.data.length > 0) {
    const { error: insertError } = await supabase.from("tracker_fields").insert(parsed.data.map((field) => ({ tracker_id: input.trackerId, name: field.name, field_key: field.fieldKey, field_type: field.fieldType, description: field.description ?? null, is_required: field.isRequired, position: field.position, validation: field.validation, display: field.display })));
    if (insertError) return { error: "The field definitions could not be saved." };
  }
  revalidatePath(`/trackers/${input.trackerId}`);
  revalidatePath(`/trackers/${input.trackerId}/settings`);
  return { error: null };
}