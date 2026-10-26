"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthFormState } from "@/lib/auth/schemas";

type AuthAction = (state: AuthFormState | undefined, formData: FormData) => Promise<AuthFormState>;

export function AuthForm({ mode, action }: { mode: "login" | "signup"; action: AuthAction }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const isSignup = mode === "signup";

  return <form action={formAction} className="mt-8 space-y-4" noValidate>
    {isSignup && <Field label="Name" name="name" type="text" placeholder="Alex Morgan" error={state?.fieldErrors?.name?.[0]} />}
    <Field label="Email" name="email" type="email" placeholder="you@example.com" error={state?.fieldErrors?.email?.[0]} />
    <Field label="Password" name="password" type="password" placeholder="At least 8 characters" error={state?.fieldErrors?.password?.[0]} />
    {state?.error && <p role="alert" className="rounded-lg bg-[#fff1e9] px-3 py-2.5 text-sm text-[var(--danger)]">{state.error}</p>}
    <button type="submit" disabled={pending} className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--primary-deep)] disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Working..." : isSignup ? "Create account" : "Sign in"}</button>
  </form>;
}

function Field({ label, name, type, placeholder, error }: { label: string; name: string; type: string; placeholder: string; error?: string }) {
  return <label className="block text-sm font-semibold" htmlFor={name}>{label}<input id={name} name={name} type={type} className="mt-2 w-full rounded-lg border px-3 py-3 font-normal outline-none transition-colors focus:border-[var(--primary)]" placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} />{error && <span id={`${name}-error`} className="mt-1.5 block text-xs font-normal text-[var(--danger)]">{error}</span>}</label>;
}

export function AuthFooter({ mode }: { mode: "login" | "signup" }) {
  return <p className="mt-6 text-center text-sm text-[var(--muted)]">{mode === "login" ? "New to ProgressOS?" : "Already have an account?"} <Link href={mode === "login" ? "/signup" : "/login"} className="font-bold text-[var(--primary)]">{mode === "login" ? "Create an account" : "Sign in"}</Link></p>;
}
