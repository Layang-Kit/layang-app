<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { User } from '$lib/db/types';
  import { 
    User as UserIcon, Database, ArrowRight, LogOut, 
    Settings, Users, Loader2, Shield 
  } from 'lucide-svelte';
  
  let user: User | null = null;
  let users: User[] = [];
  let loading = true;
  let usersLoading = true;
  
  onMount(async () => {
    await Promise.all([
      loadUser(),
      loadUsers()
    ]);
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
  
  async function loadUsers() {
    try {
      const res = await fetch('/api/users');
      const json = await res.json() as { data: User[] };
      users = json.data || [];
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      usersLoading = false;
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

<div class="min-h-screen bg-gray-900">
  <!-- Navigation -->
  <nav class="bg-gray-800 border-b border-gray-700">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a href="/" class="text-xl font-bold text-blue-400">SvelteKit D1</a>
          <span class="text-gray-600">/</span>
          <span class="text-white">Dashboard</span>
        </div>
        
        {#if user}
          <div class="flex items-center gap-4">
            <a 
              href="/profile" 
              class="flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              {#if user.avatar}
                <img src={user.avatar} alt={user.name} class="w-8 h-8 rounded-full" />
              {:else}
                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              {/if}
              <span class="hidden sm:inline">{user.name}</span>
            </a>
            
            <button
              on:click={handleLogout}
              class="p-2 text-gray-400 hover:text-red-400 transition"
              title="Logout"
            >
              <LogOut class="w-5 h-5" />
            </button>
          </div>
        {/if}
      </div>
    </div>
  </nav>
  
  <!-- Main Content -->
  <main class="container mx-auto px-4 py-8 max-w-6xl">
    {#if loading}
      <div class="flex items-center justify-center py-12">
        <Loader2 class="w-8 h-8 animate-spin text-blue-500" />
      </div>
    {:else if user}
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white">
          Welcome back, {user.name.split(' ')[0]}!
        </h1>
        <p class="text-gray-400 mt-2">
          Here's what's happening with your account.
        </p>
      </div>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gray-800 rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-500/20 rounded-lg">
              <UserIcon class="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p class="text-gray-400 text-sm">Profile Status</p>
              <p class="text-white font-semibold">
                {#if user.bio && user.location}
                  Complete
                {:else}
                  Incomplete
                {/if}
              </p>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-800 rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-green-500/20 rounded-lg">
              <Shield class="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p class="text-gray-400 text-sm">Account Type</p>
              <p class="text-white font-semibold capitalize">{user.provider}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-800 rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-purple-500/20 rounded-lg">
              <Users class="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p class="text-gray-400 text-sm">Total Users</p>
              <p class="text-white font-semibold">{users.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Action Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <a 
          href="/profile" 
          class="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition group"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition">
                <Settings class="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 class="text-white font-semibold">Edit Profile</h3>
                <p class="text-gray-400 text-sm">Update your information</p>
              </div>
            </div>
            <ArrowRight class="w-5 h-5 text-gray-500 group-hover:text-white transition" />
          </div>
        </a>
        
        <div class="bg-gray-800 rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-green-500/20 rounded-lg">
              <Database class="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 class="text-white font-semibold">D1 Database</h3>
              <p class="text-gray-400 text-sm">Connected and running</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Users Section -->
      <div class="bg-gray-800 rounded-xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-700">
          <h2 class="text-xl font-semibold text-white">All Users</h2>
        </div>
        
        {#if usersLoading}
          <div class="flex items-center justify-center py-8">
            <Loader2 class="w-6 h-6 animate-spin text-blue-500" />
          </div>
        {:else}
          <div class="divide-y divide-gray-700">
            {#each users as u}
              <div class="px-6 py-4 flex items-center gap-4">
                {#if u.avatar}
                  <img src={u.avatar} alt={u.name} class="w-10 h-10 rounded-full" />
                {:else}
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                {/if}
                <div class="flex-1">
                  <p class="text-white font-medium">{u.name}</p>
                  <p class="text-sm text-gray-400">{u.email}</p>
                </div>
                <span class="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300 capitalize">
                  {u.provider}
                </span>
              </div>
            {:else}
              <div class="px-6 py-8 text-center text-gray-500">
                No users found
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {:else}
      <div class="text-center py-12">
        <p class="text-gray-400 mb-4">Please log in to view your dashboard</p>
        <a 
          href="/login" 
          class="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Go to Login
        </a>
      </div>
    {/if}
  </main>
</div>
