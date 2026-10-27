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

function isTransientProviderError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /503|UNAVAILABLE|high demand|temporarily/i.test(message);
}

async function generateWithTimeout(ai: GoogleGenAI, prompt: string) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      ai.models.generateContent({ model, contents: `${trackerProposalSystemPrompt}\n\nUser request:\n${prompt}`, config: { temperature: 0.2, responseMimeType: "application/json" } }),
      new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error("AI_TIMEOUT")), 15000); }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export const geminiProvider: AIProvider = {
  async proposeTracker(prompt) {
    const ai = getClient();
    let response;
    try {
      response = await generateWithTimeout(ai, prompt);
    } catch (error) {
      if (!isTransientProviderError(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, 750));
      response = await generateWithTimeout(ai, prompt);
    }
    const text = response.text?.trim();
    if (!text) throw new Error("AI_EMPTY_RESPONSE");
    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch { throw new Error("AI_INVALID_JSON"); }
    const proposal = aiTrackerProposalSchema.parse(parsed);
    return { proposal, model };
  },
};
