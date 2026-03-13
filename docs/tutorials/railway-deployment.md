# Deploying Shelf AI to Railway

Shelf AI consists of two Next.js dashboards (Admin and User). Since they are part of a Turborepo monorepo, Railway requires specific configurations to build and deploy each app independently.

We have already included a `nixpacks.toml` file at the root to enforce `pnpm` usage, and the `next.config.ts` files are configured for `standalone` output mode.

Follow these steps to deploy both dashboards from the same GitHub repository natively in Railway.

## 1. Deploy the Admin Dashboard

1. Go to Railway -> **New Project** -> **Deploy from GitHub repo**.
1. Select your `shelf-ai` repository.
1. Railway will start building (and might fail initially due to missing env variables). Go to the service **Settings** panel.
1. **Root Directory:** Leave this completely blank (or `/`). _Do not set it to `apps/admin`._
1. Scroll to the **Build** section:
   - **Build Command:** `pnpm build --filter=@shelf-ai/admin`
1. Scroll down to the **Deploy** section:
   - **Start Command:** `pnpm --filter @shelf-ai/admin start`
1. Go to the **Variables** tab and add all your Admin environment variables (Clerk keys, SpacetimeDB URI, Gemini API key, etc.).
1. Click **Deploy** (or trigger a rebuild if it failed previously).

## 2. Deploy the User Dashboard

1. Go back to your Railway project dashboard.
1. Click **Create** -> **GitHub Repo**.
1. Select your exact same `shelf-ai` repository again. _(This creates a second, independent service alongside your Admin dashboard)._
1. Go to this new service's **Settings** panel.
1. In the **Build** section:
   - **Root Directory:** Leave blank (or `/`).
   - **Build Command:** `pnpm build --filter=@shelf-ai/user`
1. In the **Deploy** section:
   - **Start Command:** `pnpm --filter @shelf-ai/user start`
1. Go to the **Variables** tab and add all your User-specific environment variables.
1. Click **Deploy** (or trigger a rebuild if it failed previously).

### Why this works

Because Next.js `output: "standalone"` is enabled and `nixpacks.toml` configures pnpm for the workspace, Railway correctly captures all shared local packages (`@shelf-ai/ui`, `@shelf-ai/shared`) and isolates each dashboard into its own optimized Docker container.
