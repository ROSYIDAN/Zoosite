Back-End System Law
You are generating backend code for a Next.js (App Router) project.
Stack: Next.js Route Handlers, Prisma ORM, PostgreSQL, TypeScript.
Background: this project follows Clean Architecture principles adapted
from .NET — same layer separation, same dependency rule, different tools.

Read this entire context before writing a single line of code.

━━━ LAYER ARCHITECTURE (mandatory, no exceptions) ━━━

  HTTP Request
      ↓
  Route Handler          app/api/[resource]/route.ts
      ↓  (validated DTO only — no Prisma types)
  Service                services/[resource].service.ts
      ↓  (domain logic, orchestration, business rules)
  Repository             repositories/[resource].repo.ts
      ↓  (ALL Prisma calls live here — nowhere else)
  Prisma Client          lib/prisma.ts (singleton)
      ↓
  PostgreSQL

DEPENDENCY RULE: each layer only imports from the layer below it.
- Route handlers never import Prisma or repositories directly
- Services never import from route handlers or NextRequest
- Repositories never contain business logic — pure DB access only

━━━ .NET → NEXT.JS TRANSLATION ━━━

  IRepository<T>       →  typed repo functions (no interface needed in JS)
  DbContext            →  prisma singleton in lib/prisma.ts
  MediatR Command/Query →  direct service method call
  FluentValidation     →  Zod schema in lib/validations/
  AutoMapper DTO       →  explicit map function in lib/mappers/
  GlobalExceptionHandler → lib/errors.ts + handleError() wrapper
  EF Core migration    →  prisma migrate dev
  Soft delete          →  deletedAt DateTime? field pattern

━━━ ROUTE HANDLER LAW ━━━
Thin. Validate input → call service → return response. Nothing else.

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = createOrderSchema.safeParse(body)
  if (!parsed.success)
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  const result = await orderService.create(parsed.data, session.user.id)
  return Response.json({ data: result }, { status: 201 })
}

━━━ SERVICE LAYER LAW ━━━
Business logic only. No req/res objects. No Prisma imports. Returns plain objects or throws AppError.

// services/order.service.ts
export const orderService = {
  async create(input: CreateOrderInput, userId: string) {
    const user = await userRepo.findById(userId)
    if (!user) throw new AppError("User not found", 404)
    if (user.status === "BANNED") throw new AppError("Forbidden", 403)

    // multi-step write → always a transaction (see transaction rules below)
    return await orderRepo.createWithItems(input, userId)
  }
}

━━━ REPOSITORY LAYER LAW ━━━
ALL Prisma code lives here. No business logic. No throw based on rules.
Return null for not-found, never throw from repo unless DB itself fails.

// repositories/order.repo.ts
import { prisma } from "@/lib/prisma"

export const orderRepo = {
  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id, deletedAt: null },
      select: { id: true, status: true, total: true, userId: true }
    })
  },

  async createWithItems(input: CreateOrderInput, userId: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: { userId, status: "PENDING", total: input.total }
      })
      await tx.orderItem.createMany({
        data: input.items.map(i => ({ ...i, orderId: order.id }))
      })
      return order
    })
  }
}

━━━ TRANSACTION RULES (anti-slop) ━━━

RULE 1 — Use $transaction whenever >= 2 writes must succeed together.
  Never do: await prisma.order.create(); await prisma.orderItem.createMany()
  Always do: prisma.$transaction(async tx => { await tx.order...; await tx.orderItem... })

RULE 2 — Use interactive transactions (async tx callback) not batch array form.
  Batch [op1, op2] has no rollback control. Always use the async callback.

RULE 3 — Pass tx down, never re-import prisma inside a transaction.
  Wrong: async (tx) => { await prisma.user.update(...) }  ← bypasses tx!
  Right: async (tx) => { await tx.user.update(...) }

RULE 4 — Transactions belong in repositories, not services or route handlers.
  Services call a repo method that wraps the transaction internally.

RULE 5 — Keep transactions short. No external API calls, no emails, no events inside tx.
  Commit the DB write, then fire side effects after tx resolves.

RULE 6 — Stock / inventory / balance mutations always use a transaction +
  optimistic lock or SELECT FOR UPDATE pattern via prisma.$queryRaw if needed.

━━━ DATABASE / PRISMA RULES ━━━

Schema requirements (every model):
  id          String    @id @default(cuid())
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime? // soft delete — never hard delete user data

Query rules:
  - Always use select — never return full Prisma objects to callers
  - Always filter deletedAt: null on queries
  - Paginate ALL list queries: take/skip or cursor-based
  - Index every FK column and every WHERE/ORDER BY column with @@index
  - Use Prisma enums for status, role, type fields — never raw strings
  - Never call new PrismaClient() outside lib/prisma.ts

Postgres rules:
  - cuid() or uuid() for all PKs (never auto-increment Int for public IDs)
  - snake_case in DB, camelCase in Prisma schema (map with @map / @@map)
  - Never store computed/derived values
  - Sensitive columns (passwordHash, resetToken) → never in select by default

━━━ VALIDATION LAW ━━━
Every request body, every query param, every route param — validated with Zod before the service is called. Define schemas in lib/validations/[resource].schema.ts.

━━━ ERROR HANDLING ━━━
Use a typed AppError class. Catch Prisma errors by code.
Return consistent shape: { error: string, code?: string }

HTTP codes:
  200 success  201 created   400 validation
  401 unauth   403 forbidden  404 not found
  409 conflict  422 unprocessable  500 server error

Prisma error codes to catch:
  P2002 → unique constraint violation → 409
  P2025 → record not found → 404
  P2003 → foreign key constraint → 400

━━━ NAMING ━━━
  Route file      app/api/orders/route.ts
  Service         services/order.service.ts
  Repository      repositories/order.repo.ts
  Validation      lib/validations/order.schema.ts
  Mapper          lib/mappers/order.mapper.ts
  Types           types/order.types.ts

━━━ RESPONSE SHAPE (always consistent) ━━━
  List:    { data: T[], meta: { total: number, page: number, limit: number } }
  Single:  { data: T }
  Created: { data: T }  → status 201
  Error:   { error: string, code?: string, details?: ZodIssue[] }

━━━ API VERIFICATION & TESTING LAW ━━━
Before integrating with the Frontend UI, every API route (especially POST/PATCH) MUST be verified via Swagger UI (/api-docs). 
- For complex "multiple data" posts (relational inserts), use the "Try it out" feature to ensure the service and repository correctly handle all fields.
- Verification via Swagger ensures the backend contract is stable before UI development begins.

━━━ ABSOLUTE PROHIBITIONS ━━━
  NEVER call prisma directly in a route handler
  NEVER call prisma directly in a service
  NEVER write >= 2 related writes without $transaction
  NEVER pass tx from service to repo — repos own their transactions
  NEVER return a raw Prisma model to the HTTP layer
  NEVER hard delete — always set deletedAt
  NEVER await an email/webhook/event inside a $transaction block
