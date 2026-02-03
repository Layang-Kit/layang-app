<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { User } from '$lib/db/types';
  import AppSidebar from '$lib/components/AppSidebar.svelte';
  import { theme } from '$lib/stores/theme.svelte';
  
  let user = $state<User | null>(null);
  let loading = $state(true);
  
  onMount(async () => {
    theme.init();
    await loadUser();
  });
  
  async function loadUser() {
    try {
      const res = await fetch('/api/profile');
      
      if (res.status === 401) {
        goto('/login');
        return;
      }
      
      const data = await res.json() as { user: User };
      user = data.user;
    } catch (err) {
      console.error('Failed to load user:', err);
    } finally {
      loading = false;
    }
  }
  
  async function handleLogout() {
    try {
      await fetch('/auth/logout', { method: 'POST' });
      goto('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }
</script>

<div class="min-h-screen flex grain" style="background-color: var(--bg-primary);">
  <AppSidebar {user} onLogout={handleLogout} />
  
  <main class="flex-1 min-w-0 lg:ml-0 ml-0">
    {#if loading}
      <div class="flex items-center justify-center h-screen">
        <div class="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style="border-color: var(--accent-primary); border-top-color: transparent;"></div>
      </div>
    {:else if user}
      <div class="h-full">
        <slot />
      </div>
    {:else}
      <div class="flex items-center justify-center h-screen">
        <div class="text-center">
          <p style="color: var(--text-secondary);" class="mb-4">Please log in to access this page</p>
          <a href="/login" class="btn-primary">Go to Login</a>
        </div>
      </div>
    {/if}
  </main>
</div>
