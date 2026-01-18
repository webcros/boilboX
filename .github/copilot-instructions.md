## Quick context for AI coding agents

This repository is a Next.js (app router) project (Next 14) with an embedded Sanity Studio and Supabase-auth flows. The goal of this file is to give an AI agent enough concrete, actionable knowledge to be productive immediately.

### High-level architecture
- Next.js app (app directory) is the main frontend and server-side handler.
- Sanity Studio is mounted and rendered via `next-sanity` at the `/studio` path. See `sanity.config.ts` and `src/app/studio/[[...tool]]/page.tsx` + `StudioClient.tsx`.
- Sanity is used as the content source (schemas live in `src/sanity/schemaTypes`). Sanity client helper is in `src/lib/sanity.ts`.
- Supabase is used for authentication (including Google OAuth) and session management. See `src/lib/supabase.ts` and `src/app/api/auth/google/route.ts`.

### Important files to open first
- `package.json` — scripts and key deps. Notable scripts: `dev`, `dev-webpack` (disables Turbopack), `build`, `start`, `lint` (`biome check`).
- `next.config.ts` — contains Next.js flags (e.g., `reactCompiler: false`).
- `sanity.config.ts` — Sanity Studio config; import point for `src/sanity/*` configuration.
- `src/lib/sanity.ts` — single Sanity client instance. Uses env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_WRITE_TOKEN`.
- `src/sanity/schemaTypes` — canonical schema source for the Studio.
- `src/lib/sanity-queries.ts` — example GROQ queries and data-mapping patterns (fetch -> map to typed model).
- `src/app/studio/[[...tool]]/page.tsx` and `StudioClient.tsx` — how the Studio is wired into Next.js.
- `src/lib/supabase.ts` and `src/app/api/auth/google/route.ts` — Supabase auth flow and admin-check logic.

### Environment & secrets (important)
The codebase expects the following environment variables (used directly in code):
- NEXT_PUBLIC_SANITY_PROJECT_ID
- NEXT_PUBLIC_SANITY_DATASET
- NEXT_PUBLIC_SANITY_WRITE_TOKEN  (note: present in client code; treat as sensitive in practice)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (used for server-side service client)
- ADMIN_EMAILS (comma-separated emails used by the admin-check in `api/auth/google/route.ts`)

When changing env usage, search `src/lib/sanity.ts`, `src/lib/supabase.ts`, and `src/app/api` for references.

### Patterns and conventions to follow
- Data flow for content reads: use `sanityClient.fetch(groqQuery, params)`, then map raw results into TS interfaces (see `src/lib/sanity-queries.ts`). Keep mapping close to the data consumer.
- Sanity schema edits must be made under `src/sanity/schemaTypes` (these are the source-of-truth for Studio). The Studio is served through Next when running the app.
- Studio uses server-side dynamic rendering: `export const dynamic = 'force-dynamic'` in the studio page. Prefer server-side-safe imports for studio-specific modules.
- OAuth/admin flow: Google OAuth handled via Supabase in `src/app/api/auth/google/route.ts`. Admin access is first checked against `ADMIN_EMAILS`, then falls back to a Sanity `user` document lookup.
- For client vs server client choices: the repository exposes a public client in `src/lib/sanity.ts` and server-specific client patterns can be introduced when needed (follow current file's patterns: `useCdn: false` for write ops).

### Build / dev / lint commands
- Run development: `npm run dev` (or `pnpm dev`).
- If you need to disable Turbopack for debugging webpack behavior: `npm run dev-webpack` (sets NEXT_USE_UNSUPPORTED_DISABLE_TURBOPACK=1).
- Build for production: `npm run build` then `npm run start`.
- Lint/format: `npm run lint` (biome), `npm run format` (biome format).

### Examples the agent can use when editing code
- To add a new Sanity query and expose it: add the GROQ in `src/lib/sanity-queries.ts`, use `sanityClient.fetch(query, params)`, then map to the existing `Meal` (or appropriate) interface in `src/lib/types.ts`.
- To change Studio schema: edit or add files under `src/sanity/schemaTypes` and ensure `src/sanity/index.ts` (or `schemaTypes/index.ts`) exports the new type.
- To debug OAuth: inspect `src/app/api/auth/google/route.ts` and `src/lib/supabase.ts`. The route both initiates and receives the OAuth callback depending on presence of `code` query param.

### Quick GOTCHAs and repo-specific notes
- `NEXT_PUBLIC_SANITY_WRITE_TOKEN` is referenced in client-side code. Be careful: write tokens should be server-only—if you remove it from the client, update code that imports `sanityClient` in client bundles.
- The Studio is included in the Next app, not run as a separate `sanity` process. Modifying the Studio config requires editing `sanity.config.ts` (root) and schema files under `src/sanity`.
- Linting uses Biome (`@biomejs/biome`) — don't run eslint specific commands unless you add an ESLint config.

### Where to look for more examples
- Content queries and model mapping: `src/lib/sanity-queries.ts` and `src/lib/types.ts`.
- Authentication flows: `src/app/api/auth/*` and `src/lib/supabase.ts`.
- Studio wiring: `sanity.config.ts`, `src/app/studio/[[...tool]]/page.tsx`, `src/app/studio/[[...tool]]/StudioClient.tsx`.

If anything above is unclear or you want the agent to emphasize a particular area (tests, schema migration, CI), tell me which and I'll expand/iterate.
