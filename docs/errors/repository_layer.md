# Repository Layer Errors

> **Last Updated**: May 27, 2026
> **Layer Boundary**: Database Access & Prisma ORM Queries (`src/repositories/*`)

This registry tracks errors related to database query failures, transactions, and Prisma constraint violations.

---

## 🔍 Errors

### 1. Prisma Unique Constraint Failure (`P2002`)
* **Symptoms**:
  * An operation crashes or returns a server error because of a unique database constraint violation.
  * Server logs output: `PrismaClientKnownRequestError: Unique constraint failed on the fields: (name)` with code `P2002`.
* **Trace Context**:
  * **Location**: Found inside any write methods of repository files (`src/repositories/*.repo.ts`).
  * **Failure Node**: Attempting to insert a duplicate value into a field marked with `@unique` in the database schema.
* **Resolution**:
  * Avoid try-catching unique constraints directly inside the Repository Layer to hide it. 
  * Let the Service Layer (Layer 3) pre-validate field uniqueness before initiating a write, throwing a typed custom exception if a conflict is found:
    ```typescript
    // In Service Layer
    const existing = await animalRepo.findByName(input.name);
    if (existing) {
      throw new AppError("An animal with this name already exists", 409);
    }
    ```

### 2. Inconsistent Column Data: Error Creating UUID
* **Symptoms**:
  * Pages or API endpoints crash with `PrismaClientKnownRequestError: Inconsistent column data: Error creating UUID, invalid character: expected an optional prefix of urn:uuid: followed by [0-9a-fA-F-], found ...`
  * Initiators are pages or controllers fetching database rows based on a dynamic parameter (such as `session.user.id` or a request `id` from the URL parameters).
* **Trace Context**:
  * **Initiating Path 1**: `/request-animal` → [page.tsx:L22](file:///d:/CHAKKSSS/ZooSite/src/app/request-animal/page.tsx#L22) (`getUserById(session.user.id)`)
  * **Initiating Path 2**: `/my-requests` → [page.tsx:L15](file:///d:/CHAKKSSS/ZooSite/src/app/my-requests/page.tsx#L15) (`findByUserId(session.user.id)`)
  * **Location**: [animal-request.repo.ts](file:///d:/CHAKKSSS/ZooSite/src/repositories/animal-request.repo.ts) (`getUserById()`, `findByUserId()`, `findById()`, `getRejectionCount()`, `banUser()`)
  * **Failure Node**: A non-UUID format string (such as the old static developer bypass user ID `"dev-admin-id"`) is filtered against a strict Postgres database column typed as `@db.Uuid` or its relations.
* **Resolution (Dual-Layer Safeguard)**:
  1. **Layer 1: NextAuth Identity Casting**
     Update the credentials bypass provider inside [auth.ts](file:///d:/CHAKKSSS/ZooSite/src/auth.ts) to:
     * Use a 100% valid static UUID shape (`"43a886b6-e274-4b6a-93a0-8bf135ea244c"`) instead of arbitrary text.
     * Perform an atomic database `upsert` of this static user on authorization to guarantee the row is persisted inside the `users` table, which resolves foreign key/referential constraints.
  2. **Layer 2: Repository Format Guards (Defense-in-depth)**
     Incorporate active regex validation directly in the repository lookup methods to validate parameter string formats before executing Prisma database queries. If a parameter is not a valid UUID format, return fallback values directly without hitting the database, shielding the queries from runtime casting exceptions:
     ```typescript
     const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
     const isUuid = (id?: string | null): boolean => !!id && UUID_REGEX.test(id);

     async getUserById(id: string) {
       if (!isUuid(id)) return null; // Intercepts stale session IDs (like 'dev-admin-id') safely
       return prisma.user.findUnique({
         where: { id },
         select: { ... }
       });
     }
     ```
