-- ===========================================
-- Personal Strategic Plan - Row Level Security Policies
-- ===========================================
-- Run this AFTER schema.sql in your Supabase SQL Editor
-- These policies ensure users can only access their own data
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strengths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.constraints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pillars ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- PROFILES POLICIES
-- ===========================================

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Profiles are created by trigger, no direct insert policy needed
-- But we add one for edge cases
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ===========================================
-- PLANS POLICIES
-- ===========================================

-- Users can view their own plans
DROP POLICY IF EXISTS "Users can view own plans" ON public.plans;
CREATE POLICY "Users can view own plans"
    ON public.plans
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own plans
DROP POLICY IF EXISTS "Users can create own plans" ON public.plans;
CREATE POLICY "Users can create own plans"
    ON public.plans
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own plans
DROP POLICY IF EXISTS "Users can update own plans" ON public.plans;
CREATE POLICY "Users can update own plans"
    ON public.plans
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own plans
DROP POLICY IF EXISTS "Users can delete own plans" ON public.plans;
CREATE POLICY "Users can delete own plans"
    ON public.plans
    FOR DELETE
    USING (auth.uid() = user_id);

-- ===========================================
-- STRENGTHS POLICIES
-- ===========================================

-- Users can view strengths belonging to their plans
DROP POLICY IF EXISTS "Users can view own strengths" ON public.strengths;
CREATE POLICY "Users can view own strengths"
    ON public.strengths
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = strengths.plan_id
            AND plans.user_id = auth.uid()
        )
    );

-- Users can create strengths for their plans
DROP POLICY IF EXISTS "Users can create own strengths" ON public.strengths;
CREATE POLICY "Users can create own strengths"
    ON public.strengths
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = plan_id
            AND plans.user_id = auth.uid()
        )
    );

-- Users can update strengths belonging to their plans
DROP POLICY IF EXISTS "Users can update own strengths" ON public.strengths;
CREATE POLICY "Users can update own strengths"
    ON public.strengths
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = strengths.plan_id
            AND plans.user_id = auth.uid()
        )
    );

-- Users can delete strengths belonging to their plans
DROP POLICY IF EXISTS "Users can delete own strengths" ON public.strengths;
CREATE POLICY "Users can delete own strengths"
    ON public.strengths
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = strengths.plan_id
            AND plans.user_id = auth.uid()
        )
    );

-- ===========================================
-- ASSETS POLICIES
-- ===========================================

DROP POLICY IF EXISTS "Users can view own assets" ON public.assets;
CREATE POLICY "Users can view own assets"
    ON public.assets
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = assets.plan_id
            AND plans.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create own assets" ON public.assets;
CREATE POLICY "Users can create own assets"
    ON public.assets
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = plan_id
            AND plans.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update own assets" ON public.assets;
CREATE POLICY "Users can update own assets"
    ON public.assets
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = assets.plan_id
            AND plans.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete own assets" ON public.assets;
CREATE POLICY "Users can delete own assets"
    ON public.assets
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = assets.plan_id
            AND plans.user_id = auth.uid()
        )
    );

-- ===========================================
-- CONSTRAINTS POLICIES
-- ===========================================

DROP POLICY IF EXISTS "Users can view own constraints" ON public.constraints;
CREATE POLICY "Users can view own constraints"
    ON public.constraints
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = constraints.plan_id
            AND plans.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create own constraints" ON public.constraints;
CREATE POLICY "Users can create own constraints"
    ON public.constraints
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = plan_id
            AND plans.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update own constraints" ON public.constraints;
CREATE POLICY "Users can update own constraints"
    ON public.constraints
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = constraints.plan_id
            AND plans.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete own constraints" ON public.constraints;
CREATE POLICY "Users can delete own constraints"
    ON public.constraints
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = constraints.plan_id
            AND plans.user_id = auth.uid()
        )
    );

-- ===========================================
-- ENERGY ITEMS POLICIES
-- ===========================================

DROP POLICY IF EXISTS "Users can view own energy items" ON public.energy_items;
CREATE POLICY "Users can view own energy items"
    ON public.energy_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = energy_items.plan_id
            AND plans.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create own energy items" ON public.energy_items;
CREATE POLICY "Users can create own energy items"
    ON public.energy_items
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = plan_id
            AND plans.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update own energy items" ON public.energy_items;
CREATE POLICY "Users can update own energy items"
    ON public.energy_items
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = energy_items.plan_id
            AND plans.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete own energy items" ON public.energy_items;
CREATE POLICY "Users can delete own energy items"
    ON public.energy_items
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = energy_items.plan_id
            AND plans.user_id = auth.uid()
        )
    );

-- ===========================================
-- PILLARS POLICIES
-- ===========================================

DROP POLICY IF EXISTS "Users can view own pillars" ON public.pillars;
CREATE POLICY "Users can view own pillars"
    ON public.pillars
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = pillars.plan_id
            AND plans.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create own pillars" ON public.pillars;
CREATE POLICY "Users can create own pillars"
    ON public.pillars
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = plan_id
            AND plans.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update own pillars" ON public.pillars;
CREATE POLICY "Users can update own pillars"
    ON public.pillars
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = pillars.plan_id
            AND plans.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete own pillars" ON public.pillars;
CREATE POLICY "Users can delete own pillars"
    ON public.pillars
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.plans
            WHERE plans.id = pillars.plan_id
            AND plans.user_id = auth.uid()
        )
    );

-- ===========================================
-- VERIFICATION QUERIES
-- ===========================================
-- Run these to verify RLS is properly enabled

-- Check RLS status on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- List all policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ===========================================
-- RLS POLICIES COMPLETE
-- ===========================================
