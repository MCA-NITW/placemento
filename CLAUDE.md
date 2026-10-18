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

Distributed as versioned GitHub Releases on `v*.*.*` tags. The repo homepage (placemento.onrender.com) serves an older server-rendered build, not this
codebase (no `/health`, EJS-style OTP page) as of 2026-10-18.

## Stack

- **Language**: TypeScript 7 (both packages)
- **Framework**: React 19 + Vite 8 (client), Express 5 (server)
- **Database**: MongoDB via Mongoose 9
- **Package manager**: pnpm workspace (`client` + `server`)
- **Deploy target**: GitHub Releases (tag-triggered tarball/zip); CI via reusable workflows from `mca-nitw/.github`

## Run

```
pnpm install
pnpm dev                      # server (tsx watch, :5000) + client (vite, :3000) concurrently
pnpm build                    # client production build -> client/build
pnpm --filter server build    # tsc -> server/dist
pnpm demo                     # API on in-memory Mongo + seeded demo data, plus client; logins in server/src/seed/demoData.ts
docker compose up -d          # local Mongo single-node replica set (rs0) on :27017 (MONGO_PORT to change)
pnpm seed [--reset]           # load demo data into DB_CONNECTION_STRING; refuses if users exist unless --reset
```

## Test

```
pnpm test                     # server then client (both Vitest)
pnpm --filter server test     # mongodb-memory-server replica set (7.0.0 binary) locally and in CI
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
- `client/vite.config.ts` -- dev port 3000, `outDir: 'build'`; no proxy (client calls `VITE_API_BASE_URL` directly)
- `.github/workflows/ci.yml` -- build/test/format/security jobs

## Gotchas

- README screenshots in `docs/screenshots/` come from `pnpm demo` (fake data). Recapture them when the demo dataset or the UI changes.
- Auth endpoints must not reveal whether an email is registered: login answers `401 Invalid email or password` for both unknown email and wrong
  password; keep new auth responses uniform too. Wrap user-supplied values in `sanitizeForLog()` when logging.
- `globalLimiter` (app.ts) runs before every route; set `TRUST_PROXY` behind a proxy or all clients share one bucket.
- Do not re-add a Vite dev proxy for API paths: `/stats` and `/companies` are also client routes, and proxying them breaks refresh.
- Client is not typechecked by `vite build`; run `pnpm --filter client exec tsc --noEmit -p .` after type changes.
- `pnpm-workspace.yaml` carries the `overrides` block of security pins and the `allowBuilds` list. Do not strip it.
- pnpm enforces a minimum release age: a Renovate PR merged the same day a dependency was published fails `pnpm install --frozen-lockfile` with
  `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`; re-run CI a day later.
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
