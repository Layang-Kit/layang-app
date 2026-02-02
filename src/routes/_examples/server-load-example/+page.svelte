<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  import { invalidate } from '$app/navigation';
  import { Trash2, RefreshCw, Users, Mail } from 'lucide-svelte';
  
  export let data: PageData;
  $: ({ users, emailUsers, totalUsers, loadedAt } = data);
  
  function refreshData() {
    invalidate('app:users');
  }
</script>

<div class="min-h-screen bg-gray-900 p-8">
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-blue-400 mb-2">Server Load Pattern</h1>
      <p class="text-gray-400">Data di-load DI SERVER, bukan dari browser!</p>
      <p class="text-sm text-gray-500 mt-1">Loaded at: {new Date(loadedAt).toLocaleString()}</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gray-800 rounded-xl p-6">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-500/20 rounded-lg">
            <Users class="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p class="text-gray-400">Total Users</p>
            <p class="text-2xl font-bold text-white">{totalUsers}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-800 rounded-xl p-6">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-500/20 rounded-lg">
            <Mail class="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p class="text-gray-400">Email Users</p>
            <p class="text-2xl font-bold text-white">{emailUsers.length}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex justify-center">
      <button on:click={refreshData} class="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition">
        <RefreshCw class="w-4 h-4" />
        Refresh Data
      </button>
    </div>
    
    <div class="bg-gray-800 rounded-xl overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-white">Users (Dari Server Load)</h2>
        <span class="text-xs text-gray-500">No API call needed!</span>
      </div>
      
      <div class="divide-y divide-gray-700">
        {#each users as user}
          <div class="px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p class="text-white font-medium">{user.name}</p>
                <p class="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <span class="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300 capitalize">{user.provider}</span>
              <form method="POST" action="?/deleteUser" use:enhance={() => {
                return async ({ result }) => {
                  if (result.type === 'success') invalidate('app:users');
                };
              }}>
                <input type="hidden" name="userId" value={user.id} />
                <button type="submit" class="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition">
                  <Trash2 class="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        {:else}
          <div class="px-6 py-12 text-center text-gray-500">No users found</div>
        {/each}
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
        <h3 class="text-red-400 font-semibold mb-3">❌ Pattern API (2 Request)</h3>
        <pre class="text-sm text-gray-400 overflow-x-auto"><code>// Page.svelte - Fetch dari browser
let users = [];

onMount(async () =&gt; {'{'}
  // Request 1: Ambil HTML page
  // Request 2: Fetch data dari API!
  const res = await fetch('/api/users');
  const data = await res.json();
  users = data.users;
{'}'});

// Loading state needed
{'{'}#if loading{'}'}
  &lt;Loading /&gt;
{'{'}:else{'}'}
  &lt;UsersList /&gt;
{'{'}\/if{'}'}</code></pre>
      </div>
      
      <div class="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
        <h3 class="text-green-400 font-semibold mb-3">✅ Server Load (1 Request)</h3>
        <pre class="text-sm text-gray-400 overflow-x-auto"><code>// +page.server.ts
export const load = async () =&gt; {'{'}
  // Langsung query DB di server!
  const users = await db.query.users.findMany();
  return {'{'} users {'}'};
{'}'};

// +page.svelte
export let data;

// Langsung render, no loading!
{'{'}#each data.users as user{'}'}
  &lt;UserCard /&gt;
{'{'}\/each{'}'}</code></pre>
      </div>
    </div>
    
    <div class="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
      <h3 class="text-blue-400 font-semibold mb-4">✨ Keuntungan Server Load:</h3>
      <ul class="space-y-2 text-gray-300">
        <li class="flex items-start gap-2"><span class="text-green-400">✓</span><span><strong>1 Request</strong> - Server render HTML lengkap dengan data</span></li>
        <li class="flex items-start gap-2"><span class="text-green-400">✓</span><span><strong>SEO Friendly</strong> - Google bisa index konten</span></li>
        <li class="flex items-start gap-2"><span class="text-green-400">✓</span><span><strong>No Loading State</strong> - User langsung lihat data</span></li>
        <li class="flex items-start gap-2"><span class="text-green-400">✓</span><span><strong>Type Safe</strong> - Data typed dari server</span></li>
        <li class="flex items-start gap-2"><span class="text-green-400">✓</span><span><strong>Secure</strong> - Bisa access secrets di server</span></li>
      </ul>
    </div>
  </div>
</div>
