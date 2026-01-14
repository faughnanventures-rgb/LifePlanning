'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { signInSchema, signUpSchema } from '@/lib/validations';

// ===========================================
// Auth Server Actions
// ===========================================
// Server actions are more secure than client-side API calls
// because they run entirely on the server

interface ActionResult {
  error?: string;
  success?: boolean;
}

/**
 * Sign in with email and password
 */
export async function signIn(formData: FormData): Promise<ActionResult> {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  // Validate input
  const validation = signInSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.errors[0]?.message ?? 'Invalid input' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  });

  if (error) {
    return {
      error:
        error.message === 'Invalid login credentials'
          ? 'Invalid email or password'
          : error.message,
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

/**
 * Sign up with email and password
 */
export async function signUp(formData: FormData): Promise<ActionResult> {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: (formData.get('fullName') as string) || undefined,
  };

  // Validate input
  const validation = signUpSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.errors[0]?.message ?? 'Invalid input' };
  }

  // Check password confirmation
  const confirmPassword = formData.get('confirmPassword') as string;
  if (validation.data.password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
    options: {
      data: {
        full_name: validation.data.fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'An account with this email already exists' };
    }
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

/**
 * Request password reset
 */
export async function requestPasswordReset(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;

  if (!email) {
    return { error: 'Email is required' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Update password (after reset)
 */
export async function updatePassword(formData: FormData): Promise<ActionResult> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || password.length < 8) {
    return { error: 'Password must be at least 8 characters' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}
