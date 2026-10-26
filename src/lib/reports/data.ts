import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getReportTrackers() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("trackers").select("id, name, status").order("updated_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}
