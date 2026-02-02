<script lang="ts">
  import { page } from '$app/stores';
  import { Mail, ArrowLeft, RefreshCw, Hexagon } from 'lucide-svelte';
  
  // Get email from URL query param
  $: email = $page.url.searchParams.get('email') || '';
  
  let resending = false;
  let resendMessage = '';
  
  async function resendEmail() {
    if (!email) return;
    
    resending = true;
    resendMessage = '';
    
    try {
      const res = await fetch('/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json() as { message?: string };
      
      if (res.ok) {
        resendMessage = 'Verification email sent! Please check your inbox.';
      } else {
        resendMessage = data.message || 'Failed to resend email. Please try again.';
      }
    } catch (err) {
      resendMessage = 'An error occurred. Please try again later.';
    } finally {
      resending = false;
    }
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
    
    <div class="card-elevated p-8 text-center">
      <!-- Icon -->
      <div class="mb-6">
        <div class="w-20 h-20 bg-accent-500/10 rounded-full flex items-center justify-center mx-auto">
          <Mail class="w-10 h-10 text-accent-500" />
        </div>
      </div>
      
      <!-- Title -->
      <h1 class="font-display text-display-xs text-neutral-100 mb-3">
        Verify Your Email
      </h1>
      
      <!-- Message -->
      <p class="text-neutral-500 mb-6">
        We've sent a verification email to
        <span class="text-neutral-300 font-medium">{email || 'your email address'}</span>.
        Please check your inbox and click the link to verify your account.
      </p>
      
      <!-- Info box -->
      <div class="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 mb-6">
        <p class="text-sm text-neutral-400">
          <span class="text-accent-500 font-medium">Tip:</span> 
          If you don't see the email, check your spam or junk folder. 
          The link will expire in 24 hours.
        </p>
      </div>
      
      <!-- Resend message -->
      {#if resendMessage}
        <div class="mb-4 p-3 rounded-lg {resendMessage.includes('sent') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'} text-sm">
          {resendMessage}
        </div>
      {/if}
      
      <!-- Actions -->
      <div class="space-y-3">
        <button
          on:click={resendEmail}
          disabled={resending || !email}
          class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition disabled:opacity-50 border border-neutral-700 hover:bg-neutral-800 text-neutral-300"
        >
          {#if resending}
            <RefreshCw class="w-4 h-4 animate-spin" />
            Sending...
          {:else}
            <RefreshCw class="w-4 h-4" />
            Resend Verification Email
          {/if}
        </button>
        
        <a 
          href="/login" 
          class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition btn-primary"
        >
          Go to Login
        </a>
      </div>
      
      <!-- Back link -->
      <div class="mt-6">
        <a 
          href="/register" 
          class="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-400 transition"
        >
          <ArrowLeft class="w-4 h-4" />
          Back to Register
        </a>
      </div>
    </div>
  </div>
</div>
