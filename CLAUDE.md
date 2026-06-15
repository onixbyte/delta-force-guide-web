# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install          # Install dependencies (pnpm required)
pnpm dev              # Start Vite dev server
pnpm build            # TypeScript check + Vite production build
pnpm build:tar        # Build + tar.gz archive (used by CI)
pnpm preview          # Preview production build locally
pnpm lint             # ESLint
```

No test suite exists in this project.

## Architecture

This is a Chinese-language SPA for browsing and managing Delta Force guide ("《三角洲》指南"). The frontend talks to a Spring Boot backend via REST APIs.

**App shell** (`src/main.tsx`): React 19 + React Router 7 + Redux Toolkit + Ant Design 6 + Tailwind CSS 4. Wraps the router in Redux `Provider` → `PersistGate` (Redux Persist) → Ant Design `StyleProvider`/`ConfigProvider` (locale `zh_CN`).

**Routing** (`src/router/index.tsx`): Two layout groups:
- `HeroLayout` (nav header + footer) for `/`, `/firearms`, `/mod-codes`
- `EmptyLayout` (minimal) for `/login`
All page components are lazy-loaded via `createBrowserRouter` + `lazy()`.

**State** (`src/store/`): Redux Toolkit with two slices — `auth` (current user) and `firearms` (paginated firearm list). State is persisted to `localStorage` or `sessionStorage` based on the `VITE_REDUX_STORAGE` env var. Use typed hooks from `src/hooks/store.ts` (`useAppDispatch`, `useAppSelector`).

**API layer** (`src/api/`): Axios instance (`src/shared/web-client/`) with base URL from `VITE_API_BASE_URL`, 10s timeout, and credentials. API modules: `FirearmApi`, `ModificationApi`, `TagApi`, `AuthApi`.

**Pages**:
- `FirearmsPage` — paginated card grid with type filter, create/edit modals (admin-only), delete with popconfirm
- `ModCodesPage` — paginated list with tag multi-select and firearmId query param filter, create/edit modals with nested accessory/tuning form lists
- `LoginPage` — simple username/password form, dispatches `setCurrentUser` on success

**Shared form components**: `FirearmForm` and `ModificationForm` are reused by both create and edit modals. `ModificationForm` fetches all firearms for its weapon selector and supports a `lockFirearmId` prop that disables the selector (used when navigating from a specific firearm).

**Type system** (`src/types/`): `Firearm` with weapon stats, `Modification` with nested `Accessory[]` → `Tuning[]`, `Page<T>` for paginated API responses, `User` for auth.

**Vite config**: Alias `@` → `./src`. Plugins: React, Tailwind CSS 4, port checker. Build uses rolldown with manual chunk splitting for React, Redux, Ant Design, React Router, and rc-* packages.

**Styling**: Tailwind CSS 4 with CSS layers (`theme, base, antd, components, utilities`). Responsive grid for mod code cards (1→2→3→4 columns). Prettier: 100 print width, no semicolons, double quotes, trailing commas ES5.

## Environment variables

```
VITE_API_BASE_URL=/api        # Backend API base URL
VITE_REDUX_STORAGE=local      # "local" or "session" for Redux persistence
```

## Contributing conventions

- User-facing copy, documentation, and code comments in British English
- Commit messages use `chore:` prefix for dependency updates (per Dependabot config)
