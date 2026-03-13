# Clerk Authentication Setup

Step-by-step guide to obtaining **Clerk API keys** for Shelf AI's authentication system.

## 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com) and click **Get started free**.
1. Sign up with your GitHub, Google, or email address.

## 2. Create a New Application

1. In the Clerk Dashboard, click **Create application**.
1. Enter the application name: `Shelf AI`.
1. Select the sign-in methods you want to enable (Email, Google, GitHub, etc.).
1. Click **Create application**.

## 3. Get Your API Keys

After creating the application, you're taken to the **API Keys** page. You need two keys:

| Key             | Variable                            | Location                             |
| :-------------- | :---------------------------------- | :----------------------------------- |
| Publishable key | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Starts with `pk_test_` or `pk_live_` |
| Secret key      | `CLERK_SECRET_KEY`                  | Starts with `sk_test_` or `sk_live_` |

Both are visible on the **API Keys** page of your Clerk Dashboard at: `dashboard.clerk.com → [Your App] → API Keys`.

## 4. Configure Environment Variables

Add these keys to `.env.local` in both `apps/user/` and `apps/admin/`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
```

## 5. Configure Redirect URLs

The admin and user dashboards use different redirect paths after authentication:

**apps/user/.env.local:**

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/home
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/home
```

**apps/admin/.env.local:**

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## 6. Verify

1. Run `pnpm dev`.
1. Navigate to `http://localhost:3002/sign-in`.
1. You should see the Clerk-hosted sign-in form styled with Shelf AI's dark theme.
