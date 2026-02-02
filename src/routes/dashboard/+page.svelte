<script lang="ts">
  import { onMount } from 'svelte';
  import type { User } from '$lib/db/types';
  
  let users: User[] = [];
  let loading = true;
  
  onMount(async () => {
    const res = await fetch('/api/users');
    const json = await res.json() as { data: User[] };
    users = json.data || [];
    loading = false;
  });
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-2xl font-bold">Users</h2>
    <a href="/" class="text-blue-400 hover:underline">← Back to Home</a>
  </div>
  
  {#if loading}
    <p class="text-gray-400">Loading...</p>
  {:else}
    <div class="space-y-2">
      {#each users as user}
        <div class="p-4 bg-gray-800 rounded flex justify-between items-center">
          <div>
            <p class="font-semibold">{user.name}</p>
            <p class="text-sm text-gray-400">{user.email}</p>
          </div>
          <span class="text-xs text-gray-500">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
          </span>
        </div>
      {:else}
        <p class="text-gray-500 text-center py-8">No users found</p>
      {/each}
    </div>
  {/if}
</div>
