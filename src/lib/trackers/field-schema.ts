import { z } from "zod";

export const trackerFieldTypeSchema = z.enum(["text", "long_text", "number", "boolean", "date", "single_select", "multi_select", "url", "currency", "percentage", "rating", "checkbox", "status"]);
export const trackerFieldSchema = z.object({
  name: z.string().trim().min(1).max(120),
  fieldKey: z.string().regex(/^[a-z0-9_]+$/),
  fieldType: trackerFieldTypeSchema,
  description: z.string().max(500).optional(),
  isRequired: z.boolean().default(false),
  position: z.number().int().nonnegative(),
  defaultValue: z.string().max(200).optional(),
  units: z.string().max(40).optional(),
  options: z.array(z.string().max(80)).max(30).default([]),
  displayFormat: z.string().max(80).optional(),
  visibility: z.enum(["card", "table", "form", "hidden"]).default("card"),
  validation: z.record(z.string(), z.unknown()).default({}),
  display: z.record(z.string(), z.unknown()).default({}),
});
export const trackerFieldsSchema = z.array(trackerFieldSchema).max(50);
