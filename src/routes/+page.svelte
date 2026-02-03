<script lang="ts">
  import { Database, Shield, Zap, Globe, ArrowRight, Hexagon } from 'lucide-svelte';
  
  const features = [
    {
      icon: Database,
      title: 'Edge Database',
      description: 'Cloudflare D1 with global replication for lightning-fast queries at the edge'
    },
    {
      icon: Shield,
      title: 'Secure Auth',
      description: 'Session-based authentication with Google OAuth and passwordless options'
    },
    {
      icon: Zap,
      title: 'Fast by Default',
      description: 'SvelteKit 2.x with Vite for rapid development and optimal performance'
    },
    {
      icon: Globe,
      title: 'Global Scale',
      description: 'Deploy to Cloudflare Pages with edge functions running worldwide'
    }
  ];
</script>

<div class="min-h-screen flex flex-col">
  <!-- Hero Section -->
  <section class="relative flex-1 flex items-center justify-center pt-20 pb-32 px-4 overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent-500/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-[600px] h-[400px] bg-rose-500/5 rounded-full blur-3xl"></div>
    </div>
    
    <div class="container-tight relative z-10">
      <div class="text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 mb-8 animate-fade-in">
          <span class="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse"></span>
          <span class="text-xs font-medium text-neutral-400 uppercase tracking-wider">Now Available</span>
        </div>
        
        <!-- Headline -->
        <h1 class="font-display text-display-lg sm:text-display-xl mb-6 animate-fade-in-up" style="animation-delay: 0.1s">
          <span class="text-neutral-100">Build at the</span>
          <br />
          <span class="text-gradient">speed of thought</span>
        </h1>
        
        <!-- Subheadline -->
        <p class="text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style="animation-delay: 0.2s">
          A refined starter kit for modern web applications. 
          Built with SvelteKit, Cloudflare D1, and a touch of elegance.
        </p>
        
        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style="animation-delay: 0.3s">
          <a href="/register" class="btn-primary w-full sm:w-auto">
            Get Started
            <ArrowRight class="w-4 h-4" />
          </a>
          <a href="/login" class="btn-secondary w-full sm:w-auto">
            Sign In
          </a>
        </div>
        
        <!-- Tech Stack -->
        <div class="flex flex-wrap items-center justify-center gap-2 text-sm text-neutral-600 animate-fade-in" style="animation-delay: 0.4s">
          <span>SvelteKit</span>
          <span class="text-neutral-800">·</span>
          <span>TypeScript</span>
          <span class="text-neutral-800">·</span>
          <span>Tailwind</span>
          <span class="text-neutral-800">·</span>
          <span>Drizzle</span>
          <span class="text-neutral-800">·</span>
          <span>D1</span>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Features Section -->
  <section class="section border-t border-neutral-800/50">
    <div class="container-tight">
      <div class="text-center mb-16">
        <h2 class="font-display text-display-sm text-neutral-100 mb-4">
          Everything you need
        </h2>
        <p class="text-neutral-500 max-w-lg mx-auto">
          Carefully selected tools and patterns for building production-ready applications
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each features as feature, i}
          {@const Icon = feature.icon}
          <div 
            class="group p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/50 hover:border-neutral-700/50 hover:bg-neutral-900/50 transition-all duration-300"
            style="animation-delay: {i * 0.1}s"
          >
            <div class="flex items-start gap-4">
              <div class="w-11 h-11 rounded-xl bg-neutral-800 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-500/10 transition-colors duration-300">
                <Icon class="w-5 h-5 text-neutral-400 group-hover:text-accent-500 transition-colors duration-300" />
              </div>
              <div>
                <h3 class="font-display font-semibold text-neutral-200 mb-1">
                  {feature.title}
                </h3>
                <p class="text-neutral-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  
  <!-- Quick Start Section -->
  <section class="section border-t border-neutral-800/50">
    <div class="container-tight">
      <div class="card-elevated p-8 sm:p-12">
        <div class="max-w-2xl mx-auto text-center mb-10">
          <h2 class="font-display text-display-sm text-neutral-100 mb-4">
            Quick Start
          </h2>
          <p class="text-neutral-500">
            Get up and running in minutes
          </p>
        </div>
        
        <div class="bg-neutral-950 rounded-xl p-6 font-mono text-sm border border-neutral-800">
          <div class="space-y-3">
            <p>
              <span class="text-neutral-600">$</span>
              <span class="text-neutral-400">git clone https://github.com/yourusername/sveltekit-starter.git</span>
            </p>
            <p>
              <span class="text-neutral-600">$</span>
              <span class="text-neutral-400">cd sveltekit-starter && npm install</span>
            </p>
            <p>
              <span class="text-neutral-600">$</span>
              <span class="text-neutral-400">cp .env.example .env</span>
            </p>
            <p>
              <span class="text-neutral-600">$</span>
              <span class="text-accent-400">npm run dev</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
