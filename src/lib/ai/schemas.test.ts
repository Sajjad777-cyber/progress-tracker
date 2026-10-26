import { describe, expect, it } from "vitest";
import { aiTrackerProposalSchema } from "./schemas";

describe("AI proposal schema", () => {
  it("accepts a structured proposal", () => {
    const result = aiTrackerProposalSchema.safeParse({ name: "Study plan", description: "A focused plan", category: "Learning", mode: "task", fields: [], tasks: ["Study"], milestones: [], assumptions: [], clarificationQuestions: [] });
    expect(result.success).toBe(true);
  });

  it("rejects unsafe or malformed proposal data", () => {
    const result = aiTrackerProposalSchema.safeParse({ name: "x", description: "", category: "", mode: "unknown", fields: [], tasks: [], milestones: [], assumptions: [], clarificationQuestions: [] });
    expect(result.success).toBe(false);
  });
});
