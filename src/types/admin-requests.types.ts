// Types for Admin Requests feature

export interface RequestUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  is_request_banned: boolean;
  request_banned_until: string | null;
  rejections_reset_at: string | null;
}

export interface RequestDetail {
  id: string;
  request_type: "QUICK" | "FULL_DETAIL";
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";
  animal_name: string;
  image_url: string | null;
  image_public_id: string | null;
  scientific_name: string | null;
  synonyms: string | null;
  family: string | null;
  genus: string | null;
  ordo: string | null;
  class_id: string | null;
  description: string | null;
  description_source: string | null;
  diet: string | null;
  lifespan_years: string | null;
  weight_kg: string | null;
  height_cm: string | null;
  avg_speed_kmh: string | null;
  top_speed_kmh: string | null;
  social_structure: string | null;
  conservation_status: string | null;
  predators: string | null;
  tags: string[];
  countries: string[];
  habitats: string[];
  review_started: string | null;
  reject_reason: string | null;
  approved_animal_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  user: RequestUser;
  approved_animal?: {
    id: string;
    canonical_slug: string;
  } | null;
}

export interface AdminRequestsTableProps {
  initialRequests: RequestDetail[];
  classes: { id: string; name: string }[];
}