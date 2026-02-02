# Architecture Decision Records (ADR)

Dokumentasi keputusan arsitektural penting dan alasannya.

---

## ADR-001: SvelteKit sebagai Framework

### Status
✅ Accepted

### Context
Memilih framework utama untuk full-stack development dengan requirement:
- Server-side rendering (SSR) untuk SEO
- TypeScript support
- Edge deployment ready
- Developer experience yang baik

### Options Considered

| Framework | SSR | Edge | Bundle Size | DX Score |
|-----------|-----|------|-------------|----------|
| SvelteKit | ✅ | ✅ | Small | ⭐⭐⭐⭐⭐ |
| Next.js | ✅ | ⚠️ | Large | ⭐⭐⭐⭐ |
| Nuxt | ✅ | ⚠️ | Medium | ⭐⭐⭐⭐ |
| Remix | ✅ | ⚠️ | Medium | ⭐⭐⭐⭐ |
| Astro | ⚠️ | ✅ | Small | ⭐⭐⭐⭐ |

### Decision
**Pilih SvelteKit**

### Consequences

**Positive:**
- Compile-time optimization (no virtual DOM overhead)
- File-based routing sederhana
- Built-in form actions dengan progressive enhancement
- Native TypeScript support
- Output yang kecil dan cepat

**Negative:**
- Ecosystem lebih kecil dari React
- Hiring pool developer lebih kecil
- Learning curve untuk tim yang terbiasa React

### Rationale
SvelteKit menawarkan best-in-class DX dengan output yang optimal. Compile-time approach memberikan performance yang lebih baik daripada runtime VDOM. Edge deployment support merupakan requirement utama.

---

## ADR-002: Cloudflare D1 sebagai Database

### Status
✅ Accepted

### Context
Memilih database solution untuk edge-first application dengan consideration:
- Edge deployment (data harus dekat dengan user)
- SQL interface (familiarity)
- Cost-effective untuk small-medium scale
- Transaction support

### Options Considered

| Database | Edge | SQL | Cost (Free Tier) | Replication |
|----------|------|-----|------------------|-------------|
| Cloudflare D1 | ✅ | ✅ | 500MB | Global |
| PostgreSQL (Neon) | ⚠️ | ✅ | 500MB | Single region |
| Turso (libSQL) | ✅ | ✅ | 500MB | Global |
| FaunaDB | ✅ | ❌ | 100k ops | Global |
| Supabase | ⚠️ | ✅ | 500MB | Single region |

### Decision
**Pilih Cloudflare D1**

### Consequences

**Positive:**
- True edge deployment (replicated ke 300+ locations)
- SQLite-based (familiar, no server setup)
- Zero cold start
- Cost sangat rendah
- Native integration dengan Workers

**Negative:**
- Write latency (eventual consistency)
- 500MB limit pada free tier
- Tidak cocok untuk complex transactions
- Mature ecosystem kurang dari PostgreSQL

### Rationale
D1 adalah pilihan natural untuk edge-first application yang deploy ke Cloudflare. SQLite cukup untuk 90% use case web apps. Global replication memberikan read latency yang excellent.

### Mitigation
- Untuk write-heavy workloads, pertimbangkan write-through cache
- Untuk complex analytics, export ke data warehouse

---

## ADR-003: Drizzle ORM vs Prisma

### Status
✅ Accepted

### Context
Memilih ORM untuk database abstraction dengan requirement:
- TypeScript support
- Edge runtime compatibility
- Query performance
- Migration support

### Options Considered

| Criteria | Drizzle | Prisma |
|----------|---------|--------|
| Edge Support | ✅ Native | ❌ Requires Data Proxy |
| Bundle Size | ~20KB | ~15MB |
| Query Builder | SQL-like | Fluent API |
| Migrations | ✅ | ✅ |
| Type Safety | ✅ | ✅ |
| Performance | Native SQL | Query engine overhead |

### Decision
**Pilih Drizzle ORM**

### Consequences

**Positive:**
- Native edge support (no additional infrastructure)
- Bundle size minimal
- SQL-like syntax yang transparent
- Zero runtime overhead
- Type inference yang excellent

**Negative:**
- Ecosystem lebih kecil
- IDE support tidak sebagus Prisma
- Relasi handling kurang mature
- Documentation kurang lengkap

### Rationale
Prisma requires Data Proxy untuk edge deployment, menambah complexity dan cost. Drizzle memberikan native edge support dengan approach "SQL in TypeScript" yang lebih transparent.

---

## ADR-004: Lucia Auth vs Auth.js

### Status
✅ Accepted

### Context
Memilih authentication library dengan requirement:
- Session-based auth (bukan JWT)
- Edge runtime support
- Flexible (bawaan DB bisa custom)
- TypeScript support

### Options Considered

| Criteria | Lucia | Auth.js | Custom |
|----------|-------|---------|--------|
| Edge Support | ✅ | ⚠️ | ✅ |
| Session-based | ✅ | ✅ | Manual |
| OAuth | Arctic | Built-in | Manual |
| DB Flexibility | ✅ | Prisma only | Unlimited |
| Complexity | Low | Medium | High |

### Decision
**Pilih Lucia Auth**

### Consequences

**Positive:**
- Designed for edge-first
- Minimal abstraction (easy to audit)
- Works dengan any database (via adapter)
- Excellent TypeScript support
- No magic, easy to debug

**Negative:**
- Lebih banyak boilerplate daripada Auth.js
- Feature set lebih kecil
- Community lebih kecil
- Harus setup OAuth provider sendiri (Arctic)

### Rationale
Lucia designed specifically untuk edge environments. Transparency dan minimal abstraction sesuai dengan philosophy project. Arctic untuk OAuth memberikan flexibility tanpa vendor lock-in.

---

## ADR-005: Session-based vs JWT

### Status
✅ Accepted

### Context
Memilih authentication mechanism dengan trade-off:
- Security vs Scalability
- Revocation capability
- Edge deployment constraints

### Options Considered

| Criteria | Session | JWT |
|----------|---------|-----|
| Revocation | ✅ Instant | ❌ Wait for expiry |
| Storage | Server-side | Client-side |
| Edge Compatible | ✅ | ✅ |
| Stateless | ❌ | ✅ |
| Size | Small (session ID) | Large (claims) |
| Security | Centralized | Distributed |

### Decision
**Pilih Session-based Auth**

### Consequences

**Positive:**
- Instant logout/revocation
- Server controls session lifecycle
- Smaller payload (hanya session ID)
- Easier to audit

**Negative:**
- Requires session storage (D1/SQLite)
- Database lookup setiap request
- Horizontal scaling lebih complex

### Rationale
Untuk web application tradisional, session-based memberikan security dan control yang lebih baik. Edge environment dengan D1 membuat session storage feasible. Instant revocation merupakan requirement penting untuk security.

---

## ADR-006: Tailwind CSS vs CSS-in-JS

### Status
✅ Accepted

### Context
Memilih styling approach dengan consideration:
- Bundle size
- Runtime performance
- Developer experience
- Maintenance

### Options Considered

| Criteria | Tailwind | Styled Components | Vanilla Extract |
|----------|----------|-------------------|-----------------|
| Bundle Size | Small (purge) | Large | Small |
| Runtime | None | JS overhead | None |
| Learning Curve | Medium | Low | Medium |
| Customization | ✅ | ✅ | ✅ |
| Svelte Integration | ✅ | ⚠️ | ✅ |

### Decision
**Pilih Tailwind CSS**

### Consequences

**Positive:**
- Zero runtime overhead
- Consistent design system
- Utility-first productivity
- Excellent purge/bundle optimization
- Native Svelte support

**Negative:**
- HTML menjadi verbose
- Learning curve untuk utility classes
- Custom components require @apply
- Risk of inconsistent design tanpa guidelines

### Rationale
Tailwind menawarkan best balance antara performance dan DX. Utility-first approach scales well untuk team development. Zero runtime overhead critical untuk edge deployment.

---

## ADR-007: Server Load vs API + Client Fetch

### Status
✅ Accepted

### Context
Memilih pattern data fetching dengan consideration:
- Performance
- SEO
- Complexity
- User experience

### Options Considered

| Pattern | Requests | SEO | Initial Load | Hydration |
|---------|----------|-----|--------------|-----------|
| Server Load | 1 | ✅ Good | Fast | Minimal |
| API + Fetch | 2 | ❌ Poor | Loading state | Full |
| SWR/React Query | 2+ | ❌ Poor | Cached | Full |

### Decision
**Prioritaskan Server Load Pattern**

### Consequences

**Positive:**
- Single round-trip
- SEO friendly (full HTML)
- No loading states
- Simpler mental model

**Negative:**
- Data harus tersedia saat render
- Tidak cocok untuk real-time updates
- Page refresh untuk data baru

### Rationale
Untuk content-focused applications, SSR dengan Server Load memberikan UX terbaik. API + Fetch hanya untuk use case spesifik (real-time, heavy data).

---

## ADR-008: Form Actions vs API Endpoints

### Status
✅ Accepted

### Context
Memilih pattern form submission dengan consideration:
- Progressive enhancement
- Complexity
- Validation
- Error handling

### Options Considered

| Criteria | Form Actions | API + on:submit |
|----------|--------------|-----------------|
| No JS Required | ✅ | ❌ |
| Complexity | Low | Medium |
| Validation | Server | Both |
| Error Handling | Built-in | Manual |
| Type Safety | ✅ | Manual |

### Decision
**Gunakan Form Actions sebagai Default**

### Consequences

**Positive:**
- Works tanpa JavaScript
- Progressive enhancement automatic
- Simpler code
- Built-in error handling

**Negative:**
- Page refresh (unless use:enhance)
- Kurang flexible untuk complex interactions
- File upload limitations

### Rationale
Form Actions merupakan feature killer SvelteKit. Progressive enhancement out-of-the-box sesuai dengan web standards. `use:enhance` memberikan SPA experience bila diperlukan.

---

## ADR-009: Monorepo vs Multi-repo

### Status
✅ Accepted

### Context
Organizing codebase untuk full-stack application.

### Decision
**Single Repository (Monolith)**

### Consequences

**Positive:**
- Simple deployment
- Shared types
- Atomic commits
- Easier refactoring
- Single source of truth

**Negative:**
- Scale limitations
- Coupling risk
- CI/CD lebih complex di scale

### Rationale
Untuk small-medium applications, monolith memberikan productivity yang lebih tinggi. Premature optimization untuk split services sebelum scalability requirement jelas.

---

## ADR-010: Environment Variable Strategy

### Status
✅ Accepted

### Context
Managing secrets dan configuration across environments.

### Decision
**Pendekatan Hierarchical:**
1. `.env` untuk local development
2. `.env.example` sebagai template
3. Cloudflare Dashboard untuk production secrets
4. Public env vars dengan `VITE_` prefix

### Consequences

**Positive:**
- Clear separation of concerns
- No secrets in git
- Environment-specific config

**Negative:**
- Manual sync untuk production
- Multiple places untuk check

### Rationale
Security-first approach dengan practical local development experience. Cloudflare Dashboard untuk production memberikan audit trail dan access control.

---

## ADR-011: File Upload Strategy (R2)

### Status
✅ Accepted

### Context
Handling file uploads untuk avatars dan assets.

### Decision
**Direct-to-R2 Uploads**

Flow:
1. Client request presigned URL dari server
2. Server validate authorization
3. Client upload langsung ke R2
4. Server save URL ke database

### Consequences

**Positive:**
- Server tidak handle file bytes
- Scalable
- CDN distribution automatic

**Negative:**
- Extra complexity (presigned URLs)
- Public bucket required

### Rationale
Offload file handling ke storage service mengurangi load pada compute. R2 sebagai Cloudflare service memberikan integration yang seamless.

---

## ADR-012: Email Service (Resend)

### Status
✅ Accepted

### Context
Transactional email untuk verification dan notifications.

### Decision
**Resend untuk Transactional Email**

### Consequences

**Positive:**
- Simple API
- Good deliverability
- Developer experience excellent

**Negative:**
- Newer service (less mature)
- Pricing untuk scale
- Limited templates

### Rationale
Resend menawarkan modern API dengan focus pada developer experience. Alternative considered: SendGrid (complex), AWS SES (setup complexity), Postmark (good but paid).

---

## Decision Log Summary

| ADR | Decision | Status | Date |
|-----|----------|--------|------|
| 001 | SvelteKit | ✅ Accepted | 2024-01 |
| 002 | Cloudflare D1 | ✅ Accepted | 2024-01 |
| 003 | Drizzle ORM | ✅ Accepted | 2024-01 |
| 004 | Lucia Auth | ✅ Accepted | 2024-01 |
| 005 | Session-based Auth | ✅ Accepted | 2024-01 |
| 006 | Tailwind CSS | ✅ Accepted | 2024-01 |
| 007 | Server Load Pattern | ✅ Accepted | 2024-01 |
| 008 | Form Actions | ✅ Accepted | 2024-01 |
| 009 | Monorepo | ✅ Accepted | 2024-01 |
| 010 | Hierarchical Env | ✅ Accepted | 2024-01 |
| 011 | Direct R2 Upload | ✅ Accepted | 2024-01 |
| 012 | Resend Email | ✅ Accepted | 2024-01 |

---

## Revisiting Decisions

Decisions bisa direvisit ketika:
- Requirements berubah signifikan
- New technology emerges (significant benefit)
- Scale requirements exceed current solution
- Security vulnerabilities discovered

Process untuk revisit:
1. Document current pain points
2. Evaluate alternatives
3. Cost-benefit analysis
4. Migration plan
5. Team buy-in
6. Execute dengan monitoring
