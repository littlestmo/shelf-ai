# Google AI (Gemini) Setup

Step-by-step guide to obtaining a **Google Generative AI API key** for Shelf AI's AI features (search, generation, shuffle).

## 1. Open Google AI Studio

1. Go to [aistudio.google.com](https://aistudio.google.com).
1. Sign in with your Google account.

## 2. Get an API Key

1. Click the **Get API Key** button in the left sidebar.
1. You can either create a key in a **new Google Cloud project** or select an **existing project**.
1. Click **Create API key**.
1. Copy the generated key immediately, it is only shown once.

## 3. Configure Environment Variables

Add the key to `.env.local` in both `apps/user/` and `apps/admin/`:

```env
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...your_key_here
```

The Vercel AI SDK automatically reads this environment variable, no additional configuration is required.

## 4. Model Selection

Shelf AI uses `gemini-2.5-flash` by default. This model is:

- Fast (sub-second structured output)
- Free tier available (5 requests/minute, 1M tokens/day)
- Supports structured JSON output via function calling

To switch models, update the `google()` call in the API routes:

```typescript
model: google("gemini-2.5-flash");
```

Available alternatives: `gemini-2.5-pro`, `gemini-3.0-flash`.

## 5. Verify

1. Start the dev server: `pnpm dev`.
1. Go to the admin dashboard at `http://localhost:3001/ai-generate`.
1. Enter a prompt like "A mystery novel set in a library".
1. If you see a generated book entry, the key is configured correctly.
1. If you see a 401 error, double-check the key in your `.env.local`.

## 6. API Limits (Free Tier)

| Limit               | Value |
| :------------------ | :---- |
| Requests per minute | 5     |
| Tokens per minute   | 250K  |

For production workloads, enable billing in the [Google Cloud Console](https://console.cloud.google.com).
