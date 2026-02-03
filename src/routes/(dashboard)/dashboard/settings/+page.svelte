<script lang="ts">
  import { 
    Settings, 
    Bell, 
    Shield, 
    Database, 
    Globe, 
    Mail,
    Save,
    Loader2
  } from 'lucide-svelte';
  
  let saving = $state(false);
  
  const settingsSections = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Configure basic application settings',
      icon: Settings,
      settings: [
        { id: 'site_name', label: 'Site Name', type: 'text', value: 'Studio' },
        { id: 'site_description', label: 'Site Description', type: 'textarea', value: 'A modern admin dashboard built with SvelteKit' },
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage email and push notification preferences',
      icon: Bell,
      settings: [
        { id: 'email_notifications', label: 'Email Notifications', type: 'toggle', value: true },
        { id: 'new_user_alerts', label: 'New User Alerts', type: 'toggle', value: true },
        { id: 'security_alerts', label: 'Security Alerts', type: 'toggle', value: true },
      ]
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Configure security and authentication settings',
      icon: Shield,
      settings: [
        { id: 'two_factor', label: 'Require 2FA for Admin', type: 'toggle', value: false },
        { id: 'session_timeout', label: 'Session Timeout (hours)', type: 'number', value: 24 },
        { id: 'password_min_length', label: 'Min Password Length', type: 'number', value: 8 },
      ]
    },
  ];
  
  async function handleSave() {
    saving = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    saving = false;
  }
</script>

<svelte:head>
  <title>Settings | Studio</title>
</svelte:head>

<div class="p-6 lg:p-8 max-w-4xl mx-auto">
  <!-- Header -->
  <div class="mb-8">
    <div class="flex items-center gap-2 text-sm text-neutral-500 mb-2">
      <span>Management</span>
      <span>/</span>
      <span class="text-neutral-300">Settings</span>
    </div>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-display font-bold text-neutral-100">Settings</h1>
        <p class="text-neutral-500 mt-1">Manage your application preferences and configurations.</p>
      </div>
      <button 
        onclick={handleSave}
        disabled={saving}
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-500 text-neutral-950 rounded-xl hover:bg-accent-400 transition-colors text-sm font-medium disabled:opacity-50"
      >
        {#if saving}
          <Loader2 class="w-4 h-4 animate-spin" />
          Saving...
        {:else}
          <Save class="w-4 h-4" />
          Save Changes
        {/if}
      </button>
    </div>
  </div>
  
  <!-- Settings Sections -->
  <div class="space-y-6">
    {#each settingsSections as section}
      {@const Icon = section.icon}
      <div class="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-800 flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
            <Icon class="w-5 h-5 text-neutral-400" />
          </div>
          <div>
            <h3 class="font-semibold text-neutral-100">{section.title}</h3>
            <p class="text-sm text-neutral-500">{section.description}</p>
          </div>
        </div>
        
        <div class="p-6 space-y-6">
          {#each section.settings as setting}
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label for={setting.id} class="block text-sm font-medium text-neutral-300">
                  {setting.label}
                </label>
              </div>
              
              <div class="sm:w-64">
                {#if setting.type === 'toggle'}
                  <button
                    type="button"
                    aria-label="Toggle {setting.label}"
                    onclick={() => setting.value = !setting.value}
                    class="relative w-11 h-6 rounded-full transition-colors {setting.value ? 'bg-accent-500' : 'bg-neutral-700'}"
                  >
                    <span class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform {setting.value ? 'translate-x-5' : 'translate-x-0'}"></span>
                  </button>
                {:else if setting.type === 'textarea'}
                  <textarea
                    id={setting.id}
                    bind:value={setting.value}
                    rows="2"
                    class="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors resize-none"
                  ></textarea>
                {:else}
                  <input
                    id={setting.id}
                    type={setting.type === 'number' ? 'number' : 'text'}
                    bind:value={setting.value}
                    class="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                  />
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
  
  <!-- Info Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
    <div class="p-4 bg-neutral-900/30 border border-neutral-800 rounded-xl">
      <div class="flex items-center gap-3 mb-2">
        <Database class="w-5 h-5 text-neutral-500" />
        <span class="text-sm font-medium text-neutral-300">Database</span>
      </div>
      <p class="text-xs text-neutral-500">Cloudflare D1 (SQLite)</p>
      <p class="text-xs text-emerald-400 mt-1">Connected</p>
    </div>
    
    <div class="p-4 bg-neutral-900/30 border border-neutral-800 rounded-xl">
      <div class="flex items-center gap-3 mb-2">
        <Mail class="w-5 h-5 text-neutral-500" />
        <span class="text-sm font-medium text-neutral-300">Email Provider</span>
      </div>
      <p class="text-xs text-neutral-500">Resend</p>
      <p class="text-xs text-emerald-400 mt-1">Active</p>
    </div>
    
    <div class="p-4 bg-neutral-900/30 border border-neutral-800 rounded-xl">
      <div class="flex items-center gap-3 mb-2">
        <Globe class="w-5 h-5 text-neutral-500" />
        <span class="text-sm font-medium text-neutral-300">Region</span>
      </div>
      <p class="text-xs text-neutral-500">Auto (Edge)</p>
      <p class="text-xs text-neutral-400 mt-1">5 locations</p>
    </div>
  </div>
</div>
