export type TemplateDefinition = {
  id: string;
  name: string;
  description: string;
  category: string;
  mode: "task" | "numeric" | "milestone" | "manual" | "habit" | "mixed";
  fields: Array<{ name: string; fieldKey: string; fieldType: string; isRequired: boolean; position: number }>;
  suggestedTasks: string[];
};

export const templateCatalog: TemplateDefinition[] = [
  { id: "study-plan", name: "Study plan", description: "Subjects, study sessions, assignments, and exams.", category: "Learning", mode: "task", fields: [{ name: "Subject", fieldKey: "subject", fieldType: "single_select", isRequired: true, position: 0 }, { name: "Study minutes", fieldKey: "study_minutes", fieldType: "number", isRequired: false, position: 1 }], suggestedTasks: ["Choose the first subject", "Set the first study session", "Review the next assignment"] },
  { id: "fitness-rhythm", name: "Fitness rhythm", description: "Sessions, habits, targets, and consistency.", category: "Health", mode: "habit", fields: [{ name: "Activity", fieldKey: "activity", fieldType: "text", isRequired: true, position: 0 }, { name: "Duration", fieldKey: "duration", fieldType: "number", isRequired: false, position: 1 }], suggestedTasks: ["Choose a weekly schedule", "Record the first session"] },
  { id: "reading-list", name: "Reading list", description: "Books, reading progress, notes, and reflections.", category: "Personal", mode: "numeric", fields: [{ name: "Author", fieldKey: "author", fieldType: "text", isRequired: false, position: 0 }, { name: "Pages", fieldKey: "pages", fieldType: "number", isRequired: false, position: 1 }], suggestedTasks: ["Add the first book", "Set a reading target"] },
  { id: "software-project", name: "Software project", description: "Milestones, delivery work, risks, and technical notes.", category: "Work", mode: "milestone", fields: [{ name: "Owner", fieldKey: "owner", fieldType: "text", isRequired: false, position: 0 }, { name: "Risk", fieldKey: "risk", fieldType: "single_select", isRequired: false, position: 1 }], suggestedTasks: ["Define the first milestone", "List the known risks"] },
];
