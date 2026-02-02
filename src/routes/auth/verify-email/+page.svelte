<script lang="ts">
  import { goto } from '$app/navigation';
  import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-svelte';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  // Redirect to login after 5 seconds if success
  $: if (data.success) {
    setTimeout(() => {
      goto('/login');
    }, 5000);
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
  <div class="w-full max-w-md">
    <div class="bg-gray-800 rounded-xl p-8 text-center">
      {#if data.success}
        <!-- Success State -->
        <div class="mb-6">
          <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle class="w-10 h-10 text-green-500" />
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">
            {data.alreadyVerified ? 'Already Verified!' : 'Email Verified!'}
          </h1>
          <p class="text-gray-400">{data.message}</p>
        </div>
        
        {#if !data.alreadyVerified}
          <p class="text-sm text-gray-500 mb-6">
            Redirecting to login page in 5 seconds...
          </p>
        {/if}
        
        <a 
          href="/login" 
          class="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Go to Login
        </a>
        
      {:else}
        <!-- Error State -->
        <div class="mb-6">
          <div class="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle class="w-10 h-10 text-red-500" />
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">Verification Failed</h1>
          <p class="text-gray-400">{data.message}</p>
        </div>
        
        <div class="space-y-3">
          <a 
            href="/login" 
            class="inline-flex items-center justify-center w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition"
          >
            Go to Login
          </a>
          
          <form method="POST" action="/auth/resend-verification" class="w-full">
            <input type="hidden" name="email" value={new URLSearchParams(window.location.search).get('email')} />
            <button 
              type="submit"
              class="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
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
