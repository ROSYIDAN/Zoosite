# Request Animal Feature — Use Case & Test Scenarios

This document defines all testable use cases for the **Request Animal** feature.
It covers both the **User** (requester) and **Admin** (reviewer) roles, including happy paths, edge cases, concurrency locks, strike/ban logic, and regression checks.

---

## Actors

| Actor | Role | Pages |
| --- | --- | --- |
| **User** | Authenticated site visitor | `/request-animal`, `/my-requests` |
| **Admin** | Authenticated admin staff | `/admin/requests` |

---

## Preconditions

- User is signed in (Google OAuth or Developer Bypass).
- Admin is signed in with `UserRole.ADMIN`.
- At least one animal class exists in the database (e.g., "Mammals", "Birds").
- The dev server is running (`npm run dev`).

---

## Part 1: User — Submit Request (`/request-animal`)

### UC-1.1 — Quick Request (Happy Path)

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Navigate to `/request-animal` | Page loads with "Request Animal Addition" header. Tab defaults to **Quick Request**. |
| 2 | Type a unique animal name (e.g., `Axolotl`) into the **Common Name** field | After ~500ms debounce, a green checkmark or "Available" indicator appears. No duplicate warning. |
| 3 | Upload a reference image using the image dropzone | Image uploads to Cloudinary temp folder. Preview thumbnail renders inside the dropzone. |
| 4 | Click **Submit Request** | Toast: "Request submitted successfully!". Redirects to `/my-requests`. New entry appears with status **PENDING**. |

### UC-1.2 — Full Detail Request (Happy Path)

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Navigate to `/request-animal` | Page loads. |
| 2 | Switch to the **Full Details Request** tab | Additional sections animate in: Classification, Description, Physical Stats. |
| 3 | Fill in **Common Name** (`Pangolin`), **Scientific Name** (`Manis`), select **Class** (`Mammals`), fill Family, Genus, Diet, Description, Lifespan, Weight, Height, etc. | All fields accept input. No validation errors while typing. |
| 4 | Upload a reference image | Preview renders. |
| 5 | Click **Submit Request** | Toast: "Request submitted successfully!". Redirects to `/my-requests`. Entry shows type badge: **FULL DETAIL**. |

### UC-1.3 — Duplicate Animal Detection

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Type the name of an animal **already in the database** (e.g., `Lion`) | After debounce, a **red warning** appears: "This animal already exists in the database." |
| 2 | Attempt to click **Submit Request** | Button is **disabled**. Cannot submit. |

### UC-1.4 — Active Review Detection

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Type the name of an animal that has a **PENDING or IN_REVIEW** request (e.g., `Axolotl` if already submitted) | After debounce, an **amber warning** appears: "There is already a pending request for this animal." |
| 2 | Attempt to click **Submit Request** | Button is **disabled**. Cannot submit. |

### UC-1.5 — Empty Name Validation

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Leave the **Common Name** blank | No debounced check fires. |
| 2 | Click **Submit Request** | Zod validation error: "Common name is required." shown inline below the field. Form does NOT submit. |

### UC-1.6 — Image Optional

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Fill in only the **Common Name** with a valid unique name | No image uploaded. |
| 2 | Click **Submit Request** | Request submits successfully. `image_url` is `null` in database. |

### UC-1.7 — Clear Uploaded Image

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Upload an image | Preview appears. |
| 2 | Click the **X** (clear) button on the image preview | Image preview disappears. `imageUrl` resets to `null`. |
| 3 | Submit the form | Request submits successfully without an image. |

---

## Part 2: User — Request History (`/my-requests`)

### UC-2.1 — View Request History

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Navigate to `/my-requests` | Page loads with header "My Animal Requests". Shows a list/grid of all user's past requests. |
| 2 | Observe request cards | Each card shows: animal name, request type badge (QUICK/FULL DETAIL), status badge (PENDING/IN_REVIEW/APPROVED/REJECTED), submitted date. |

### UC-2.2 — Filter by Status

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Click the **Pending** filter tab | Only requests with status `PENDING` are shown. |
| 2 | Click **Approved** | Only `APPROVED` requests shown. |
| 3 | Click **All** | All requests shown again. |

### UC-2.3 — Withdraw a Pending Request

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Find a request with status **PENDING** | Withdraw button is visible. |
| 2 | Click **Withdraw** | Browser confirmation dialog: "Are you sure you want to withdraw this request?" |
| 3 | Confirm | Toast: "Request withdrawn successfully!". Card animates out. Cloudinary temp image is deleted. |

### UC-2.4 — Cannot Withdraw In-Review Request

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Admin locks a request for review (status becomes `IN_REVIEW`) | — |
| 2 | User navigates to `/my-requests` | The request card does NOT show a Withdraw button. Status badge shows `IN_REVIEW`. |

### UC-2.5 — Fix & Resubmit a Rejected Request

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Find a request with status **REJECTED** | Card shows the rejection reason from admin. A **Fix & Resubmit** button is visible. |
| 2 | Click **Fix & Resubmit** | Redirects to `/request-animal?resubmit=true`. Form is pre-filled with the original rejected request data. |
| 3 | Correct the flagged issues and submit | A new request is created. The old rejected entry remains in history for audit. |

### UC-2.6 — Strike Warning Banner (2 Rejections)

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Accumulate **2 rejected** requests | — |
| 2 | Navigate to `/my-requests` | An **amber warning banner** appears: "You currently have 2 rejected requests... A third rejection may result in your request privileges being suspended." |

### UC-2.7 — New Request Button

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Click the **+ New Request** button | Navigates to `/request-animal`. |

---

## Part 3: Admin — Review Requests (`/admin/requests`)

### UC-3.1 — View All Incoming Requests

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Navigate to `/admin/requests` | Page loads with header "Pending Animal Requests". Table/grid shows all community requests. |
| 2 | Observe each request card | Shows: animal name, request type badge, status, requester name/email, strike count (rejections / 3), and privilege status (Active/Suspended). |
| 3 | Reference image is **blurred by default** | A "Reveal Reference" button overlay is present on top of the blurred image. |

### UC-3.2 — Filter Tabs

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Click **PENDING** tab | Only pending requests shown. |
| 2 | Click **IN_REVIEW** tab | Only locked (in-review) requests shown. |
| 3 | Click **COMPLETED** tab | Only APPROVED and REJECTED requests shown together. |
| 4 | Click **ALL** | Everything shown. |

### UC-3.3 — Lock a Request for Review

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Find a **PENDING** request | "Start Review" button is visible. |
| 2 | Click **Start Review** | Toast: "Request locked for review successfully.". Card changes to amber-highlighted `IN_REVIEW` state with a spinning lock badge. `review_started` timestamp is set. |
| 3 | User-side: the same request is now non-withdrawable and non-editable | Concurrency lock is active. |

### UC-3.4 — Approve a Quick Request (Complete & Approve)

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Lock a **QUICK** request first (UC-3.3) | Status becomes `IN_REVIEW`. Button reads "Complete & Approve". |
| 2 | Click **Complete & Approve** | A **full-screen correction modal** opens, pre-filled with the user's submitted data. Admin sees editable fields: Common Name, Scientific Name, Class, Family, Genus, Diet, Description, Conservation, Lifespan, Weight, Height. |
| 3 | Fill in missing fields (Quick requests usually only have the name) | Admin completes taxonomy, stats, description. |
| 4 | Click **Save & Approve** | Toast: "Animal approved, corrections saved, and database profile created!". The animal is now live in the public `/animals` archive. Request status updates to `APPROVED`. |

### UC-3.5 — Approve a Full Detail Request (Review & Approve)

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Lock a **FULL_DETAIL** request (UC-3.3) | Button reads "Review & Approve". |
| 2 | Click **Review & Approve** | Correction modal opens with most fields pre-filled from the user's detailed submission. |
| 3 | Fix any typos (e.g., `Pangollin` → `Pangolin`) or incorrect fields | Admin edits inline. |
| 4 | Click **Save & Approve** | Same success flow as UC-3.4. Animal created in database with corrections applied. User receives attribution (`contributed_by`). |

### UC-3.6 — Reject a Request

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Lock a request (UC-3.3) | Status becomes `IN_REVIEW`. |
| 2 | Click **Reject** | A rejection modal opens with a textarea for the reason. |
| 3 | Leave the reason **empty** and click submit | Toast error: "Rejection reason is required." Modal stays open. |
| 4 | Type a reason: `"Please provide a real, non-fictional animal."` and click **Reject & Delete Image** | Toast: "Request rejected successfully.". Status changes to `REJECTED`. Cloudinary temp image is deleted. User's rejection count (strike) increments by 1. |

### UC-3.7 — Reveal / Hide Reference Image

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Click **Reveal Reference** on a blurred image | Image unblurs with a smooth CSS transition. A small "eye" toggle appears in the corner. |
| 2 | Click the eye toggle | Image re-blurs. (Safety feature for potentially inappropriate user uploads.) |

---

## Part 4: Admin — Strike & Ban Management

### UC-4.1 — Strike Counter Visibility

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Observe a user's request card | The "Strikes (Rejections)" field shows `X / 3`. |
| 2 | When a user reaches 3+ rejections | The strike counter turns **red** to alert the admin. |

### UC-4.2 — Suspend User (Temporary — 7 Days)

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Click **Suspend User** on a request card | A ban duration modal opens with three options: 7 Days, 30 Days, Permanent. |
| 2 | Select **🟡 Suspend for 7 Days** and click **Apply Suspension** | Toast: "User request privileges suspended successfully!". User's privilege status badge changes from "Active" to **"Suspended"**. |
| 3 | User navigates to `/request-animal` within 7 days | User sees the red "Request Privileges Suspended" full-page block. Cannot submit any requests. |
| 4 | After 7 days | User can submit requests again normally. |

### UC-4.3 — Suspend User (Temporary — 30 Days)

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Same as UC-4.2 but select **🟠 Suspend for 30 Days** | `request_banned_until` is set to 30 days from now. |

### UC-4.4 — Ban User (Permanent)

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Select **🔴 Ban Permanently** and click **Apply Suspension** | `is_request_banned` set to `true` in database. |
| 2 | User navigates to `/request-animal` | Permanently sees "Request Privileges Suspended". No expiry. |

### UC-4.5 — Restore User Privileges (Unban)

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Find a user with "Suspended" privilege status | A **Restore Privileges** button appears (replaces "Suspend User"). |
| 2 | Click **Restore Privileges** | Toast: "User request privileges restored!". Badge changes back to "Active". User can submit requests again. |

---

## Part 5: Concurrency & Edge Cases

### UC-5.1 — Admin Lock Prevents User Edit

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Admin locks a request via "Start Review" | Status → `IN_REVIEW`. |
| 2 | User tries to PATCH `/api/animals/request/:id` (edit the request via API or stale UI) | HTTP `409 Conflict`: "This request is currently under review and cannot be edited." |

### UC-5.2 — Admin Lock Prevents User Withdraw

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Admin locks a request | Status → `IN_REVIEW`. |
| 2 | User tries to DELETE `/api/animals/request/:id` | HTTP `409 Conflict`: "This request is currently under review and cannot be withdrawn." |

### UC-5.3 — Stale Lock Auto-Release (30 Minutes)

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Admin locks a request and then **abandons it** (closes browser, does nothing for 30+ minutes) | — |
| 2 | Another admin navigates to `/admin/requests` | The stale lock is automatically reverted to `PENDING`. The request is reviewable again. |

### UC-5.4 — Banned User Cannot Submit via API

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Admin bans a user | — |
| 2 | Banned user tries to POST `/api/animals/request` directly (e.g., via Postman/curl bypassing the UI block) | HTTP `403 Forbidden`: "Your request privileges have been suspended permanently." |

### UC-5.5 — Banned User Cannot Edit via API

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Admin bans a user who has existing PENDING requests | — |
| 2 | Banned user tries to PATCH `/api/animals/request/:id` | HTTP `403 Forbidden`: "Your request privileges have been suspended." |

---

## Part 6: Request Submission Page — Banned/Strike UI Guards

### UC-6.1 — Banned User Sees Full Block

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Navigate to `/request-animal` as a banned user | Instead of the form, user sees a centered red card with gavel icon: **"Request Privileges Suspended"** with a message to contact support. No form fields are rendered. |

### UC-6.2 — Strike Warning on Submission Page

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Navigate to `/request-animal` as a user with 2 rejections | An **amber warning** strip appears above the form: "You have 2 prior rejection strikes. A third rejection may result in a temporary or permanent suspension." |
| 2 | The form is still usable | User can still submit (they are warned, not blocked). |

---

## Part 7: Approved Animal Verification

### UC-7.1 — Approved Animal Appears in Public Archive

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Admin approves a request (UC-3.4 or UC-3.5) | — |
| 2 | Navigate to `/animals` (public archive) | The newly approved animal appears in the species list. |
| 3 | Click on the animal card | Animal detail page loads with all the data the admin filled in during the correction step. |

### UC-7.2 — Community Contribution Badge

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | View the detail page of an animal that was created through the request workflow | A **"Community Contribution"** badge is displayed on the animal header/detail page, attributing the animal to the requesting user. |

---

## Part 8: Navigation & Access Control

### UC-8.1 — Sidebar Links

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Log in as a regular User | The user sidebar shows a **"Contributions"** section with links: "Request Animal" and "My Requests". |
| 2 | Click **Request Animal** | Navigates to `/request-animal`. |
| 3 | Click **My Requests** | Navigates to `/my-requests`. |

### UC-8.2 — Unauthenticated Access Redirect

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Visit `/request-animal` without being logged in | Redirects to `/login`. |
| 2 | Visit `/my-requests` without being logged in | Redirects to `/login`. |

### UC-8.3 — Non-Admin Cannot Access Admin Panel

| Step | Action | Expected Result |
| --- | --- | --- |
| 1 | Visit `/admin/requests` as a User (non-admin) | Redirects to `/forbidden`. |

---

## Regression Checklist

After testing all use cases above, verify these existing features still work:

- [ ] `/animals` — Public animal list renders correctly.
- [ ] `/animals/[slug]` — Animal detail page renders correctly.
- [ ] `/admin/animals` — Admin species inventory is unaffected.
- [ ] `/admin/animals/[id]/edit` — Admin edit form still works.
- [ ] `/admin/quiz` — Quiz management is unaffected.
- [ ] `/quiz` — Public quiz flow still works.
- [ ] `/login` — Login page loads and Google OAuth / dev bypass works.
- [ ] `npm run build` — Production build completes with zero errors.

---

## API Endpoints Reference

| Method | Endpoint | Actor | Description |
| --- | --- | --- | --- |
| GET | `/api/animals/check?name=X` | User | Live duplicate & active review check |
| GET | `/api/animals/request` | User | Fetch user's request history |
| POST | `/api/animals/request` | User | Submit a new request |
| PATCH | `/api/animals/request/[id]` | User | Edit a pending request |
| DELETE | `/api/animals/request/[id]` | User | Withdraw a pending request |
| GET | `/api/admin/requests` | Admin | List all requests (auto-unlocks stale locks) |
| PATCH | `/api/admin/requests/[id]` | Admin | Lock, Reject, Approve, or Ban actions |
