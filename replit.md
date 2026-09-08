# Luna Belle

A dreamy, responsive women’s clothing storefront with real fashion photography, persistent shopping state, and secure Stripe Checkout.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/mimi-moon-store run dev` — run the Luna Belle storefront
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- Storefront: `artifacts/mimi-moon-store`
- Product catalog: `artifacts/mimi-moon-store/src/lib/catalog.ts`
- Store state: `artifacts/mimi-moon-store/src/hooks/useStore.tsx`
- Checkout API: `artifacts/api-server/src/routes/checkout.ts`
- API contract: `lib/api-spec/openapi.yaml`

## Architecture decisions

- Cart and wishlist remain browser-local for a fast guest checkout experience.
- Stripe Checkout collects payment and delivery details on Stripe’s hosted page; card details never pass through the storefront.
- Checkout pricing is validated against a server-owned catalog before Stripe sessions are created.

## Product

Customers can browse, search, filter, favorite, and purchase Luna Belle clothing across responsive desktop and mobile layouts. The cart persists locally and checkout redirects to Stripe for secure test-mode payment.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
