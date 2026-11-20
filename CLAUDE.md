# Frontend Template

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript ~5.5
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- Bun package manager
- ESLint 8 + Prettier

## Commands

- `bun run dev` - Start dev server with Turbopack
- `bun run build` - Production build
- `bun run lint` - Run ESLint
- `bun run lint:fix` - Run ESLint with auto-fix
- `bun run format:check` - Check Prettier formatting
- `bun run typecheck` - Run TypeScript type checking

## Code Conventions

### Naming

- Types: `T` prefix (`TUser`, `TProps`)
- Interfaces: `I` prefix (`IService`)
- Components: PascalCase
- Functions/variables: camelCase

### Imports

- Use `type` imports for type-only imports (`import type {TFoo} from ...`)
- Separate type imports on their own line
- Imports ordered: builtin > external > internal > relative > type
- Use `@/` path alias for `src/` imports

### Types

- Prefer `type` over `interface` (`consistent-type-definitions`)
- Explicit return types on functions
- No `any` (warning)

### Formatting

- Tabs, width 4
- Single quotes
- No trailing commas
- No bracket spacing
- Print width 120

## Architecture

- Server Components by default
- Source code in `src/app/`
- `@/` maps to `./src/`
- Tailwind v4: use `@theme inline` in globals.css, no tailwind.config
