# Dashboard API Documentation

This document outlines the API endpoints used by the Dashboard page. These are broken down into granular endpoints to support progressive loading of dashboard components.

Base URL (local): `http://localhost:3000`

---

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/browse/region` | Fetches a list of all available regions |
| GET | `/api/dashboard/browse/habitat` | Fetches a distinct list of all available habitats/ecosystems |
| GET | `/api/dashboard/explore/region` | Fetches the structured list of animals for a specific region |
| GET | `/api/dashboard/explore/habitat` | Fetches the structured list of animals for a specific habitat |
| GET | `/api/dashboard/classes` | Returns a list of all animal classes with animal counts |
| GET | `/api/dashboard/trending` | Fetches a trending list of 10 random animals |
| GET | `/api/dashboard/stats/animals-lived` | Fetches the count of animals living in a specific region or ecosystem |
| GET | `/api/dashboard/stats/totals` | Fetches the total counts for the site metrics (animals, regions, countries) |

---

## Endpoint Details

### `GET /api/dashboard/browse/region`
Fetches a complete list of all available regions from the database to display in the region navigation menu.

**Response Example:**
```json
[
  {
    "id": "uuid",
    "region_name": "Africa",
    "animal_count": 150,
    "top_habitat": "Savanna"
  }
]
```

---

### `GET /api/dashboard/browse/habitat`
Fetches a complete list of all distinct habitats/ecosystems from the database to display in the habitat navigation menu.
*(Note: Fetching the actual animals for a specific habitat will be handled by a separate API once the user clicks on a habitat).*

**Response Example:**
```json
[
  {
    "habitat": "Forest"
  }
]
```

---

### `GET /api/dashboard/explore/region`
Fetches the actual list of animals for a specific region once a user clicks on one of the regions from the navigation menu.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `region`  | string | Yes    | The name of the region to filter by (e.g., Africa) |

**Example Request:**
`GET /api/dashboard/explore/region?region=Africa`

**Response Example:**
```json
[
  {
    "id": "uuid",
    "name": "Lion",
    "imageUrl": "https://...",
    "habitats": ["Savanna", "Grassland"],
    "region": "Africa"
  }
]
```

---

### `GET /api/dashboard/explore/habitat`
Fetches the actual list of animals for a specific ecosystem/habitat once a user clicks on it.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `habitat` | string | Yes    | The name of the habitat to filter by (e.g., Forest) |

**Example Request:**
`GET /api/dashboard/explore/habitat?habitat=Forest`

**Response Example:**
```json
[
  {
    "id": "uuid",
    "name": "Tiger",
    "imageUrl": "https://...",
    "habitats": ["Forest", "Jungle"]
  }
]
```

---

### `GET /api/dashboard/classes`
Returns a list of all animal classes (e.g. Mammals, Birds, Reptiles) with the count of animals in each class.

**Response Example:**
```json
[
  {
    "id": "uuid",
    "name": "Mammals",
    "animal_count": 120
  },
  {
    "id": "uuid",
    "name": "Birds",
    "animal_count": 85
  }
]
```

---

### `GET /api/dashboard/trending`
Fetches a trending list of 10 random animals.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `detail`  | string | No     | If set to `full`, returns complete dataset physical attributes under a `stats` object |

**Example Requests:**
- Basic List: `GET /api/dashboard/trending`
- Full Details: `GET /api/dashboard/trending?detail=full`

**Response Example (Basic):**
```json
[
  {
    "id": "uuid",
    "name": "Kangaroo",
    "habitat": ["Grassland"],
    "ordo": "Diprotodontia",
    "imageUrl": "https://..."
  }
]
```

---

### `GET /api/dashboard/stats/animals-lived`
Fetches the count of animals living in a specific region or ecosystem.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `region`  | string | No*    | Filter count natively by a specific region |
| `habitat` | string | No*    | Filter count natively by a specific habitat |

*(Note: You must provide either `region` or `habitat` as a parameter)*

**Example Requests:**
- By Region: `GET /api/dashboard/stats/animals-lived?region=Africa`
- By Habitat: `GET /api/dashboard/stats/animals-lived?habitat=Wetland`

**Response Example:**
```json
{
  "count": 150
}
```

---

### `GET /api/dashboard/stats/totals`
Fetches the consolidated total counts for the site metrics (bottom of the dashboard).

**Response Example:**
```json
{
  "fullDataAnimalsCount": 4200,
  "totalRegions": 5,
  "totalCountries": 195
}
```

---

## Testing with Swagger API
The easiest way to test these endpoints interactive is via our Next.js visualizer. Simply open your browser while the dev server is active and navigate to:
**[http://localhost:3000/api-docs](http://localhost:3000/api-docs)** 
