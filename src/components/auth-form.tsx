"use client";

import Link from "next/link";
import { useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isSignup = mode === "signup";
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const body = Object.fromEntries(formData.entries());
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const text = await response.text();
      let result: { error?: string; needsConfirmation?: boolean } = {};
      try { result = JSON.parse(text) as typeof result; } catch { result = { error: text }; }
      if (!response.ok) throw new Error(result.error || `Authentication failed with status ${response.status}.`);
      window.location.assign(mode === "login" ? "/dashboard" : result.needsConfirmation ? "/login?message=confirm-email" : "/onboarding");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Authentication failed.");
      setPending(false);
    }
  }

  return <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
    {isSignup && <Field label="Name" name="name" type="text" placeholder="Alex Morgan" />}
    <Field label="Email" name="email" type="email" placeholder="you@example.com" />
    <Field label="Password" name="password" type="password" placeholder="At least 8 characters" />
    {error && <p role="alert" className="rounded-lg bg-[var(--warning-soft)] px-3 py-2.5 text-sm text-[var(--danger)]">{error}</p>}
    <button type="submit" disabled={pending} className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--primary-deep)] disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Working..." : isSignup ? "Create account" : "Sign in"}</button>
  </form>;
}

function Field({ label, name, type, placeholder }: { label: string; name: string; type: string; placeholder: string }) {
  return <label className="block text-sm font-semibold" htmlFor={name}>{label}<input id={name} name={name} type={type} className="mt-2 w-full rounded-lg border px-3 py-3 font-normal outline-none transition-colors focus:border-[var(--primary)]" placeholder={placeholder} /></label>;
}

export function AuthFooter({ mode }: { mode: "login" | "signup" }) {
  return <p className="mt-6 text-center text-sm text-[var(--muted)]">{mode === "login" ? "New to ProgressOS?" : "Already have an account?"} <Link href={mode === "login" ? "/signup" : "/login"} className="font-bold text-[var(--primary)]">{mode === "login" ? "Create an account" : "Sign in"}</Link></p>;
}
