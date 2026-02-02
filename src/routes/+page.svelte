<script lang="ts">
  import { User, Database, ArrowRight } from 'lucide-svelte';
</script>

<div class="space-y-8">
  <div class="text-center space-y-4">
    <h1 class="text-4xl font-bold text-blue-400">SvelteKit + D1 + Drizzle</h1>
    <p class="text-gray-400">Full-stack edge-ready boilerplate</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <a href="/dashboard" class="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition flex items-center justify-between">
      <div class="flex items-center gap-3">
        <User class="w-6 h-6 text-blue-400" />
        <span>Manage Users</span>
      </div>
      <ArrowRight class="w-5 h-5" />
    </a>
    
    <div class="p-6 bg-gray-800 rounded-lg flex items-center gap-3">
      <Database class="w-6 h-6 text-green-400" />
      <span>D1 Database Connected</span>
    </div>
  </div>
</div>
