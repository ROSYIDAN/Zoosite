# Project Timeline & Progress

## 2026-05-27
### User Feature: Request Animal Submission & Review Workflow
- [x] **Database Schema & Prisma Sync**
  - Added `RequestType`, `RequestStatus` enums and the `animal_requests` model to `schema.prisma`.
  - Updated `User` model with `is_banned` and `rejection_count` fields. Updated `animals` model with `requested_by` attribution.
  - Synced with PostgreSQL via `rtk prisma db push` and regenerated the Prisma Client.
- [x] **Backend: Clean Architecture (Repo → Service → Route)**
  - Built [animal-request.repo.ts](file:///d:/CHAKKSSS/ZooSite/src/repositories/animal-request.repo.ts) with full CRUD, UUID format guards, and concurrency-safe locking.
  - Built [animal-request.service.ts](file:///d:/CHAKKSSS/ZooSite/src/services/animal-request.service.ts) encapsulating all business logic (`getSubmissionPageData`, `banUser`, strike counting, auto-unlock stale reviews).
  - Created Zod validation schemas in [animal-request.schema.ts](file:///d:/CHAKKSSS/ZooSite/src/lib/validations/animal-request.schema.ts).
  - Implemented 5 API route handlers: `/api/animals/check`, `/api/animals/request`, `/api/animals/request/[id]`, `/api/admin/requests`, `/api/admin/requests/[id]`.
- [x] **Frontend: User Submission & History Pages**
  - Created `/request-animal` page with `RequestAnimalForm` supporting quick/full detail tabs, debounced duplicate checking, and image upload.
  - Created `/my-requests` page with `RequestHistory` showing tabbed status views, withdraw actions, and "Fix & Resubmit" pre-fill.
  - Added "Request Animal" and "My Requests" links under a new "Contributions" section in the user sidebar.
- [x] **Frontend: Admin Review Panel**
  - Created `/admin/requests` page with `AdminRequestsTable` featuring active review locks, editable correction fields, rejection panels, and manual "Ban User" buttons.
  - Updated the Animal Detail page to display a `Community Contribution` badge.
- [x] **Component Modularization (FE SRP)**
  - Refactored `request-animal-form.tsx` from ~590 lines down to ~110 lines by extracting a custom hook ([useRequestAnimalForm.ts](file:///d:/CHAKKSSS/ZooSite/src/components/features/requests/useRequestAnimalForm.ts)) and co-located sub-components: `RequestIdentitySection`, `RequestImageSection`, `RequestDescriptionSection`, `RequestClassificationSection`, `RequestPhysicalStatsSection`, `RequestFormActions`.
  - Refactored `request-history.tsx` down to ~100 lines with extracted sub-components.
- [x] **Critical Bug Fix: UUID Casting Crash**
  - Diagnosed and fixed `PrismaClientKnownRequestError` caused by stale non-UUID session tokens (e.g., `"dev-admin-id"`) crashing PostgreSQL casts.
  - **Two-Layer Defense**: (1) Atomic `upsert` for developer bypass credentials in [auth.ts](file:///d:/CHAKKSSS/ZooSite/src/auth.ts) to always produce a valid UUID. (2) Regex `isUuid` format guards in all Repository methods.
  - Documented the pattern in [repository_layer.md](file:///d:/CHAKKSSS/ZooSite/docs/errors/repository_layer.md).
- [x] **E2E Verification**
  - Created and executed a comprehensive programmatic test suite (`scratch/verify-flow.ts`) covering concurrency locks, strike logic, bans, and the full request lifecycle.

## 2026-05-25
### Admin: Symmetrical Grid Layout, Smart Paste Safeguards, Predators Autocomplete, and Smart Tag Recommendations
- [x] **Perfectly Balanced Symmetrical 50/50 Grid Layout (UX Refinement)**
  - Re-engineered the parent form in `AnimalForm.tsx` from an unbalanced 3-column setup to a highly optimized, symmetrical `grid-cols-1 lg:grid-cols-2` 50/50 layout.
  - Re-allocated form cards to balance Left column height (~680px for Identity & Description) and Right column height (~640px for Classification & Physical Stats) perfectly, completely resolving trailing empty whitespace.
  - Implemented a **fluid bottom footer section** spanning both columns (`lg:col-span-2`) for list-based and media inputs (Distribution, Tags, Media, Form Actions), giving badge lists ample horizontal breathing room and establishing a strong visual anchor.
- [x] **Smart Predators Autocomplete & Tag Input**
  - Upgraded the `predators` field from a plain textarea to a premium **Autocomplete Search + Tag Input** in `AnimalDetailStatsCard`.
  - Implemented real-time dynamic matching against pre-existing database animals via `GET /api/animals?search=...` while allowing a flexible **Enter/Comma fallback** to easily add unregistered custom predators (like `"Hyenas"`, `"Crocodiles"`).
  - Automatically normalizes all matched and typed predator entries to Title Case and synchronizes them as a clean comma-separated list into the Hook Form state, maintaining full relational backend compatibility.
- [x] **Smart Classification Tags (Title-Case Normalization & Real-time Suggestions)**
  - Implemented **Automatic Title-Case Normalization** in `AnimalTagCard` to format any manually typed or pasted tags (e.g. `"big cat"` ➔ `"Big Cat"`), resolving case discrepancies and preventing database catalog duplicate records.
  - Engineered a **Dynamic Taxonomy Recommendation Engine** that watches family, diet, and name fields to offer relevant quick-add pills (e.g. `"Feline"`, `"Big Cat"`, `"Small Cat"`, `"Predator"`, `"Carnivore"`, `"Endangered"`) with interactive micro-animations.
  - **Modular Sub-Component Refactoring**: Deconstructed the tag card, extracting reusable sub-components `TagRecommendations.tsx` and `TagList.tsx` to align strictly with FE Single Responsibility Principle laws.
- [x] **Countries & Habitats Smart Paste (Option C Safeguard)**
  - Developed a robust `parsePastedList` helper to cleanly parse lists, stripping noise words (like `"and "`, `"or "`, `"as well as "`) and trailing punctuation.
  - Implemented **Option C (Strict Paste Selection)** for habitats—pasting a list only auto-selects *pre-existing* DB habitats, preventing random tags from cluttering the database, while manual creation remains accessible via Enter.
  - Enhanced the `/api/habitats` endpoint to support `all=true` for client-side tag matching.
  - Added elegant, matching inline help descriptions with `info` icons below both the Country and Habitat inputs.
- [x] **Build & Verification**
  - Verified all changes against the TypeScript compiler (`rtk tsc`), ensuring zero compilation errors in the workspace.

## 2026-05-24
### Admin: Form UX Redesign, Default Value Adjustments & Swagger Documentation
- [x] **Animal Registration Form Restructuring (UX Fix)**
  - Moved **Diet Type (Ordo)** and **Conservation Status** fields into the **Animal Identity** card to prevent admins from missing them.
  - Implemented the exact 3x2 grid layout requested by the user:
    - Row 1: Common Name & Scientific Name
    - Row 2: Diet Type (Ordo) & Family
    - Row 3: Genus & Conservation Status
  - Removed the now redundant `AnimalCharacteristicsCard` component to clean up the form.
- [x] **Smart Taxonomy Default Adjustments**
  - Removed default `"Herbivore"` diet and `"Least Concern"` status from `AnimalForm.tsx`, initializing both to `""`.
  - This avoids premature, incorrect taxonomy suggestion filtering on initial focus and ensures an accurate "Smart Taxonomy Assist" workflow.
- [x] **Automated & Interactive API Documentation (Swagger)**
  - Documented `/api/animals/taxonomy` GET autocomplete API.
  - Documented `POST /api/animals` (Create Animal) API.
  - Documented `PATCH /api/animals/[slug]` (Update Animal) API.
  - Re-grouped all form-related and taxonomy-related APIs into their own dedicated **`Animal Form Input`** Swagger UI section (distinct from the read-only `Animals` section).
- [x] **System Verification**
  - Added dynamic server-side diagnostic logging to `GET /api/animals/taxonomy` for real-time filter inspection.
  - Compiled and verified all changes using `npx tsc --noEmit` yielding zero TypeScript compilation errors.

## 2026-05-22
### Admin: Country & Flag Management Suite & Component Modularization
- [x] **Modular Component Refactoring (FE SRP)**
  - Refactored monolithic countries page `/admin/countries` into highly cohesive small components.
  - Extracted shared typescript definitions into [types.ts](file:///d:/CHAKKSSS/ZooSite/src/components/features/admin/countries/types.ts).
  - Isolated statistics visualization inside [CountryStats.tsx](file:///d:/CHAKKSSS/ZooSite/src/components/features/admin/countries/CountryStats.tsx).
  - Modularized keyword search inputs and continent selectors inside [CountryFilters.tsx](file:///d:/CHAKKSSS/ZooSite/src/components/features/admin/countries/CountryFilters.tsx).
  - Extracted tabular records layout and client-side 10-item pagination controls inside [CountryTable.tsx](file:///d:/CHAKKSSS/ZooSite/src/components/features/admin/countries/CountryTable.tsx).
  - Structured modal-based country registration and editing overrides inside [CountryModal.tsx](file:///d:/CHAKKSSS/ZooSite/src/components/features/admin/countries/CountryModal.tsx) featuring a live visual flag previewer.
  - Condensed the main [page.tsx](file:///d:/CHAKKSSS/ZooSite/src/app/admin/countries/page.tsx) to serve strictly as the state orchestrator.
- [x] **API Route Enhancements**
  - Created new secure GET `/api/regions` route handler mapping existing geographical continents.
  - Upgraded `/api/countries` to support GET parameter `all=true` (administrative views), POST (creating countries with case-insensitive duplication guards), and PATCH (updating names, regions, and flags).
- [x] **Seamless Form Creation Overlay**
  - Embedded an inline `+ Create Country` action directly inside the geographical distribution multiselect menu in `AnimalDistributionCard`.
  - Configured prompt overlays to prefill queried parameters, register the new country in the DB, and auto-select it in the active multiselect state without interrupting form edits.
- [x] **E2E Validation and Build Verification**
  - Verified static compilation across all newly created files using `npx tsc --noEmit`.
  - Executed production bundle checking (`npm run build`), compiling the entire project with zero errors.

### Frontend & Backend: Animal Detailed Statistics Expansion
- [x] **Relational Schema & Stats Definitions**
  - Integrated detailed stats (`height_cm`, `avg_speed_kmh`, `top_speed_kmh`, and `social_structure`) into frontend type declarations (`src/types/animal.ts`).
  - Added full mapper parsing inside `mapAnimalToData` (`src/lib/actions/animal.ts`) to extract stats from Prisma relational `dataset_animals` payload.
- [x] **Aesthetic Double-Grid Layout & AutoPagination**
  - Expanded `AnimalStatsGrid` to divide physical characteristics into `"primary"` and `"details"` grids.
  - Implemented unit conversion helpers (`cm`, `years`, `kg`, `km/h`) with a clean `N/A` text fallback for omitted records.
  - Integrated stats into the `AutoPagination` slider layout, pushing details to the second page to reduce vertical scrolling and enhance user experience.
- [x] **Admin Form & Endpoint Consistency**
  - Synchronized type checking and validation in the administrative `AnimalForm` and API Route Handlers.
  - Resolved all pre-existing TypeScript build compilation issues across 7 files, achieving **0 compile errors** for the entire workspace.
- [x] **Developer Bypass & Authentication Robustness**
  - Resolved `CredentialsSignin` crash on invalid credentials under Auth.js v5 using specific `AuthError` catching and elegant `searchParams` parsing in `/login`.
  - Implemented an elegant, responsive alert overlay for invalid passcode attempts that blends perfectly with the forest-green curation.
- [x] **Dual-Portal Navigation Toggles**
  - Designed and integrated an elegant, mirrored "User Portal" button in `AdminTopbar` for immediate fallback to the user dashboard.
  - Hardened layout role checks, ensuring role-restricted navigation toggles remain accessible and consistent.

## 2026-05-14
### System: Google OAuth & Identity Management
- [x] **Secure Authentication Integration**
  - Implemented `next-auth@beta` with `GoogleProvider`.
  - Configured `PrismaAdapter` to persist user profiles and linked accounts in PostgreSQL.
  - **Edge-Safe Architecture**: Split configuration into `auth.ts` and `auth.config.ts` to support Next.js middleware constraints.
- [x] **Role-Based Access Control (RBAC)**
  - Implemented `UserRole` enum (`USER`, `ADMIN`) with a default of `USER`.
  - Developed `proxy.ts` (Next.js 16) to intercept and protect all routes except Landing and Login.
  - **Admin Enforcement**: Strictly enforced `/admin/*` access for users with the `ADMIN` role, redirecting others to a custom `/forbidden` page.
- [x] **Developer Experience & Bypass**
  - Engineered a "Developer Backdoor" with a secret passcode (`zoo-admin`) for instant admin access during local development.
  - Integrated smart redirects on login: Admins go to `/admin`, while Users land on `/dashboard`.

### UI/UX: Dashboard & Navigation Refinement
- [x] **Global User Management UI**
  - Developed the `UserMenu` component with dynamic profile avatars and role-aware navigation.
  - Integrated `SignOut` buttons across all sidebars (Admin & User) for a unified exit flow.
  - Cleaned up the Dashboard Sidebar by removing administrative "+ New Entry" buttons for standard users.
- [x] **YouTube-Style "Instant" Transitions**
  - Engineered specialized **Loading Skeletons** (`loading.tsx`) for all primary animal routes.
  - Enabled streaming for `/animals` and `/animals/[slug]`, allowing the browser to transition instantly to placeholder layouts while data is fetched in the background.

## 2026-05-12
### Admin: Habitat & Geographical Distribution Integration
- [x] **Relational Geo-Mapping**
  - Implemented `animal_distributions` (Countries) and `animal_environment` (Habitats) in the registration flow.
  - **Dynamic Habitat Creation**: Built a "find-or-create" repository pattern for habitats.
  - **Searchable UI Components**: Developed `AnimalDistributionCard` with real-time API search for countries and habitats.
  - **Atomic Transactions**: Hardened the animal repository to ensure all geographical and environmental data is committed alongside the core species record.
### System Verification: Animal Registration & Relational Integrity
- [x] **Post New Animal Verification (Red Panda)**
  - Successfully verified the entire `Route -> Service -> Repo` flow using complex test case data for a "Red Panda".
  - **Atomic Transactions**: Confirmed that `animalRepo.createWithRelations` correctly creates records across 5 tables (`animals`, `animal_descriptions`, `animal_images`, `dataset_animals`, `_animalsTotags`) in a single transaction.
  - **Relational Integrity**: Verified that detailed stats (diet, lifespan, speed, etc.), descriptions, and tags are accurately persisted and linked to the core animal record.
  - [x] **Tag Auto-Resolution**: Confirmed that the tagging system correctly identifies and links existing tags (e.g., "Cute") during the registration process.
### Admin: Taxonomy Optimization & Inventory Management
- [x] **Taxonomic Data Expansion**
  - Added **Genus** and **Order** fields to the registration pipeline.
  - **Logical Consolidation**: Synced the `ordo` database column with the "Diet Type" input to reduce redundancy while maintaining scientific data structure.
- [x] **Admin Species Inventory (Archive)**
  - Developed a premium **Species Inventory** management page (`/admin/animals`).
  - **Search & Filter**: Implemented a real-time search bar for species discovery.
  - **Dynamic Sorting**: Built interactive table headers supporting **ASC/DESC** sorting by name and scientific name.
  - **Pagination**: Integrated an 8-entry-per-page pagination system for scalable archive browsing.
- [x] **UI/UX Hardening & Bug Fixes**
  - **Media Picker Submit Fix**: Resolved a critical bug where mode-switching buttons in the media picker would accidentally trigger form submission.
  - **Public Detail Enrichment**: Updated the `AnimalHeader` and `TaxonomyGrid` to prioritize Diet Type as a primary classification badge.
  - **Navigation Sync**: Updated the Admin Sidebar and Dashboard to correctly link to the new management archive.

## 2026-05-11
### Admin: Central Dashboard & Animal Tagging System
- [x] **Admin Dashboard Implementation**
  - Architected a central `/admin` landing page with premium interactive cards for "Register Animal", "Quiz Management", and "Species Archive".
  - Refined the `AdminSidebar` to provide a persistent "Dashboard" anchor while differentiating "Public Dashboard" links.
- [x] **Animal Tagging System (Pinterest-style)**
  - **Database & Schema**: Introduced the `tags` model with a many-to-many relationship to `animals`.
  - **Tag Normalization**: Implemented a backend `tagRepo` with auto-slugification and case-insensitive matching to prevent duplicate tags like "Cute" vs "cute".
  - **Dynamic Tag Input**: Developed `AnimalTagCard.tsx`, a specialized form component for adding/removing tags on-the-fly.
  - **Public Badges**: Integrated dynamic tag rendering into the `AnimalHeader` using custom color tokens.
- [x] **Species Edit Capability**
  - Created the `/admin/animals/[id]/edit` page, enabling full administrative control over existing records.
  - Refactored `AnimalForm.tsx` to handle both **Create (POST)** and **Update (PATCH)** modes seamlessly.
  - Implemented `animalRepo.updateWithRelations` to manage atomic updates of descriptions, media, and tags in a single transaction.
- [x] **Media Attribution & Source Tracking**
  - Added `source` fields to the `animal_images` model to track image provenance (e.g., Wikipedia, Admin Upload).
  - Built an elegant attribution overlay in `AnimalImage.tsx` that appears on hover/interaction in the public detail pages.
- [x] **Routing & API Stability**
  - Resolved a critical Next.js routing conflict between sibling `[id]` and `[slug]` folders in `/api/animals`.
  - Merged administrative `PATCH` logic into a unified `[slug]` route handler while maintaining strict ID validation.
  - Regenerated Prisma Client to resolve transient TypeScript `never` type inference issues on complex relational selects.

## 2026-05-08
### Frontend: Animal Admin System - Form Refactoring & UI Stability
- [x] **Component Modularization & Refactoring**
  - Deconstructed the monolithic `AnimalForm.tsx` (228 lines) into 6 specialized, co-located sub-components following the project's **FE Law (SRP)**.
  - **New Components**: `AnimalIdentityCard`, `AnimalDescriptionCard`, `AnimalCharacteristicsCard`, `AnimalClassificationCard`, `AnimalMediaCard`, and `AnimalFormActions`.
  - Reduced the main form orchestrator to ~70 lines of clean, readable code.
- [x] **Layout & UX Stability**
  - Widened the admin form container to **1200px** (`max-w-[1200px]`) for a more spacious and professional aesthetic.
  - Engineered a **Static Height Media Slot**: Implemented a fixed `480px` height for the `AnimalMediaCard` with internal flex-centering to eliminate layout jumps during media selection, database searching, and uploading.
  - Resolved horizontal jittering by implementing **`scrollbar-gutter: stable`** on the main form, ensuring the layout remains immovable regardless of dynamic content length.


## 2026-05-06
### Frontend: Admin Quiz System - Interactive Layout & UX Refinement
- [x] **Interactive Preview & Layout Editor**
  - Built a full-screen interactive modal for real-time layout adjustment within the admin form.
  - Implemented **Fit Strategy** (Cover/Contain) and **Position Panning** (X/Y sliders) for all quiz images.
  - Engineered a **URL Hash-based Storage** system (`#fit=cover&x=50&y=50`) to persist layout settings without database schema migrations.
- [x] **Quiz Gameplay & Media Integration**
  - Migrated `QuizPlayPage` from mock data to real database data fetching.
  - Fixed rendering of question media and option images across all patterns (`SinglePick`, `MultiPick`, `Silhouette`).
  - Added support for answer option thumbnails in `SinglePickQuestion` rendering.
- [x] **Advanced Form UX & Validation**
  - Implemented **Dirty State Tracking**: The "Update" button now intelligently stays disabled until a change is detected.
  - Fixed `isDirty` detection for programmatic `setValue` calls in checkboxes and media pickers.
  - Enhanced **Multi-Pick Logic**:
    - Enforced exactly **3, 6, or 9** options to maintain perfect 3-column grid consistency.
    - Required at least one wrong answer to ensure valid quiz challenges.
  - Added a **Real-time Info Bar** in the Answer Options section with a dynamic counter and validity feedback.
- [x] **Resilience & Polish**
  - Added **Broken Image Fallbacks** in Media Picker search results to handle failed or missing ImgBB assets.
  - Synchronized `isCorrect` logic to automatically manage single vs multi-choice selection states.

## 2026-05-04
### Frontend: Quiz Architecture & Progression System
- [x] **Component Modularization & Refactoring**
  - Restructured `src/components/features/quiz/` into functional subdirectories: `play/`, `ready/`, `result/`, and `shared/`.
  - Extracted monolithic page logic from `/ready` and `/result` into granular components (`ReadyCard`, `ResultHero`, `PerformanceSummary`, `LevelProgress`, `ResultActions`).
- [x] **Dynamic Multi-Level Content**
  - Developed a `questionsByLevel` mapping with unique question sets for **Easy**, **Normal**, and **Hard** difficulty.
  - Integrated level-based routing logic to serve distinct content based on the `[level]` parameter.
- [x] **Stateful Session Tracking**
  - Implemented `questionResults` state in `QuizPlayPage` to track real-time correctness of each answer.
  - Synchronized results with the `/result` page via JSON query parameters to enable dynamic performance feedback.
- [x] **Persistent Progression & Level Unlocking**
  - Engineered a dual-key `localStorage` system:
    - `zoosite_unlocked_levels`: Manages access control and card states in the Hub.
    - `zoosite_completed_levels`: Drives the progress bar, rank progression, and card checkmarks.
  - Implemented auto-unlocking logic: Scoring 3/3 on a level unlocks the next difficulty tier.
- [x] **Progress Management & UX**
  - Added a **"Reset Progress"** feature in the Quiz Hub to clear all saved results and lock levels.
  - Refined the Hub UI to show real-time progress (0% to 100%) and "Completed" badges for each tier.
- [x] **Bug Fixes & Polish**
  - Resolved TypeScript `Variants` typing errors in newly extracted components.
  - Fixed `useRouter` and icon reference errors caused by component migration.

## 2026-05-03
### Frontend: Zoo Mastermind Quiz UI (Full-Page Journey)
- [x] **Full-Page Quiz Architecture**
  - Architected a standalone, modal-free quiz flow: **Hub ➔ Confirmation ➔ Play ➔ Results**.
  - Implemented dynamic routes under `/quiz` with full-viewport layouts (`min-h-screen`) and deep jungle aesthetic.
- [x] **Interactive Question Primitives**
  - Developed a suite of reusable features in `src/components/features/quiz/`:
    - **SinglePickQuestion**: Immediate reveal with shake/glow feedback.
    - **MultiPickQuestion**: Grid-based multi-selection with "Submit" logic and dashed-border highlight for missed answers.
    - **SilhouetteQuestion**: CSS-driven `brightness-0` masking with smooth image reveals upon answering.
- [x] **UX & Animation Suite**
  - Integrated `framer-motion` for page transitions and staggered entrance animations.
  - Implemented `canvas-confetti` celebrations for perfect (3/3) scores.
  - Built a sticky `QuizTopBar` with an integrated "slide-down" quit confirmation banner.
- [x] **Dashboard Integration**
  - Created a premium `QuizNav` featured banner with shimmer hover effects.
  - Replaced "Explore by Region" on the main dashboard with the new Quiz entry point to drive user engagement.
- [x] **Type Safety & Refinement**
  - Fixed TypeScript compatibility issues with Framer Motion `Variants` in the results component.
  - Synchronized global CSS with new `shimmer` animation keyframes.

## 2026-05-02
### Frontend: Admin Media Picker System
- [x] **Hybrid MediaPicker Implementation**
  - Created a dual-purpose component supporting **Archive Search** (integrated) and **ImgBB Upload** (standalone).
  - Implemented **Automatic Mode Switching**: Search only for Answers, Upload only for Recognition Questions, and Search only for Regular Questions.
  - Developed a **Zero-Tab UI** that hides the switcher when only one mode is allowed to save vertical space.
- [x] **State Management: Recent Assets Store**
  - Built a session-wide Zustand store to cache recently uploaded/selected images.
  - Solves redundancy by allowing admins to upload an image once and reuse it across multiple answer options.
- [x] **Data Integrity & UX**
  - Added "Add New Animal" CTA when search results are empty to encourage database-first management.
  - Implemented real-time ImgBB upload integration via a new secure API route.

## 2026-04-30
### Backend: Regular Quiz Engine & Architecture
- [x] **Quiz System Design & Documentation**
  - Organized quiz documentation into a modular structure: `/docs/quiz/regular/` and `/docs/quiz/kids/`.
  - Defined the **"Pattern x Logic" Strategy** for generating infinite quiz variations from database data.
  - Created a bank of 27 example questions categorized by level (Easy, Normal, Hard) and UI pattern.
- [x] **Database: Quiz Bank Schema**
  - Updated `schema.prisma` with new models: `quiz_questions` and `quiz_options`.
  - Implemented enums for `QuizLevel` and `QuizPattern` (Single Pick, Multi Pick, Image Recognition).
  - Successfully synced database via `npx prisma db push`.
- [x] **Clean Architecture Implementation**
  - **Validation**: Created `quiz.schema.ts` with Zod schemas for question creation and answer verification.
  - **Repository**: Built `quiz.repo.ts` to handle complex selects (hiding answers from users) and atomic transactions.
  - **Service**: Implemented `quiz.service.ts` with Set-based verification logic for single/multi-choice support.
- [x] **API Development & Documentation**
  - Implemented 5 secure API routes for both User (fetch/verify) and Admin (CRUD) operations.
  - Fully integrated the new Quiz endpoints into the **Swagger UI** (`src/lib/swagger.ts`).
- [x] **Verification**
  - Verified the entire flow (Create -> Fetch -> Verify -> Delete) using a custom test script.
  - Confirmed 0 errors/warnings in the production build.
### Frontend: Admin Quiz UI
- [x] **Static Dashboard Implementation**
  - Created `/admin/quiz` (Question Bank) and `/admin/quiz/create` (Create Question form).
  - Designed the UI matching the ZooSite forest-green palette (`#2d5a27`, `#154212`).
- [x] **Component Architecture**
  - Extracted `AdminLayout`, `AdminSidebar`, and `AdminTopbar` for consistent internal navigation.
  - Deconstructed complex form into modular features: `PromptSection`, `AnswerOptionsSection`, `QuestionPropertiesCard`, etc.
- [x] **Animal Image Picker (Completed)**
  - Replaced standard media URL inputs with a searchable/uploadable `MediaPicker`.
  - Implemented session-wide "Recent Assets" to prevent redundant uploads.


## 2026-04-27
### Frontend & Backend: Live Search & Species Archive
- [x] **Animal Search Feature & Autocomplete Dropdown**
  - Upgraded the mock hero search input into a client state handler in `src/components/features/dashboard/hero-search.tsx`.
  - Implemented debounced fetching with a 300ms delay to extract real-time results from backend API queries.
- [x] **Standalone `/animals` Route Groupings**
  - Assembled dynamic archive templates yielding results sequentially using pre-vetted custom token frameworks.
- [x] **Relational Filter Capabilities**
  - Updated validation types to match strict query patterns effectively.

## 2026-04-24
### Discovery & Image System Enhancements
- [x] **Animal Redirection & UX**
  - Linked trending slider cards to `/animals/[slug]` detail pages.
  - Implemented 10-minute inactivity refresh logic to ensure stale discovery data is updated upon user return.
- [x] **Performance: Server-Side Caching**
  - Integrated `unstable_cache` for trending animal data with a 300-second (5-min) revalidation period.
  - Added "Last updated" timestamps to the UI for cache transparency and testing.
- [x] **Architecture: Local Image Integration**
  - Centralized image directory and extension logic in `src/lib/constants.ts` and `src/lib/image-utils.ts`.
  - Migrated entire app to use local images from `D:\CHAKKSSS\downloadImages\images` via the `/api/animals/[slug]/image` endpoint.
  - Updated all API mappers and server actions to replace remote URLs/placeholders with local API paths.
- [x] **UI/UX: Detail Page Refinement**
  - Standardized animal detail images to **584x452** with a fixed aspect ratio.
  - Optimized `AnimalDetailPage` width to **1440px** with a responsive 2-column grid to minimize vertical scrolling.
  - Refactored `ImageWithSkeleton` to be more flexible, removing hardcoded dimensions to support custom container sizes.

## 2026-04-21
### Frontend: Dashboard Navigation & UX Refinement
- [x] **Collapsible Sidebar Implementation**
  - Added interactive hide/show functionality to the `SideNavBar` with smooth CSS transitions.
  - Implemented a floating "Show" button (`SidebarToggleButton`) that appears at the left edge when the sidebar is hidden.
  - Optimized the appearance delay (`delay-300`) to ensure the show button only renders after the sidebar has fully exited the viewport.
- [x] **Architecture: Sidebar Modularization**
  - Refactored `SideNavBar.tsx` from a monolithic component into a dedicated directory `src/components/dashboard/sidenav/`.
  - Separated the sidebar body and the floating toggle button into independent, reusable components.
- [x] **Layout & Responsive Fixes**
  - Synchronized `TopNavBar` content with the sidebar state: added a shifting animation (`lg:pl-64`) to prevent the dashboard title from being cut off when the sidebar is open.
  - Adjusted z-index hierarchy (`SideNavBar` at z-50 vs `TopNavBar` at z-30) to ensure a clean visual overlap.


## 2026-04-15
### Architecture: Animal Detail Modularization
- [x] **Refactored Animal Detail Page**
  - Deconstructed the monolithic page component into a modular suite of reusable components.
  - **Extracted Data Layer:** Moved Prisma queries and data mapping logic to domain-based files under `src/lib/actions/` (e.g., `animal.ts`).
  - **Action Organization:** Implemented a service-oriented structure for server actions with a barrel export for clean discovery.
    - `AnimalHeader`, `AnimalImage`, `AnimalTaxonomyGrid`, `AnimalStatsGrid`, `AnimalHabitats`, `AnimalDistribution`, and `AnimalPredators`.
  - **Type Separation:** Centralized animal-related TypeScript interfaces in `src/types/animal.ts`.
  - **Barrel Export Pattern:** Simplified imports using an `index.ts` file in the `animal_details` directory.
- [x] **Verified Type Safety**
  - Aligned component prop types with Prisma's nullable database schema results.

## 2026-04-14
### Frontend: Advanced UI & UX Enhancements
- [x] **Created `AutoPagination` Component**
  - Developed a specialized client component for horizontal content pagination using CSS multi-column layouts.
  - Implemented logic to auto-calculate pages based on viewport height and content overflow.
  - Added interactive navigation controls (left/right arrows) and visual dot indicators.
- [x] **Animal Detail Page UX Overhaul**
  - Integrated `AutoPagination` into the animal detail view to prevent long vertical scrolling on mobile and desktop.
  - Applied `break-inside-avoid` to logical content blocks to ensure clean layout reflow.

## 2026-04-13
### Database & API: Region Images Integration
- [x] **Schema Introspection**
  - Pulled database schema changes to integrate the new `imageurl` column on the `regions` table.
- [x] **Updated `/api/dashboard/browse/region` API**
  - Included `r.imageurl as image_url` in the raw SQL query.
  - Refactored the query to return all distinct regions directly (removed previous continent aggregation logic).

### Frontend: UI Enhancements
- [x] **Redesigned Browse by Region Page (`/regions`)**
  - Migrated the data fetching mechanism to securely call the new internal Dashboard Region API endpoint.
  - Overhauled the interface using the new tailwind custom token aesthetic into a responsive grid of region cards.
  - Implemented dynamic rendering for `image_url` overlays, `top_habitat` badges, and distinct `animal_count` statistics directly into the card design.

## 2026-04-10
### Backend: API Refactoring
- [x] **Renamed `/api/dashboard/random` to `/api/dashboard/classes`**
  - Updated route directory, Swagger documentation, and automated tests.
- [x] **Enhanced `/api/dashboard/browse/region` API**
  - Integrated raw SQL query to calculate `animal_count` (distinct animals) and `top_habitat` (most frequent habitat) per region.
  - **Relational Aggregation:** Grouped sub-regions (e.g., "Central Africa", "West Africa") into main continents ("Africa") to provide a cleaner, consolidated dashboard view.
  - Updated API documentation and task tracker with new response structure.

### Frontend: Dashboard & Discovery Implementation
- [x] **Deconstructed HTML Template into Modular Components**
  - Created 10+ granular UI components under `src/components/dashboard/`.
  - Implemented `DashboardLayout` for persistent navigation.
- [x] **Implemented Browse by Region Flow**
  - Created `/regions` list and `/regions/[region]` detail pages.
  - Linked Dashboard cards to real regional discovery views.
- [x] **Implemented Animal Detail Page Flow**
  - Created dynamic `/animals/[slug]` page for taxonomic and descriptive discovery.

## 2026-04-09
### Database: Schema Introspection Update
- [x] **Prisma DB Pull** — Re-introspected `animal_site` database (14 models detected, `tempdata` auto-excluded)
- [x] **New table `animal_class`** — Contains 6 classes: Mammals, Birds, Reptiles, Fish, Insect, Amphibians
- [x] **New column `animals.class_id`** — UUID FK linking each animal to its class
- [x] **Schema Relations** — Manually added `animals.class_id` → `animal_class.id` relation in Prisma schema
- [x] **Removed `tempdata`** model from `schema.prisma`
- [x] **Regenerated Prisma Client**

### Backend: API Updates
- [x] **Updated `GET /api/animals/:slug`**
  - Added `animal_class` to the Prisma `include` block
  - Added `class` field to the `taxonomy` object in the response (e.g. `"class": "Mammals"`)
- [x] **Rewrote `GET /api/dashboard/classes` (previously `/random`)**
  - Changed from returning a single random animal to returning a list of all animal classes
  - Each class includes `id`, `name`, and `animal_count`
- [x] **Documentation**
  - Updated Swagger spec (`src/lib/swagger.ts`) with new endpoint descriptions
  - Updated `dashboard_apis.md` with new response examples
  - Updated `API_DOCS.md` with `class` field in taxonomy example

## 2026-04-08
### Backend: Dashboard APIs & Documentation
- [x] **Implemented Dashboard API Suite**
  - Created 8 modular routes under `/api/dashboard/` for Browse, Explore, Classes, Trending, and Stats.
  - **Relational Refactor:** Updated all habitat-related endpoints to use the new `habitat` model relationship.
  - **Browse:** Optimized `browse/habitat` using the `habitat` table directly with ascending name sorts.
  - **Explore:** Built relational queries for region and habitat animal extraction via nested joins.
  - **Stats:** Created lightweight aggregation endpoints for region/habitat counts and site-wide totals.
  - **Dynamic:** Implemented performant `ORDER BY random()` queries via raw SQL for Classes/Trending features.
- [x] **Integrated Swagger UI**
  - Added `swagger-ui-react` and `next-swagger-doc` dependencies.
  - Developed and verified interactive OpenAPI documentation at `/api-docs`.
- [x] **Database: Schema Sync & Maintenance**
  - **Relation Enrichment:** Manually injected `PRIMARY KEY` on `habitat` table and `FOREIGN KEY` constraints on `animal_environment(habitat_id)` to enable relational mapping.
  - Successfully ran `npx prisma db pull` and `prisma generate` to sync schema with recent DB transformations.
  - Cleaned up `schema.prisma` by removing the temporary `tempdata` model and enabling the `habitat` model.
- [x] **Documentation & Verification**
  - Re-formatted `dashboard_apis.md` to follow the project's standard template.
  - Verified 9/9 endpoints pass automatically with `test-dashboard-apis.mjs` against the new relational schema.
  - Successfully passed `npm run build` with all new integrations.

## 2026-04-03
### Backend: Animal Detail API Update
- [x] **Refactored `GET /api/animals/:slug`**
  - Replaced fragmented DB queries with a highly-efficient, single Prisma nested `include` operation.
  - Designed mapping function to transform DB results into a clean, frontend-ready nested JSON shape.
  - Flattened `habitats` and `images` arrays, and appropriately parsed data like `predators` within the new `stats` node.
- [x] **Repaired `POST /api/animals` Types**
  - Fixed TypeScript compiler errors driven by schema migrations.
  - Rewired `scientific_name` assignments to the core `animal_names` table.
  - Redirected `image` assignments from the deleted `animal_attributes` table to the `animals_image` table.
- [x] **Documentation**
  - Fully updated `API_DOCS.md` with the new structure output for `GET /api/animals/:slug`.

## 2026-04-02
### Database: Schema Introspection Update
- [x] **Prisma DB Pull** — Re-introspected `animal_site` database (11 models detected)
- [x] **Removed `tempdata`** model from `schema.prisma` (excluded per project policy)
- [x] **Regenerated Prisma Client** — `npx prisma generate` completed successfully
- [x] **DB Schema Enrichment (Primary & Foreign Keys)** 
  - [x] Manually injected `PRIMARY KEY (id)` rules to tables missing them (`animals_image`, `dataset_animals`, `animal_distributions`, `animal_environment`).
  - [x] Added rigorous `FOREIGN KEY` constraints via SQL, forcing relations from these auxiliary tables back to `animals(id)` with `ON DELETE CASCADE`.
  - [x] Formally mapped `countries(region_id)` → `regions(id)`.
  - [x] Stripped out Prisma `@@ignore` warnings from schema for full relational safety.
- [x] **Schema Changes Detected:**
  - **New tables:** `animal_distributions`, `animal_environment`, `countries`, `regions`
  - **Modified `animals`:** added `genus`, `ordo`; removed `scientific_name`
  - **Modified `animal_names`:** added `scientific_name` column
  - **Modified `animals_image`:** added `id` (PK), `animal_id`; removed `dataset_name`, `scientific_name`, `extract`
  - **Modified `dataset_animals`:** added `id` (PK), `animal_id`
  - **Removed `animal_attributes`** model (table no longer exists in DB)
- [x] **New Endpoint (`/api/animal-distributions`)**
  - [x] Created `GET /api/animal-distributions?name=` using raw SQL
  - [x] Joins `animal_distributions`, `countries`, `regions` and `animal_environment` to fetch aggregated geographic and habitat data
  - [x] Fixed stale TypeScript references to removed `animal_attributes` table across other routes
  - [x] Updated `API_DOCS.md` with new endpoint details

## 2026-03-26
### Frontend: Landing Page Migration & Enhancements
- [x] Analyze existing `design/landingPage.html`
- [x] Set up Next.js components and layout
- [x] Port HTML/CSS to Next.js
- [x] **Hero Carousel Enhancements**
  - [x] Implement interactive carousel logic
  - [x] Add smooth, layered animations (Fade-in/Slide-up)
  - [x] Adjust container to 16:9 aspect ratio (56.25vw)
  - [x] **YouTube Background Integration**
    - [x] Embed Lion YouTube clip (1080p, Autoplay, Muted)
    - [x] Embed Elephant YouTube clip (1080p, Autoplay, Muted)
    - [x] Embed Penguin YouTube clip (1080p, Autoplay, Muted)
    - [x] Add source attribution links for all creators
- [x] **Teaser Content Expansion**
  - [x] Fleshed out Sloth description with Ecological & Energy sections
- [x] **Stats Component Refinement**
  - [x] Replaced Tiger with Reticulated Giraffe for Savanna theme
  - [x] Differentiated conservation statuses (Vulnerable, Near Threatened, Endangered)
- [x] **Carousel Content Refresh**
  - [x] Replaced Sloth slide with Penguin to avoid section duplication

## 2026-03-24
### Backend: API Development & Integration
- [x] **API Routes Development**
  - [x] Create core route handlers: `animals`, `animal-names`, `animal-descriptions`, etc.
  - [x] Implement search filter by `?name=` parameter
  - [x] Implement global `?limit=` parameter support
  - [x] Create Master/Detail endpoint (`/api/animals/[slug]`)
- [x] **Integrations**
  - [x] Cloudinary setup and verification
  - [x] Prisma generation and client singleton setup
- [x] **Documentation**
  - [x] Created comprehensive `API_DOCS.md`

## 2026-03-23
### Discovery & Database Setup
- [x] **Database Integration**
  - [x] Initialize Prisma and configure `schema.prisma`
  - [x] Introspect `animal_site` PostgreSQL database
- [x] **Initial Project Setup**
  - [x] Scaffold Next.js project structure
