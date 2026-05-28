# Service & Business Layer Errors

> **Last Updated**: May 27, 2026
> **Layer Boundary**: Domain Logic & Orchestration (`src/services/*`)

This registry tracks business validation rule violations, external integrations (Cloudinary, OpenAI), and operational logic failures.

---

## 🔍 Errors

### 1. Cloudinary Integration Signature / Key Mismatch
* **Symptoms**:
  * Uploading files fails, return status `500 Server Error`.
  * Logs show error messages such as: `Must supply api_key` or `Invalid Signature`.
* **Trace Context**:
  * **Location**: `src/services/animal-request.service.ts` → `src/lib/cloudinary.ts`.
  * **Failure Node**: The server environment variables for Cloudinary credentials loaded as undefined or incorrect.
* **Resolution**:
  * Verify that the local [.env](file:///d:/CHAKKSSS/ZooSite/.env) file is populated with valid Cloudinary keys:
    ```env
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
    NEXT_PUBLIC_CLOUDINARY_API_KEY="your_api_key"
    CLOUDINARY_API_SECRET="your_api_secret"
    ```

### 2. Orphaned Cloudinary Media Assets (Storage Leaks)
* **Symptoms**:
  * Storage usage is unexpectedly high due to lingering rejected or abandoned request images.
* **Trace Context**:
  * **Location**: `src/services/animal-request.service.ts` → `rejectRequest()`.
  * **Failure Node**: Admin rejects a user request but the service fails to clean up the uploaded temporary asset in Cloudinary.
* **Resolution**:
  * Ensure the service saves the unique `public_id` of the Cloudinary asset inside the database when created, and invokes cleanup when rejections or deletions occur:
    ```typescript
    if (request.imagePublicId) {
      await deleteFromCloudinary(request.imagePublicId);
    }
    ```
