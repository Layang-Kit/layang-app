<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { User, LayoutDashboard, Hexagon, Menu, X } from 'lucide-svelte';
  
  let mobileMenuOpen = false;
  
  $: isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].some(
    path => $page.url.pathname.startsWith(path)
  );
  
  $: isHomePage = $page.url.pathname === '/';
</script>

{#if isAuthPage}
  <slot />
{:else}
  <div class="min-h-screen flex flex-col grain">
    {#if !isHomePage}
      <header class="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50">
        <div class="container-wide">
          <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <a href="/" class="flex items-center gap-3 group">
              <div class="w-9 h-9 rounded-lg bg-accent-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Hexagon class="w-5 h-5 text-neutral-950" strokeWidth={2.5} />
              </div>
              <span class="font-display font-bold text-lg text-neutral-100 hidden sm:block">Studio</span>
            </a>
            
            <!-- Desktop Navigation -->
            <nav class="hidden md:flex items-center gap-1">
              <a 
                href="/dashboard" 
                class="nav-link {$page.url.pathname === '/dashboard' ? 'nav-link-active' : ''}"
              >
                <LayoutDashboard class="w-4 h-4 mr-2" />
                Dashboard
              </a>
              
              <a 
                href="/profile" 
                class="nav-link {$page.url.pathname === '/profile' ? 'nav-link-active' : ''}"
              >
                <User class="w-4 h-4 mr-2" />
                Profile
              </a>
            </nav>
            
            <!-- Mobile Menu Button -->
            <button
              class="md:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900 transition"
              on:click={() => mobileMenuOpen = !mobileMenuOpen}
            >
              <svelte:component this={mobileMenuOpen ? X : Menu} class="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <!-- Mobile Navigation -->
        {#if mobileMenuOpen}
          <nav class="md:hidden border-t border-neutral-800/50 bg-neutral-950/95 backdrop-blur-xl">
            <div class="container-wide py-3 space-y-1">
              <a 
                href="/dashboard" 
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors {$page.url.pathname === '/dashboard' ? 'text-neutral-100 bg-neutral-800' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'}"
                on:click={() => mobileMenuOpen = false}
              >
                <LayoutDashboard class="w-4 h-4" />
                Dashboard
              </a>
              
              <a 
                href="/profile" 
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors {$page.url.pathname === '/profile' ? 'text-neutral-100 bg-neutral-800' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'}"
                on:click={() => mobileMenuOpen = false}
              >
                <User class="w-4 h-4" />
                Profile
              </a>
            </div>
          </nav>
        {/if}
      </header>
    {/if}
    
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
