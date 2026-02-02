<script lang="ts">
  import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-svelte';
  
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

<div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
  <div class="w-full max-w-md space-y-8">
    <!-- Back Link -->
    <a href="/login" class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
      <ArrowLeft class="w-4 h-4" />
      Back to login
    </a>
    
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-white">Forgot Password?</h1>
      <p class="mt-2 text-gray-400">
        Enter your email address and we'll send you a link to reset your password.
      </p>
    </div>
    
    {#if success}
      <!-- Success Message -->
      <div class="bg-green-500/10 border border-green-500 text-green-500 px-4 py-6 rounded-lg text-center">
        <CheckCircle class="w-12 h-12 mx-auto mb-3" />
        <h3 class="font-semibold mb-1">Check your email</h3>
        <p class="text-sm">
          If an account exists for {email}, we've sent password reset instructions.
        </p>
      </div>
      
      <div class="text-center">
        <a href="/login" class="text-blue-400 hover:text-blue-300 font-medium">
          Return to login
        </a>
      </div>
    {:else}
      <!-- Error Alert -->
      {#if errorMsg}
        <div class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {errorMsg}
        </div>
      {/if}
      
      <!-- Forgot Password Form -->
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
        
        <button
          type="submit"
          disabled={loading}
          class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {#if loading}
            <Loader2 class="w-5 h-5 animate-spin" />
            Sending...
          {:else}
            Send Reset Link
          {/if}
        </button>
      </form>
    {/if}
  </div>
</div>
