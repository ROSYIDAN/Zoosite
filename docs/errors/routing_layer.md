# Routing & HTTP Handler Layer Errors

> **Last Updated**: May 27, 2026
> **Layer Boundary**: HTTP entry points (`src/app/api/*`, `src/proxy.ts`)

This registry tracks routing issues, headers, request parsing, and middleware integration failures.

---

## 🔍 Errors

### 1. Turbopack Destructured Export 404 Route Failure
* **Symptoms**:
  * Requesting a valid API route returns `404 Not Found` (returning an HTML page).
  * Dev server compilation logs show the handler files are not being compiled when the endpoint is requested.
* **Trace Context**:
  * **Location**: `src/app/api/auth/[...nextauth]/route.ts`.
  * **Failure Node**: Next.js 16/Turbopack failing to parse destructured dynamic properties exported directly from library instances (e.g. `export const { GET, POST } = handlers;`).
* **Resolution**:
  * Wrap the destructured handler functions inside explicit, named handler proxies to resolve compiler treeshaking issues:
    ```typescript
    import { handlers } from "@/auth";
    import { NextRequest } from "next/server";

    export async function GET(request: NextRequest) {
      return handlers.GET(request);
    }

    export async function POST(request: NextRequest) {
      return handlers.POST(request);
    }
    ```

### 2. NextRequest/NextResponse Leakage inside Repositories or Services
* **Symptoms**:
  * Next.js build errors showing `NextRequest is not defined` or execution crashes in non-HTTP server processes (such as background workers or cron tasks).
* **Trace Context**:
  * **Location**: Found inside business logic files (`src/services/*`) or database handlers (`src/repositories/*`).
  * **Failure Node**: Importing HTTP elements like `NextRequest`, `NextResponse`, or `Headers` outside Route Handlers, violating Clean Architecture layer boundaries.
* **Resolution**:
  * Remove HTTP references from services and repositories. 
  * Pass plain JS objects/DTOs as arguments into the services. Let the Route Handlers handle HTTP status codes, headers, and responses using `handleError()` from `lib/errors.ts`.
