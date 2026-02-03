<script lang="ts">
  import { onMount } from 'svelte';
  import type { User } from '$lib/db/types';
  import { 
    Search, 
    Filter, 
    MoreHorizontal, 
    Loader2, 
    Mail,
    Shield,
    UserX,
    UserCheck,
    Download,
    Plus,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight
  } from 'lucide-svelte';
  
  let users = $state<User[]>([]);
  let loading = $state(true);
  let searchQuery = $state('');
  let selectedFilter = $state('all');
  let currentPage = $state(1);
  const itemsPerPage = 10;
  
  onMount(async () => {
    await loadUsers();
  });
  
  async function loadUsers() {
    try {
      const res = await fetch('/api/users');
      const json = await res.json() as { data: User[] };
      users = json.data || [];
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      loading = false;
    }
  }
  
  // Filter and search users
  let filteredUsers = $derived(() => {
    let result = users;
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query)
      );
    }
    
    // Apply filter
    if (selectedFilter !== 'all') {
      result = result.filter(u => u.provider === selectedFilter);
    }
    
    return result;
  });
  
  // Pagination
  let paginatedUsers = $derived(() => {
    const filtered = filteredUsers();
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  });
  
  let totalPages = $derived(() => Math.ceil(filteredUsers().length / itemsPerPage));
  
  function getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  
  function formatDate(timestamp: number | null): string {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
  
  function handlePageChange(page: number) {
    if (page >= 1 && page <= totalPages()) {
      currentPage = page;
    }
  }
</script>

<svelte:head>
  <title>Users | Studio</title>
</svelte:head>

<div class="p-6 lg:p-8 max-w-7xl mx-auto">
  <!-- Header -->
  <div class="mb-8">
    <div class="flex items-center gap-2 text-sm text-neutral-500 mb-2">
      <span>Management</span>
      <span>/</span>
      <span class="text-neutral-300">Users</span>
    </div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-display font-bold text-neutral-100">User Management</h1>
        <p class="text-neutral-500 mt-1">Manage and monitor user accounts in your system.</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-xl hover:bg-neutral-800 hover:border-neutral-700 transition-colors text-sm font-medium">
          <Download class="w-4 h-4" />
          Export
        </button>
        <button class="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-500 text-neutral-950 rounded-xl hover:bg-accent-400 transition-colors text-sm font-medium">
          <Plus class="w-4 h-4" />
          Add User
        </button>
      </div>
    </div>
  </div>
  
  <!-- Stats Row -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
    <div class="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <UserCheck class="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p class="text-2xl font-bold text-neutral-100">{users.length}</p>
          <p class="text-sm text-neutral-500">Total Users</p>
        </div>
      </div>
    </div>
    <div class="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
          <Shield class="w-5 h-5 text-accent-500" />
        </div>
        <div>
          <p class="text-2xl font-bold text-neutral-100">
            {users.filter(u => u.emailVerified).length}
          </p>
          <p class="text-sm text-neutral-500">Verified</p>
        </div>
      </div>
    </div>
    <div class="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Mail class="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p class="text-2xl font-bold text-neutral-100">
            {users.filter(u => u.provider === 'email').length}
          </p>
          <p class="text-sm text-neutral-500">Email Users</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Filters & Search -->
  <div class="bg-neutral-900/50 border border-neutral-800 rounded-2xl mb-6">
    <div class="p-4 border-b border-neutral-800 flex flex-col sm:flex-row gap-4">
      <!-- Search -->
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search users by name or email..."
          class="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
        />
      </div>
      
      <!-- Filter -->
      <div class="flex items-center gap-2">
        <div class="relative">
          <Filter class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <select
            bind:value={selectedFilter}
            class="pl-10 pr-8 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-300 focus:outline-none focus:border-neutral-600 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Providers</option>
            <option value="email">Email</option>
            <option value="google">Google</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Table -->
    {#if loading}
      <div class="flex items-center justify-center py-20">
        <Loader2 class="w-6 h-6 animate-spin text-accent-500" />
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-neutral-800/50 bg-neutral-900/30">
              <th class="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3 cursor-pointer hover:text-neutral-400 transition-colors">
                <div class="flex items-center gap-1">
                  User
                  <ArrowUpDown class="w-3 h-3" />
                </div>
              </th>
              <th class="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">
                Provider
              </th>
              <th class="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">
                Status
              </th>
              <th class="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3 cursor-pointer hover:text-neutral-400 transition-colors">
                <div class="flex items-center gap-1">
                  Joined
                  <ArrowUpDown class="w-3 h-3" />
                </div>
              </th>
              <th class="text-right text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800/50">
            {#each paginatedUsers() as user}
              <tr class="hover:bg-neutral-900/30 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    {#if user.avatar}
                      <img src={user.avatar} alt={user.name} class="w-10 h-10 rounded-xl ring-2 ring-neutral-800 object-cover" />
                    {:else}
                      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-sm font-bold text-neutral-950">
                        {getInitials(user.name)}
                      </div>
                    {/if}
                    <div>
                      <p class="font-medium text-neutral-200">{user.name}</p>
                      <p class="text-sm text-neutral-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800 text-neutral-400 capitalize">
                    {user.provider}
                  </span>
                </td>
                <td class="px-6 py-4">
                  {#if user.emailVerified}
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Active
                    </span>
                  {:else}
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      Pending
                    </span>
                  {/if}
                </td>
                <td class="px-6 py-4 text-sm text-neutral-500">
                  {formatDate(user.createdAt)}
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="p-2 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="5" class="px-6 py-16 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center">
                      <UserX class="w-6 h-6 text-neutral-500" />
                    </div>
                    <p class="text-neutral-500">No users found</p>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      {#if totalPages() > 1}
        <div class="px-6 py-4 border-t border-neutral-800 flex items-center justify-between">
          <p class="text-sm text-neutral-500">
            Showing <span class="text-neutral-300">{(currentPage - 1) * itemsPerPage + 1}</span> to <span class="text-neutral-300">{Math.min(currentPage * itemsPerPage, filteredUsers().length)}</span> of <span class="text-neutral-300">{filteredUsers().length}</span> users
          </p>
          <div class="flex items-center gap-2">
            <button
              onclick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              class="p-2 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            
            {#each Array(totalPages()) as _, i}
              {@const page = i + 1}
              {#if page === 1 || page === totalPages() || (page >= currentPage - 1 && page <= currentPage + 1)}
                <button
                  onclick={() => handlePageChange(page)}
                  class="w-8 h-8 rounded-lg text-sm font-medium transition-colors {currentPage === page ? 'bg-accent-500 text-neutral-950' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'}"
                >
                  {page}
                </button>
              {:else if page === currentPage - 2 || page === currentPage + 2}
                <span class="text-neutral-600">...</span>
              {/if}
            {/each}
            
            <button
              onclick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages()}
              class="p-2 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>
