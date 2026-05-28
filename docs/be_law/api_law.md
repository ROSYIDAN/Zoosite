
When generating a GET list endpoint, follow every rule below.

━━━ QUERY PARAMS (always parse these) ━━━
?page=1             current page, integer, default 1, min 1
?limit=20           items per page, integer, default 20, max 100
?search=foo         optional keyword search on relevant text columns
?sortBy=createdAt   column to sort, whitelist allowed values only
?sortOrder=desc     asc | desc, default desc

Parse and validate ALL of them with Zod before touching the service.

const querySchema = z.object({
  page:      z.coerce.number().int().min(1).default(1),
  limit:     z.coerce.number().int().min(1).max(100).default(20),
  search:    z.string().optional(),
  sortBy:    z.enum(["createdAt", "name"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

━━━ ROUTE HANDLER ━━━
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success)
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })

  const result = await productService.findMany(parsed.data)
  return Response.json(result)
}

━━━ REPOSITORY ━━━
Use $transaction([count, findMany]) — one DB round trip, not two.

async findMany({ page, limit, search, sortBy, sortOrder }) {
  const skip = (page - 1) * limit
  const where = {
    deletedAt: null,
    ...(search && {
      OR: [
        { name:        { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    })
  }

  const [total, data] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      select: { id: true, name: true, price: true, createdAt: true },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    })
  ])

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
  }
}

━━━ RESPONSE SHAPES (Raw JSON, do not over-engineer with wrappers) ━━━

1. Success with data (list)
```json
{
  "data": [...],
  "meta": {
    "total": 24,
    "page": 1,
    "limit": 10
  }
}
```

2. Success with single item
```json
{
  "data": { ... }
}
```

3. Success no data (create/update/delete)
```json
{
  "message": "Resource created successfully"
}
```

4. Error
```json
{
  "message": "Resource not found"
}
```

━━━ RULES ━━━
- ALWAYS paginate — never return unbounded findMany()
- ALWAYS use $transaction([count, findMany]) — one round trip
- ALWAYS whitelist sortBy in Zod enum — never pass raw string to orderBy
- ALWAYS filter deletedAt: null
- ALWAYS use select — never return full Prisma objects
- Only add the OR search clause when search is actually present
- skip = (page - 1) * limit, not page * limit

━━━ WHAT NOT TO DO ━━━
✗ prisma.product.findMany()                      // unbounded, no pagination
✗ const count = await prisma.product.count()     // two separate round trips
✗ orderBy: { [req.query.sortBy]: "desc" }        // unsanitized user input to DB
✗ where: { name: { contains: search } }          // missing mode: insensitive
✗ skip: page * limit                             // off-by-one bug
✗ Abstract response helpers                      // e.g. successResponse(data). Just use plain Response.json() instead.
