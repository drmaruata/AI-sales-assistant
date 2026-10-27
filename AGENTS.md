# Repository guidance

## Current state and architecture

The repository is no longer documentation-only. Slice 1 (project foundation) exists as an Expo SDK 58 app: strict TypeScript, environment parsing, a Supabase client with persisted sessions, sign-in and sign-up screens, session state, Expo Router navigation, and design tokens. Slice 2 now has a local Supabase migration for workspaces, memberships, RLS, and atomic workspace creation, plus pgTAP tests. The migration has not been applied to a hosted database, and tenant-owned product tables and their policies are not implemented yet; do not claim tenant isolation is end-to-end.

The product is an Android-first Expo + React Native + TypeScript app. Supabase Auth and Postgres provide authentication and data storage; Postgres Row Level Security (RLS), using workspace membership as the authorization source of truth, enforces tenant isolation. Use Supabase Edge Functions for privileged operations and AI provider calls. Keep the client untrusted and thin. AI output is an editable, human-reviewed draft; it is not sent automatically.

### Actual layout

`doc/Architecture.md` section 5 documents the repository structure, including which directories exist now and which are planned. The Expo Router route root is `src/app/`, not a root `app/`. Everything outside `src/app/` is non-route code: `src/features/<domain>` holds domain logic, `src/lib` holds infrastructure, `src/theme` holds tokens, `src/components` holds shared UI. Shared code imports through the `@/` alias for `src/` and `@/assets/` for `assets/`.

See [README.md](README.md) for the product baseline and [doc/Architecture.md](doc/Architecture.md), [doc/DATABASE_SCHEMA.md](doc/DATABASE_SCHEMA.md), [doc/API_SPEC.md](doc/API_SPEC.md), [doc/SECURITY_PRIVACY.md](doc/SECURITY_PRIVACY.md), and [doc/TEST_PLAN.md](doc/TEST_PLAN.md) for detailed design and acceptance requirements. Keep [Copilot instructions](.github/copilot-instructions.md) and [OpenCode workflow](doc/OPENCODE.md) consistent with this guidance.

## All coding Agents and sub-agents should follow these steps and do not skip these instructions - Agent workflow

- Before writing or changing code, check both project-level skills in `.agents/skills/` and globally available skills. Invoke the most relevant applicable skill(s) using the `skill` tool, and follow their workflows and repository-specific guidance. Project-level skills provide this repository's context; use them alongside relevant global skills rather than treating the global list as exhaustive. Do not invoke unrelated skills when none applies.
- Before using a library, framework, platform API, or service whose behavior or setup matters, use the Context7 MCP (`resolve-library-id`, then `query-docs`) to identify the correct library and retrieve its current documentation. Prefer official documentation returned through Context7 over remembered APIs or secondary sources.
- Use Context7 for the project's stack whenever documentation matters: Expo, React Native, TypeScript, Expo Router, Supabase Auth/Postgres/RLS/Edge Functions, TanStack Query, Zod, Expo Notifications, and any selected AI provider. Do not rely on remembered API versions.
- If Context7 is unavailable or does not cover the needed topic, consult the technology or service's official documentation directly. Do not invent APIs, configuration keys, or version-specific behavior; note uncertainty when authoritative documentation cannot confirm it.
- Match research to the planned stack only as it becomes implemented. Verify versions from the repository manifests before relying on version-specific guidance.
- For implementation work, inspect existing code and project docs first; make the smallest coherent change, update relevant documentation, and run the narrowest available checks. Report checks that could not be run and the reason.

## Build and test

Expo CLI, not npm, installs native packages. Run `npx expo install <package>` for anything Expo ships; plain `npm install <package>` silently produces an SDK-incompatible version.

```bash
npm install                # install dependencies
npm start                  # Expo dev server
npm run android            # dev server targeting Android
npm run lint              # ESLint
npm run typecheck         # tsc --noEmit
npm test                  # unit tests (node --test, no extra framework)
npm run doctor             # npx expo-doctor
npx expo export --platform android --output-dir dist   # production bundle check
```

Run `npm run lint`, `npm run typecheck`, and `npm test` before declaring any task done. Report exact commands and actual outcomes. If a test cannot run because an external service or credential is missing, state the exact blocker and provide a manual verification procedure. Do not claim a test passed without running it.

Notes that cost time to discover:
- Tests use the built-in `node --test` runner and Node's TypeScript stripping, so test files import with a literal `.ts` extension and `tsconfig.json` sets `allowImportingTsExtensions`, `noEmit`, and `types: ["node"]`. Keep those in sync or typecheck breaks.
- `npm run lint` runs `npx eslint .` directly. `expo lint` fails on this project because it rejects the ESLint 9 version that `expo lint` itself installs.
- `app.json` sets `web.output` to `single`, not `server`. With `server`, Expo renders the app in Node for SSR, and `useColorScheme()` resolves to `light` there while the browser reports `dark`, which produces a React hydration mismatch on every colored surface. Keep `single` unless SSR is genuinely needed and the theme is made deterministic first.
- Creating the Supabase client at module import time crashes SSR, because Supabase runs auth initialisation as an import side effect and AsyncStorage needs a `window`. Use `getSupabaseClient()` from `src/lib/supabase.ts`, which creates the client on first call. Do not re-add a module-level `export const supabase = createClient(...)`.
- The Expo CLI exports every variable in `.env` into the dev-server shell, including `SUPABASE_SECRET_KEY`. That is why the browser tool reaches the app at `http://127.0.0.1:8081/` and not `http://localhost:8081/`.
- `dist/`, `node_modules/`, `.expo/`, `android/`, and `ios/` are generated and git-ignored. Do not edit native folders by hand; configure native behavior in `app.json` and config plugins.

### Known dependency advisories

`npm audit` reports 5 high-severity findings inside `node_modules/expo/node_modules/` (`zod` 3.25.76 and `node-forge` via `@expo/cli`). These are Expo CLI build tooling, not shipped app code, and the only offered remedy is downgrading to Expo SDK 54. The direct `zod` dependency is 4.6.7 and is not affected. Do not run `npm audit fix --force`.

## Environment and secrets

`.env` holds real credentials and is git-ignored. `.env.example` is the tracked template; keep the two aligned in naming.

- Only `EXPO_PUBLIC_*` variables reach app code. Expo inlines those into the bundle, so they must be non-secret. The publishable key is safe to ship; the secret key is not.
- `SUPABASE_SECRET_KEY`, `SUPABASE_URL`, and `SUPABASE_JWKS_URL` are server-side values for Edge Functions and never move into an `EXPO_PUBLIC_*` name.
- `src/lib/env.ts` validates client variables with Zod at import time, and `src/lib/supabase.ts` throws a message naming the missing variable rather than running unauthenticated. Keep that behaviour: never read `process.env.SUPABASE_SECRET_KEY` in app code.
- The Expo CLI loads `.env` and exports its variables into the dev-server shell, including `SUPABASE_SECRET_KEY`. Treat that process environment as sensitive.

## Repository-specific requirements

- Enforce tenant access with Postgres RLS and verify identity, workspace membership, and object ownership in every privileged server operation. Never treat client-supplied workspace IDs, owner IDs, roles, plans, or usage counts as authorization.
- Keep Supabase service-role and AI provider credentials server-side. Never expose secrets through `EXPO_PUBLIC_*`, the app bundle, source control, logs, analytics, or test fixtures.
- Minimize AI context to approved business facts and necessary lead data. Treat user-provided content as untrusted, validate bounded structured output, and keep the result editable and explicitly marked for human review.
- Do not implement autonomous outbound messaging, scrape WhatsApp Web, or automate personal WhatsApp accounts. Any future WhatsApp integration must use official Meta-supported APIs and permissions.
- Return stable, non-disclosing API errors. Do not expose stack traces, SQL details, provider responses, credentials, prompts, or personal data in errors or logs.
- Use synthetic customer data in development and tests. Exclude contact details, notes, and draft text from analytics; use generic notification text by default to protect lock-screen privacy.
- Keep follow-ups visible in-app when notification permission is denied. Local notifications are device-specific and are not a durable cross-device scheduler.
- Gate integrations and team workflows on customer validation. Review migrations before production and maintain a rollback or forward-fix plan.
- Ask before destructive migrations, deleting user data, changing production infrastructure, or making external purchases.
