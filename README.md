# Freitty — Client Cabinet

Test assignment: Dashboard, Order List and Order Detail screens as a working app.

| Part     | Stack                                          | Port |
| -------- | ---------------------------------------------- | ---- |
| backend  | NestJS 11, TypeORM 0.3, PostgreSQL             | 4000 |
| frontend | React 19 + Vite 8 SPA, React Router 7, Zustand, CSS Modules | 3002 |

## Run locally

```bash
# 1. database (or use any Postgres and set DB_* / DATABASE_URL in backend/.env)
cd backend && docker compose up -d

# 2. backend
cp .env.example .env   # set JWT_SECRET (32+ chars)
npm install
npm run seed          # runs migrations + seeds demo data (npm run seed -- --fresh to reseed)
npm run start:dev     # http://localhost:4000/api

# 3. frontend
cd ../frontend
npm install
npm run dev           # http://localhost:3002 (proxies /api to API_PROXY_TARGET, default http://localhost:4000)
```


## Quality

All packages: `npm run lint` (ESLint, flat config), `npm run format` / `format:check` (Prettier).
Backend: `npm test` — Jest unit tests for the value objects and the order mapper.

## API

| Method | Path                       | Description                                                     |
| ------ | -------------------------- | --------------------------------------------------------------- |
| POST   | `/api/auth/login`          | `{ email, password }` → sets httpOnly `access_token` cookie (public) |
| POST   | `/api/auth/logout`         | clears the cookie (public)                                      |
| GET    | `/api/users/me`            | current user + balance                                          |
| GET    | `/api/hubs`                | hubs for the filter                                             |
| GET    | `/api/orders`              | list: `tab, hubId, status, period, search, page, limit`        |
| GET    | `/api/orders/counts`       | tab counters for the same filters                               |
| GET    | `/api/orders/:number`      | detail by public number (`FR001383`)                            |
| GET    | `/api/orders/:number/operations` | operations log of the order                               |
| GET    | `/api/orders/:number/supplies` | supplies + subtotal                                         |
| GET    | `/api/dashboard/kpis`      | KPI cards incl. "Need attention"                                |
| GET    | `/api/dashboard/recent-orders` | active orders block                                         |
| GET    | `/api/dashboard/activity?period=` | activity charts (`day, cw, month, quarter`)              |
| GET    | `/api/dashboard/attention` | "Need attention" counters (sidebar badge)                       |

## Auth

- The backend signs a JWT (`sub`, `role`) and puts it into an httpOnly, `SameSite=Lax` cookie
  `access_token` (`Secure` when `COOKIE_SECURE=true`). TTL: `ACCESS_TOKEN_TTL_SECONDS`.
- A global `JwtAuthGuard` protects every route; `@Public()` opts out, `@SessionUser()` gives the token identity.
  Single-tenant: every signed-in user sees all orders (the customer is a plain `orders.customer` field).
- Passwords are stored as bcrypt hashes. In **development any password is accepted** for an existing email; the hash is checked only in production.
- The SPA calls the API on its own origin (`/api`): the Vite dev server proxies it, in production the host
  should rewrite `/api/*` to the backend so the cookie stays first-party. With `VITE_API_URL` pointing to another
  origin the cookie needs `SameSite=None; Secure` and the backend `CORS_ORIGIN` must list the web origin.
- Any 401 from the API (except login/logout) resets the main store and redirects to `/login?next=<current page>`.

Demo users (password `freitty-demo`, see `SEED_USER_PASSWORD`): `user1@rway.test` (admin), `user2..4@rway.test` (dispatchers).

## Environments (development / production)

In development `makeRequest` waits 1 s before every request (test latency); production has no delay.

| Side     | Variable                   | Effect                                                                              |
| -------- | -------------------------- | ----------------------------------------------------------------------------------- |
| backend  | `NODE_ENV`                 | `development` (default): SQL + debug logs; `production`: secure cookie by default, fewer logs. `npm run start:prod` sets it. Anything else fails at startup. |
| frontend | `VITE_APP_ENV`             | optional override, otherwise follows the Vite mode (`vite` → development, `vite build` → production) |

## Structure

```
backend/seeds               demo data: users, hubs, orders.active, orders.history, index (runner)
backend/src
  infrastructure/database   data source config, migrations
  modules/
    auth       login/logout, JwtAuthGuard (global)
    users  hubs
    orders     order + sub-order / operation / supply entities, value objects (OrderNumber, PalletQuantity)
    dashboard  aggregations over orders
frontend/src
  main.tsx, router.tsx   entry point, routes (module pages are lazy-loaded chunks), 401 → login
  modules/               one folder per feature: index.tsx (public API), page/ (index.tsx + index.module.css), store.ts, types.ts,
                         components/, helpers (constant.ts, utils.ts, search-params.ts, …)
    main          app shell (sidebar, navbar), global store (user, attention), not-found
    auth          login page
    order         order entity: core types (OrderSummary, Hub…), labels/tones, OrderCard, OrderBadges, RefNumbers
    user          user types (UserShort, SessionUser) and UserChip
    dashboard     KPIs, active orders, activity charts
    order-list    tabs, filters, cards / table / pipeline (infinite scroll per column); filter/list types
    order-detail  order, operations and supplies loaded independently; detail/operation/supply types
  services/      api (typed fetchers), format (dates/money), resource (store loader: abort + idle reset)
  config/        environment (dev/prod), API base URL, locale / time zone / currency
  ui/            shared components, types.ts, utils.ts
```

Modules import each other only through `index.tsx` (e.g. `@/modules/main` for `useMainStore`). Every API type lives
in the module it belongs to; types-only imports from another module use `import type`, so they never pull in its chunk.
