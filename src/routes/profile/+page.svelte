<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Mail, MapPin, Link as LinkIcon, FileText, Camera, Loader2, 
    Check, ArrowLeft, LogOut, Upload, X, User, Shield, Hexagon
  } from 'lucide-svelte';
  import type { User as UserType } from '$lib/db/types';
  
  let user: UserType | null = null;
  let loading = true;
  let saving = false;
  let errorMsg = '';
  let successMsg = '';
  
  let avatarFile: File | null = null;
  let avatarPreview: string | null = null;
  let uploadingAvatar = false;
  let fileInput: HTMLInputElement;
  
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
  
  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        errorMsg = 'Please select a valid image file (JPG, PNG, GIF, or WebP)';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        errorMsg = 'File size must be less than 5MB';
        return;
      }
      
      avatarFile = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      errorMsg = '';
    }
  }
  
  function clearAvatarSelection() {
    avatarFile = null;
    avatarPreview = null;
    if (fileInput) fileInput.value = '';
  }
  
  async function uploadAvatar() {
    if (!avatarFile) return;
    
    uploadingAvatar = true;
    errorMsg = '';
    
    try {
      const formData = new FormData();
      formData.append('file', avatarFile);
      formData.append('type', 'avatar');
      
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json() as { success: boolean; url?: string; message?: string };
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to upload avatar');
      }
      
      const updateRes = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: data.url }),
      });
      
      if (!updateRes.ok) {
        throw new Error('Failed to update profile');
      }
      
      if (user && data.url) {
        user = { ...user, avatar: data.url };
      }
      
      successMsg = 'Avatar updated successfully!';
      clearAvatarSelection();
      
    } catch (err: any) {
      errorMsg = err.message;
    } finally {
      uploadingAvatar = false;
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

<div class="min-h-screen grain py-8 px-4">
  <div class="container-tight">
    <!-- Navigation -->
    <div class="flex items-center justify-between mb-8">
      <a href="/dashboard" class="btn-ghost">
        <ArrowLeft class="w-4 h-4" />
        Back to Dashboard
      </a>
      <button
        on:click={handleLogout}
        class="btn-ghost text-rose-400 hover:text-rose-300"
      >
        <LogOut class="w-4 h-4" />
        Logout
      </button>
    </div>
    
    {#if loading}
      <div class="flex items-center justify-center py-20">
        <Loader2 class="w-8 h-8 animate-spin text-accent-500" />
      </div>
    {:else if user}
      <div class="space-y-6">
        <!-- Profile Header -->
        <div class="card-elevated p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row items-start gap-6">
            <div class="relative">
              {#if avatarPreview}
                <img src={avatarPreview} alt="Preview" class="w-24 h-24 rounded-full object-cover ring-4 ring-accent-500/30" />
                <button
                  on:click={clearAvatarSelection}
                  class="absolute -top-2 -right-2 p-1.5 bg-rose-500 rounded-full hover:bg-rose-600 transition"
                >
                  <X class="w-4 h-4 text-white" />
                </button>
              {:else if user.avatar}
                <img src={user.avatar} alt={user.name} class="w-24 h-24 rounded-full object-cover ring-4 ring-neutral-800" />
              {:else}
                <div class="w-24 h-24 rounded-full bg-accent-500 flex items-center justify-center text-3xl font-bold text-neutral-950">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              {/if}
              
              <button
                on:click={() => fileInput?.click()}
                class="absolute -bottom-1 -right-1 p-2.5 bg-neutral-800 rounded-full hover:bg-neutral-700 transition border-4 border-neutral-900"
              >
                <Camera class="w-4 h-4 text-neutral-300" />
              </button>
              
              <input
                type="file"
                bind:this={fileInput}
                on:change={handleFileSelect}
                accept="image/jpeg,image/png,image/gif,image/webp"
                class="hidden"
              />
            </div>
            
            <div class="flex-1">
              <h1 class="font-display text-display-xs text-neutral-100">{user.name}</h1>
              <p class="text-neutral-500 flex items-center gap-2 mt-1">
                <Mail class="w-4 h-4" />
                {user.email}
              </p>
              <div class="flex items-center gap-3 mt-3">
                <span class="text-xs px-3 py-1 rounded-lg bg-neutral-800 text-neutral-400 border border-neutral-700">
                  {user.provider === 'google' ? 'Google Account' : 'Email Account'}
                </span>
                {#if user.emailVerified}
                  <span class="text-xs px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <Check class="w-3 h-3" />
                    Verified
                  </span>
                {:else}
                  <span class="text-xs px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Unverified
                  </span>
                {/if}
              </div>
              
              {#if avatarFile}
                <div class="mt-4 flex items-center gap-3">
                  <button
                    on:click={uploadAvatar}
                    disabled={uploadingAvatar}
                    class="btn-primary text-sm py-2 px-4"
                  >
                    {#if uploadingAvatar}
                      <Loader2 class="w-4 h-4 animate-spin" />
                      Uploading...
                    {:else}
                      <Upload class="w-4 h-4" />
                      Upload Avatar
                    {/if}
                  </button>
                  <button
                    on:click={clearAvatarSelection}
                    class="text-neutral-500 hover:text-neutral-300 transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              {/if}
            </div>
          </div>
        </div>
        
        <!-- Messages -->
        {#if errorMsg}
          <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {errorMsg}
          </div>
        {/if}
        
        {#if successMsg}
          <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            {successMsg}
          </div>
        {/if}
        
        <!-- Edit Form -->
        <div class="card-elevated p-6 sm:p-8">
          <h2 class="font-display text-display-xs text-neutral-100 mb-6">Edit Profile</h2>
          
          <form on:submit|preventDefault={handleSubmit} class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-neutral-400 mb-2">
                <User class="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                id="name"
                type="text"
                bind:value={name}
                required
                class="input"
              />
            </div>
            
            <div>
              <label for="bio" class="block text-sm font-medium text-neutral-400 mb-2">
                <FileText class="w-4 h-4 inline mr-2" />
                Bio
              </label>
              <textarea
                id="bio"
                bind:value={bio}
                rows="3"
                maxlength="160"
                class="input resize-none"
                placeholder="Tell us about yourself..."
              />
              <p class="text-xs text-neutral-600 mt-2">{bio?.length || 0}/160 characters</p>
            </div>
            
            <div>
              <label for="location" class="block text-sm font-medium text-neutral-400 mb-2">
                <MapPin class="w-4 h-4 inline mr-2" />
                Location
              </label>
              <input
                id="location"
                type="text"
                bind:value={location}
                maxlength="100"
                class="input"
                placeholder="City, Country"
              />
            </div>
            
            <div>
              <label for="website" class="block text-sm font-medium text-neutral-400 mb-2">
                <LinkIcon class="w-4 h-4 inline mr-2" />
                Website
              </label>
              <input
                id="website"
                type="url"
                bind:value={website}
                class="input"
                placeholder="https://yourwebsite.com"
              />
            </div>
            
            <div class="pt-4">
              <button
                type="submit"
                disabled={saving}
                class="btn-primary"
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
        
        <!-- Security -->
        <div class="card-elevated p-6 sm:p-8">
          <h2 class="font-display text-display-xs text-neutral-100 mb-6">Security</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-neutral-800/50">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                  <Shield class="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <p class="font-medium text-neutral-100">Password</p>
                  <p class="text-sm text-neutral-500">Change your password</p>
                </div>
              </div>
              <a 
                href="/forgot-password" 
                class="text-accent-500 hover:text-accent-400 font-medium text-sm"
              >
                Change
              </a>
            </div>
            
            {#if !user.emailVerified}
              <div class="flex items-center justify-between py-3 border-b border-neutral-800/50">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                    <Mail class="w-5 h-5 text-neutral-400" />
                  </div>
                  <div>
                    <p class="font-medium text-neutral-100">Email Verification</p>
                    <p class="text-sm text-neutral-500">Verify your email address</p>
                  </div>
                </div>
                <form method="POST" action="/auth/resend-verification">
                  <input type="hidden" name="email" value={user.email} />
                  <button 
                    type="submit"
                    class="text-accent-500 hover:text-accent-400 font-medium text-sm"
                  >
                    Resend
                  </button>
                </form>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="text-center py-20 text-neutral-500">
        Failed to load profile. Please try again.
      </div>
    {/if}
  </div>
</div>
