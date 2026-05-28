# Database Layer Errors

> **Last Updated**: May 27, 2026
> **Layer Boundary**: PostgreSQL Database Engine & Ports (`localhost:5432`), Prisma ORM Schema & Type Generation

This registry tracks lower-level database service states, server connectivity, migration errors, and Prisma type generation issues.

---

## 🔍 Errors

### 1. `PrismaClientInitializationError: Can't reach database server`
* **Symptoms**:
  * Dev server crashes on dynamic pages, or Prisma migrations (`db push`/`migrate`) fail.
  * Logs show: `PrismaClientInitializationError: Can't reach database server at localhost:5432`.
* **Trace Context**:
  * **Location**: PostgreSQL Engine.
  * **Failure Node**: PostgreSQL background daemon is stopped, crashed, or blocking port `5432`.
* **Resolution**:
  * **Windows**: Open the Windows Services panel (`services.msc`) and check if the `postgresql-x64-16` service status is **Running**. Alternatively, start it via administrative PowerShell:
    ```powershell
    Start-Service postgresql-x64-16
    ```
  * Verify the local database link inside [.env](file:///d:/CHAKKSSS/ZooSite/.env):
    ```env
    DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/animal_site?schema=public"
    ```

### 2. Stale Prisma Types After Schema Changes (IDE Ghost Errors)
* **Symptoms**:
  * IDE/editor shows red squiggles like: `Property 'is_request_banned' does not exist on type '{ id: string; email: string; ... }'`.
  * Errors appear on **Service Layer** files (e.g., `src/services/animal-request.service.ts`) or **Repository Layer** files when accessing newly added database columns.
  * `npx tsc --noEmit` compiles with **zero errors** — confirming the code is correct and only the IDE cache is stale.
* **Trace Context**:
  * **Root Cause Location**: Database Layer — `prisma/schema.prisma` was updated with new fields (e.g., `is_request_banned`, `request_banned_until`), and `npx prisma generate` was run successfully.
  * **Affected Layers**: Propagates upward to **Repository Layer** (`src/repositories/*.repo.ts`) and **Service Layer** (`src/services/*.service.ts`) where the new fields are referenced.
  * **Failure Node**: The editor's TypeScript Language Server holds an **in-memory cache** of the old `@prisma/client` generated types. Even after regeneration, the TS Server does not auto-detect changes to `node_modules/.prisma/client/index.d.ts` or the incremental `tsconfig.tsbuildinfo` snapshot.
* **Resolution**:
  1. **Delete the incremental build cache**:
     ```powershell
     Remove-Item -Path tsconfig.tsbuildinfo -Force -ErrorAction SilentlyContinue
     ```
  2. **Restart the TypeScript Language Server** in your editor:
     * Open Command Palette: `Ctrl + Shift + P`
     * Select: **`TypeScript: Restart TS Server`**
  3. If the error still persists, **close and reopen the editor entirely** to force a full cache flush.
  4. **Verification**: Run `npx tsc --noEmit` in the terminal. If it passes with zero errors, the code is correct and the issue is purely IDE-related.

