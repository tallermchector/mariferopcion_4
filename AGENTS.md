# AGENTS.md — Marifer Ecommerce (Next.js 15 + Bun)

## Quick Reference

| Task | Command |
|------|---------|
| Install deps | `bun install` |
| Dev server | `bun run dev` |
| Build | `bun run build` (runs `prisma generate && next build`) |
| Lint | `bun run lint` (eslint flat config) |
| Typecheck | `bunx tsc --noEmit` |
| Prisma generate | `bunx prisma generate` |
| Prisma db push | `bunx prisma db push` |
| Seed DB | `bun run prisma/seed.ts` |
| Prisma Studio | `bunx prisma studio` |
| Test | `bun run test` (vitest) |

## Critical Conventions

**Package manager**: Bun only (`bun.lock` committed). Do not use pnpm/npm.

**Build order**: `lint` passes during build (`eslint.ignoreDuringBuilds: true`), but `typecheck` fails build (`typescript.ignoreBuildErrors: false`). Run lint + typecheck separately before committing.

**Next 15**: `params` and `searchParams` in Server Components are **Promises** — always `await` them.

**Database**: SQLite at `prisma/dev.db` (committed). `DATABASE_URL` defaults to `file:./dev.db` via `src/lib/prisma.ts` singleton.

**Prisma Client**: Run `bunx prisma generate` after schema changes. Type errors on Prisma results = missing generate.

**Images**: Only `picsum.photos` and `images.unsplash.com` allowed (see `next.config.ts` remotePatterns).

## Architecture Highlights

- **Server Components** (`src/app/*/page.tsx`) query Prisma directly with `revalidate = 60`
- `/product/[id]` resolves by `id` OR `slug` (`findFirst` with `OR`)
- `/products` filters: `?category=<slug>`, `?query=`, `?sort=newest|price-asc|price-desc|rating|sale`
- **Cart**: Client-only, stored in `localStorage` (`marifer_ecommerce_cart`). Does NOT use `CartItem` DB table.
- **Shipping constants**: `src/lib/shipping.ts` — `SHIPPING_COST = 220`, `FREE_SHIPPING_THRESHOLD = 3500`
- **Auth**: Mock only (`(auth)/login`, `(auth)/register`) — no real session
- **Price formatting**: Always use `src/lib/format.ts` helpers (`formatPriceUYU`, `calculateInstallmentsUYU`)

## Design System

- **Implementation source of truth**: `design-system/marifer/MASTER-archived-2026-08-22.md` (tokens, components, a11y checklist, motion rules)
- **Stitch prompts**: `DESIGN.md` (root) — semantic prompts for Google Stitch generation
- **Palette**: CSS vars in `src/app/globals.css` (violeta `#452453`, lila tones, accent sale `#c23b64` for AA text)
- **Fonts**: Outfit (display), Manrope (body), Lobster Two (logo), JetBrains Mono (prices)
- **Components**: Inline hex via Tailwind (`bg-[#452453]`), no `neutral-*`/`indigo-*` classes
- **Copy**: Español rioplatense with voseo ("Comprá", "Conocé")

## Known Gotchas

- `Product.images` is JSON string — `JSON.parse()` required (see `ProductDetailGallery`)
- `ProductCard` color swatches + "S – L" size hardcoded by product ID (not in DB)
- Footer links to `/faq`, `/about`, `/stores`, `/careers` → 404
- `DISABLE_HMR=true` in AI Studio disables webpack file watching — don't modify that block
- `tsconfig` maps `@/*` to both `./src/*` and `./*`
- If `prisma/dev.db` corrupted: `bunx prisma db push` + re-seed

## Testing

- Vitest + jsdom + React Testing Library
- Setup: `test/setup.ts` (mocks `next/image`, `next/navigation`, `localStorage`, `matchMedia`)
- Run single test: `bun run test -- path/to/test.tsx`
- A11y: `vitest-axe` matchers available