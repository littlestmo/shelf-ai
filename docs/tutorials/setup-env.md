# Setup Environment Variables

All environment variables for Shelf AI, organized by provider.

## Required Files

Each Next.js app needs its own `.env.local`:

| App   | Path                    | Port |
| :---- | :---------------------- | :--- |
| Admin | `apps/admin/.env.local` | 3001 |
| User  | `apps/user/.env.local`  | 3002 |

## Complete `.env.local` Template

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/home
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/home

# SpacetimeDB
NEXT_PUBLIC_SPACETIMEDB_URI=http://localhost:3000
NEXT_PUBLIC_SPACETIMEDB_MODULE=shelf-ai

# Google Gemini (Vercel AI SDK)
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...
```

## Where to Get Each Key

| Variable                            | Provider                                                             | Guide                                 |
| :---------------------------------- | :------------------------------------------------------------------- | :------------------------------------ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard → API Keys](https://dashboard.clerk.com)            | [Clerk Setup](clerk-setup.md)         |
| `CLERK_SECRET_KEY`                  | [Clerk Dashboard → API Keys](https://dashboard.clerk.com)            | [Clerk Setup](clerk-setup.md)         |
| `GOOGLE_GENERATIVE_AI_API_KEY`      | [Google AI Studio → Get API Key](https://aistudio.google.com/api-keys) | [Google AI Setup](google-ai-setup.md) |

## Verify Setup

1. Run `pnpm dev`
1. Admin dashboard loads at `http://localhost:3001`
1. User dashboard loads at `http://localhost:3002`
1. Clerk sign-in page renders without errors
1. AI features respond (test via admin AI Generate page)
