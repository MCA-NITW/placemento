# CLAUDE.md

> This file stacks on top of the workspace root at `C:\Code\GitHub\`:
>
> - Root [`CLAUDE.md`](../../CLAUDE.md) -- voice, rules, routing map, references, skills, slash commands, conventions.
> - Root [`MEMORY.md`](../../MEMORY.md) -- live facts across repos.
> - Root [`STATUS.md`](../../STATUS.md) -- live PR/CI/security dashboard.
> - [`.claude/resources/`](../../.claude/resources/README.md) -- deep reference for collaboration, workflow, git, OSS, debugging, voice.
>
> Read those first. The guidance below only adds **repo-specific context** -- it does not override anything in the root.

## Project

Placement management portal for MCA students at NIT Warangal (MCA-NITW org repo): student profiles, company tracking, placement stats, interview
experience sharing.

No hosted deployment; distributed as versioned GitHub Releases on `v*.*.*` tags.

## Stack

- **Language**: TypeScript 5.9 (both packages)
- **Framework**: React 19 + Vite 7 (client), Express 5 (server)
- **Database**: MongoDB via Mongoose 8
- **Package manager**: pnpm workspace (`client` + `server`)
- **Deploy target**: GitHub Releases (tag-triggered tarball/zip); CI via reusable workflows from `mca-nitw/.github`

## Run

```
pnpm install
pnpm dev                      # server (tsx watch, :5000) + client (vite, :3000) concurrently
pnpm build                    # client production build -> client/build
pnpm --filter server build    # tsc -> server/dist
```

## Test

```
pnpm test                     # server then client (both Vitest)
pnpm --filter server test     # needs MongoDB: mongodb-memory-server locally, mongo:7.0 service in CI
pnpm --filter client test     # jsdom + testing-library
```

## Entry points

- `server/src/index.ts` -- server bootstrap (DB connect, listen)
- `server/src/app.ts` -- Express app: middleware + route mounting
- `client/src/main.tsx` -- React root
- `client/src/App.tsx` -- router shell

## Key files

- `server/src/routes/` -- authRoutes, userRoutes, companyRoutes, experienceRoutes, statsRoutes
- `server/src/models/` -- Mongoose schemas (source of truth for data shapes)
- `client/vite.config.ts` -- dev proxy of all API paths to `localhost:5000`; `outDir: 'build'`
- `.github/workflows/ci.yml` -- build/test/format/security jobs

## Gotchas

- README.md is stale (npm, React 18, AG Grid, react-scripts era). Real stack is pnpm + Vite + React 19 + recharts. Trust package.json.
- Client tests are `continue-on-error` in CI (jsdom@28 + undici@8 module resolution bug). Green CI does not prove client tests pass.
- Vite builds to `client/build`, but `release.yml` verifies `client/dist` -- release validation fails until one side is aligned.
- Root `package.json` carries a large `pnpm.overrides` block of security pins. Do not strip it when editing scripts.
- Server env vars (names only): `DB_CONNECTION_STRING`, `JWT_SECRET`, `JWT_SALT_ROUNDS` (required at startup); `LOCAL_DB_CONNECTION_STRING` (local
  fallback), `EMAIL_ID`, `EMAIL_PASSWORD` (Nodemailer). CI sets test values inline in `ci.yml` (`.env.ci` at root is not read by any workflow); never
  commit real values.

## Routes / Pages

- `/` -- Home (landing + live stats)
- Auth, Students, Companies, Experience, Stats, Profile, Teams pages under `client/src/pages/`

## API routes

- `/auth` -- signup/login, email OTP verification
- `/users` -- student profiles (role-based access)
- `/companies` -- company profiles and postings
- `/experiences` -- interview experience posts
- `/stats` -- placement analytics

## Auth

- JWT (bcrypt-hashed passwords), email OTP verification via Nodemailer
- Token issued by: `/auth` routes on server; client decodes with `jwt-decode`
- Required env vars: `JWT_SECRET`, `JWT_SALT_ROUNDS`, `EMAIL_ID`, `EMAIL_PASSWORD`
