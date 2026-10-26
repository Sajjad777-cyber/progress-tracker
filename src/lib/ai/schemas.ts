import { z } from "zod";

export const aiTrackerFieldSchema = z.object({ name: z.string().min(1).max(120), fieldKey: z.string().regex(/^[a-z0-9_]+$/), fieldType: z.enum(["text", "long_text", "number", "boolean", "date", "single_select", "multi_select", "url", "currency", "percentage", "rating", "checkbox", "status"]), isRequired: z.boolean(), position: z.number().int().nonnegative() });
export const aiTrackerProposalSchema = z.object({ name: z.string().min(1).max(160), description: z.string().max(2000), category: z.string().max(80), mode: z.enum(["task", "numeric", "milestone", "manual", "habit", "mixed"]), fields: z.array(aiTrackerFieldSchema).max(30), tasks: z.array(z.string().min(1).max(240)).max(30), milestones: z.array(z.object({ name: z.string().min(1).max(200), description: z.string().max(1000), weight: z.number().positive() })).max(20), assumptions: z.array(z.string().max(300)).max(10), clarificationQuestions: z.array(z.string().max(300)).max(5) });
export type AITrackerProposal = z.infer<typeof aiTrackerProposalSchema>;

export const aiProposalRequestSchema = z.object({ prompt: z.string().trim().min(10, "Describe what you want to track.").max(4000) });
