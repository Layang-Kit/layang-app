<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Lock, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft, Hexagon, Check, X } from 'lucide-svelte';
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

<div class="min-h-screen flex items-center justify-center py-12 px-4 grain">
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent-500/5 rounded-full blur-3xl"></div>
  </div>
  
  <div class="w-full max-w-md relative z-10">
    <div class="mb-6">
      <a href="/login" class="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-200 transition text-sm">
        <ArrowLeft class="w-4 h-4" />
        Back to login
      </a>
    </div>
    
    {#if success}
      <div class="card-elevated p-8 text-center">
        <div class="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle class="w-8 h-8 text-emerald-400" />
        </div>
        <h2 class="font-display text-display-xs text-neutral-100 mb-2">Password reset successful!</h2>
        <p class="text-neutral-500">
          Your password has been updated. Redirecting to login...
        </p>
      </div>
    {:else}
      <div class="card-elevated p-8">
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-xl bg-accent-500 flex items-center justify-center mx-auto mb-4">
            <Hexagon class="w-6 h-6 text-neutral-950" strokeWidth={2.5} />
          </div>
          <h1 class="font-display text-display-xs text-neutral-100 mb-2">Reset Password</h1>
          <p class="text-neutral-500 text-sm">
            Enter your new password below.
          </p>
        </div>
        
        {#if errorMsg}
          <div class="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {errorMsg}
          </div>
        {/if}
        
        <form on:submit|preventDefault={handleSubmit} class="space-y-5">
          <div>
            <label for="password" class="block text-sm font-medium text-neutral-400 mb-2">
              New Password
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
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-neutral-400 mb-2">
              Confirm Password
            </label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
              <input
                id="confirmPassword"
                type="password"
                bind:value={confirmPassword}
                required
                class="input pl-12"
                placeholder="••••••••"
              />
            </div>
            {#if confirmPassword && !passwordsMatch}
              <p class="mt-2 text-sm text-rose-400">Passwords do not match</p>
            {/if}
          </div>
          
          <button
            type="submit"
            disabled={loading || !passwordValid.length || !passwordValid.uppercase || !passwordValid.number || !passwordsMatch}
            class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if loading}
              <Loader2 class="w-5 h-5 animate-spin" />
              Resetting...
            {:else}
              Reset Password
            {/if}
          </button>
        </form>
      </div>
    {/if}
  </div>
</div>
