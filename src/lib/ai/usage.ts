import "server-only";

import { createClient } from "@/lib/supabase/server";

const DAILY_LIMIT = 20;

export async function assertAIUsageAvailable(userId: string) {
  const supabase = await createClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase.from("ai_usage").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("created_at", since);
  if (error) throw new Error("AI_USAGE_UNAVAILABLE");
  if ((count ?? 0) >= DAILY_LIMIT) throw new Error("AI_QUOTA_EXHAUSTED");
}

export async function recordAIUsage(userId: string, feature: string, provider: string, model: string) {
  const supabase = await createClient();
  await supabase.from("ai_usage").insert({ user_id: userId, feature, provider, model });
}
