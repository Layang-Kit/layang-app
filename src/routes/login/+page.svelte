<script lang="ts">
  import { goto } from '$app/navigation';
  import { Chrome, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-svelte';
  
  let email = '';
  let password = '';
  let showPassword = false;
  let loading = false;
  let errorMsg = '';
  
  async function handleSubmit() {
    loading = true;
    errorMsg = '';
    
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json() as { message?: string };
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Redirect to dashboard on success
      goto('/dashboard');
      
    } catch (err: any) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  }
  
  function loginWithGoogle() {
    window.location.href = '/auth/google';
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
  <div class="w-full max-w-md space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-white">Welcome Back</h1>
      <p class="mt-2 text-gray-400">Sign in to your account</p>
    </div>
    
    <!-- Error Alert -->
    {#if errorMsg}
      <div class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
        {errorMsg}
      </div>
    {/if}
    
    <!-- Google Login Button -->
    <button
      on:click={loginWithGoogle}
      class="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition disabled:opacity-50"
      disabled={loading}
    >
      <Chrome class="w-5 h-5" />
      Continue with Google
    </button>
    
    <!-- Divider -->
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-700"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
      </div>
    </div>
    
    <!-- Email Login Form -->
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <div class="relative">
          <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            class="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            placeholder="you@example.com"
          />
        </div>
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
          Password
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
      </div>
      
      <button
        type="submit"
        disabled={loading}
        class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {#if loading}
          <Loader2 class="w-5 h-5 animate-spin" />
          Signing in...
        {:else}
          Sign In
        {/if}
      </button>
    </form>
    
    <!-- Register Link -->
    <p class="text-center text-gray-400">
      Don't have an account?
      <a href="/register" class="text-blue-400 hover:text-blue-300 font-medium">
        Create one
      </a>
    </p>
  </div>
</div>
