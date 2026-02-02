<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    User, Mail, MapPin, Link as LinkIcon, 
    FileText, Camera, Loader2, Check, ArrowLeft,
    LogOut
  } from 'lucide-svelte';
  import type { User as UserType } from '$lib/db/types';
  
  let user: UserType | null = null;
  let loading = true;
  let saving = false;
  let errorMsg = '';
  let successMsg = '';
  
  // Form fields
  let name = '';
  let bio = '';
  let location = '';
  let website = '';
  
  onMount(async () => {
    await loadProfile();
  });
  
  async function loadProfile() {
    try {
      const res = await fetch('/api/profile');
      
      if (res.status === 401) {
        goto('/login');
        return;
      }
      
      const data = await res.json() as { user: UserType };
      user = data.user;
      
      // Populate form
      name = user.name || '';
      bio = user.bio || '';
      location = user.location || '';
      website = user.website || '';
      
    } catch (err: any) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  }
  
  async function handleSubmit() {
    saving = true;
    errorMsg = '';
    successMsg = '';
    
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, location, website })
      });
      
      const data = await res.json() as { message?: string };
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      successMsg = 'Profile updated successfully!';
      
      // Update local user data
      if (user) {
        user = { ...user, name, bio, location, website };
      }
      
    } catch (err: any) {
      errorMsg = err.message;
    } finally {
      saving = false;
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
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Navigation -->
    <div class="flex items-center justify-between mb-8">
      <a href="/dashboard" class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
        <ArrowLeft class="w-4 h-4" />
        Back to Dashboard
      </a>
      <button
        on:click={handleLogout}
        class="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition"
      >
        <LogOut class="w-4 h-4" />
        Logout
      </button>
    </div>
    
    {#if loading}
      <div class="flex items-center justify-center py-12">
        <Loader2 class="w-8 h-8 animate-spin text-blue-500" />
      </div>
    {:else if user}
      <div class="space-y-6">
        <!-- Profile Header -->
        <div class="bg-gray-800 rounded-xl p-6">
          <div class="flex items-start gap-6">
            <!-- Avatar -->
            <div class="relative">
              {#if user.avatar}
                <img src={user.avatar} alt={user.name} class="w-24 h-24 rounded-full object-cover" />
              {:else}
                <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              {/if}
              <button class="absolute -bottom-2 -right-2 bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition">
                <Camera class="w-4 h-4" />
              </button>
            </div>
            
            <!-- User Info -->
            <div class="flex-1">
              <h1 class="text-2xl font-bold text-white">{user.name}</h1>
              <p class="text-gray-400 flex items-center gap-2 mt-1">
                <Mail class="w-4 h-4" />
                {user.email}
              </p>
              <div class="flex items-center gap-4 mt-3">
                <span class="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                  {user.provider === 'google' ? 'Google Account' : 'Email Account'}
                </span>
                {#if user.emailVerified}
                  <span class="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
                    <Check class="w-3 h-3" />
                    Verified
                  </span>
                {/if}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Messages -->
        {#if errorMsg}
          <div class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {errorMsg}
          </div>
        {/if}
        
        {#if successMsg}
          <div class="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
            {successMsg}
          </div>
        {/if}
        
        <!-- Edit Profile Form -->
        <div class="bg-gray-800 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-white mb-6">Edit Profile</h2>
          
          <form on:submit|preventDefault={handleSubmit} class="space-y-5">
            <!-- Name Field -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
                <User class="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                id="name"
                type="text"
                bind:value={name}
                required
                class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
            </div>
            
            <!-- Bio Field -->
            <div>
              <label for="bio" class="block text-sm font-medium text-gray-300 mb-2">
                <FileText class="w-4 h-4 inline mr-2" />
                Bio
              </label>
              <textarea
                id="bio"
                bind:value={bio}
                rows="3"
                class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none"
                placeholder="Tell us about yourself..."
              />
              <p class="text-xs text-gray-500 mt-1">{bio?.length || 0}/160 characters</p>
            </div>
            
            <!-- Location Field -->
            <div>
              <label for="location" class="block text-sm font-medium text-gray-300 mb-2">
                <MapPin class="w-4 h-4 inline mr-2" />
                Location
              </label>
              <input
                id="location"
                type="text"
                bind:value={location}
                class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                placeholder="City, Country"
              />
            </div>
            
            <!-- Website Field -->
            <div>
              <label for="website" class="block text-sm font-medium text-gray-300 mb-2">
                <LinkIcon class="w-4 h-4 inline mr-2" />
                Website
              </label>
              <input
                id="website"
                type="url"
                bind:value={website}
                class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                placeholder="https://yourwebsite.com"
              />
            </div>
            
            <!-- Submit Button -->
            <div class="pt-4">
              <button
                type="submit"
                disabled={saving}
                class="w-full sm:w-auto bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {#if saving}
                  <Loader2 class="w-5 h-5 animate-spin" />
                  Saving...
                {:else}
                  Save Changes
                {/if}
              </button>
            </div>
          </form>
        </div>
        
        <!-- Security Section -->
        <div class="bg-gray-800 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-white mb-4">Security</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <p class="text-white font-medium">Password</p>
                <p class="text-sm text-gray-400">Change your password</p>
              </div>
              <a 
                href="/forgot-password" 
                class="text-blue-400 hover:text-blue-300 font-medium"
              >
                Change
              </a>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="text-center py-12 text-gray-400">
        Failed to load profile. Please try again.
      </div>
    {/if}
  </div>
</div>
