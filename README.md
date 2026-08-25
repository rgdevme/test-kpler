# Access Provisioning & Audit Portal

A minimal internal administration portal for assigning roles to users and recording who changed
access. The repository contains a NestJS API, a Vue 3 dashboard, and Playwright full-stack tests in
a pnpm/Turborepo workspace.

## Requirements

- [Docker Desktop](https://docs.docker.com/compose/install/)
- [Node](https://nodejs.org/en/download)
- [pnpm](http://pnpm.io/installation)

## Architecture

- `packages/server` owns Nest modules, TypeORM entities and migrations, seeding, Swagger, and the
  generated API contract.
- `packages/app` owns the Vue dashboard and Tailwind theme. TanStack Query manages server state,
  TanStack Table manages tabular state, and TanStack Form manages the two mutation forms.
- `packages/e2e` owns observable, full-stack stories and their input and seed data.

### Technologies

Frontend:

- Vue: UI framework.
- TanStack: production-ready, framework-agnostic tools, including:
  - TanStack Query: asynchronous state management.
  - TanStack Table: reactive tables and data grids.
  - TanStack Form: headless form management.
- Tailwind CSS: structured styling system.

Backend:

- NestJS: backend framework.
- TypeORM: PostgreSQL ORM.
- `@nestjs/swagger`: API documentation and contract generation.

Tests:

- Playwright: reliable web automation for testing.

## Setup

```bash
pnpm install
```

## Running the project

### Run with Docker

```bash
docker-compose up
```

Access services in:

- Dashboard: <http://localhost:8080>
- API: <http://localhost:3000/api>
- Swagger: <http://localhost:3000/api/docs>

> `/api` requests to port `8080` are proxied to the server on port `3000`

Compose starts PostgreSQL, applies the TypeORM migration, seeds three roles and demo users, starts
NestJS, and serves the Vite build through Nginx.

Stop the stack with `docker-compose down`.
Add `--volumes` if you also want to remove the local database volume.

### Building and running artifacts

```bash
pnpm start
```

Access services in:

- Dashboard: <http://localhost:4173>
- API: <http://localhost:3000/api>
- Swagger: <http://localhost:3000/api/docs>

> `/api` requests to port `4173` are proxied to the server on port `3000`

The Turborepo configuration follows these dependency graphs:

**App start:**

```
check:format ───────┐
check:lint ─────────┼─> check ──────────┬─> build ────────> start
check:typecheck ────┘   server run:typegen ─┘
```

**Server start:**

```
check:format ────┐   run:typegen ─┐
check:lint ──────┼─> check ───────┴─> build ───┐
check:typecheck ─┘                     run:db ─┴─> start
```

Checks gate builds, and builds gate the commands that run their artifacts.
Resulting artifacts from checking and building are cached to ensure fast subsequent runs.

### Local development

```bash
pnpm dev
```

Access services in:

- Dashboard: <http://localhost:5173>
- API: <http://localhost:3000/api>
- Swagger: <http://localhost:3000/api/docs>

> `/api` requests to port `5173` are proxied to the server on port `3000`

The server task starts PostgreSQL as its development sidecar.

## Checks and tests

Install Chromium once before running the browser suite locally:

```bash
pnpm --filter @access/e2e exec playwright install chromium
```

Then run:

```bash
pnpm check # formatting, linting, and strict typechecking concurrently
pnpm test # tests against an isolated project with a real PostgreSQL database
```

Or:

```bash
pnpm verify # runs checks and tests
```

## Technical decisions

### DTOs and contracts

To generate the contracts, I used `@nestjs/swagger` to author the DTOs and generate the OpenAPI
documents, and `openapi-typescript` to generate the type declarations consumed by the frontend.

I chose TypeORM and `@nestjs/typeorm` because their decorator syntax aligns with NestJS. I consider
legibility a key aspect of maintainability.

Although this is a robust solution, for a client-facing product, I'd spend more time researching a
stronger ecosystem.

### Authentication

Due to time constraints, authentication was not implemented. Instead, I added an "actor selector"
to represent the authenticated user and allow reviewers to interact with the audit logs as different
users.

The selected user ID is sent through `X-Actor-User-Id` and validated by the server.

### E2E tests over unit tests

Because the evaluated flows were explicit and narrow, I chose end-to-end tests instead of unit tests
for each critical component.

This allowed me to focus on delivering a polished, well-organized repository with a well-thought-out
architecture.

### No pagination

Lists are unpaginated and sorted in the client because the task states a minimal prototype.

For a real-world application, I'd include pagination and appropriate indexes.
