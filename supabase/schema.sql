-- ===========================================
-- Personal Strategic Plan - Database Schema
-- ===========================================
-- Run this FIRST in your Supabase SQL Editor
-- Then run rls-policies.sql
-- ===========================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- PROFILES TABLE
-- ===========================================
-- Extends Supabase auth.users with app-specific data
-- Created automatically when user signs up

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ===========================================
-- PLANS TABLE
-- ===========================================
-- Core table storing strategic plans

CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'My Strategic Plan',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'complete', 'archived')),
    
    -- Phase 1: Current State (encrypted fields stored as text)
    context_prompt_encrypted TEXT, -- What prompted this planning session
    working_style TEXT CHECK (working_style IN ('deep_focus', 'rotational', 'mixed', NULL)),
    
    -- Phase 3: Minimum Viable Stability
    minimum_income INTEGER, -- Stored in cents to avoid float issues
    ideal_income INTEGER,
    enough_description_encrypted TEXT, -- What "enough" means (sensitive)
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_plans_user_id ON public.plans(user_id);
CREATE INDEX IF NOT EXISTS idx_plans_status ON public.plans(status);
CREATE INDEX IF NOT EXISTS idx_plans_updated_at ON public.plans(updated_at DESC);

-- ===========================================
-- STRENGTHS TABLE
-- ===========================================
-- Areas where user feels strongest (Phase 1)

CREATE TABLE IF NOT EXISTS public.strengths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    area TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_strengths_plan_id ON public.strengths(plan_id);

-- ===========================================
-- ASSETS TABLE
-- ===========================================
-- Skills, interests, relationships, values inventory (Phase 1)

CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('skill', 'experience', 'interest', 'relationship', 'value')),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_plan_id ON public.assets(plan_id);
CREATE INDEX IF NOT EXISTS idx_assets_category ON public.assets(category);

-- ===========================================
-- CONSTRAINTS TABLE
-- ===========================================
-- Financial, legal, health, time, geography constraints (Phase 1)

CREATE TABLE IF NOT EXISTS public.constraints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('financial', 'legal', 'health', 'time', 'geography', 'other')),
    description_encrypted TEXT NOT NULL, -- Encrypted - contains sensitive info
    is_controllable BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_constraints_plan_id ON public.constraints(plan_id);

-- ===========================================
-- ENERGY ITEMS TABLE
-- ===========================================
-- Activities and their energy impact (Phase 2)

CREATE TABLE IF NOT EXISTS public.energy_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    activity TEXT NOT NULL,
    energy_type TEXT NOT NULL CHECK (energy_type IN ('energizing', 'draining', 'discipline_required', 'neutral')),
    hours_per_week DECIMAL(4,1), -- e.g., 10.5 hours
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_energy_items_plan_id ON public.energy_items(plan_id);

-- ===========================================
-- PILLARS TABLE
-- ===========================================
-- Strategic focus areas (Phase 4)

CREATE TABLE IF NOT EXISTS public.pillars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    current_state TEXT,
    progress_definition TEXT, -- What progress looks like
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pillars_plan_id ON public.pillars(plan_id);

-- ===========================================
-- UPDATED_AT TRIGGER FUNCTION
-- ===========================================
-- Automatically updates updated_at timestamp

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_plans_updated_at ON public.plans;
CREATE TRIGGER update_plans_updated_at
    BEFORE UPDATE ON public.plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pillars_updated_at ON public.pillars;
CREATE TRIGGER update_pillars_updated_at
    BEFORE UPDATE ON public.pillars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- PROFILE CREATION TRIGGER
-- ===========================================
-- Automatically creates a profile when a user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- SCHEMA COMPLETE
-- ===========================================
-- Now run rls-policies.sql to enable Row Level Security
