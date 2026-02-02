<script lang="ts">
  import { Mail, ArrowLeft, Loader2, CheckCircle, Hexagon } from 'lucide-svelte';
  
  let email = '';
  let loading = false;
  let errorMsg = '';
  let success = false;
  
  async function handleSubmit() {
    loading = true;
    errorMsg = '';
    
    try {
      const res = await fetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json() as { message?: string };
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }
      
      success = true;
      
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
        <h2 class="font-display text-display-xs text-neutral-100 mb-2">Check your email</h2>
        <p class="text-neutral-500 mb-6">
          If an account exists for <span class="text-neutral-300">{email}</span>, we've sent password reset instructions.
        </p>
        <a 
          href="/login" 
          class="btn-primary w-full"
        >
          Return to login
        </a>
      </div>
    {:else}
      <div class="card-elevated p-8">
        <div class="text-center mb-8">
          <div class="w-12 h-12 rounded-xl bg-accent-500 flex items-center justify-center mx-auto mb-4">
            <Hexagon class="w-6 h-6 text-neutral-950" strokeWidth={2.5} />
          </div>
          <h1 class="font-display text-display-xs text-neutral-100 mb-2">Forgot Password?</h1>
          <p class="text-neutral-500 text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        {#if errorMsg}
          <div class="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {errorMsg}
          </div>
        {/if}
        
        <form on:submit|preventDefault={handleSubmit} class="space-y-5">
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
          
          <button
            type="submit"
            disabled={loading}
            class="btn-primary w-full"
          >
            {#if loading}
              <Loader2 class="w-5 h-5 animate-spin" />
              Sending...
            {:else}
              Send Reset Link
            {/if}
          </button>
        </form>
      </div>
    {/if}
  </div>
</div>
