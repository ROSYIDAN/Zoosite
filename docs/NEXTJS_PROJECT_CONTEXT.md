# NEXTJS_PROJECT_CONTEXT.md

> Purpose: This file gives AI coding agents project rules for generating safer, simpler, and more production-friendly Next.js code.
> The goal is to avoid common Next.js problems early: heavy production builds, unnecessary SSR, security upgrade pain, image optimization issues, caching mistakes, and complicated deployments.

---

## 1. Core Principle

Do not use Next.js features just because they exist.

Prefer the simplest rendering and deployment model that satisfies the page requirements.

Use this decision rule:

```txt
Public SEO page / marketing / blog:
  Prefer Server Components, SSG, ISR, or SSR when needed.

Admin dashboard / internal CRUD / highly interactive page:
  Prefer CSR-heavy UI with Client Components.
  Use Server Components only for layout, auth checks, and initial data when useful.

Fully client-side app with separate backend API:
  Consider static export if no Next.js server features are required.

E-commerce / content-heavy / SEO-sensitive app:
  Next.js is useful, but caching, security, deployment, and image strategy must be handled carefully.
```

---

## 2. Rendering Rules

### 2.1 Default to Server Components, but do not overuse SSR

In the Next.js App Router, components are Server Components by default.

Use Server Components for:

```txt
- Layouts
- Page shells
- Auth/session checks
- Initial data fetching
- Database/API calls that need secrets
- SEO-sensitive pages
- Static or semi-static content
```

Use Client Components for:

```txt
- Forms
- Modals
- Tables with sorting/filtering/pagination
- Charts
- Tabs
- Search inputs
- Drag and drop
- Browser APIs
- useState/useEffect/useRef
- Client-side libraries
```

### 2.2 Admin dashboard rule

For admin dashboards, do not make everything SSR by default.

Preferred pattern:

```tsx
// app/admin/page.tsx
// Server Component
import AdminTable from "./AdminTable";

export default async function AdminPage() {
  const initialData = await getInitialAdminData();

  return (
    <main>
      <h1>Admin Dashboard</h1>
      <AdminTable initialData={initialData} />
    </main>
  );
}
```

```tsx
// app/admin/AdminTable.tsx
"use client";

export default function AdminTable({ initialData }) {
  // sorting, filters, pagination, modals, optimistic updates
}
```

Avoid:

```txt
- SSR for every small dashboard interaction
- Server Actions for simple local UI state
- Putting every component behind "use client"
- Fetching sensitive data directly from the browser if it requires server secrets
```

---

## 3. Static Export Rule

If the project is mostly a client-side app and uses a separate backend API, consider:

```js
// next.config.js
module.exports = {
  output: "export",
};
```

Use static export only when the app does not need runtime Next.js server features.

Good fit:

```txt
- Admin dashboard that fetches from external API
- Static landing page
- Frontend-only React app
- Documentation site
- App deployed to CDN/static hosting
```

Bad fit:

```txt
- SSR per request
- API routes / Route Handlers as backend
- Middleware-based auth
- Server Actions
- Dynamic Next.js image optimization
- Runtime secrets inside Next.js server
- Features requiring a Node.js server
```

If using static export, remember:

```txt
- The result is static HTML/CSS/JS in the out directory.
- Browser will fetch runtime data from APIs.
- Do not rely on Next.js server runtime.
```

---

## 4. Build and Deployment Rules

### 4.1 Never build directly on a small production VPS

Avoid this deployment flow on small VPS machines:

```txt
VPS production:
  git pull
  npm install
  next build
  restart app
```

This can overload CPU/RAM, slow the app, or crash production.

Preferred flow:

```txt
GitHub/GitLab
  -> CI/CD runner builds the app
  -> artifact/Docker image is produced
  -> production VPS only pulls and runs the built output
```

Production server should focus on running the app, not building it.

### 4.2 Separate build server and runtime server

Use one of these:

```txt
- GitHub Actions
- GitLab CI
- Jenkins
- Self-hosted runner
- Mini PC runner
- Docker build machine
```

The runner does not need public IP. It only needs internet access and a way to deploy to production.

### 4.3 Lock build commands

Use predictable package manager commands:

```bash
pnpm install --frozen-lockfile
pnpm build
```

or:

```bash
npm ci
npm run build
```

Avoid:

```bash
npm install
npm update
npm install next@latest
```

during production deployment.

---

## 5. Standalone Build Rule

Use standalone output when deploying a minimal Node.js runtime package:

```js
// next.config.js
module.exports = {
  output: "standalone",
};
```

Important:

```txt
- Standalone output can make deployment smaller.
- Build can be heavier because dependency/file tracing is required.
- Do the standalone build in CI/CD, not on a small production VPS.
- Make sure required runtime files are copied correctly.
```

When using Docker, prefer multi-stage builds:

```txt
builder stage:
  install dependencies
  run next build

runner stage:
  copy .next/standalone
  copy .next/static
  copy public
  run server.js
```

Do not assume standalone output includes everything automatically if custom servers, unusual file access, or runtime assets are used.

---

## 6. Image Optimization Rule

If using `next/image` on self-hosted production, install `sharp`:

```bash
pnpm add sharp
```

or:

```bash
npm install sharp
```

Especially required/recommended for:

```txt
- next start in production
- output: "standalone"
- Docker deployment
- VPS self-hosting
```

Watch out for:

```txt
- Alpine Linux sharp binary issues
- Missing native dependencies
- High memory usage on small VPS
- Dynamic image optimization increasing server load
```

For small VPS or static export, consider alternatives:

```txt
- Use normal <img> for simple images
- Use external image CDN
- Pre-optimize images during build
- Use unoptimized images when acceptable
```

Example:

```tsx
<Image
  src="/hero.webp"
  alt="Hero image"
  width={1200}
  height={600}
  priority
/>
```

Do not use `next/image` everywhere blindly.

---

## 7. Caching Rules

Caching in Next.js can improve speed, but wrong caching can cause stale or incorrect data.

Always classify data:

```txt
Static:
  marketing copy, docs, public content that rarely changes

Semi-static:
  product catalog, blog posts, public CMS content

Dynamic:
  user profile, admin data, auth state, dashboard metrics, orders

Sensitive:
  private user data, tokens, permissions, billing, admin-only information
```

Rules:

```txt
- Do not cache sensitive user-specific data globally.
- Be explicit with fetch cache behavior.
- For admin dashboards, prefer fresh data unless caching is intentionally designed.
- For public pages, use caching/revalidation where useful.
- Never cache permission/auth results incorrectly.
```

Examples:

```ts
// Fresh data
await fetch(url, { cache: "no-store" });
```

```ts
// Revalidate public/semi-static data
await fetch(url, { next: { revalidate: 3600 } });
```

For mutations:

```txt
- Invalidate or refetch affected data.
- Do not assume UI updates automatically.
- Use optimistic UI only when rollback behavior is clear.
```

---

## 8. Security and Upgrade Rules

Next.js can receive critical security updates. Treat framework upgrades seriously.

Rules:

```txt
- Do not blindly install next@latest in production.
- Track Next.js security releases.
- Keep Next.js, React, and react-server-dom packages patched.
- Upgrade in a separate branch.
- Test build, auth, middleware, image optimization, caching, and deployment before production.
- Avoid staying on unsupported major versions.
```

Upgrade process:

```txt
1. Read official Next.js release notes/security advisory.
2. Create upgrade branch.
3. Update Next.js, React, React DOM, and related packages together if required.
4. Run typecheck.
5. Run lint.
6. Run test suite.
7. Run production build.
8. Test locally in production mode.
9. Deploy to staging.
10. Test auth, middleware, protected routes, forms, images, and APIs.
11. Deploy production.
```

Commands:

```bash
pnpm outdated
pnpm audit
pnpm build
pnpm lint
pnpm typecheck
```

Do not solve major upgrade problems by random downgrade/canary unless there is a clear reason.

If a temporary patch is required:

```txt
- Document the reason.
- Link to issue/CVE.
- Add TODO to remove patch later.
- Prefer official patch release when available.
```

---

## 9. Middleware Rules

Use middleware only when needed.

Good uses:

```txt
- Lightweight auth redirect
- Locale redirect
- Simple request rewrites
- Header changes
```

Avoid middleware for:

```txt
- Heavy database queries
- Complex business logic
- Large dependencies
- Full authorization decisions
- Expensive API calls
```

Security rule:

```txt
Middleware is not the only security layer.
Always validate authorization again in the server/API/database layer.
```

---

## 10. API and Backend Rules

If the backend is separate:

```txt
- Keep Next.js mostly as frontend.
- Use CSR for dashboard interactions.
- Store tokens securely.
- Avoid exposing private API keys to the browser.
```

If using Next.js Route Handlers as backend:

```txt
- Validate input.
- Check auth on every protected route.
- Avoid long-running work in request handlers.
- Keep secrets server-only.
- Add rate limiting for public endpoints.
```

Do not put server secrets in:

```txt
NEXT_PUBLIC_*
client components
browser fetch code
localStorage
```

Only `NEXT_PUBLIC_*` variables are safe to expose to browser code.

---

## 11. Package and Dependency Rules

Use strict dependency management:

```txt
- Commit lockfile.
- Use npm ci or pnpm install --frozen-lockfile in CI.
- Avoid unnecessary UI/framework libraries.
- Avoid adding packages for small utilities.
- Check package maintenance before adding.
```

Before adding a dependency, ask:

```txt
- Is this needed?
- Can native browser/React/Next.js handle it?
- Is it maintained?
- Is it compatible with SSR/RSC?
- Does it increase client bundle size?
```

---

## 12. Client Bundle Rules

Avoid making the whole app a Client Component.

Bad:

```tsx
// app/layout.tsx
"use client";
```

Better:

```txt
- Keep layout as Server Component.
- Move only interactive widgets into Client Components.
- Import heavy libraries only inside the components that need them.
- Dynamically import charts/editors/maps if they are heavy.
```

Example:

```tsx
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("./Chart"), {
  ssr: false,
});
```

Use this for browser-only libraries such as charts, maps, rich text editors, or drag-and-drop tools.

---

## 13. Auth Rules

For protected dashboards:

```txt
- Check auth before showing admin pages.
- Do not rely only on client-side redirects.
- Re-check permissions in server/API layer.
- Avoid caching private auth-dependent pages incorrectly.
```

Recommended pattern:

```txt
Server:
  verify session
  check role/permission
  fetch initial allowed data

Client:
  handle UI interaction
  call protected API
  show loading/error states
```

---

## 14. Error Handling Rules

Every data fetch should handle:

```txt
- loading state
- empty state
- error state
- unauthorized state
- retry when useful
```

Admin dashboard pages should not fail with blank screens.

For forms:

```txt
- validate client-side for UX
- validate server-side for security
- show field-level errors
- prevent duplicate submit
- handle network failure
```

---

## 15. When to Avoid Next.js Features

Avoid SSR when:

```txt
- Page is private dashboard
- SEO is irrelevant
- Data is highly interactive
- Initial page does not need server-rendered data
```

Avoid Server Actions when:

```txt
- A simple REST/JSON API is clearer
- The backend is separate
- The action needs to be reused by mobile app or other clients
```

Avoid `next/image` when:

```txt
- Images are already optimized
- Static export is used
- VPS is too small for dynamic optimization
- External CDN already handles optimization
```

Avoid middleware when:

```txt
- Logic requires database access
- Logic is complex
- Logic belongs in backend/API authorization
```

Avoid custom server when:

```txt
- Next.js built-in routing is enough
- You want to keep automatic optimizations
```

---

## 16. Recommended Project Defaults

For a small-to-medium dashboard project:

```txt
Rendering:
  Server Components for layout/auth shell
  Client Components for dashboard widgets

Deployment:
  CI/CD builds the app
  VPS only runs the built artifact

Build:
  Use lockfile
  Use standalone only if needed
  Do not build on production VPS

Images:
  Install sharp if using next/image on self-hosting
  Consider external CDN/pre-optimized images

Caching:
  no-store for private/admin data
  revalidate for public/semi-static data

Security:
  Track Next.js advisories
  Upgrade in branch/staging
  Test middleware/auth after upgrades
```

---

## 17. AI Agent Checklist Before Generating Code

Before generating a page/component, the AI agent must decide:

```txt
1. Is this page public or private?
2. Does this page need SEO?
3. Is the data static, semi-static, dynamic, or sensitive?
4. Should this be Server Component or Client Component?
5. Does it need SSR, SSG, ISR, CSR, or static export?
6. Could this accidentally expose secrets to the browser?
7. Could caching make this data stale or unsafe?
8. Will this increase client bundle size?
9. Does this depend on Node.js runtime or can it be static?
10. Will this work on the chosen deployment target?
```

---

## 18. AI Agent Code Generation Rules

The AI agent must follow these rules:

```txt
- Do not add "use client" unless hooks, events, browser APIs, or client-only libraries are required.
- Do not fetch private/sensitive data in browser code unless it is through a protected public API.
- Do not add SSR for dashboard interactions unless there is a clear reason.
- Do not add middleware for heavy logic.
- Do not add next/image for every image automatically.
- Do not introduce new dependencies without explaining why.
- Do not assume production builds happen on the VPS.
- Do not use next@latest casually.
- Do not expose env vars unless they intentionally start with NEXT_PUBLIC_.
- Do not cache admin/private data globally.
```

---

## 19. Suggested Scripts

Use scripts like:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  }
}
```

For CI:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm build
```

---

## 20. Summary

Next.js is powerful but operationally more complex than a normal React SPA.

Use it intentionally:

```txt
Use Next.js server features when they give real value.
Use CSR/static patterns when the app is mostly interactive and private.
Keep production deployment boring.
Keep upgrades controlled.
Keep caching explicit.
Keep secrets server-side.
```

The safest default is not "SSR everything" or "CSR everything".

The safest default is:

```txt
Server where it improves security, initial load, SEO, or data access.
Client where the UI is interactive.
Static where no server runtime is needed.
```
