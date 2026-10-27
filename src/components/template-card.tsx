import Link from "next/link";
import { ArrowRight, BookOpen, Dumbbell, LibraryBig, Rocket } from "lucide-react";
import type { TemplateDefinition } from "@/lib/templates/catalog";

const icons = { "study-plan": BookOpen, "fitness-rhythm": Dumbbell, "reading-list": LibraryBig, "software-project": Rocket };

export function TemplateCard({ template }: { template: TemplateDefinition }) {
  const Icon = icons[template.id as keyof typeof icons] ?? BookOpen;
  return <div className="surface-card p-5"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-[var(--primary)]"><Icon className="h-5 w-5" /></span><span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[var(--muted)]">{template.category}</span></div><h2 className="mt-5 font-display font-bold">{template.name}</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{template.description}</p><p className="mt-4 text-xs text-[var(--muted)]">{template.fields.length} fields · {template.suggestedTasks.length} suggested steps</p><Link href={`/trackers/new/manual?template=${template.id}`} className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[var(--primary)]">Use template <ArrowRight className="h-3.5 w-3.5" /></Link></div>;
}
