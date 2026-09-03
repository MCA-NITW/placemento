# Changelog

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
