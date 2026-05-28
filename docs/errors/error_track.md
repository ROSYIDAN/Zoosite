# ZooSite Clean Architecture Error Registry

> **Last Updated**: May 27, 2026
> **Purpose**: This central registry catalogs, organizes, and links to common system errors, compatibility issues, and runtime failures. The tracking is divided into isolated files for each **Clean Architecture Layer** to ensure highly traceable debugging boundaries.

---

## 🏗️ Architectural Layer Overview & Trace Paths

Below is the dependency direction and request trace path for the application. Errors should be traced downwards (request flow) or upwards (response flow):

```mermaid
graph TD
    classDef client fill:#dcfce7,stroke:#16a34a,stroke-width:2px;
    classDef handler fill:#fee2e2,stroke:#dc2626,stroke-width:2px;
    classDef service fill:#fef9c3,stroke:#ca8a04,stroke-width:2px;
    classDef repo fill:#dbeafe,stroke:#2563eb,stroke-width:2px;
    classDef db fill:#f3f4f6,stroke:#4b5563,stroke-width:2px;

    UI[1. Client / UI Layer]:::client -->|Fetch HTTP JSON| API[2. Routing / HTTP Handler Layer]:::handler
    API -->|Validate DTO & Call| SVC[3. Service / Business Layer]:::service
    SVC -->|Invoke DB Access| REP[4. Repository Layer]:::repo
    REP -->|Run SQL via Prisma| DB[5. Database Layer]:::db

    click UI href "client_layer.md" "View Client Layer Errors"
    click API href "routing_layer.md" "View Routing Layer Errors"
    click SVC href "service_layer.md" "View Service Layer Errors"
    click REP href "repository_layer.md" "View Repository Layer Errors"
    click DB href "database_layer.md" "View Database Layer Errors"
```

---

## 📂 Layer Registry Indexes

Select a specific architectural layer directory to view dedicated logs, symptoms, exact trace paths, and resolution steps:

| Layer Number | Layer Name | Directory File Reference | Focus Area |
| :---: | :--- | :--- | :--- |
| **1** | **Client / UI Layer** | 🟢 [client_layer.md](file:///d:/CHAKKSSS/ZooSite/docs/errors/client_layer.md) | Browser UI, Client Fetches, Session Providers |
| **2** | **Routing & HTTP Handlers** | 🔴 [routing_layer.md](file:///d:/CHAKKSSS/ZooSite/docs/errors/routing_layer.md) | API Routes, NextAuth wrappers, Middleware routing |
| **3** | **Service / Business Layer** | 🟡 [service_layer.md](file:///d:/CHAKKSSS/ZooSite/docs/errors/service_layer.md) | Domain Logic, Zod Validation Schemas, Media/API Integrations |
| **4** | **Repository Layer** | 🔵 [repository_layer.md](file:///d:/CHAKKSSS/ZooSite/docs/errors/repository_layer.md) | Database Access, Prisma Client queries, Transactions |
| **5** | **Database Layer** | ⚪ [database_layer.md](file:///d:/CHAKKSSS/ZooSite/docs/errors/database_layer.md) | PostgreSQL Engine, local port `5432` bindings, migrations |
