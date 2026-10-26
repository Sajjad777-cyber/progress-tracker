import { FolderKanban, ListChecks, Target } from "lucide-react";
import { PreviewCard, PrototypePage } from "@/components/prototype-page";

export default function TrackersPage() { return <PrototypePage eyebrow="Workspace" title="Your trackers" description="Keep every kind of progress in one calm, flexible library." action={{ href: "/trackers/new", label: "New tracker" }}><div className="mt-8 grid gap-4 md:grid-cols-3"><PreviewCard icon={Target} title="Web development" detail="Learning · 62% complete · Updated today" /><PreviewCard icon={FolderKanban} title="Product launch" detail="Work · 48% complete · Updated yesterday" /><PreviewCard icon={ListChecks} title="Morning movement" detail="Habit · 76% complete · 18 day streak" /></div></PrototypePage>; }
