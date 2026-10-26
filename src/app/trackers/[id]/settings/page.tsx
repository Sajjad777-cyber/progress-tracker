import { PrototypePage } from "@/components/prototype-page";
import { FieldBuilder } from "@/components/field-builder";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function TrackerSettingsPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	let fields: Array<{ name: string; fieldKey: string; fieldType: string; isRequired: boolean; position: number }> = [];
	try {
		const supabase = await createClient();
		const { data } = await supabase.from("tracker_fields").select("name, field_key, field_type, is_required, position").eq("tracker_id", id).order("position");
		fields = (data ?? []).map((field) => ({ name: field.name, fieldKey: field.field_key, fieldType: field.field_type, isRequired: field.is_required, position: field.position }));
	} catch {
		fields = [];
	}
	return <PrototypePage eyebrow="Tracker settings" title="Customize your tracker" description="Field definitions, progress rules, visibility, and archive controls are managed here."><FieldBuilder trackerId={id} initialFields={fields} /></PrototypePage>;
}
