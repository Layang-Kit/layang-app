<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';
  import { invalidate } from '$app/navigation';
  import { UserPlus, Trash2, CheckCircle, AlertCircle } from 'lucide-svelte';
  
  export let data: PageData;
  export let form: ActionData;
  
  // Extract errors for easier access
  $: errors = form?.errors as Record<string, string> | undefined;
  $: formError = errors?._form;
  $: nameError = errors?.name;
  $: emailError = errors?.email;
  $: passwordError = errors?.password;
  
  let creating = false;
  let showPassword = false;
</script>

<div class="min-h-screen bg-gray-900 p-8">
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-blue-400 mb-2">Form Actions Pattern</h1>
      <p class="text-gray-400">Form submission langsung ke server, tanpa API endpoint!</p>
    </div>
    
    {#if form?.success}
      <div class="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg flex items-center gap-3">
        <CheckCircle class="w-5 h-5" />
        {form.message}
      </div>
    {/if}
    
    {#if formError}
      <div class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg flex items-center gap-3">
        <AlertCircle class="w-5 h-5" />
        {formError}
      </div>
    {/if}
    
    <div class="bg-gray-800 rounded-xl p-6">
      <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <UserPlus class="w-5 h-5" />
        Create User (Form Action)
      </h2>
      
      <form method="POST" action="?/createUser" class="space-y-4" use:enhance={() => {
        creating = true;
        return async ({ result, update }) => {
          creating = false;
          if (result.type === 'success') {
            invalidate('app:users');
            update();
          }
        };
      }}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input type="text" name="name" value={form?.values?.name || ''} required class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none" placeholder="John Doe" />
            {#if nameError}
              <p class="text-red-400 text-sm mt-1">{nameError}</p>
            {/if}
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input type="email" name="email" value={form?.values?.email || ''} required class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none" placeholder="john@example.com" />
            {#if emailError}
              <p class="text-red-400 text-sm mt-1">{emailError}</p>
            {/if}
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <div class="relative">
            {#if showPassword}
              <input type="text" name="password" required minlength="8" class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none" placeholder="Min 8 characters" />
            {:else}
              <input type="password" name="password" required minlength="8" class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 outline-none" placeholder="Min 8 characters" />
            {/if}
            <button type="button" on:click={() => showPassword = !showPassword} class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {#if passwordError}
            <p class="text-red-400 text-sm mt-1">{passwordError}</p>
          {/if}
        </div>
        
        <button type="submit" disabled={creating} class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
          {#if creating}
            Creating...
          {:else}
            <UserPlus class="w-4 h-4" />
            Create User
          {/if}
        </button>
      </form>
    </div>
    
    <div class="bg-gray-800 rounded-xl overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-700">
        <h2 class="text-xl font-semibold text-white">Users</h2>
      </div>
      <div class="divide-y divide-gray-700">
        {#each data.users as user}
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
            <form method="POST" action="?/deleteUser" use:enhance={() => {return async ({ result }) => { if (result.type === 'success') invalidate('app:users'); };}}>
              <input type="hidden" name="userId" value={user.id} />
              <button type="submit" class="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition">
                <Trash2 class="w-4 h-4" />
              </button>
            </form>
          </div>
        {:else}
          <div class="px-6 py-8 text-center text-gray-500">No users found</div>
        {/each}
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
        <h3 class="text-red-400 font-semibold mb-3">❌ Pattern API (2 Request)</h3>
        <pre class="text-sm text-gray-400 overflow-x-auto"><code>// routes/api/users/+server.ts
export const POST = async (request) =&gt; {'{'}
  const body = await request.json();
  // ... validate & create user
  return json({'{'} success: true {'}'});
{'}'};

// +page.svelte
const handleSubmit = async () =&gt; {'{'}
  // Request 1: POST ke API
  const res = await fetch('/api/users', {'{'}
    method: 'POST',
    body: JSON.stringify(data)
  {'}'});
  // Request 2: Refresh data
  await refreshUsers();
{'}'};</code></pre>
      </div>
      
      <div class="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
        <h3 class="text-green-400 font-semibold mb-3">✅ Form Actions (1 Request)</h3>
        <pre class="text-sm text-gray-400 overflow-x-auto"><code>// +page.server.ts
export const actions = {'{'}
  createUser: async (request) =&gt; {'{'}
    const form = await request.formData();
    // ... validate & create user
    return {'{'} success: true {'}'};
  {'}'}
{'}'};

// +page.svelte
&lt;form method="POST" action="?/createUser"&gt;
  &lt;input name="name" /&gt;
  &lt;button type="submit"&gt;Create&lt;/button&gt;
&lt;/form&gt;</code></pre>
      </div>
    </div>
    
    <div class="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
      <h3 class="text-blue-400 font-semibold mb-4">✨ Keuntungan Form Actions:</h3>
      <ul class="space-y-2 text-gray-300">
        <li class="flex items-start gap-2"><span class="text-green-400">✓</span><span><strong>No JavaScript Required</strong> - Form works tanpa JS!</span></li>
        <li class="flex items-start gap-2"><span class="text-green-400">✓</span><span><strong>1 Request</strong> - Langsung ke server action</span></li>
        <li class="flex items-start gap-2"><span class="text-green-400">✓</span><span><strong>No API Endpoint</strong> - Tidak perlu buat /api/*</span></li>
        <li class="flex items-start gap-2"><span class="text-green-400">✓</span><span><strong>Progressive Enhancement</strong> - Tambah JS untuk UX lebih baik</span></li>
        <li class="flex items-start gap-2"><span class="text-green-400">✓</span><span><strong>Type Safe</strong> - ActionData typed</span></li>
        <li class="flex items-start gap-2"><span class="text-green-400">✓</span><span><strong>Secure</strong> - Logic tidak expose ke browser</span></li>
      </ul>
    </div>
    
    <div class="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
      <h3 class="text-purple-400 font-semibold mb-3">🚀 Progressive Enhancement</h3>
      <p class="text-gray-300 mb-4">Form Actions work tanpa JavaScript. Tapi dengan use:enhance, kita bisa tambahkan UX yang lebih baik:</p>
      <ul class="space-y-1 text-sm text-gray-400">
        <li>• Loading states</li>
        <li>• Prevent double submission</li>
        <li>• Handle result tanpa page reload</li>
        <li>• Optimistic updates</li>
      </ul>
    </div>
  </div>
</div>
