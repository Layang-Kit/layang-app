<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { Hexagon } from 'lucide-svelte';
  
  // Routes that use full-width layout without header
  let isDashboardRoute = $derived(
    page.url.pathname.startsWith('/dashboard') || 
    page.url.pathname === '/profile'
  );
  
  // Auth pages - completely clean layout
  let isAuthPage = $derived(
    ['/login', '/register', '/forgot-password', '/reset-password'].some(
      path => page.url.pathname.startsWith(path)
    )
  );
  
  // Home page - special layout with footer
  let isHomePage = $derived(page.url.pathname === '/');
</script>

{#if isAuthPage}
  <!-- Auth pages: Clean layout, no header/footer -->
  <slot />
{:else if isDashboardRoute}
  <!-- Dashboard routes: Managed by (dashboard) group layout -->
  <slot />
{:else}
  <!-- Public pages: Standard layout with header -->
  <div class="min-h-screen flex flex-col grain">
    <header class="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50">
      <div class="container-wide">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a href="/" class="flex items-center gap-3 group">
            <div class="w-9 h-9 rounded-lg bg-accent-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Hexagon class="w-5 h-5 text-neutral-950" strokeWidth={2.5} />
            </div>
            <span class="font-display font-bold text-lg text-neutral-100">Studio</span>
          </a>
          
          <!-- Navigation -->
          <nav class="flex items-center gap-1">
            <a 
              href="/login" 
              class="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Sign In
            </a>
            <a 
              href="/register" 
              class="px-4 py-2 text-sm font-medium bg-accent-500 text-neutral-950 rounded-lg hover:bg-accent-400 transition-colors"
            >
              Get Started
            </a>
          </nav>
        </div>
      </div>
    </header>
    
    <main class="flex-1">
      <slot />
    </main>
    
    {#if isHomePage}
      <footer class="border-t border-neutral-800/50 py-12">
        <div class="container-wide">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center">
                <Hexagon class="w-4 h-4 text-neutral-950" strokeWidth={2.5} />
              </div>
              <span class="font-display font-semibold text-neutral-200">Studio</span>
            </div>
            <p class="text-sm text-neutral-600">
              Crafted with precision
            </p>
          </div>
        </div>
      </footer>
    {/if}
  </div>
{/if}
