import { PrototypePage } from "@/components/prototype-page";
import { TrackerBuilder } from "@/components/tracker-builder";
import { templateCatalog } from "@/lib/templates/catalog";

export const instant = false;

export default async function ManualTrackerPage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
	const { template: templateId } = await searchParams;
	const template = templateCatalog.find((item) => item.id === templateId);
	return <PrototypePage eyebrow={template ? "Template starting point" : "Visual builder"} title={template ? `Use ${template.name}` : "Build manually"} description={template ? `${template.description} You can edit the copied configuration after creation.` : "Create a tracker that fits the way you think, then preview it before saving."}><TrackerBuilder templateId={template?.id} initialName={template?.name} initialCategory={template?.category} initialMode={template?.mode} /></PrototypePage>;
}
