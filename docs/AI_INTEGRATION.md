# ProgressOS AI integration

ProgressOS uses the official `@google/genai` SDK through a server-only provider boundary.

## Configuration

Set these values in `.env.local` or the hosting provider environment:

```text
GEMINI_API_KEY=your-server-only-key
GEMINI_MODEL=gemini-flash-latest
```

`GEMINI_API_KEY` must never be prefixed with `NEXT_PUBLIC_` and must never be imported by client components. The model name is configurable so it can be changed when provider availability changes.

## Current workflow

The AI tracker builder accepts a natural-language request, sends it to the authenticated server route `/api/ai/tracker-proposal`, parses the response as JSON, and validates it with Zod. The result is displayed as an editable draft. Nothing is written until the user explicitly approves it through `/api/ai/tracker-proposal/approve`, which validates the edited proposal again and writes through the authenticated Supabase client and RLS.

The provider prompt forbids SQL, code, tool calls, and invented commitments. AI suggestions are not authoritative progress values. All progress calculations remain deterministic application logic.

## Limits and failure behavior

- Maximum request size: 4,000 characters.
- Daily limit: 20 requests per user.
- Provider requests time out after 15 seconds.
- Invalid JSON and invalid structured output are rejected.
- Missing keys, quota exhaustion, timeout, and provider failures return user-safe messages.
- Manual tracker creation remains available when AI is disabled.

Usage records are stored in `ai_usage` when the database is configured. Raw prompts are not persisted by this implementation.

## Privacy

Before using Gemini with sensitive work data, review Google's current AI Studio or Gemini API data-processing terms and configure the product's privacy policy accordingly. Context minimization is required before adding progress analysis or persistent conversations.

## Testing

Automated tests validate proposal schemas without requiring a Gemini key. A real-provider integration test should only be run manually when `GEMINI_API_KEY` is configured and the account's quota and data-processing settings are understood.
