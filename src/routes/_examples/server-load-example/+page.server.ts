// ============================================================================
// SERVER LOAD PATTERN - Data langsung di-load di server, tanpa API call!
// ============================================================================
// 
// CARA KERJA:
// 1. User request halaman
// 2. SvelteKit panggil load() function DI SERVER
// 3. load() query database langsung
// 4. Return data → SvelteKit render HTML dengan data sudah ada
// 5. Browser terima HTML lengkap (sudah ada datanya!)
//
// KEUNTUNGAN:
// ✅ 1 request saja
// ✅ SEO friendly (HTML lengkap)
// ✅ No loading state needed
// ✅ Type-safe (data typed di server)
// ✅ Bisa access secrets/env vars di server
//
// ============================================================================

import type { PageServerLoad } from './\$types';
import { users } from '\$lib/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

// Tipe data yang akan di-return
interface UserData {
  id: string;
  name: string;
  email: string;
  provider: string;
  createdAt: Date | null;
}

// LOAD FUNCTION - Jalan DI SERVER sebelum page di-render
export const load: PageServerLoad = async ({ locals, depends }) => {
  // 'depends' untuk invalidate data nanti
  depends('app:users');
  
  try {
    // LANGSUNG query database dari server!
    // Tidak perlu fetch ke API!
    const usersList = await locals.db.query.users.findMany({
      orderBy: (users, { desc }) => [desc(users.createdAt)],
      limit: 10
    });
    
    // Bisa juga query dengan filter
    const emailUsers = await locals.db.query.users.findMany({
      where: eq(users.provider, 'email')
    });
    
    return {
      // Data ini langsung available di +page.svelte sebagai 'data' prop!
      users: usersList as UserData[],
      emailUsers: emailUsers as UserData[],
      totalUsers: usersList.length,
      loadedAt: new Date().toISOString()
    };
    
  } catch (err) {
    console.error('Failed to load users:', err);
    throw error(500, 'Failed to load users');
  }
};

// Bisa juga export actions untuk form submission!
export const actions = {
  // POST /server-load-example?/deleteUser
  deleteUser: async ({ request, locals }) => {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    
    if (!userId) {
      return { success: false, error: 'User ID required' };
    }
    
    try {
      await locals.db.delete(users).where(eq(users.id, userId));
      return { success: true, message: 'User deleted' };
    } catch (err) {
      return { success: false, error: 'Failed to delete user' };
    }
  }
};
