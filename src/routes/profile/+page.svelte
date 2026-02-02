<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    User, Mail, MapPin, Link as LinkIcon, 
    FileText, Camera, Loader2, Check, ArrowLeft,
    LogOut, Upload, X
  } from 'lucide-svelte';
  import type { User as UserType } from '$lib/db/types';
  
  let user: UserType | null = null;
  let loading = true;
  let saving = false;
  let errorMsg = '';
  let successMsg = '';
  
  // Avatar upload
  let avatarFile: File | null = null;
  let avatarPreview: string | null = null;
  let uploadingAvatar = false;
  let fileInput: HTMLInputElement;
  
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
  
  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      // Validate file
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
      
      // Create preview
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
      
      // Update user profile with new avatar URL
      const updateRes = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: data.url }),
      });
      
      if (!updateRes.ok) {
        throw new Error('Failed to update profile');
      }
      
      // Update local user data
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
          <div class="flex flex-col sm:flex-row items-start gap-6">
            <!-- Avatar Upload -->
            <div class="relative">
              {#if avatarPreview}
                <!-- Preview -->
                <img src={avatarPreview} alt="Preview" class="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500/50" />
                <button
                  on:click={clearAvatarSelection}
                  class="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition"
                >
                  <X class="w-4 h-4 text-white" />
                </button>
              {:else if user.avatar}
                <img src={user.avatar} alt={user.name} class="w-24 h-24 rounded-full object-cover" />
              {:else}
                <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              {/if}
              
              <!-- Upload Button -->
              <button
                on:click={() => fileInput?.click()}
                class="absolute -bottom-2 -right-2 bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition border-2 border-gray-800"
              >
                <Camera class="w-4 h-4" />
              </button>
              
              <input
                type="file"
                bind:this={fileInput}
                on:change={handleFileSelect}
                accept="image/jpeg,image/png,image/gif,image/webp"
                class="hidden"
              />
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
                {:else}
                  <span class="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                    Unverified
                  </span>
                {/if}
              </div>
              
              <!-- Upload Actions -->
              {#if avatarFile}
                <div class="mt-4 flex items-center gap-3">
                  <button
                    on:click={uploadAvatar}
                    disabled={uploadingAvatar}
                    class="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
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
                    class="text-gray-400 hover:text-white transition"
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
                maxlength="160"
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
                maxlength="100"
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
            
            {#if !user.emailVerified}
              <div class="flex items-center justify-between py-3 border-b border-gray-700">
                <div>
                  <p class="text-white font-medium">Email Verification</p>
                  <p class="text-sm text-gray-400">Verify your email address</p>
                </div>
                <form method="POST" action="/auth/resend-verification">
                  <input type="hidden" name="email" value={user.email} />
                  <button 
                    type="submit"
                    class="text-blue-400 hover:text-blue-300 font-medium"
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
      <div class="text-center py-12 text-gray-400">
        Failed to load profile. Please try again.
      </div>
    {/if}
  </div>
</div>
