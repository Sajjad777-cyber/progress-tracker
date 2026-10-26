"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema, type AuthFormState } from "@/lib/auth/schemas";

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function login(_state: AuthFormState | undefined, formData: FormData): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({ email: formValue(formData, "email"), password: formValue(formData, "password") });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) return { error: "Those sign-in details were not accepted." };
  } catch {
    return { error: "Authentication is not configured yet. Add Supabase values to your environment." };
  }

  redirect("/dashboard");
}

export async function signup(_state: AuthFormState | undefined, formData: FormData): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({ name: formValue(formData, "name"), email: formValue(formData, "email"), password: formValue(formData, "password") });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({ email: parsed.data.email, password: parsed.data.password, options: { data: { name: parsed.data.name } } });
    if (error) return { error: "We could not create that account." };
  } catch {
    return { error: "Authentication is not configured yet. Add Supabase values to your environment." };
  }

  redirect("/onboarding");
}
