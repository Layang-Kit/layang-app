<script lang="ts">
  import { page } from '$app/state';
  import { 
    LayoutDashboard, 
    User, 
    Settings, 
    Users, 
    Hexagon,
    LogOut,
    ChevronLeft,
    ChevronRight,
    type Icon
  } from 'lucide-svelte';
  import type { User as UserType } from '$lib/db/types';

  interface Props {
    user: UserType | null;
    onLogout: () => void;
  }

  let { user, onLogout }: Props = $props();

  let collapsed = $state(false);
  let mobileOpen = $state(false);

  interface NavItem {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: string;
  }

  const mainNav: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  const adminNav: NavItem[] = [
    { href: '/dashboard/users', label: 'Users', icon: Users, badge: 'Admin' },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  function toggleSidebar() {
    collapsed = !collapsed;
  }

  function getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
</script>

<!-- Mobile Overlay -->
{#if mobileOpen}
  <button
    type="button"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
    onclick={() => mobileOpen = false}
    aria-label="Close sidebar"
  ></button>
{/if}

<!-- Mobile Toggle Button -->
<button
  type="button"
  class="fixed top-4 left-4 z-30 lg:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200"
  onclick={() => mobileOpen = !mobileOpen}
  aria-label="Toggle menu"
>
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>

<!-- Sidebar -->
<aside
  class="fixed lg:static inset-y-0 left-0 z-40 bg-neutral-950 border-r border-neutral-800/50 flex flex-col transition-all duration-300 ease-out {mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} {collapsed ? 'w-20' : 'w-64'}"
>
  <!-- Logo -->
  <div class="h-16 flex items-center px-4 border-b border-neutral-800/50">
    <a href="/dashboard" class="flex items-center gap-3 group overflow-hidden">
      <div class="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
        <Hexagon class="w-5 h-5 text-neutral-950" strokeWidth={2.5} />
      </div>
      {#if !collapsed}
        <div class="overflow-hidden">
          <span class="font-display font-bold text-lg text-neutral-100 whitespace-nowrap">Studio</span>
          <span class="block text-[10px] text-neutral-500 -mt-1 whitespace-nowrap">Admin Panel</span>
        </div>
      {/if}
    </a>
    
    <!-- Collapse Toggle (Desktop) -->
    <button
      type="button"
      class="hidden lg:flex ml-auto p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 transition-colors"
      onclick={toggleSidebar}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {#if collapsed}
        <ChevronRight class="w-4 h-4" />
      {:else}
        <ChevronLeft class="w-4 h-4" />
      {/if}
    </button>
  </div>

  <!-- Navigation -->
  <nav class="flex-1 overflow-y-auto py-4 px-3 scrollbar-smooth">
    <!-- Main Navigation -->
    <div class="space-y-1">
      <div class="px-3 mb-2">
        {#if !collapsed}
          <span class="text-xs font-medium text-neutral-500 uppercase tracking-wider">Main</span>
        {:else}
          <div class="h-px bg-neutral-800 mx-auto w-8"></div>
        {/if}
      </div>
      
      {#each mainNav as item}
        {@const isActive = page.url.pathname === item.href}
        <a
          href={item.href}
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group {isActive ? 'bg-accent-500/10 text-accent-500' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'}"
          title={collapsed ? item.label : ''}
        >
          <item.icon class="w-5 h-5 shrink-0 {isActive ? 'text-accent-500' : 'text-neutral-500 group-hover:text-neutral-400'}" />
          {#if !collapsed}
            <span class="truncate">{item.label}</span>
          {/if}
        </a>
      {/each}
    </div>

    <!-- Admin Navigation -->
    <div class="mt-6 space-y-1">
      <div class="px-3 mb-2">
        {#if !collapsed}
          <span class="text-xs font-medium text-neutral-500 uppercase tracking-wider">Management</span>
        {:else}
          <div class="h-px bg-neutral-800 mx-auto w-8"></div>
        {/if}
      </div>
      
      {#each adminNav as item}
        {@const isActive = page.url.pathname === item.href || page.url.pathname.startsWith(item.href + '/')}
        <a
          href={item.href}
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group {isActive ? 'bg-accent-500/10 text-accent-500' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'}"
          title={collapsed ? item.label : ''}
        >
          <item.icon class="w-5 h-5 shrink-0 {isActive ? 'text-accent-500' : 'text-neutral-500 group-hover:text-neutral-400'}" />
          {#if !collapsed}
            <span class="flex-1 truncate">{item.label}</span>
            {#if item.badge}
              <span class="px-2 py-0.5 text-[10px] font-semibold bg-neutral-800 text-neutral-400 rounded-full">{item.badge}</span>
            {/if}
          {/if}
        </a>
      {/each}
    </div>
  </nav>

  <!-- User Section -->
  <div class="border-t border-neutral-800/50 p-3">
    {#if user}
      <div class="relative group">
        <!-- User Card -->
        <div class="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-900 transition-colors cursor-pointer">
          <!-- Avatar -->
          {#if user.avatar}
            <img 
              src={user.avatar} 
              alt={user.name}
              class="w-9 h-9 rounded-xl ring-2 ring-neutral-800 object-cover shrink-0"
            />
          {:else}
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-sm font-bold text-neutral-950 shrink-0">
              {getInitials(user.name)}
            </div>
          {/if}
          
          {#if !collapsed}
            <div class="flex-1 min-w-0 overflow-hidden">
              <p class="text-sm font-medium text-neutral-200 truncate">{user.name}</p>
              <p class="text-xs text-neutral-500 truncate">{user.email}</p>
            </div>
          {/if}
        </div>

        <!-- Dropdown (Desktop) / Always visible actions (Collapsed) -->
        {#if collapsed}
          <div class="mt-2 space-y-1">
            <a
              href="/profile"
              class="flex items-center justify-center p-2 rounded-xl text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900 transition-colors"
              title="Profile"
            >
              <User class="w-4 h-4" />
            </a>
            <button
              type="button"
              onclick={onLogout}
              class="w-full flex items-center justify-center p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              title="Logout"
            >
              <LogOut class="w-4 h-4" />
            </button>
          </div>
        {:else}
          <div class="absolute bottom-full left-0 right-0 mb-2 p-2 bg-neutral-900 border border-neutral-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl">
            <div class="space-y-1">
              <a
                href="/profile"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
              >
                <User class="w-4 h-4" />
                Profile
              </a>
              <button
                type="button"
                onclick={onLogout}
                class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut class="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        {/if}
      </div>
    {:else}
      <div class="flex items-center justify-center py-2">
        <div class="w-8 h-8 rounded-xl bg-neutral-800 animate-pulse"></div>
      </div>
    {/if}
  </div>
</aside>
