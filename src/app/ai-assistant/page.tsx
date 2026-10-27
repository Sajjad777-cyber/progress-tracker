import { Sparkles } from "lucide-react";
import { AITrackerBuilder } from "@/components/ai-tracker-builder";
import { AppShell } from "@/components/app-shell";

export default function AIAssistantPage() { return <AppShell><div className="mx-auto max-w-6xl"><div className="flex items-start gap-3"><span className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--success-soft)] text-[var(--primary)]"><Sparkles className="h-5 w-5" /></span><div><p className="text-sm font-bold uppercase tracking-[.15em] text-[var(--primary)]">Optional intelligence</p><h1 className="mt-2 font-display metric-value text-3xl font-bold tracking-[-0.04em]">AI tracker builder</h1><p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">Describe what you want to track and receive a structured draft. The assistant cannot save anything without a later approval step.</p></div></div><AITrackerBuilder /></div></AppShell>; }
