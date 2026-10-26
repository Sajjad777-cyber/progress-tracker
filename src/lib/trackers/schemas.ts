import { z } from "zod";

export const trackerModeSchema = z.enum(["task", "numeric", "milestone", "manual", "habit", "mixed"]);
export const trackerInputSchema = z.object({
  name: z.string().trim().min(1, "Give your tracker a name.").max(160),
  description: z.string().trim().max(2000).optional(),
  category: z.string().trim().max(80).optional(),
  mode: trackerModeSchema,
  templateId: z.string().max(80).optional(),
  startDate: z.string().optional(),
  targetDate: z.string().optional(),
}).refine((value) => !value.startDate || !value.targetDate || value.targetDate >= value.startDate, { message: "Target date must be on or after the start date.", path: ["targetDate"] });

export const taskInputSchema = z.object({ trackerId: z.string().uuid(), title: z.string().trim().min(1).max(240), description: z.string().trim().max(2000).optional(), priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"), dueDate: z.string().optional() });
export const milestoneInputSchema = z.object({ trackerId: z.string().uuid(), name: z.string().trim().min(1).max(200), description: z.string().trim().max(2000).optional(), dueDate: z.string().optional(), weight: z.coerce.number().positive() });