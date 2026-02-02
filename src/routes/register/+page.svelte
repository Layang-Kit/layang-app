<script lang="ts">
  import { goto } from '$app/navigation';
  import { Chrome, Mail, Lock, User, Eye, EyeOff, Loader2, Check, X } from 'lucide-svelte';
  
  let name = '';
  let email = '';
  let password = '';
  let showPassword = false;
  let loading = false;
  let errorMsg = '';
  let errors: Record<string, string[]> = {};
  
  // Password validation
  $: passwordValid = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password)
  };
  
  async function handleSubmit() {
    loading = true;
    errorMsg = '';
    errors = {};
    
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json() as { message?: string; errors?: Record<string, string[]> };
      
      if (!res.ok) {
        if (data.errors) {
          errors = data.errors;
        }
        throw new Error(data.message || 'Registration failed');
      }
      
      // Redirect to dashboard on success
      goto('/dashboard');
      
    } catch (err: any) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  }
  
  function registerWithGoogle() {
    window.location.href = '/auth/google';
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
  <div class="w-full max-w-md space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-white">Create Account</h1>
      <p class="mt-2 text-gray-400">Get started with your free account</p>
    </div>
    
    <!-- Error Alert -->
    {#if errorMsg}
      <div class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
        {errorMsg}
      </div>
    {/if}
    
    <!-- Google Register Button -->
    <button
      on:click={registerWithGoogle}
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
        <span class="px-2 bg-gray-900 text-gray-400">Or register with email</span>
      </div>
    </div>
    
    <!-- Register Form -->
    <form on:submit|preventDefault={handleSubmit} class="space-y-5">
      <!-- Name Field -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
          Full Name
        </label>
        <div class="relative">
          <User class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            id="name"
            type="text"
            bind:value={name}
            required
            class="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            placeholder="John Doe"
          />
        </div>
        {#if errors.name}
          <p class="mt-1 text-sm text-red-500">{errors.name[0]}</p>
        {/if}
      </div>
      
      <!-- Email Field -->
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
        {#if errors.email}
          <p class="mt-1 text-sm text-red-500">{errors.email[0]}</p>
        {/if}
      </div>
      
      <!-- Password Field -->
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
        
        <!-- Password Requirements -->
        <div class="mt-3 space-y-2">
          <p class="text-sm text-gray-500">Password must have:</p>
          <div class="space-y-1">
            <div class="flex items-center gap-2 text-sm" class:text-green-400={passwordValid.length} class:text-gray-500={!passwordValid.length}>
              {#if passwordValid.length}
                <Check class="w-4 h-4" />
              {:else}
                <X class="w-4 h-4" />
              {/if}
              At least 8 characters
            </div>
            <div class="flex items-center gap-2 text-sm" class:text-green-400={passwordValid.uppercase} class:text-gray-500={!passwordValid.uppercase}>
              {#if passwordValid.uppercase}
                <Check class="w-4 h-4" />
              {:else}
                <X class="w-4 h-4" />
              {/if}
              One uppercase letter
            </div>
            <div class="flex items-center gap-2 text-sm" class:text-green-400={passwordValid.number} class:text-gray-500={!passwordValid.number}>
              {#if passwordValid.number}
                <Check class="w-4 h-4" />
              {:else}
                <X class="w-4 h-4" />
              {/if}
              One number
            </div>
          </div>
        </div>
        {#if errors.password}
          <p class="mt-1 text-sm text-red-500">{errors.password[0]}</p>
        {/if}
      </div>
      
      <button
        type="submit"
        disabled={loading || !passwordValid.length || !passwordValid.uppercase || !passwordValid.number}
        class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {#if loading}
          <Loader2 class="w-5 h-5 animate-spin" />
          Creating account...
        {:else}
          Create Account
        {/if}
      </button>
    </form>
    
    <!-- Login Link -->
    <p class="text-center text-gray-400">
      Already have an account?
      <a href="/login" class="text-blue-400 hover:text-blue-300 font-medium">
        Sign in
      </a>
    </p>
  </div>
</div>
