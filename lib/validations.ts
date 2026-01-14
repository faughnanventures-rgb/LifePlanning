import { z } from 'zod';

// ===========================================
// Validation Schemas
// ===========================================
// Using Zod for runtime validation of inputs
// Always validate on the server, even if validated on client
// ===========================================

// -------------------------------------------
// Auth Schemas
// -------------------------------------------

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .max(255, 'Email is too long');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password is too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z.string().max(255, 'Name is too long').optional(),
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// -------------------------------------------
// Plan Schemas
// -------------------------------------------

export const planStatusSchema = z.enum(['draft', 'in_progress', 'complete', 'archived']);

export const workingStyleSchema = z.enum(['deep_focus', 'rotational', 'mixed']).nullable();

export const createPlanSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long')
    .default('My Strategic Plan'),
});

export const updatePlanSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  status: planStatusSchema.optional(),
  context_prompt: z.string().max(10000, 'Context is too long').optional(),
  working_style: workingStyleSchema.optional(),
  minimum_income: z.number().int().min(0).max(100000000).optional(),
  ideal_income: z.number().int().min(0).max(100000000).optional(),
  enough_description: z.string().max(5000, 'Description is too long').optional(),
});

// -------------------------------------------
// Strength Schemas
// -------------------------------------------

export const createStrengthSchema = z.object({
  plan_id: z.string().uuid('Invalid plan ID'),
  area: z.string().min(1, 'Area is required').max(200, 'Area is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
});

// -------------------------------------------
// Asset Schemas
// -------------------------------------------

export const assetCategorySchema = z.enum([
  'skill',
  'experience',
  'interest',
  'relationship',
  'value',
]);

export const createAssetSchema = z.object({
  plan_id: z.string().uuid('Invalid plan ID'),
  category: assetCategorySchema,
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
});

// -------------------------------------------
// Constraint Schemas
// -------------------------------------------

export const constraintCategorySchema = z.enum([
  'financial',
  'legal',
  'health',
  'time',
  'geography',
  'other',
]);

export const createConstraintSchema = z.object({
  plan_id: z.string().uuid('Invalid plan ID'),
  category: constraintCategorySchema,
  description: z.string().min(1, 'Description is required').max(2000, 'Description is too long'),
  is_controllable: z.boolean().default(false),
});

// -------------------------------------------
// Energy Item Schemas
// -------------------------------------------

export const energyTypeSchema = z.enum([
  'energizing',
  'draining',
  'discipline_required',
  'neutral',
]);

export const createEnergyItemSchema = z.object({
  plan_id: z.string().uuid('Invalid plan ID'),
  activity: z.string().min(1, 'Activity is required').max(200, 'Activity name is too long'),
  energy_type: energyTypeSchema,
  hours_per_week: z.number().min(0).max(168).optional(),
  notes: z.string().max(1000, 'Notes are too long').optional(),
});

// -------------------------------------------
// Pillar Schemas
// -------------------------------------------

export const createPillarSchema = z.object({
  plan_id: z.string().uuid('Invalid plan ID'),
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  current_state: z.string().max(2000, 'Current state is too long').optional(),
  progress_definition: z.string().max(2000, 'Progress definition is too long').optional(),
});

export const updatePillarSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  current_state: z.string().max(2000).optional(),
  progress_definition: z.string().max(2000).optional(),
  sort_order: z.number().int().min(0).optional(),
});

// -------------------------------------------
// Type Exports
// -------------------------------------------

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type CreateStrengthInput = z.infer<typeof createStrengthSchema>;
export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type CreateConstraintInput = z.infer<typeof createConstraintSchema>;
export type CreateEnergyItemInput = z.infer<typeof createEnergyItemSchema>;
export type CreatePillarInput = z.infer<typeof createPillarSchema>;
export type UpdatePillarInput = z.infer<typeof updatePillarSchema>;

// -------------------------------------------
// Validation Helper
// -------------------------------------------

export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors = result.error.errors.map((err) => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });
  
  return { success: false, errors };
}
