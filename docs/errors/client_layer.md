# UI & Client Layer Errors

> **Last Updated**: May 27, 2026
> **Layer Boundary**: Browser environment (`src/components/*`, `src/hooks/*`)

This registry tracks errors occurring inside the client-side browser environment.

---

## 🔍 Errors

### 1. `ClientFetchError: Unexpected token '<' ... is not valid JSON`
* **Symptoms**:
  * Browser console outputs: `ClientFetchError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON. Read more at https://errors.authjs.dev#autherror`
  * Dynamic panels (e.g. session information, client-side fetches) fail to load or throw layout failures.
* **Trace Context**:
  * **Initiator**: `SessionProvider` inside [session-provider.tsx](file:///d:/CHAKKSSS/ZooSite/src/components/providers/session-provider.tsx) or browser client-side `fetch()`.
  * **Path**: Browser → API request to `/api/auth/session` (or any dynamic route).
  * **Failure Node**: The server did not return a JSON payload. Instead, it failed or returned a generic HTML page (such as a 404 or 500 HTML error page).
* **Resolution**:
  * Investigate the server-side Route Handler (Layer 2) corresponding to the target path. Ensure the handlers are correctly exported, compile cleanly, and return a proper JSON response.
