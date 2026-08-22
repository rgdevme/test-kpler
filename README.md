# Access Provisioning & Audit Portal

A minimal internal administration portal for assigning roles to users and recording who changed
access. The repository contains a NestJS API, a Vue 3 dashboard, and Playwright full-stack tests in
a pnpm/Turborepo workspace.

## Run with Docker

Requirements: Docker with Compose support.

```bash
docker-compose up
```

Open <http://localhost:8080>. Compose starts PostgreSQL, applies the TypeORM migration, seeds the
three roles and demo users, starts Nest, and serves the Vite build through Nginx. Stop the stack
with `docker-compose down`. Add `--volumes` if you also want to remove the local database volume.

The actor selector is intentionally a demonstration mechanism. The selected user ID is sent through
`X-Actor-User-Id` and validated by the server, but it is not authentication and must not be treated
as a production trust boundary.

## Local development

Requirements: Node 24, pnpm 11.5.2, and Docker.

```bash
pnpm install
pnpm dev
```

The dashboard runs at <http://localhost:5173>, the API at <http://localhost:3000/api>, and Swagger
at <http://localhost:3000/api/docs>. The server task starts PostgreSQL as its development sidecar.

Build and run local artifacts with:

```bash
pnpm build
pnpm start
```

`build` performs the full verification gate before writing production artifacts.

## Generated API types

Nest Swagger DTOs are the API contract source. Regenerate the committed OpenAPI document and
TypeScript declarations after changing a controller or DTO:

```bash
pnpm generate:types
```

The generated files live in `packages/server`; `packages/app` consumes them through the
`@server/generated/api` alias. Server builds run generation as a prerequisite, and typechecking
fails when committed artifacts are stale.

## Checks and tests

Install Chromium once before running the browser suite locally:

```bash
pnpm --filter @access/e2e exec playwright install chromium
```

Then run:

```bash
pnpm check
pnpm test
pnpm verify
```

- `check` runs formatting, linting, and strict typechecking concurrently.
- `test` runs Playwright against an isolated Docker Compose project with real PostgreSQL.
- `verify` runs checks and tests concurrently.

## Architecture and trade-offs

- `packages/server` owns Nest modules, TypeORM entities and migrations, seeding, Swagger, and the
  generated API contract.
- `packages/app` owns the Vue dashboard and Tailwind theme. TanStack Query manages server state,
  TanStack Table manages tabular state, and TanStack Form manages the two mutation forms.
- `packages/e2e` owns observable, full-stack stories and their input and seed data.

TypeORM was selected for its direct Nest integration and explicit decorator-based model. Role
updates and their audit entries share a serializable transaction. The audit record stores immutable
before and after role snapshots so history remains understandable independently of current
assignments.

The six-hour constraint favors one high-value E2E layer over separate unit and component suites.
Authentication, authorization enforcement, role CRUD, server pagination, and production
observability are intentionally out of scope. Lists are unpaginated and sorted in the client because
the prototype dataset is deliberately small.

Turborepo caches generated contracts, type metadata, build artifacts, test reports, and task logs.
Remote caching is optional and activates when `TURBO_TOKEN`, `TURBO_TEAM`, and
`TURBO_REMOTE_CACHE_SIGNATURE_KEY` are configured.
