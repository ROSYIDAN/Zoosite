Front-End System Law
You are generating React code for a Next.js (App Router) project.
Before writing any code, you MUST follow every rule in this context.

━━━ 1. COMPONENT STRUCTURE ━━━
- One component = one responsibility (Single Responsibility Principle)
- If a component does more than one thing, split it
- Max ~150 lines per component file; extract if longer
- Co-locate: keep component, its types, and its sub-components close

━━━ 2. DRY (Don't Repeat Yourself) ━━━
- Repeated JSX (2+ times) → extract into a component
- Repeated logic (2+ times) → extract into a custom hook in /hooks
- Repeated styles → use cn() utility or shared class tokens
- Repeated API calls → extract into a service in /services

━━━ 3. FOLDER STRUCTURE ━━━
/app              → Next.js pages (App Router)
/components
  /ui             → Dumb reusable primitives (Button, Input, Badge)
  /features       → Smart domain components (UserCard, OrderTable)
  /layouts        → Page wrappers (DashboardLayout, AuthLayout)
/hooks            → Custom hooks (useFetch, useDebounce, useForm)
/lib              → Pure utils & helpers (cn, formatDate, slugify)
/services         → API calls & external integrations
/types            → Shared TypeScript interfaces & types
/constants        → App-wide constant values

━━━ 4. SERVER vs CLIENT COMPONENTS ━━━
- Default to Server Components (no directive needed)
- Only add "use client" when you need:
  • useState, useEffect, useReducer
  • Browser APIs (window, localStorage, document)
  • Event listeners (onClick, onChange, etc.)
  • Third-party client-only libraries
- Push "use client" as far DOWN the tree as possible
- Never fetch data in useEffect if a Server Component can do it

━━━ 5. TYPESCRIPT ━━━
- Always define explicit prop interfaces (no implicit any)
- Name interfaces: ButtonProps, UserCardProps, etc.
- Use union types for variants: variant?: "primary" | "ghost" | "danger"
- Export shared types from /types directory

━━━ 6. CLASSNAME MERGING ━━━
- Always use cn() from lib/utils for className merging
- Never use string concatenation for class names
- cn() combines clsx + tailwind-merge

// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

━━━ 7. DATA FETCHING ━━━
- Fetch in Server Components by default
- Use fetch() with Next.js cache options (next: { revalidate: N })
- For client-side async state: use TanStack Query (react-query)
- Never fetch data directly in useEffect (use libraries or Server Components)
- Handle loading, error, and empty states explicitly

━━━ 8. FORMS ━━━
- Always use React Hook Form + Zod resolver
- Define schema with z.object() before the component
- Never manage form state with useState manually
- Show field-level errors from formState.errors

━━━ 9. STATE MANAGEMENT ━━━
Local UI state      → useState
Derived/computed    → useMemo
Side effects        → useEffect (sparingly)
Cross-component     → Zustand or React Context
Server/async state  → TanStack Query
URL/filter state    → useSearchParams

━━━ 10. NEXT.JS CONVENTIONS ━━━
- Use loading.tsx  → automatic Suspense boundary
- Use error.tsx    → automatic error boundary
- Use not-found.tsx → call notFound() in Server Components
- Use layout.tsx   → shared UI per route segment
- Prefer generateMetadata() for per-page SEO

━━━ 11. NAMING CONVENTIONS ━━━
Components       → PascalCase       (UserCard, AuthButton)
Hooks            → useCamelCase     (useDebounce, useAuth)
Utils/helpers    → camelCase        (formatDate, slugify)
Types/Interfaces → PascalCase       (UserProfile, ApiResponse)
Constants        → UPPER_SNAKE_CASE (MAX_RETRIES, API_BASE_URL)
Files (components) → kebab-case.tsx (user-card.tsx, auth-button.tsx)
Files (hooks)    → use-camel.ts     (use-debounce.ts)

━━━ 12. GENERAL LAWS ━━━
- No magic numbers — define named constants
- No commented-out code in final output
- Props should flow down, events should flow up
- Avoid prop drilling deeper than 2 levels → use Context or Zustand
- Always handle null/undefined states (optional chaining, fallbacks)
- Prefer composition over inheritance
- Keep business logic OUT of components → put it in hooks or services
