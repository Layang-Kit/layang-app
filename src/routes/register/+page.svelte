<script lang="ts">
  import { goto } from '$app/navigation';
  import { Chrome, Mail, Lock, User, Eye, EyeOff, Loader2, Check, X, Hexagon, ArrowRight } from 'lucide-svelte';
  
  let name = '';
  let email = '';
  let password = '';
  let showPassword = false;
  let loading = false;
  let errorMsg = '';
  let errors: Record<string, string[]> = {};
  
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
      
      // Redirect to verification pending page
      goto(`/verify-email-sent?email=${encodeURIComponent(email)}`);
      
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

<div class="min-h-screen flex items-center justify-center py-12 px-4 grain">
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent-500/5 rounded-full blur-3xl"></div>
  </div>
  
  <div class="w-full max-w-md relative z-10">
    <div class="text-center mb-8">
      <a href="/" class="inline-flex items-center gap-3 group">
        <div class="w-12 h-12 rounded-xl bg-accent-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <Hexagon class="w-6 h-6 text-neutral-950" strokeWidth={2.5} />
        </div>
      </a>
    </div>
    
    <div class="card-elevated p-8">
      <div class="text-center mb-8">
        <h1 class="font-display text-display-xs text-neutral-100 mb-2">Create Account</h1>
        <p class="text-neutral-500">Get started with your free account</p>
      </div>
      
      {#if errorMsg}
        <div class="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {errorMsg}
        </div>
      {/if}
      
      <button
        on:click={registerWithGoogle}
        disabled={loading}
        class="w-full flex items-center justify-center gap-3 bg-neutral-100 text-neutral-950 py-3 px-4 rounded-xl font-semibold hover:bg-white transition disabled:opacity-50 mb-6"
      >
        <Chrome class="w-5 h-5" />
        Continue with Google
      </button>
      
      <div class="relative mb-6">
        <div class="absolute inset-0 flex items-center">
          <div class="divider w-full"></div>
        </div>
        <div class="relative flex justify-center text-xs">
          <span class="px-4 bg-neutral-900 text-neutral-600">or register with email</span>
        </div>
      </div>
      
      <form on:submit|preventDefault={handleSubmit} class="space-y-5">
        <div>
          <label for="name" class="block text-sm font-medium text-neutral-400 mb-2">
            Full Name
          </label>
          <div class="relative">
            <User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
            <input
              id="name"
              type="text"
              bind:value={name}
              required
              class="input pl-12"
              placeholder="John Doe"
            />
          </div>
          {#if errors.name}
            <p class="mt-2 text-sm text-rose-400">{errors.name[0]}</p>
          {/if}
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-neutral-400 mb-2">
            Email Address
          </label>
          <div class="relative">
            <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
            <input
              id="email"
              type="email"
              bind:value={email}
              required
              class="input pl-12"
              placeholder="you@example.com"
            />
          </div>
          {#if errors.email}
            <p class="mt-2 text-sm text-rose-400">{errors.email[0]}</p>
          {/if}
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-neutral-400 mb-2">
            Password
          </label>
          <div class="relative">
            <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
            {#if showPassword}
              <input
                id="password"
                type="text"
                bind:value={password}
                required
                class="input pl-12 pr-12"
                placeholder="••••••••"
              />
            {:else}
              <input
                id="password"
                type="password"
                bind:value={password}
                required
                class="input pl-12 pr-12"
                placeholder="••••••••"
              />
            {/if}
            <button
              type="button"
              on:click={() => showPassword = !showPassword}
              class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition"
            >
              <svelte:component this={showPassword ? EyeOff : Eye} class="w-5 h-5" />
            </button>
          </div>
          
          <div class="mt-4 space-y-2">
            <p class="text-xs text-neutral-600 uppercase tracking-wider font-medium">Password requirements</p>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-sm {passwordValid.length ? 'text-emerald-400' : 'text-neutral-600'}">
                <svelte:component this={passwordValid.length ? Check : X} class="w-4 h-4" />
                At least 8 characters
              </div>
              <div class="flex items-center gap-2 text-sm {passwordValid.uppercase ? 'text-emerald-400' : 'text-neutral-600'}">
                <svelte:component this={passwordValid.uppercase ? Check : X} class="w-4 h-4" />
                One uppercase letter
              </div>
              <div class="flex items-center gap-2 text-sm {passwordValid.number ? 'text-emerald-400' : 'text-neutral-600'}">
                <svelte:component this={passwordValid.number ? Check : X} class="w-4 h-4" />
                One number
              </div>
            </div>
          </div>
          {#if errors.password}
            <p class="mt-2 text-sm text-rose-400">{errors.password[0]}</p>
          {/if}
        </div>
        
        <button
          type="submit"
          disabled={loading || !passwordValid.length || !passwordValid.uppercase || !passwordValid.number}
          class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if loading}
            <Loader2 class="w-5 h-5 animate-spin" />
            Creating account...
          {:else}
            Create Account
            <ArrowRight class="w-4 h-4" />
          {/if}
        </button>
      </form>
    </div>
    
    <p class="text-center mt-6 text-neutral-500">
      Already have an account?
      <a href="/login" class="text-accent-500 hover:text-accent-400 font-medium transition">
        Sign in
      </a>
    </p>
  </div>
</div>
