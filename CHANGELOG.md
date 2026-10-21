# Changelog

## [3.1.1] - 2026-10-21

### Docs

- README architecture diagram is now a picture drawn with orrery from `docs/diagrams/architecture.yaml`, in dark and light versions, replacing the
  Mermaid flowchart. It also corrects the old flowchart, which sent the `/auth` routes through the JWT check; signup, login and the OTP endpoints are
  public. The per-route rate limits and the 10 kb JSON cap moved into the text under the picture.

## [3.1.0] - 2026-10-18

### Added

- `pnpm demo`: runs the API on an in-memory MongoDB replica set seeded with a fake batch (60 students, 20 companies, 6 interview experiences) plus the
  Vite client. Demo logins for each role, password `Demo@1234`. No Atlas, Docker, Gmail or `.env` needed.
- `pnpm seed`: loads the same deterministic demo dataset into `DB_CONNECTION_STRING`. Refuses to touch a database that already has users unless
  `--reset` is passed.
- `docker-compose.yml`: local MongoDB as a single-node replica set (needed for the placement transaction), initiated by its healthcheck.
- README screenshots (desktop and 390 px phone) captured from `pnpm demo`, a data-model diagram, and setup docs for the demo, Docker and seed paths.
- `TRUST_PROXY` env var so rate limits key on the client IP behind a reverse proxy.
- Server tests for the demo data (logins work, placements match company selections and cutoffs) and for account-enumeration resistance: 35 to 44.

### Security

- App-wide rate limiter (300 requests per 5 minutes per IP) mounted before routing and `authenticateUser`, so the per-request user lookup and the read
  and stats routes are throttled too.
- Login returns one `401 Invalid email or password` for an unknown email and a wrong password, with the same bcrypt cost on both paths. "Account not
  verified" is only shown after the password matches.
- `/auth/verify-email` answers the same for registered and unknown emails; `/auth/verify-otp` and `/auth/reset-password` no longer return
  `404 User not found` before the OTP is checked.
- CR and LF are stripped from user-supplied values (emails, names, company names) before they are logged, which blocks forged log lines.

## [3.0.3] - 2026-10-18

### Fixed

- Forgot-password flow: `/auth/verify-otp` no longer deletes the OTP, so the follow-up `/auth/reset-password` call succeeds instead of always
  returning "No OTP generated".
- `PUT /users/company/:id` returns 404 for a well-formed but unknown company id instead of marking the student placed with "Not Placed" data.
- Client dev server: removed the unused API proxy, which hijacked the `/stats` and `/companies` routes on refresh or direct visit.
- Navbar no longer overflows on phones when signed in (8 icons); the icon row scrolls sideways inside the bar.
- Client now typechecks (`tsc --noEmit`): added `vite-env.d.ts` and loosened the `CompanyForm` action type.
- Replaced the deprecated Mongoose `new: true` option with `returnDocument: 'after'`.
- `release.yml` verifies and packages `client/build` (Vite's configured `outDir`) instead of the non-existent `client/dist`.

### Security

- Students can only update their own placement location (`PUT /users/companyLocation/:id`).
- Only the experience owner or staff can delete comments on an experience.
- `release.yml` passes `release_notes` through an environment variable instead of interpolating it into the shell script.
- Dependency refresh to latest stable; `pnpm audit` goes from 11 advisories (2 critical, 3 high) to 0, including nodemailer 10.1.2, express 5.3.0,
  mongoose 9.11.2 and patched transitive proxy-addr, shell-quote, ip-address, moment and source-map-js.

### CI

- Client tests are a required step again (the jsdom/undici `continue-on-error` workaround is no longer needed).

### Docs

- README rewritten to match the code: pnpm, React 19, Vite, Recharts, real env var names and scripts, architecture diagram, tech decisions and test
  coverage.

## [3.0.2] - 2026-09-03

### Security

- Bump transitive qs to 6.16.0 (alerts #172, #173: array-limit bypass, isBuffer DoS).

## [3.0.1] - 2026-09-03

- Security: bump transitive dependencies via pnpm overrides to resolve all 10 open Dependabot alerts
  - nanoid 3.3.16 -> 3.3.18 (GHSA alert #171, high)
  - postcss 8.5.22 -> 8.5.26 (alert #170, medium)
  - ip-address 10.2.0 -> 10.7.0 (alerts #161, #162, #168)
  - undici 7.28.0 -> 7.29.0 (alerts #163-#167), kept on 7.x for jsdom compatibility

## [3.0.0] - 2026-02-28

- Full-stack rewrite: pnpm monorepo with React 19 + TypeScript frontend, Express backend
- CI/CD infrastructure with GitHub Actions
- Configure Renovate for dependency management

## [2.0.0] - 2025-08-02

- Revamp Home Page with live stats, interactive elements, and enhanced UI
- Add comprehensive GitHub Actions workflows and security audits
- Refactor CSS to utility classes for maintainability
- Add reusable components: buttons, form fields, loading indicators, data tables
- Implement ExperienceForm component
- Add PropTypes validation across all components
- Add animation utilities and styles

## [1.0.0] - 2024-01-08

- Initial placement management system for MCA NIT Warangal
- Authentication with JWT (token expiration, login/signup forms)
- Company and student CRUD with controllers and routes
- Profile management with role-based navbar
- Express backend with logging and default model values
