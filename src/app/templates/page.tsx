import { TemplateCard } from "@/components/template-card";
import { PrototypePage } from "@/components/prototype-page";
import { templateCatalog } from "@/lib/templates/catalog";

export default function TemplatesPage() { return <PrototypePage eyebrow="Starting points" title="Template library" description="Begin with a thoughtful structure, then make it yours." action={{ href: "/trackers/new", label: "Create from scratch" }}><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{templateCatalog.map((template) => <TemplateCard key={template.id} template={template} />)}</div></PrototypePage>; }
