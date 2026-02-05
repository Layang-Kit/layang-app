// ============================================================================
// FORM ACTIONS PATTERN - Form submission langsung di server!
// ============================================================================
// 
// CARA KERJA:
// 1. User submit form (tanpa JavaScript!)
// 2. Form POST ke server action
// 3. Action process di server (validasi, DB, dll)
// 4. Return result → SvelteKit render result
// 5. Bisa juga redirect ke page lain
//
// KEUNTUNGAN:
// ✅ Works without JavaScript!
// ✅ 1 request untuk form submission
// ✅ No API endpoint needed
// ✅ Validation di server
// ✅ Secure (tidak expose logic ke browser)
//
// ============================================================================

import type { Actions, PageServerLoad } from './\$types';
import { users } from '\$lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '\$lib/auth/session';
import { hashPassword } from '\$lib/auth/password';
import { fail, redirect } from '@sveltejs/kit';

// Load function untuk ambil data awal
export const load: PageServerLoad = async ({ locals }) => {
  const usersList = await locals.db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    limit: 10
  });
  
  return { users: usersList };
};

// FORM ACTIONS - Handler untuk form submission
export const actions: Actions = {
  // Action: createUser
  // Form akan POST ke: /form-actions-example?/createUser
  createUser: async ({ request, locals }) => {
    // 1. Parse form data
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // 2. Validasi
    const errors: Record<string, string> = {};
    
    if (!name || name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!email || !email.includes('@')) {
      errors.email = 'Valid email required';
    }
    
    if (!password || password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    // Jika ada error, return 400 dengan errors
    if (Object.keys(errors).length > 0) {
      // fail() akan return error ke form
      return fail(400, {
        errors,
        values: { name, email } // Return values biar form tidak kosong
      });
    }
    
    // 3. Check email exists
    const existing = await locals.db.query.users.findFirst({
      where: eq(users.email, email)
    });
    
    if (existing) {
      return fail(409, {
        errors: { email: 'Email already registered' },
        values: { name, email }
      });
    }
    
    // 4. Create user
    try {
      const passwordHash = await hashPassword(password);
      
      await locals.db.insert(users).values({
        id: generateId(),
        name,
        email,
        passwordHash,
        provider: 'email'
      });
      
      // 5. Return success
      // Bisa juga redirect dengan: throw redirect(303, '/success');
      return {
        success: true,
        message: `User "${name}" created successfully!`
      };
      
    } catch (err) {
      return fail(500, {
        errors: { _form: 'Failed to create user' },
        values: { name, email }
      });
    }
  },
  
  // Action: deleteUser
  deleteUser: async ({ request, locals }) => {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    
    if (!userId) {
      return fail(400, { error: 'User ID required' });
    }
    
    try {
      await locals.db.delete(users).where(eq(users.id, userId));
      return { success: true, message: 'User deleted' };
    } catch (err) {
      return fail(500, { error: 'Failed to delete user' });
    }
  }
};
