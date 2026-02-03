<script lang="ts">
  import { goto } from '$app/navigation';
  import { Chrome, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Hexagon } from 'lucide-svelte';
  
  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let loading = $state(false);
  let errorMsg = $state('');
  
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
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
        <h1 class="font-display text-display-xs text-neutral-100 mb-2">Welcome back</h1>
        <p class="text-neutral-500">Sign in to your account</p>
      </div>
      
      {#if errorMsg}
        <div class="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {errorMsg}
        </div>
      {/if}
      
      <button
        onclick={loginWithGoogle}
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
          <span class="px-4 bg-neutral-900 text-neutral-600">or continue with email</span>
        </div>
      </div>
      
      <form onsubmit={handleSubmit} class="space-y-5">
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
        </div>
        
        <div>
          <div class="flex items-center justify-between mb-2">
            <label for="password" class="text-sm font-medium text-neutral-400">
              Password
            </label>
            <a href="/forgot-password" class="text-sm text-accent-500 hover:text-accent-400 transition">
              Forgot?
            </a>
          </div>
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
              onclick={() => showPassword = !showPassword}
              class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition"
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
          class="btn-primary w-full"
        >
          {#if loading}
            <Loader2 class="w-5 h-5 animate-spin" />
            Signing in...
          {:else}
            Sign In
            <ArrowRight class="w-4 h-4" />
          {/if}
        </button>
      </form>
    </div>
    
    <p class="text-center mt-6 text-neutral-500">
      Don't have an account?
      <a href="/register" class="text-accent-500 hover:text-accent-400 font-medium transition">
        Create one
      </a>
    </p>
  </div>
</div>
