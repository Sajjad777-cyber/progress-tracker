import "server-only";

import { GoogleGenAI } from "@google/genai";
import { trackerProposalSystemPrompt } from "./prompts";
import { aiTrackerProposalSchema } from "./schemas";
import type { AIProvider } from "./provider";

const model = process.env.GEMINI_MODEL || "gemini-flash-latest";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("AI_NOT_CONFIGURED");
  return new GoogleGenAI({ apiKey });
}

export const geminiProvider: AIProvider = {
  async proposeTracker(prompt) {
    const ai = getClient();
    const response = await Promise.race([
      ai.models.generateContent({ model, contents: `${trackerProposalSystemPrompt}\n\nUser request:\n${prompt}`, config: { temperature: 0.2, responseMimeType: "application/json" } }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("AI_TIMEOUT")), 15000)),
    ]);
    const text = response.text?.trim();
    if (!text) throw new Error("AI_EMPTY_RESPONSE");
    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch { throw new Error("AI_INVALID_JSON"); }
    const proposal = aiTrackerProposalSchema.parse(parsed);
    return { proposal, model };
  },
};
