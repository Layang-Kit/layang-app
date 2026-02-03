<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    Mail, MapPin, Link as LinkIcon, FileText, Camera, Loader2, 
    Check, Upload, X, User, Shield, Globe, AlertCircle
  } from 'lucide-svelte';
  import type { User as UserType } from '$lib/db/types';
  
  let user = $state<UserType | null>(null);
  let loading = $state(true);
  let saving = $state(false);
  let errorMsg = $state('');
  let successMsg = $state('');
  
  let avatarFile = $state<File | null>(null);
  let avatarPreview = $state<string | null>(null);
  let uploadingAvatar = $state(false);
  let fileInput = $state<HTMLInputElement | null>(null);
  
  let name = $state('');
  let bio = $state('');
  let location = $state('');
  let website = $state('');
  
  onMount(async () => {
    await loadProfile();
  });
  
  async function loadProfile() {
    try {
      const res = await fetch('/api/profile');
      
      if (res.status === 401) return;
      
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
</script>

<svelte:head>
  <title>Profile | Studio</title>
</svelte:head>

<div class="p-6 lg:p-8 max-w-4xl mx-auto">
  <!-- Header -->
  <div class="mb-8">
    <div class="flex items-center gap-2 text-sm text-neutral-500 mb-2">
      <span>Account</span>
      <span>/</span>
      <span class="text-neutral-300">Profile</span>
    </div>
    <h1 class="text-2xl font-display font-bold text-neutral-100">Profile Settings</h1>
    <p class="text-neutral-500 mt-1">Manage your account information and preferences.</p>
  </div>
  
  {#if loading}
    <div class="flex items-center justify-center py-20">
      <Loader2 class="w-8 h-8 animate-spin text-accent-500" />
    </div>
  {:else if user}
    <div class="space-y-6">
      <!-- Profile Card -->
      <div class="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
        <div class="flex flex-col sm:flex-row items-start gap-6">
          <div class="relative">
            {#if avatarPreview}
              <img src={avatarPreview} alt="Preview" class="w-24 h-24 rounded-2xl object-cover ring-4 ring-accent-500/30" />
              <button
                onclick={clearAvatarSelection}
                class="absolute -top-2 -right-2 p-1.5 bg-rose-500 rounded-lg hover:bg-rose-600 transition"
              >
                <X class="w-4 h-4 text-white" />
              </button>
            {:else if user.avatar}
              <img src={user.avatar} alt={user.name} class="w-24 h-24 rounded-2xl object-cover ring-2 ring-neutral-800" />
            {:else}
              <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-3xl font-bold text-neutral-950">
                {user.name.charAt(0).toUpperCase()}
              </div>
            {/if}
            
            <button
              onclick={() => fileInput?.click()}
              class="absolute -bottom-2 -right-2 p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition border-2 border-neutral-900"
            >
              <Camera class="w-4 h-4 text-neutral-300" />
            </button>
            
            <input
              type="file"
              bind:this={fileInput}
              onchange={handleFileSelect}
              accept="image/jpeg,image/png,image/gif,image/webp"
              class="hidden"
            />
          </div>
          
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-neutral-100">{user.name}</h2>
            <div class="flex items-center gap-2 text-neutral-500 mt-1">
              <Mail class="w-4 h-4" />
              {user.email}
            </div>
            <div class="flex items-center gap-2 mt-3">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800 text-neutral-400">
                <Globe class="w-3 h-3" />
                {user.provider === 'google' ? 'Google' : 'Email'}
              </span>
              {#if user.emailVerified}
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400">
                  <Check class="w-3 h-3" />
                  Verified
                </span>
              {:else}
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400">
                  <AlertCircle class="w-3 h-3" />
                  Unverified
                </span>
              {/if}
            </div>
            
            {#if avatarFile}
              <div class="mt-4 flex items-center gap-3">
                <button
                  onclick={uploadAvatar}
                  disabled={uploadingAvatar}
                  class="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 text-neutral-950 font-medium rounded-xl hover:bg-accent-400 transition-colors disabled:opacity-50"
                >
                  {#if uploadingAvatar}
                    <Loader2 class="w-4 h-4 animate-spin" />
                    Uploading...
                  {:else}
                    <Upload class="w-4 h-4" />
                    Upload
                  {/if}
                </button>
                <button
                  onclick={clearAvatarSelection}
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
        <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
          <AlertCircle class="w-4 h-4" />
          {errorMsg}
        </div>
      {/if}
      
      {#if successMsg}
        <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <Check class="w-4 h-4" />
          {successMsg}
        </div>
      {/if}
      
      <!-- Edit Form -->
      <div class="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
        <h3 class="font-semibold text-neutral-100 mb-6">Edit Profile</h3>
        
        <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-neutral-400 mb-2">
                <User class="w-4 h-4 inline mr-1" />
                Full Name
              </label>
              <input
                id="name"
                type="text"
                bind:value={name}
                required
                class="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
              />
            </div>
            
            <div>
              <label for="location" class="block text-sm font-medium text-neutral-400 mb-2">
                <MapPin class="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                id="location"
                type="text"
                bind:value={location}
                maxlength="100"
                class="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                placeholder="City, Country"
              />
            </div>
          </div>
          
          <div>
            <label for="bio" class="block text-sm font-medium text-neutral-400 mb-2">
              <FileText class="w-4 h-4 inline mr-1" />
              Bio
            </label>
            <textarea
              id="bio"
              bind:value={bio}
              rows="3"
              maxlength="160"
              class="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors resize-none"
              placeholder="Tell us about yourself..."
            ></textarea>
            <p class="text-xs text-neutral-600 mt-2 text-right">{bio?.length || 0}/160</p>
          </div>
          
          <div>
            <label for="website" class="block text-sm font-medium text-neutral-400 mb-2">
              <LinkIcon class="w-4 h-4 inline mr-1" />
              Website
            </label>
            <input
              id="website"
              type="url"
              bind:value={website}
              class="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
              placeholder="https://yourwebsite.com"
            />
          </div>
          
          <div class="pt-4 border-t border-neutral-800">
            <button
              type="submit"
              disabled={saving}
              class="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-neutral-950 font-semibold rounded-xl hover:bg-accent-400 active:bg-accent-600 transition-colors disabled:opacity-50"
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
      <div class="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
        <h3 class="font-semibold text-neutral-100 mb-4">Security</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b border-neutral-800/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                <Shield class="w-5 h-5 text-neutral-400" />
              </div>
              <div>
                <p class="font-medium text-neutral-200">Password</p>
                <p class="text-sm text-neutral-500">Change your account password</p>
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
            <div class="flex items-center justify-between py-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
                  <Mail class="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <p class="font-medium text-neutral-200">Email Verification</p>
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
