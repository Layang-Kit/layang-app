# Performance Optimization Guide

Best practices untuk optimize performance aplikasi SvelteKit di edge environment.

---

## 📊 Performance Metrics

### Core Web Vitals Target

| Metric | Good | Poor | How to Measure |
|--------|------|------|----------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | > 4s | Lighthouse, Web Vitals |
| **FID** (First Input Delay) | < 100ms | > 300ms | Real User Monitoring |
| **CLS** (Cumulative Layout Shift) | < 0.1 | > 0.25 | Lighthouse |
| **TTFB** (Time to First Byte) | < 200ms | > 600ms | DevTools Network |
| **FCP** (First Contentful Paint) | < 1.8s | > 3s | Lighthouse |

### Custom Metrics

```javascript
// Measure Server-Side Rendering time
export const load = async ({ locals }) => {
  const start = performance.now();
  
  const data = await locals.db.query.users.findMany();
  
  const duration = performance.now() - start;
  console.log(`DB Query: ${duration}ms`);
  
  return { data };
};
```

---

## ⚡ Server-Side Optimization

### 1. Database Query Optimization

**❌ N+1 Query Problem:**
```typescript
// BAD: 1 query untuk users, N query untuk posts
const users = await db.query.users.findMany();
for (const user of users) {
  user.posts = await db.query.posts.findMany({
    where: eq(posts.authorId, user.id)
  });
}
// Total: 1 + N queries
```

**✅ Solution (Join):**
```typescript
// GOOD: Single query dengan join
const result = await db
  .select({
    user: users,
    post: posts
  })
  .from(users)
  .leftJoin(posts, eq(users.id, posts.authorId));
// Total: 1 query
```

**✅ Solution (Select Specific Columns):**
```typescript
// BAD: Select semua columns
const users = await db.select().from(users);

// GOOD: Select only needed columns
const users = await db
  .select({
    id: users.id,
    name: users.name,
    avatar: users.avatar
  })
  .from(users);
```

---

### 2. Database Indexing

**When to Add Index:**
```sql
-- columns yang sering di-where atau di-join
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_author ON posts(authorId);
CREATE INDEX idx_sessions_user ON sessions(userId);
```

**Check Query Performance:**
```bash
npx wrangler d1 execute DB --local --command "EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'test@test.com'"
```

---

### 3. Caching Strategies

#### Memory Cache (Short-term)

```typescript
// Simple in-memory cache
const cache = new Map<string, { data: any; expiry: number }>();

export const load = async ({ locals }) => {
  const cacheKey = 'users-list';
  const cached = cache.get(cacheKey);
  
  if (cached && cached.expiry > Date.now()) {
    return { users: cached.data };
  }
  
  const users = await locals.db.query.users.findMany();
  
  cache.set(cacheKey, {
    data: users,
    expiry: Date.now() + 60000 // 1 minute
  });
  
  return { users };
};
```

#### Cache Headers

```typescript
export const load = async ({ setHeaders }) => {
  setHeaders({
    'Cache-Control': 'public, max-age=60' // Cache 1 minute
  });
  
  return { data: await fetchData() };
};
```

---

### 4. Streaming

**Streaming untuk Large Data:**
```svelte
<script>
  import { stream } from '$lib/streaming';
  
  // Data streams in as it becomes available
  export let data;
</script>

{#await data.users}
  <Loading />
{:then users}
  {#each users as user}
    <UserCard {user} />
  {/each}
{/await}
```

---

## 🎨 Frontend Optimization

### 1. Code Splitting

**Automatic (by SvelteKit):**
```
┌─────────────────────────────────────┐
│  routes/                            │
│    ├── +page.svelte → page.js       │
│    ├── about/+page.svelte → about.js│
│    └── admin/+page.svelte → admin.js│
└─────────────────────────────────────┘
// Each route = separate chunk
```

**Manual (Dynamic Import):**
```svelte
<script>
  import { onMount } from 'svelte';
  
  let HeavyComponent;
  
  onMount(async () => {
    // Load hanya ketika diperlukan
    const module = await import('./HeavyComponent.svelte');
    HeavyComponent = module.default;
  });
</script>

<svelte:component this={HeavyComponent} />
```

---

### 2. Image Optimization

**Use WebP Format:**
```svelte
<!-- BAD: Large JPG -->
<img src="photo.jpg" alt="Photo" />

<!-- GOOD: WebP with fallback -->
<picture>
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="Photo" loading="lazy" />
</picture>
```

**Lazy Loading:**
```svelte
<!-- Images below fold -->
<img src="image.jpg" loading="lazy" alt="Description" />

<!-- Critical above-fold image -->
<img src="hero.jpg" loading="eager" alt="Hero" />
```

**Responsive Images:**
```svelte
<img 
  srcset="small.jpg 300w, medium.jpg 600w, large.jpg 900w"
  sizes="(max-width: 600px) 300px, (max-width: 900px) 600px, 900px"
  src="large.jpg"
  alt="Responsive"
/>
```

---

### 3. Virtual Lists untuk Large Data

**❌ Rendering 10,000 items:**
```svelte
{#each items as item}
  <ItemRow {item} />
{/each}
<!-- Browser freeze! -->
```

**✅ Virtual Scrolling:**
```svelte
<script>
  import VirtualList from 'svelte-virtual-list';
</script>

<VirtualList items={items} let:item>
  <ItemRow {item} />
</VirtualList>
<!-- Only renders visible items -->
```

---

### 4. Reactive Statement Optimization

**❌ Heavy Computation:**
```svelte
<script>
  let items = [];
  
  // Jalan tiap kali items berubah
  $: sortedItems = items.sort((a, b) => 
    complexComparison(a, b)
  );
</script>
```

**✅ Memoization:**
```svelte
<script>
  import { memoize } from 'lodash-es';
  
  let items = [];
  
  const sortItems = memoize(
    (items) => items.sort(complexComparison),
    (items) => items.length // cache key
  );
  
  $: sortedItems = sortItems(items);
</script>
```

---

### 5. Avoid Layout Thrashing

**❌ Forced Reflow:**
```javascript
// BAD: Read, Write, Read, Write
const height = element.offsetHeight; // Read
element.style.height = (height + 10) + 'px'; // Write
const newHeight = element.offsetHeight; // Read (forced reflow!)
```

**✅ Batch Reads and Writes:**
```javascript
// GOOD: Read all, then Write all
const height = element.offsetHeight;
const width = element.offsetWidth;

requestAnimationFrame(() => {
  element.style.height = (height + 10) + 'px';
  element.style.width = (width + 10) + 'px';
});
```

---

## 🗄️ Database Optimization

### 1. Pagination

**Offset-based (Simple, tapi lambat di page besar):**
```typescript
const page = 1;
const limit = 20;
const offset = (page - 1) * limit;

const posts = await db
  .select()
  .from(posts)
  .limit(limit)
  .offset(offset);
```

**Cursor-based (Faster untuk large datasets):**
```typescript
// First page
const posts = await db
  .select()
  .from(posts)
  .orderBy(desc(posts.createdAt))
  .limit(20);

// Next page (use last item's cursor)
const lastPost = posts[posts.length - 1];
const nextPosts = await db
  .select()
  .from(posts)
  .where(lt(posts.createdAt, lastPost.createdAt))
  .orderBy(desc(posts.createdAt))
  .limit(20);
```

---

### 2. Connection Pooling

D1 automatic handling, tapi untuk external DBs:

```typescript
// drizzle.config.ts dengan pooling
export default {
  // ...
  dbCredentials: {
    // Use connection pooler untuk production
    url: process.env.DATABASE_URL,
  },
};
```

---

### 3. Batch Operations

**❌ Individual Inserts:**
```typescript
for (const user of users) {
  await db.insert(users).values(user); // N queries
}
```

**✅ Batch Insert:**
```typescript
await db.insert(users).values(users); // 1 query
```

---

## 🌐 Network Optimization

### 1. Compression

Cloudflare automatic gzip/brotli, tapi verify:
```bash
curl -H "Accept-Encoding: br" -I https://yoursite.com
# Check for: content-encoding: br
```

---

### 2. Preload Critical Resources

```svelte
<!-- In +page.svelte -->
<svelte:head>
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://api.example.com">
</svelte:head>
```

---

### 3. Service Worker (Advanced)

```typescript
// service-worker.ts
import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  // Cache-first strategy untuk assets
  if (ASSETS.includes(event.request.url)) {
    event.respondWith(caches.match(event.request));
  }
});
```

---

## 🔍 Monitoring & Profiling

### 1. Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://preview-url.pages.dev/
          budgetPath: ./lighthouse-budget.json
```

---

### 2. Web Vitals Tracking

```svelte
<!-- +layout.svelte -->
<script>
  import { onMount } from 'svelte';
  
  onMount(() => {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  });
</script>
```

---

### 3. Sentry Integration

```typescript
// hooks.client.ts
import * as Sentry from '@sentry/svelte';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

---

## 📈 Benchmarks

### Local Development

```bash
# Build size analysis
npm run build
npx vite-bundle-visualizer

# Lighthouse check
npm install -g lighthouse
lighthouse http://localhost:5173 --output=json
```

### Production Monitoring

| Metric | Before | After Optimization |
|--------|--------|-------------------|
| Bundle Size | 150KB | 75KB |
| LCP | 3.2s | 1.4s |
| Time to Interactive | 4.5s | 2.1s |
| DB Query Time | 120ms | 15ms |

---

## ✅ Performance Checklist

### Pre-deployment

- [ ] Lighthouse score > 90
- [ ] Bundle size < 100KB initial
- [ ] Images optimized (WebP, lazy)
- [ ] Fonts preloaded
- [ ] Critical CSS inlined
- [ ] Gzip/Brotli enabled

### Database

- [ ] Indexes pada query yang sering di-where/join
- [ ] Pagination untuk lists > 50 items
- [ ] Batch operations (bukan N+1)
- [ ] Select specific columns (bukan SELECT *)

### Code

- [ ] Dynamic imports untuk heavy components
- [ ] Virtual lists untuk large datasets
- [ ] Reactive statements optimized
- [ ] No memory leaks (unsubscribe events)

---

**💡 Remember:** Premature optimization is the root of all evil. Profile first, then optimize! 🚀
