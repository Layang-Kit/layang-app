<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { User, LogIn, LayoutDashboard } from 'lucide-svelte';
  
  // Check if we're on an auth page (no nav needed)
  $: isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].some(
    path => $page.url.pathname.startsWith(path)
  );
  
  $: isHomePage = $page.url.pathname === '/';
</script>

{#if isAuthPage}
  <!-- Auth pages - no navigation -->
  <slot />
{:else}
  <!-- Regular pages with navigation -->
  <div class="min-h-screen bg-gray-900">
    {#if !isHomePage}
      <!-- Top Navigation -->
      <nav class="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <a href="/" class="flex items-center gap-2">
              <span class="text-xl font-bold text-blue-400">SvelteKit D1</span>
            </a>
            
            <!-- Navigation Links -->
            <div class="flex items-center gap-2">
              <a 
                href="/dashboard" 
                class="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition"
                class:bg-gray-700={$page.url.pathname === '/dashboard'}
                class:text-white={$page.url.pathname === '/dashboard'}
              >
                <LayoutDashboard class="w-4 h-4" />
                <span class="hidden sm:inline">Dashboard</span>
              </a>
              
              <a 
                href="/profile" 
                class="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition"
                class:bg-gray-700={$page.url.pathname === '/profile'}
                class:text-white={$page.url.pathname === '/profile'}
              >
                <User class="w-4 h-4" />
                <span class="hidden sm:inline">Profile</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    {/if}
    
    <!-- Main Content -->
    <main>
      <slot />
    </main>
    
    <!-- Footer (only on home page) -->
    {#if isHomePage}
      <footer class="bg-gray-800 border-t border-gray-700 py-8">
        <div class="container mx-auto px-4 text-center text-gray-400">
          <p>SvelteKit + Cloudflare D1 + Drizzle ORM Boilerplate</p>
          <p class="text-sm mt-2">Built with ❤️ for the community</p>
        </div>
      </footer>
    {/if}
  </div>
{/if}
