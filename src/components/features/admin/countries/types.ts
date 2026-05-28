export interface Region {
  id: string;
  region: string;
}

export interface Country {
  id: string;
  country: string;
  country_flag: string | null;
  region_id: string | null;
  regions?: {
    id: string;
    region: string;
  } | null;
}
