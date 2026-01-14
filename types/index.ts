// ===========================================
// Type Definitions
// ===========================================

// Database row types (matching Supabase schema)
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type PlanStatus = 'draft' | 'in_progress' | 'complete' | 'archived';
export type WorkingStyle = 'deep_focus' | 'rotational' | 'mixed' | null;

export interface Plan {
  id: string;
  user_id: string;
  title: string;
  status: PlanStatus;
  context_prompt_encrypted: string | null;
  working_style: WorkingStyle;
  minimum_income: number | null;
  ideal_income: number | null;
  enough_description_encrypted: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  last_accessed_at: string | null;
}

export interface Strength {
  id: string;
  plan_id: string;
  area: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export type AssetCategory = 'skill' | 'experience' | 'interest' | 'relationship' | 'value';

export interface Asset {
  id: string;
  plan_id: string;
  category: AssetCategory;
  name: string;
  description: string | null;
  created_at: string;
}

export type ConstraintCategory = 'financial' | 'legal' | 'health' | 'time' | 'geography' | 'other';

export interface Constraint {
  id: string;
  plan_id: string;
  category: ConstraintCategory;
  description_encrypted: string;
  is_controllable: boolean;
  created_at: string;
}

export type EnergyType = 'energizing' | 'draining' | 'discipline_required' | 'neutral';

export interface EnergyItem {
  id: string;
  plan_id: string;
  activity: string;
  energy_type: EnergyType;
  hours_per_week: number | null;
  notes: string | null;
  created_at: string;
}

export interface Pillar {
  id: string;
  plan_id: string;
  name: string;
  description: string | null;
  current_state: string | null;
  progress_definition: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ===========================================
// Decrypted types (for application use)
// ===========================================

export interface DecryptedPlan extends Omit<Plan, 'context_prompt_encrypted' | 'enough_description_encrypted'> {
  context_prompt: string | null;
  enough_description: string | null;
}

export interface DecryptedConstraint extends Omit<Constraint, 'description_encrypted'> {
  description: string;
}

// ===========================================
// Form input types
// ===========================================

export interface CreatePlanInput {
  title?: string;
}

export interface UpdatePlanInput {
  title?: string;
  status?: PlanStatus;
  context_prompt?: string;
  working_style?: WorkingStyle;
  minimum_income?: number;
  ideal_income?: number;
  enough_description?: string;
}

export interface CreateStrengthInput {
  plan_id: string;
  area: string;
  description?: string;
}

export interface CreateAssetInput {
  plan_id: string;
  category: AssetCategory;
  name: string;
  description?: string;
}

export interface CreateConstraintInput {
  plan_id: string;
  category: ConstraintCategory;
  description: string;
  is_controllable?: boolean;
}

export interface CreateEnergyItemInput {
  plan_id: string;
  activity: string;
  energy_type: EnergyType;
  hours_per_week?: number;
  notes?: string;
}

export interface CreatePillarInput {
  plan_id: string;
  name: string;
  description?: string;
  current_state?: string;
  progress_definition?: string;
}

// ===========================================
// API Response types
// ===========================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// ===========================================
// Auth types
// ===========================================

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
}

export interface Session {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// ===========================================
// UI State types
// ===========================================

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormState<T> extends LoadingState {
  data: T | null;
  isDirty: boolean;
}
