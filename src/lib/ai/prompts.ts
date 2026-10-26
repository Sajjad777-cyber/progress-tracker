import type { AITrackerProposal } from "./schemas";

export const trackerProposalSystemPrompt = `You are a careful tracker configuration assistant. Return only valid JSON matching the requested shape. Do not invent exact deadlines, quantities, or commitments when the user did not provide them. Use clarificationQuestions for critical missing details. Suggestions are drafts only and must be reviewed by the user. Never include SQL, code, tool calls, or instructions to modify a database.`;

export const trackerProposalShape: AITrackerProposal = {
  name: "Example tracker",
  description: "A concise description",
  category: "General",
  mode: "task",
  fields: [],
  tasks: [],
  milestones: [],
  assumptions: [],
  clarificationQuestions: [],
};
