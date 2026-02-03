<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { CheckCircle, XCircle, Mail, Hexagon } from 'lucide-svelte';
  import type { PageData } from './$types';
  
  let { data }: { data: PageData } = $props();
  
  // Redirect to login after 5 seconds if success (browser only)
  onMount(() => {
    if (data.success && browser) {
      setTimeout(() => {
        goto('/login');
      }, 5000);
    }
  });
</script>

<div class="min-h-screen flex items-center justify-center px-4 grain">
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent-500/5 rounded-full blur-3xl"></div>
  </div>
  
  <div class="w-full max-w-md relative z-10">
    <div class="card-elevated p-8 text-center">
      {#if data.success}
        <!-- Success State -->
        <div class="mb-6">
          <div class="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle class="w-10 h-10 text-emerald-400" />
          </div>
          <h1 class="font-display text-display-xs text-neutral-100 mb-2">
            {data.alreadyVerified ? 'Already Verified!' : 'Email Verified!'}
          </h1>
          <p class="text-neutral-500">{data.message}</p>
        </div>
        
        {#if !data.alreadyVerified}
          <p class="text-sm text-neutral-600 mb-6">
            Redirecting to login page in 5 seconds...
          </p>
        {/if}
        
        <a 
          href="/login" 
          class="btn-primary w-full"
        >
          Go to Login
        </a>
        
      {:else}
        <!-- Error State -->
        <div class="mb-6">
          <div class="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle class="w-10 h-10 text-rose-400" />
          </div>
          <h1 class="font-display text-display-xs text-neutral-100 mb-2">Verification Failed</h1>
          <p class="text-neutral-500">{data.message}</p>
        </div>
        
        <div class="space-y-3">
          <a 
            href="/login" 
            class="btn-secondary w-full"
          >
            Go to Login
          </a>
          
          <form method="POST" action="/auth/resend-verification" class="w-full">
            <input type="hidden" name="email" value={new URLSearchParams(window.location.search).get('email')} />
            <button 
              type="submit"
              class="btn-primary w-full"
            >
              <Mail class="w-4 h-4 mr-2" />
              Resend Verification Email
            </button>
          </form>
        </div>
      {/if}
    </div>
  </div>
</div>
