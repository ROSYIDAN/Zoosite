// Types for the animal detail page and its child components

export interface AnimalTaxonomy {
  family: string | null;
  genus: string | null;
  order: string | null;
}

export interface AnimalStats {
  diet: string | null;
  lifespan_years: string | null;
  weight_kg: string | null;
  height_cm: string | null;
  avg_speed_kmh: string | null;
  top_speed_kmh: string | null;
  social_structure: string | null;
  conservation_status: string | null;
  predators: string[];
}

export interface AnimalDistribution {
  country: string | undefined;
  flag: string | null | undefined;
}

export interface AnimalData {
  name: string | null;
  scientific_name: string | null;
  taxonomy: AnimalTaxonomy;
  descriptions: { summary: string | null; source_url?: string | null }[];
  stats: AnimalStats | null;
  habitats: (string | null | undefined)[];
  distribution: AnimalDistribution[];
  images: string[];
  image_sources?: (string | null)[];
  image_photographers?: (string | null)[];
  tags: { name: string; color: string | null }[];
}
