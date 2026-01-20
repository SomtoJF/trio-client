# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server
npm run dev

# Build production
npm build

# Run production server
npm start

# Lint
npm run lint
```

Backend defaults to `http://localhost:8080` via `NEXT_PUBLIC_BACKEND_URL` env var.

## Architecture

### Route Groups & Auth Flow

App uses Next.js 15 App Router with route groups:
- `(public)` - Public pages (e.g., /about)
- `(auth)` - Auth pages (/login, /signup)
- `(protected)` - Protected routes with auth check via layout that fetches current user, redirects to /login on error
- `(chat)` - Nested under (protected) for chat interfaces

### Two Chat Systems

**Basic Chat** (`basic-chat.ts`):
- Multi-agent chat where user creates custom agents with traits
- Messages sent via `sendBasicMessage` with SSE streaming
- Each agent responds independently, tracked via status updates
- Messages stored per chat with agent responses

**Reflection Chat** (`reflection-chat.ts`):
- AI self-improvement chat using reflection/evaluation loop
- Messages trigger reflection sequences
- Includes evaluator feedback (`isOptimal` flags)
- SSE streaming for status + reflection updates

### State Management

- **Auth**: Zustand store (`useAuthStore`) holds current user
- **Queries**: TanStack Query with factory pattern (`query-key-factory/`)
  - User keys: `queryKeys.user.currentUser()`
  - Chat keys: organized in `chat.keys.ts`

### API Layer

All API calls in `src/services/`:
- `routes.ts` - Centralized route definitions with `BaseRoute` + typed route config
- Auth services use `credentials: 'include'` for cookie-based sessions
- SSE streaming pattern: both chat services use `ReadableStream` reader with line buffering for `data:` events

### Component Organization

- `components/ui/` - Radix UI + shadcn/ui primitives, Aceternity UI effects
- `components/custom/` - App-specific components (LoadingScreen, ReflectionSequence, ProtectedSidebar, etc.)
- Heavy use of Framer Motion, next-themes for dark mode

### Path Aliases

`@/*` maps to `src/*` (tsconfig)

## Key Patterns

- Protected routes auto-fetch current user in layout, refetch every 60s
- Services throw errors on non-2xx responses for TanStack Query error handling
- SSE endpoints parse `data:` prefixed lines, handle `<nil>`/`done` termination signals
- Type definitions centralized in `src/types/types.ts`
