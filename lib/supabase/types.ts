// ===========================================
// Supabase Database Types
// ===========================================
// Auto-generated types can replace this file using:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      plans: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          status: 'draft' | 'in_progress' | 'complete' | 'archived';
          context_prompt_encrypted: string | null;
          working_style: 'deep_focus' | 'rotational' | 'mixed' | null;
          minimum_income: number | null;
          ideal_income: number | null;
          enough_description_encrypted: string | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
          last_accessed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          status?: 'draft' | 'in_progress' | 'complete' | 'archived';
          context_prompt_encrypted?: string | null;
          working_style?: 'deep_focus' | 'rotational' | 'mixed' | null;
          minimum_income?: number | null;
          ideal_income?: number | null;
          enough_description_encrypted?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
          last_accessed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          status?: 'draft' | 'in_progress' | 'complete' | 'archived';
          context_prompt_encrypted?: string | null;
          working_style?: 'deep_focus' | 'rotational' | 'mixed' | null;
          minimum_income?: number | null;
          ideal_income?: number | null;
          enough_description_encrypted?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
          last_accessed_at?: string | null;
        };
      };
      strengths: {
        Row: {
          id: string;
          plan_id: string;
          area: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          area: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          area?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      assets: {
        Row: {
          id: string;
          plan_id: string;
          category: 'skill' | 'experience' | 'interest' | 'relationship' | 'value';
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          category: 'skill' | 'experience' | 'interest' | 'relationship' | 'value';
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          category?: 'skill' | 'experience' | 'interest' | 'relationship' | 'value';
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      constraints: {
        Row: {
          id: string;
          plan_id: string;
          category: 'financial' | 'legal' | 'health' | 'time' | 'geography' | 'other';
          description_encrypted: string;
          is_controllable: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          category: 'financial' | 'legal' | 'health' | 'time' | 'geography' | 'other';
          description_encrypted: string;
          is_controllable?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          category?: 'financial' | 'legal' | 'health' | 'time' | 'geography' | 'other';
          description_encrypted?: string;
          is_controllable?: boolean;
          created_at?: string;
        };
      };
      energy_items: {
        Row: {
          id: string;
          plan_id: string;
          activity: string;
          energy_type: 'energizing' | 'draining' | 'discipline_required' | 'neutral';
          hours_per_week: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          activity: string;
          energy_type: 'energizing' | 'draining' | 'discipline_required' | 'neutral';
          hours_per_week?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          activity?: string;
          energy_type?: 'energizing' | 'draining' | 'discipline_required' | 'neutral';
          hours_per_week?: number | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      pillars: {
        Row: {
          id: string;
          plan_id: string;
          name: string;
          description: string | null;
          current_state: string | null;
          progress_definition: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          name: string;
          description?: string | null;
          current_state?: string | null;
          progress_definition?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          name?: string;
          description?: string | null;
          current_state?: string | null;
          progress_definition?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
