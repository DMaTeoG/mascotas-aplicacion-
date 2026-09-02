export type ReportType = 'LOST' | 'FOUND' | 'ADOPTION';
export type SpeciesType = 'dog' | 'cat';
export type SizeType = 'small' | 'medium' | 'large' | 'extra_large';
export type GenderType = 'male' | 'female' | 'unknown';
export type StatusType = 'ACTIVE' | 'RESOLVED' | 'ADOPTED';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_joined?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
  message?: string;
}

export interface Pet {
  id: number;
  author?: number | null;
  author_detail?: User | null;
  title: string;
  report_type: ReportType;
  report_type_display?: string;
  species: SpeciesType;
  species_display?: string;
  breed: string;
  size: SizeType;
  gender: GenderType;
  primary_color: string;
  secondary_color?: string;
  pattern: string;
  distinctive_features?: string;
  zone_name: string;
  latitude?: number;
  longitude?: number;
  event_date: string;
  description: string;
  reward?: string;
  contact_name: string;
  contact_phone?: string;
  contact_email?: string;
  image_url: string;
  status: StatusType;
  status_display?: string;
  likes_count: number;
  created_at: string;
}

export interface MatchFactorsBreakdown {
  species_score: number;
  breed_score: number;
  color_score: number;
  size_gender_score: number;
  geo_score: number;
  distance_km: number;
  time_score: number;
  diff_hours: number;
}

export interface MatchResult {
  id: number;
  lost_pet: number | Pet;
  found_pet: number | Pet;
  lost_pet_detail?: Pet;
  found_pet_detail?: Pet;
  score_percent: number;
  confidence_level: 'ALTA' | 'MEDIA' | 'BAJA';
  explanation: string;
  factors_breakdown: MatchFactorsBreakdown;
  is_dismissed: boolean;
  created_at: string;
}

export interface AdoptionApplication {
  id?: number;
  pet: number;
  pet_detail?: Pet;
  applicant_user?: number | null;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  city: string;
  housing_type: string;
  has_other_pets: boolean;
  other_pets_description?: string;
  has_children: boolean;
  time_dedicated: string;
  experience_description: string;
  agree_to_home_visit: boolean;
  status?: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  created_at?: string;
}

export interface CommentItem {
  id?: number;
  pet: number;
  author_name: string;
  content: string;
  is_sighting: boolean;
  sighting_location?: string;
  created_at?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  notification_type: 'MATCH' | 'ADOPTION' | 'COMMENT' | 'SYSTEM';
  pet?: number;
  is_read: boolean;
  created_at: string;
}

export interface PetClaim {
  id: number;
  pet: number;
  pet_detail?: Pet;
  claimant?: number;
  claimant_detail?: User;
  proof_description: string;
  proof_image_url?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  status_display?: string;
  rescatista_notes?: string;
  created_at: string;
  updated_at?: string;
}

