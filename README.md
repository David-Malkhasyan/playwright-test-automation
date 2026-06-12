# Playwright Test Automation Framework

A layered **Playwright + TypeScript** test framework for UI and API testing, demonstrated against the public **[Swagger Petstore](https://petstore.swagger.io/)** API and the JetBrains website.

This is a portfolio sample: it shows how I structure a real test suite — a layered HTTP client, runtime contract validation, fixture-injected request contexts, builder factories, and data-driven, resilient tests — using only public endpoints.

## 🚀 Features

- **Multi-layered testing** — UI (Page Object Model) and API layers in one framework.
- **Layered API client** — `BaseApiClient` → `ConfiguredApiClient` → `PetStoreService`, composed of one controller per domain (`pet` / `store` / `user`).
- **Raw + Parsed methods** — every endpoint has a raw variant and a Zod-validated `…Parsed` variant, so a contract drift fails loudly instead of leaking an `undefined`.
- **Runtime contract validation** — request/response shapes defined as **Zod** schemas with inferred TypeScript types.
- **Fixture-injected contexts** — a fresh `APIRequestContext` per test, auto-disposed, for clean parallel isolation.
- **Data-driven tests** — `scenarios.forEach(...)` tables with `test.step()`, `expect.soft()` messages, and `toPass()` polling for eventual consistency.
- **Dependency-ordered setup** — a `setup` project runs first (health-check + best-effort seed); the `api` project depends on it.
- **Reporting** — HTML + JUnit reporters for CI integration.

## 🧱 Architecture

```
tests (data-driven scenarios, import { test, expect } from "@api-fixtures")
        │  fixture injects PetStoreService + a fresh APIRequestContext per test
        ▼
PetStoreService              (extends ConfiguredApiClient)
   .pet / .store / .user     (controllers — each method: raw + …Parsed)
        │  get/post/put/delete<T>
        ▼
BaseApiClient  ───────────►  Playwright APIRequestContext
        │  returns ApiResponse<T> = { response, data, status, ok }
        ▼
parseApiResponseData<T>(wrapper, ZodSchema)  ──►  validated DTOs (@dtos)

builders (@builders, faker)   ─►  request payloads with sane defaults
ApiConfig / ApiType + Config  ─►  baseURL / headers / timeout per environment
setup project                 ─►  health-check + best-effort seed (process.env / global-state)
```

## 📂 Project structure

- `api/base/` — `BaseApiClient`, `ConfiguredApiClient`, `ApiConfig`/`ApiType`, request logger, shared types.
- `api/services/` — `PetStoreService` + `controllers/` (pet, store, user) + route definitions.
- `api/dto/` — Zod schemas and inferred types (`pet` / `store` / `user`).
- `api/api-fixtures/` — custom Playwright fixtures injecting the service.
- `data/builders/` — faker-backed payload builders.
- `tests/setup/` — health-check + seed (runs first); `tests/api/` & `tests/ui/` — the suites.
- `utils/`, `config/`, `enum/`, `scenarios/` — helpers, config, enums, and scenario maps.
- `scripts/fetch-swagger.mjs` — refreshes the committed `pet-store.json` OpenAPI snapshot.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) 20+
- npm

## ⚙️ Installation

```bash
npm install
npx playwright install --with-deps
```

## 🧪 Running tests

```bash
npm test                 # full suite (setup project runs first)
npm run test:api         # API suite only
npm run test:ui          # UI suite only
npm run test:debug       # Playwright inspector

npx playwright test tests/api/petstore.test.ts --project=api   # a single file
npx playwright test -g "pst-001" --project=api                 # a single case

npm run report           # open the last HTML report
npm run lint             # eslint
npm run typecheck        # tsc --noEmit
npm run format           # prettier --write
npm run swagger:update   # refresh pet-store.json from the live spec
```

## 🔐 Configuration

`.env` holds public configuration only (no secrets). A git-ignored `.env.override` can override any value locally.

| Variable | Default | Purpose |
|---|---|---|
| `TIMEOUT_MS` | `30000` | global test timeout |
| `API_TIMEOUT_MS` | `60000` | per-request timeout |
| `WORKERS` | `4` | parallel workers |
| `RETRIES` | `2` | test retries (absorbs sandbox 5xx) |
| `HEADLESS` | `true` | run UI tests headless |
| `API_REQUEST_LOG` | `true` | log requests/responses |

## ⚠️ A note on the public sandbox

`petstore.swagger.io` is a **free, shared sandbox**: it does not durably persist data, recycles ids, holds third-party junk records, and intermittently returns `5xx`. The tests treat this as a design constraint rather than papering over it:

- **Create-then-read in the same test** — never rely on cross-test or cross-run persistence.
- **`toPass()` polling** on every read-back step to ride out eventual consistency.
- **Exact `toBe`** only for invariants: immediate HTTP status, fields echoed in the same response, structural facts, and Zod shape validation.
- **`expect.soft`** for values the sandbox is known to mangle (status echoes, post-delete `404`s, `findByStatus` purity over the shared dataset).
- **`retries: 2`** at the runner level to absorb transient `5xx`.

## 📊 Reporting

```bash
npm run report
```

Reports are written to `report/playwright-report` (HTML) and `report/playwright-report/results.xml` (JUnit).
