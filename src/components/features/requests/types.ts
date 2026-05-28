export interface RequestUser {
  id: string;
  name: string | null;
  email: string;
}

export interface RequestDetail {
  id: string;
  request_type: "QUICK" | "FULL_DETAIL";
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";
  animal_name: string;
  image_url: string | null;
  image_public_id: string | null;
  scientific_name: string | null;
  review_started: string | null;
  reject_reason: string | null;
  approved_animal_id: string | null;
  created_at: string;
  updated_at: string;
  user: RequestUser;
  approved_animal?: {
    id: string;
    canonical_slug: string;
  } | null;
}
