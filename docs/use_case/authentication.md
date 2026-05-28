# Google-First Authentication Plan - ZooSite

## Goal

Add authentication to ZooSite with Google OAuth first:

1. Google sign-in creates and links users through Auth.js.
2. Auth sessions expose `user.id`, `user.email`, `user.name`, `user.image`, and `user.role`.
3. `/admin/*` routes are protected by the `ADMIN` role.
4. Email/password auth is deferred to a later phase.

This keeps the first implementation small, free, and easier to verify before adding password security flows.

---

## Recommended Stack

| Layer | Tool | Cost | Why |
| --- | --- | --- | --- |
| Auth library | Auth.js v5 / NextAuth | Free / open source | Built for Next.js and supports Google OAuth |
| OAuth provider | Google Cloud OAuth 2.0 | Free | No per-login or monthly OAuth credential fee |
| Database adapter | `@auth/prisma-adapter` | Free / open source | Persists users and linked provider accounts in PostgreSQL |
| Database | Existing PostgreSQL + Prisma | Existing project stack | Matches ZooSite backend architecture |

Google OAuth credentials are created in Google Cloud Console. For local testing, use this redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

---

## Current Implementation Scope

### Phase 1 - Google OAuth

- Install `next-auth@beta` and `@auth/prisma-adapter`.
- Add Auth.js-compatible Prisma models:
  - `User`
  - `Account`
  - `Session`
  - `VerificationToken`
- Use PostgreSQL UUID IDs and map Prisma camelCase fields to snake_case DB columns.
- Add `UserRole` enum:
  - `USER`
  - `ADMIN`
- Default all new users to `USER`.
- Create `src/auth.ts` with Google provider, Prisma adapter, JWT sessions, and session callbacks.
- Create `src/app/api/auth/[...nextauth]/route.ts`.
- Create `src/proxy.ts` for Next.js 16 request-boundary protection of `/admin/*`.
- Add `/login`, Google sign-in UI, sign-out UI, and role-aware admin navigation.

### Phase 2 - Email + Password Later

Email/password is intentionally not part of the first rollout. When added, it must include:

- Zod validation for registration, login, password reset, and verification routes.
- Route handler -> service -> repository layering.
- Password hashing with `bcryptjs` or an equivalent password hashing library.
- Required email verification before allowing password login.
- Rate limiting for login, registration, verification resend, and password reset.
- Generic login errors so attackers cannot enumerate registered emails.
- Password reset flow.
- Email delivery through a free-tier provider such as Resend.

Current Resend free plan guidance should be treated as `100 emails/day`, not the older `3,000 emails/month` wording.

---

## Prisma Auth Schema Requirements

Auth.js Prisma Adapter expects PascalCase Prisma model names such as `User`, `Account`, `Session`, and `VerificationToken`. ZooSite can still keep snake_case PostgreSQL tables and columns through `@@map` and `@map`.

Example pattern:

```prisma
model User {
  id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email         String    @unique
  emailVerified DateTime? @map("email_verified")
  role          UserRole  @default(USER)

  @@map("users")
}
```

Do not rename these Prisma models to `users`, `accounts`, or similar lowercase model names, because the adapter expects the Auth.js model shape.

---

## Access Control

| Role | Can Access |
| --- | --- |
| `USER` | Public pages, dashboard, favorites, quiz, profile |
| `ADMIN` | Everything above plus `/admin/*` |

Rules:

- New Google users start as `USER`.
- Admin promotion is manual through the database for v1.
- `/admin/*` protection lives in `src/proxy.ts`, not `middleware.ts`, because this project uses Next.js 16.
- JWT sessions are used so the proxy can read the role from the session token.
- If a user is manually promoted to `ADMIN`, they should sign out and sign in again so the JWT receives the updated role.

---

## Environment Variables

```env
# Auth.js
AUTH_SECRET=
AUTH_TRUST_HOST=true

# Google OAuth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

Generate the secret with:

```bash
rtk npx auth secret
```

---

## Testing Checklist

### Schema and Build Checks

- `rtk npx prisma validate`
- `rtk npx prisma generate`
- `rtk npm run lint`
- `rtk npm run build`

### OAuth Route Checks

- `/api/auth/signin` loads.
- `/api/auth/signin/google` redirects to Google.
- `/api/auth/callback/google` works after Google redirects back.
- Missing or invalid OAuth env values fail visibly during local testing.

### Database Checks

- First Google login creates one row in `users`.
- First Google login creates one linked row in `accounts` with provider `google`.
- Returning Google login reuses the same user and does not create duplicates.
- New user role defaults to `USER`.

### Session Checks

- Authenticated session includes `user.id`, `user.email`, `user.name`, `user.image`, and `user.role`.
- `/login` shows signed-out state before login.
- Header/user menu shows signed-in state after login.
- Sign-out clears the session and UI state.

### Admin Protection Checks

- Anonymous user visiting `/admin` redirects to `/login`.
- Signed-in `USER` visiting `/admin` redirects to `/forbidden`.
- Manually promoted `ADMIN` user can access `/admin`.
- Admin navigation is hidden for `USER` and visible for `ADMIN`.

### Regression Checks

- Public routes still work:
  - `/`
  - `/animals`
  - `/quiz`
  - `/favorites`
- Existing API routes still build and respond.
- Swagger/API docs route still loads.
- No direct Prisma calls are added to route handlers outside the Auth.js adapter route.

---

## Acceptance Criteria

- Google login works locally end to end.
- User/account records persist correctly in PostgreSQL.
- Sessions expose role safely to UI and route protection.
- `/admin/*` is protected by role.
- Existing public site behavior is unchanged.
- Prisma validation, lint, and production build pass.
