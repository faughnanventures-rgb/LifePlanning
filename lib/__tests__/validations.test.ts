import {
  signInSchema,
  signUpSchema,
  createPlanSchema,
  updatePlanSchema,
  createStrengthSchema,
  createConstraintSchema,
  validateInput,
} from '@/lib/validations';

describe('Validation Schemas', () => {
  describe('signInSchema', () => {
    it('should validate valid sign in data', () => {
      const result = signInSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = signInSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const result = signInSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('signUpSchema', () => {
    it('should validate valid sign up data', () => {
      const result = signUpSchema.safeParse({
        email: 'test@example.com',
        password: 'Password1',
        fullName: 'John Doe',
      });
      expect(result.success).toBe(true);
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'short', // Too short
        'alllowercase1', // No uppercase
        'ALLUPPERCASE1', // No lowercase
        'NoNumbers', // No number
      ];

      weakPasswords.forEach((password) => {
        const result = signUpSchema.safeParse({
          email: 'test@example.com',
          password,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should accept valid passwords', () => {
      const validPasswords = [
        'Password1',
        'MySecure123',
        'Testing123!',
      ];

      validPasswords.forEach((password) => {
        const result = signUpSchema.safeParse({
          email: 'test@example.com',
          password,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should allow optional fullName', () => {
      const result = signUpSchema.safeParse({
        email: 'test@example.com',
        password: 'Password1',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('createPlanSchema', () => {
    it('should validate with default title', () => {
      const result = createPlanSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('My Strategic Plan');
      }
    });

    it('should validate custom title', () => {
      const result = createPlanSchema.safeParse({
        title: 'My 2024 Plan',
      });
      expect(result.success).toBe(true);
    });

    it('should reject too long titles', () => {
      const result = createPlanSchema.safeParse({
        title: 'a'.repeat(201),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updatePlanSchema', () => {
    it('should validate partial updates', () => {
      const result = updatePlanSchema.safeParse({
        status: 'in_progress',
      });
      expect(result.success).toBe(true);
    });

    it('should validate income values', () => {
      const result = updatePlanSchema.safeParse({
        minimum_income: 5000000, // $50,000 in cents
        ideal_income: 10000000, // $100,000 in cents
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const result = updatePlanSchema.safeParse({
        status: 'invalid_status',
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative income', () => {
      const result = updatePlanSchema.safeParse({
        minimum_income: -1000,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createStrengthSchema', () => {
    it('should validate valid strength', () => {
      const result = createStrengthSchema.safeParse({
        plan_id: '550e8400-e29b-41d4-a716-446655440000',
        area: 'Communication',
        description: 'I excel at written and verbal communication',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const result = createStrengthSchema.safeParse({
        plan_id: 'not-a-uuid',
        area: 'Communication',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createConstraintSchema', () => {
    it('should validate valid constraint', () => {
      const result = createConstraintSchema.safeParse({
        plan_id: '550e8400-e29b-41d4-a716-446655440000',
        category: 'financial',
        description: 'Limited savings, need income within 3 months',
        is_controllable: false,
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid category', () => {
      const result = createConstraintSchema.safeParse({
        plan_id: '550e8400-e29b-41d4-a716-446655440000',
        category: 'invalid_category',
        description: 'Some constraint',
      });
      expect(result.success).toBe(false);
    });

    it('should default is_controllable to false', () => {
      const result = createConstraintSchema.safeParse({
        plan_id: '550e8400-e29b-41d4-a716-446655440000',
        category: 'health',
        description: 'Managing chronic condition',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.is_controllable).toBe(false);
      }
    });
  });

  describe('validateInput helper', () => {
    it('should return success with data for valid input', () => {
      const result = validateInput(signInSchema, {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });

    it('should return errors for invalid input', () => {
      const result = validateInput(signInSchema, {
        email: 'invalid',
        password: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });
});
