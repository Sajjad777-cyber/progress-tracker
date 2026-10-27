import Link from "next/link";
import { AuthFooter, AuthForm } from "@/components/auth-form";

export default function SignupPage() {
	return <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-5 py-12"><div className="w-full max-w-md"><Link href="/" className="font-display text-lg font-bold text-[var(--primary-deep)]">progress<span className="text-[var(--accent)]">OS</span></Link><div className="mt-10 surface-card p-7 sm:p-9"><h1 className="font-display text-2xl font-bold">Create your workspace</h1><p className="mt-2 text-sm text-[var(--muted)]">Start making your progress visible.</p><AuthForm mode="signup" /><AuthFooter mode="signup" /></div><p className="mt-5 text-center text-xs text-[var(--muted)]">Your account is handled securely by Supabase.</p></div></main>;
}
