import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { geminiProvider } from "@/lib/ai/gemini-provider";
import { assertAIUsageAvailable, recordAIUsage } from "@/lib/ai/usage";
import { aiProposalRequestSchema } from "@/lib/ai/schemas";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Sign in before using the AI assistant." }, { status: 401 });
    const body = await request.json();
    const parsed = aiProposalRequestSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Describe what you want to track." }, { status: 400 });
    await assertAIUsageAvailable(user.id);
    const result = await geminiProvider.proposeTracker(parsed.data.prompt);
    await recordAIUsage(user.id, "tracker_proposal", "gemini", result.model);
    return NextResponse.json({ proposal: result.proposal, model: result.model });
  } catch (error) {
    const code = error instanceof Error ? error.message : "AI_UNAVAILABLE";
    const messages: Record<string, string> = { AI_NOT_CONFIGURED: "AI is not configured. Manual tracker creation is still available.", AI_QUOTA_EXHAUSTED: "Your daily AI limit has been reached. Try again tomorrow or build the tracker manually.", AI_TIMEOUT: "The AI request took too long. Please try again.", AI_INVALID_JSON: "The AI returned an invalid proposal. Please try again.", AI_USAGE_UNAVAILABLE: "AI usage could not be checked. Please try again later." };
    const status = code === "AI_QUOTA_EXHAUSTED" ? 429 : code === "AI_NOT_CONFIGURED" ? 503 : 500;
    return NextResponse.json({ error: messages[code] ?? "The AI assistant is temporarily unavailable." }, { status });
  }
}
