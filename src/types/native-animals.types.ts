// Types for Native Animals feature

export interface NativeAnimalItem {
  id: string;
  slug: string;
  name: string;
  scientific_name: string | null;
  family: string | null;
  image: string;
  status: "NATIVE" | "ENDEMIC";
  region_name?: string | null;       // Geographic region within country
  province?: string | null;          // Province/state level
  locality?: string | null;          // Specific location (parks, reserves)
}

export interface Country {
  id: string;
  name: string;
  flag: string | null;
  region: string | null;
}

export interface NativeAnimalsData {
  animals: NativeAnimalItem[];
  country: Country | null;
}

export interface LocationFilters {
  regions: string[];
  provinces: string[];
  localities: string[];
}
