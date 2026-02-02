<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Lock, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft } from 'lucide-svelte';
  import { onMount } from 'svelte';
  
  let token = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let showPassword = false;
  let loading = false;
  let errorMsg = '';
  let success = false;
  
  onMount(() => {
    const searchParams = $page.url.searchParams;
    token = searchParams.get('token') || '';
    email = searchParams.get('email') || '';
    
    if (!token || !email) {
      errorMsg = 'Invalid or expired reset link. Please request a new one.';
    }
  });
  
  // Password validation
  $: passwordValid = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password)
  };
  
  $: passwordsMatch = password === confirmPassword && password !== '';
  
  async function handleSubmit() {
    if (!passwordsMatch) {
      errorMsg = 'Passwords do not match';
      return;
    }
    
    loading = true;
    errorMsg = '';
    
    try {
      const res = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password })
      });
      
      const data = await res.json() as { message?: string };
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      
      success = true;
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        goto('/login');
      }, 3000);
      
    } catch (err: any) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
  <div class="w-full max-w-md space-y-8">
    <!-- Back Link -->
    <a href="/login" class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
      <ArrowLeft class="w-4 h-4" />
      Back to login
    </a>
    
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-white">Reset Password</h1>
      <p class="mt-2 text-gray-400">
        Enter your new password below.
      </p>
    </div>
    
    {#if success}
      <!-- Success Message -->
      <div class="bg-green-500/10 border border-green-500 text-green-500 px-4 py-6 rounded-lg text-center">
        <CheckCircle class="w-12 h-12 mx-auto mb-3" />
        <h3 class="font-semibold mb-1">Password reset successful!</h3>
        <p class="text-sm">
          Your password has been updated. Redirecting to login...
        </p>
      </div>
    {:else}
      <!-- Error Alert -->
      {#if errorMsg}
        <div class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {errorMsg}
        </div>
      {/if}
      
      <!-- Reset Password Form -->
      <form on:submit|preventDefault={handleSubmit} class="space-y-5">
        <!-- New Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
            New Password
          </label>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            {#if showPassword}
              <input
                id="password"
                type="text"
                bind:value={password}
                required
                class="w-full bg-gray-800 text-white pl-10 pr-12 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                placeholder="••••••••"
              />
            {:else}
              <input
                id="password"
                type="password"
                bind:value={password}
                required
                class="w-full bg-gray-800 text-white pl-10 pr-12 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                placeholder="••••••••"
              />
            {/if}
            <button
              type="button"
              on:click={() => showPassword = !showPassword}
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {#if showPassword}
                <EyeOff class="w-5 h-5" />
              {:else}
                <Eye class="w-5 h-5" />
              {/if}
            </button>
          </div>
          
          <!-- Password Requirements -->
          <div class="mt-3 space-y-1">
            <p class="text-xs" class:text-green-400={passwordValid.length} class:text-gray-500={!passwordValid.length}>
              • At least 8 characters
            </p>
            <p class="text-xs" class:text-green-400={passwordValid.uppercase} class:text-gray-500={!passwordValid.uppercase}>
              • One uppercase letter
            </p>
            <p class="text-xs" class:text-green-400={passwordValid.number} class:text-gray-500={!passwordValid.number}>
              • One number
            </p>
          </div>
        </div>
        
        <!-- Confirm Password Field -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
            Confirm Password
          </label>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              id="confirmPassword"
              type="password"
              bind:value={confirmPassword}
              required
              class="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>
          {#if confirmPassword && !passwordsMatch}
            <p class="mt-1 text-sm text-red-500">Passwords do not match</p>
          {/if}
        </div>
        
        <button
          type="submit"
          disabled={loading || !passwordValid.length || !passwordValid.uppercase || !passwordValid.number || !passwordsMatch}
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {#if loading}
            <Loader2 class="w-5 h-5 animate-spin" />
            Resetting...
          {:else}
            Reset Password
          {/if}
        </button>
      </form>
    {/if}
  </div>
</div>
