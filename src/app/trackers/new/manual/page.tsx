import { PrototypePage } from "@/components/prototype-page";
import { ManualTrackerForm } from "@/components/manual-tracker-form";
import { templateCatalog } from "@/lib/templates/catalog";

export const instant = false;

export default async function ManualTrackerPage({ searchParams }: { searchParams: Promise<{ template?: string }> }) {
	const { template: templateId } = await searchParams;
	const template = templateCatalog.find((item) => item.id === templateId);
	return <PrototypePage eyebrow={template ? "Template starting point" : "Tracker builder"} title={template ? `Use ${template.name}` : "Build manually"} description={template ? `${template.description} You can edit the copied configuration after creation.` : "Start with the essentials. You can add fields, tasks, and milestones from the tracker detail view."}><ManualTrackerForm templateId={template?.id} initialName={template?.name} initialCategory={template?.category} initialMode={template?.mode} /></PrototypePage>;
}
