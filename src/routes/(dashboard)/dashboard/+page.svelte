<script lang="ts">
  import { onMount } from 'svelte';
  import type { User } from '$lib/db/types';
  import { 
    Users, 
    TrendingUp, 
    Shield, 
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    MoreHorizontal,
    Loader2
  } from 'lucide-svelte';
  
  interface Stats {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    icon: typeof Users;
  }
  
  let users = $state<User[]>([]);
  let usersLoading = $state(true);
  let recentActivity = $state([
    { id: 1, action: 'New user registered', user: 'john@example.com', time: '2 min ago', type: 'user' },
    { id: 2, action: 'Profile updated', user: 'sarah@example.com', time: '1 hour ago', type: 'profile' },
    { id: 3, action: 'Password changed', user: 'mike@example.com', time: '3 hours ago', type: 'security' },
    { id: 4, action: 'New user registered', user: 'emma@example.com', time: '5 hours ago', type: 'user' },
  ]);
  
  onMount(async () => {
    await loadUsers();
  });
  
  async function loadUsers() {
    try {
      const res = await fetch('/api/users');
      const json = await res.json() as { data: User[] };
      users = json.data || [];
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      usersLoading = false;
    }
  }
  
  // Mock stats data
  const stats: Stats[] = [
    { 
      label: 'Total Users', 
      value: '0', 
      change: '+12%', 
      trend: 'up',
      icon: Users 
    },
    { 
      label: 'Active Sessions', 
      value: '24', 
      change: '+5%', 
      trend: 'up',
      icon: Activity 
    },
    { 
      label: 'Security Score', 
      value: '98%', 
      change: '+2%', 
      trend: 'up',
      icon: Shield 
    },
    { 
      label: 'Growth Rate', 
      value: '23%', 
      change: '-3%', 
      trend: 'down',
      icon: TrendingUp 
    },
  ];
  
  $effect(() => {
    if (!usersLoading) {
      stats[0].value = users.length.toString();
    }
  });
  
  function getActivityIcon(type: string) {
    switch (type) {
      case 'user': return '👤';
      case 'profile': return '✏️';
      case 'security': return '🔒';
      default: return '📋';
    }
  }
</script>

<svelte:head>
  <title>Dashboard | Studio</title>
</svelte:head>

<div class="p-6 lg:p-8 max-w-7xl mx-auto">
  <!-- Header -->
  <div class="mb-8">
    <div class="flex items-center gap-2 text-sm text-neutral-500 mb-2">
      <span>Overview</span>
      <span>/</span>
      <span class="text-neutral-300">Dashboard</span>
    </div>
    <h1 class="text-2xl font-display font-bold text-neutral-100">Dashboard Overview</h1>
    <p class="text-neutral-500 mt-1">Welcome back! Here's what's happening with your account.</p>
  </div>
  
  <!-- Stats Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {#each stats as stat}
      {@const Icon = stat.icon}
      <div class="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-all duration-300 group">
        <div class="flex items-start justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center group-hover:bg-accent-500/10 transition-colors">
            <Icon class="w-5 h-5 text-neutral-400 group-hover:text-accent-500 transition-colors" />
          </div>
          <div class="flex items-center gap-1 text-xs font-medium">
            {#if stat.trend === 'up'}
              <ArrowUpRight class="w-3 h-3 text-emerald-400" />
              <span class="text-emerald-400">{stat.change}</span>
            {:else if stat.trend === 'down'}
              <ArrowDownRight class="w-3 h-3 text-rose-400" />
              <span class="text-rose-400">{stat.change}</span>
            {:else}
              <span class="text-neutral-500">{stat.change}</span>
            {/if}
          </div>
        </div>
        <p class="text-2xl font-bold text-neutral-100">{stat.value}</p>
        <p class="text-sm text-neutral-500 mt-1">{stat.label}</p>
      </div>
    {/each}
  </div>
  
  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Users Table -->
    <div class="lg:col-span-2 bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden">
      <div class="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-neutral-100">Recent Users</h3>
          <p class="text-sm text-neutral-500 mt-0.5">Latest registered users in your system</p>
        </div>
        <a 
          href="/dashboard/users" 
          class="text-sm font-medium text-accent-500 hover:text-accent-400 transition-colors flex items-center gap-1"
        >
          View all
          <ArrowUpRight class="w-4 h-4" />
        </a>
      </div>
      
      {#if usersLoading}
        <div class="flex items-center justify-center py-16">
          <Loader2 class="w-6 h-6 animate-spin text-accent-500" />
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-neutral-800/50">
                <th class="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">User</th>
                <th class="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Provider</th>
                <th class="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th class="text-right text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-800/50">
              {#each users.slice(0, 5) as user}
                <tr class="hover:bg-neutral-900/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      {#if user.avatar}
                        <img src={user.avatar} alt={user.name} class="w-9 h-9 rounded-xl ring-2 ring-neutral-800 object-cover" />
                      {:else}
                        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-sm font-bold text-neutral-950">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      {/if}
                      <div>
                        <p class="font-medium text-neutral-200">{user.name}</p>
                        <p class="text-sm text-neutral-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800 text-neutral-400 capitalize">
                      {user.provider}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Active
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right text-sm text-neutral-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                  </td>
                </tr>
              {:else}
                <tr>
                  <td colspan="4" class="px-6 py-12 text-center text-neutral-500">
                    No users found
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
    
    <!-- Activity & Quick Actions -->
    <div class="space-y-6">
      <!-- Recent Activity -->
      <div class="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-800">
          <h3 class="font-semibold text-neutral-100">Recent Activity</h3>
          <p class="text-sm text-neutral-500 mt-0.5">Latest actions in your system</p>
        </div>
        <div class="p-4 space-y-1">
          {#each recentActivity as activity}
            <div class="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-900 transition-colors group">
              <div class="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0 text-lg">
                {getActivityIcon(activity.type)}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-neutral-200">{activity.action}</p>
                <p class="text-sm text-neutral-500 truncate">{activity.user}</p>
                <div class="flex items-center gap-1 mt-1 text-xs text-neutral-600">
                  <Clock class="w-3 h-3" />
                  {activity.time}
                </div>
              </div>
            </div>
          {/each}
        </div>
        <div class="px-6 py-3 border-t border-neutral-800">
          <button class="text-sm text-neutral-500 hover:text-neutral-300 transition-colors flex items-center justify-center gap-1 w-full">
            <MoreHorizontal class="w-4 h-4" />
            View all activity
          </button>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="bg-gradient-to-br from-accent-500/10 to-accent-600/5 border border-accent-500/20 rounded-2xl p-6">
        <h3 class="font-semibold text-accent-400 mb-2">Pro Tip</h3>
        <p class="text-sm text-neutral-400 mb-4">
          Manage your users efficiently by using the bulk actions feature in the Users section.
        </p>
        <a 
          href="/dashboard/users" 
          class="inline-flex items-center gap-2 text-sm font-medium text-accent-500 hover:text-accent-400 transition-colors"
        >
          Manage Users
          <ArrowUpRight class="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
</div>
