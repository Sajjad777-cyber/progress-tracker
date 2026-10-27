import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signupSchema } from "@/lib/auth/schemas";

export async function POST(request: Request) {
  try {
    const parsed = signupSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check your account details." }, { status: 400 });
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({ email: parsed.data.email, password: parsed.data.password, options: { data: { name: parsed.data.name } } });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, needsConfirmation: !data.session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication request failed.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
