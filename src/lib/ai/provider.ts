import "server-only";

import type { AITrackerProposal } from "./schemas";

export type AIProvider = { proposeTracker(prompt: string): Promise<{ proposal: AITrackerProposal; model: string }> };
