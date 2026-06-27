// Types for Native Animals feature

export interface NativeAnimalItem {
  id: string;
  slug: string;
  name: string;
  scientific_name: string | null;
  family: string | null;
  image: string;
  status: "NATIVE" | "ENDEMIC";
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