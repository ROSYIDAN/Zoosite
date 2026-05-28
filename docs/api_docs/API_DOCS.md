# API Documentation

Base URL (local): `http://localhost:3000`

---

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/animals` | Returns paginated list of animals with optional diet filter |
| POST | `/api/animals` | Creates a new animal record with associated name, description, and image |
| GET | `/api/animal-attributes` | Returns all animal attributes (key/value pairs per animal) |
| GET | `/api/animal-descriptions` | Returns all animal description summaries |
| GET | `/api/animal-distributions` | Returns geographic and habitat data for an animal by name |
| GET | `/api/animal-names` | Returns animal name entries. Supports `?name=` for search. |
| GET | `/api/animals-image` | Returns image URLs and dataset info per animal |
| GET | `/api/audit-logs` | Returns all audit logs |
| GET | `/api/dataset-animals` | Returns the raw dataset with physical & habitat stats |

---

## Global Response Shapes

All animals endpoints follow a consistent response format:

| Type | Shape |
|------|-------|
| List | `{ data: T[], meta: { total: number, page: number, limit: number } }` |
| Single | `{ data: T }` |
| Created | `{ data: T }` (status 201) |
| Error | `{ error: string, code?: string, details?: ZodIssue[] }` |

---

## Endpoint Details

### `GET /api/animals`
Returns a paginated list of animals with optional diet filtering.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | `20` | Maximum number of records per page |
| `page` | integer | No | `1` | Page number (1-indexed) |
| `diet` | string | No | — | Filter by diet (e.g., 'carnivore', 'herbivore'). Partial, case-insensitive match. |

**Examples:**
- Default (page 1, limit 20): `GET /api/animals`
- Paginated: `GET /api/animals?page=2&limit=10`
- Filter by diet: `GET /api/animals?diet=carnivore`

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "bengal-fox",
      "name": "Bengal Fox",
      "scientific_name": "Vulpes bengalensis",
      "family": "Canidae",
      "class": "Mammals",
      "image": "https://..."
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10
  }
}
```

**Error Response (400 Validation):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "path": ["limit"],
      "message": "Number must be greater than 0"
    }
  ]
}
```

---

### `POST /api/animals`
Creates a new animal record and its associated details in a single transaction.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `scientific_name` | string | Yes | The official scientific name (unique, min 1 char) |
| `family` | string | No | The taxonomic family |
| `name` | string | No | The common name (stored with `type: "common"`) |
| `description` | string | No | A short summary (stored in `animal_descriptions`) |
| `image` | string (URL) | No | A valid URL for the primary image (stored in `animals_image`) |

**Example Request:**
```json
{
  "scientific_name": "Vulpes bengalensis",
  "family": "Canidae",
  "name": "Bengal Fox",
  "description": "Short description...",
  "image": "https://example.com/bengal-fox.jpg"
}
```

**Response Example (201 Created):**
```json
{
  "data": {
    "id": "uuid",
    "slug": null,
    "family": "Canidae",
    "created_at": "2024-03-27T11:00:00.000Z"
  }
}
```

**Error Response (400 Validation):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "path": ["scientific_name"],
      "message": "scientific_name is required"
    }
  ]
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "Record already exists",
  "code": "CONFLICT"
}
```

---

### `GET /api/animals/:slug`
**[Detail]** Returns full aggregated information for a single animal matched by `canonical_slug` in a clean, nested JSON structure.

This endpoint fetches the main `animals` record and performs necessary table joins to aggregate taxonomy, descriptions, names, habitats, geographic distribution, images, and physical stats.

**Route Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | The animal's canonical slug (validated, non-empty) |

**Response Example (200 OK):**
```json
{
  "data": {
    "id": "uuid",
    "slug": "bengal-fox",
    "taxonomy": {
      "class": "Mammals",
      "family": "Canidae",
      "genus": "Vulpes",
      "order": "Carnivora"
    },
    "names": [
      {
        "name": "Bengal Fox",
        "type": "common",
        "is_primary": true,
        "scientific_name": null
      }
    ],
    "descriptions": [
      {
        "summary": "Short description...",
        "source": "wikipedia"
      }
    ],
    "habitats": [
      "grassland"
    ],
    "distribution": [
      {
        "country": "India",
        "region": "South Asia",
        "flag": "🇮🇳"
      }
    ],
    "images": [
      "https://..."
    ],
    "stats": {
      "height_cm": "50",
      "weight_kg": "3",
      "lifespan_years": "10",
      "diet": "Omnivore",
      "predators": ["Wolves", "Eagles"],
      "avg_speed_kmh": "40",
      "top_speed_kmh": "60",
      "social_structure": "Pair",
      "offspring_per_birth": "4",
      "gestation_days": "53",
      "color": "sandy",
      "conservation_status": "Least Concern"
    }
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Animal not found",
  "code": "NOT_FOUND"
}
```

---

### `GET /api/animal-attributes`
Returns all records from the `animal_attributes` table.

**Response example:**
```json
[
  {
    "id": "uuid",
    "animal_id": "uuid",
    "key": "weight",
    "value": "190",
    "unit": "kg",
    "source": "dataset",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### `GET /api/animal-descriptions`
Returns all records from the `animal_descriptions` table.

**Response example:**
```json
[
  {
    "id": "uuid",
    "animal_id": "uuid",
    "summary": "The lion is a large cat of the genus Panthera...",
    "source": "wikipedia",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### `GET /api/animal-distributions`
Returns aggregated geographic (countries, regions) and environment (habitats) data for a specific animal.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Case-insensitive match on the primary common name of the animal |

**Example Request:**
`GET /api/animal-distributions?name=Serval`

**Response Example:**
```json
{
  "name": "Serval",
  "countries": [
    "Kenya",
    "Tanzania",
    "South Africa"
  ],
  "regions": [
    "East Africa",
    "Southern Africa"
  ],
  "habitats": [
    "savanna",
    "grassland",
    "wetland"
  ]
}
```

---

### `GET /api/animal-names`
Returns all records from the `animal_names` table. Supports optional filtering by name.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | Case-insensitive partial match on the animal name |

**Examples:**
- All names: `GET /api/animal-names`
- Search for lion: `GET /api/animal-names?name=lion`
- Search for panther: `GET /api/animal-names?name=panther`

**Response example:**
```json
[
  {
    "id": "uuid",
    "animal_id": "uuid",
    "name": "Lion",
    "type": "common",
    "is_primary": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### `GET /api/animals-image`
Returns all records from the `animals_image` table (raw SQL query).

**Response example:**
```json
[
  {
    "dataset_name": "lions",
    "scientific_name": "Panthera leo",
    "extract": "Short description...",
    "imageurl": "https://example.com/lion.jpg"
  }
]
```

---

### `GET /api/dataset-animals`
Returns all records from the `dataset_animals` table (raw SQL query).

**Response example:**
```json
[
  {
    "animal_name": "Lion",
    "height_cm": "120",
    "weight_kg": "190",
    "color": "golden",
    "lifespan_years": "15",
    "diet": "Carnivore",
    "habitat": "Savanna",
    "predators": "Humans",
    "avg_speed_kmh": "50",
    "countries_found": "Africa",
    "conservation_status": "Vulnerable",
    "family": "Felidae",
    "gestation_days": "110",
    "top_speed_kmh": "80",
    "social_structure": "Pride",
    "offspring_per_birth": "3"
  }
]
```

---

### `GET /api/audit-logs`
Returns all records from the `audit_logs` table.

**Response example:**
```json
[
  {
    "id": "uuid",
    "table_name": "animals",
    "record_id": "uuid",
    "action": "UPDATE",
    "old_data": null,
    "new_data": null,
    "changed_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Testing with Postman

1. Open Postman and create a new **GET** request.
2. Set the URL to any of the endpoints above (e.g., `http://localhost:3000/api/animals`).
3. Click **Send**.
4. You should receive a `200 OK` response with a JSON array.

> **Note:** Make sure the dev server is running with `npm run dev` before testing.
