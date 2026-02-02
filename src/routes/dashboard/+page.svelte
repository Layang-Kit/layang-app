<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { User } from '$lib/db/types';
  import { 
    User as UserIcon, Database, ArrowRight, LogOut, 
    Settings, Users, Loader2, Shield, Hexagon, Mail
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

<div class="min-h-screen grain">
  <!-- Header -->
  <header class="border-b border-neutral-800/50 bg-neutral-950/50 backdrop-blur-xl">
    <div class="container-wide">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center">
            <Hexagon class="w-5 h-5 text-neutral-950" strokeWidth={2.5} />
          </div>
          <div>
            <h1 class="font-display font-bold text-lg text-neutral-100">Dashboard</h1>
            <p class="text-xs text-neutral-600">Overview</p>
          </div>
        </div>
        
        {#if user}
          <div class="flex items-center gap-3">
            <a 
              href="/profile" 
              class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-900 transition"
            >
              {#if user.avatar}
                <img src={user.avatar} alt={user.name} class="w-9 h-9 rounded-full ring-2 ring-neutral-800" />
              {:else}
                <div class="w-9 h-9 rounded-full bg-accent-500 flex items-center justify-center text-sm font-bold text-neutral-950">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              {/if}
              <div class="hidden sm:block text-left">
                <p class="text-sm font-medium text-neutral-200">{user.name}</p>
                <p class="text-xs text-neutral-600">{user.email}</p>
              </div>
            </a>
            
            <button
              on:click={handleLogout}
              class="p-2.5 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
              title="Logout"
            >
              <LogOut class="w-5 h-5" />
            </button>
          </div>
        {/if}
      </div>
    </div>
  </header>
  
  <!-- Main Content -->
  <main class="container-wide py-8">
    {#if loading}
      <div class="flex items-center justify-center py-20">
        <Loader2 class="w-8 h-8 animate-spin text-accent-500" />
      </div>
    {:else if user}
      <!-- Welcome -->
      <div class="mb-8">
        <h2 class="font-display text-display-sm text-neutral-100">
          Hello, {user.name.split(' ')[0]}
        </h2>
        <p class="text-neutral-500 mt-1">
          Here's what's happening with your account
        </p>
      </div>
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-neutral-800 flex items-center justify-center">
              <UserIcon class="w-5 h-5 text-neutral-400" />
            </div>
            <div>
              <p class="text-sm text-neutral-500">Profile Status</p>
              <p class="text-lg font-semibold text-neutral-100">
                {user.bio && user.location ? 'Complete' : 'Incomplete'}
              </p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-neutral-800 flex items-center justify-center">
              <Shield class="w-5 h-5 text-neutral-400" />
            </div>
            <div>
              <p class="text-sm text-neutral-500">Account Type</p>
              <p class="text-lg font-semibold text-neutral-100 capitalize">{user.provider}</p>
            </div>
          </div>
        </div>
        
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-neutral-800 flex items-center justify-center">
              <Users class="w-5 h-5 text-neutral-400" />
            </div>
            <div>
              <p class="text-sm text-neutral-500">Total Users</p>
              <p class="text-lg font-semibold text-neutral-100">{users.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <a 
          href="/profile" 
          class="card p-6 group hover:border-neutral-700 transition-all"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-11 h-11 rounded-xl bg-neutral-800 flex items-center justify-center group-hover:bg-accent-500/10 transition-colors">
                <Settings class="w-5 h-5 text-neutral-400 group-hover:text-accent-500 transition-colors" />
              </div>
              <div>
                <h3 class="font-semibold text-neutral-200">Edit Profile</h3>
                <p class="text-sm text-neutral-500">Update your information</p>
              </div>
            </div>
            <ArrowRight class="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 group-hover:translate-x-1 transition-all" />
          </div>
        </a>
        
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-neutral-800 flex items-center justify-center">
              <Database class="w-5 h-5 text-neutral-400" />
            </div>
            <div>
              <h3 class="font-semibold text-neutral-200">D1 Database</h3>
              <p class="text-sm text-neutral-500">Connected and running</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Users List -->
      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-800">
          <h3 class="font-display font-semibold text-neutral-100">All Users</h3>
        </div>
        
        {#if usersLoading}
          <div class="flex items-center justify-center py-12">
            <Loader2 class="w-6 h-6 animate-spin text-accent-500" />
          </div>
        {:else}
          <div class="divide-y divide-neutral-800/50">
            {#each users as u}
              <div class="px-6 py-4 flex items-center gap-4 hover:bg-neutral-900/30 transition">
                {#if u.avatar}
                  <img src={u.avatar} alt={u.name} class="w-10 h-10 rounded-full ring-2 ring-neutral-800" />
                {:else}
                  <div class="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center text-sm font-bold text-neutral-950">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                {/if}
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-neutral-100 truncate">{u.name}</p>
                  <p class="text-sm text-neutral-600 truncate">{u.email}</p>
                </div>
                <span class="text-xs px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-400 capitalize">
                  {u.provider}
                </span>
              </div>
            {:else}
              <div class="px-6 py-12 text-center text-neutral-600">
                No users found
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {:else}
      <div class="text-center py-20">
        <p class="text-neutral-500 mb-4">Please log in to view your dashboard</p>
        <a 
          href="/login" 
          class="btn-primary"
        >
          Go to Login
        </a>
      </div>
    {/if}
  </main>
</div>
