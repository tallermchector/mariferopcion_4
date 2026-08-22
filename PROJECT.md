# Project: Marifer E-commerce UX/UI & Design System Optimization

## Architecture
- **Framework**: Next.js 16 App Router + React 19 + TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables in `:root` (`src/app/globals.css`)
- **Animation**: `motion` (`motion/react` v12) with spring physics and `useReducedMotion()` support
- **State Management**: React Context (`CartContext` for cart state and drawer visibility)
- **Data Persistence**: Prisma ORM with SQLite (`prisma/dev.db`)
- **Design System Core Tokens**:
  - Primary Plum: `#452453`
  - Deep Plum: `#241230`
  - Warm White Page Background: `#fffcff`
  - Soft Lilac: `#f2e6f4`
  - Lavender Accent: `#caa8d3`
  - Border Lilac: `#e3cde8`
  - Hairline Border: `#e8e3ec`
  - Default Border: `#d3ccd8`
  - Sale Pink AA: `#c23b64` (5.1:1 AA contrast on white)
  - Announce Tobacco on Cream: `#7a5222` on `#fbf1de` (6.1:1 AA)
  - Stock Green: `#146043` / `#1f8a5f`
- **Typography Hierarchy**:
  - Headings / Displays: `Outfit` (`--font-outfit`, `.font-display`, letter-spacing `-0.025em`)
  - Body / Paragraphs: `Manrope` (`--font-manrope`, `.font-body`, line-height 1.5)
  - Brand Mark: `Lobster Two` 700 Italic (`--font-brand`, `.font-logo`, cursive, strictly for "Marifer")
  - Tabular Numbers & Currency: `JetBrains Mono` (`--font-mono`, `.font-mono-tabular`, `font-variant-numeric: tabular-nums`)
- **Custom Plum Shadow System**:
  - `shadow-marifer-sm`: `0 1px 2px rgba(36, 18, 48, 0.06)`
  - `shadow-marifer-hover`: `0 14px 36px rgba(36, 18, 48, 0.14)`
  - `shadow-marifer-btn`: `0 6px 18px rgba(69, 36, 83, 0.24)`

---

## Code Layout
- `src/app/globals.css`: Global styles, CSS custom properties, shadows, font classes, and accessibility media queries
- `src/app/layout.tsx`: Root layout, Google Fonts loading, cart provider wrapper
- `src/app/page.tsx`: Landing page (Hero 7/5 with InlineWord, Bento 5/4/3·3/4/5, Editorial Zig-zag)
- `src/app/products/page.tsx`: Catalog view with filter pills, sorting, and responsive product grid
- `src/app/product/[id]/page.tsx`: PDP with 7/5 split, gallery, and stepper add-to-bag
- `src/app/cart/page.tsx`: Cart & checkout review page
- `src/app/(auth)/login/page.tsx` & `src/app/(auth)/register/page.tsx`: Authentication cards with accessible forms
- `src/app/not-found.tsx`: Custom 404 with Marifer illustration and CTAs
- `src/app/loading.tsx`: Shimmer skeleton matching product card layout
- `src/app/error.tsx`: Branded error boundary with retry CTA
- `src/components/`: Modular React components (`Navbar`, `Footer`, `ProductCard`, `ProductGrid`, `CartDrawer`, `CartControl`, `AddToCartButton`, `ProductDetailGallery`, `EmptyIllustration`)
- `src/context/CartContext.tsx`: Cart state, total calculations, drawer toggle
- `src/lib/`: Utilities (`format.ts` for UYU currency & installments, `shipping.ts` for free shipping threshold, `db.ts` for Prisma client)
- `test/`: Test infrastructure and test suites (Vitest, RTL, vitest-axe, unit/integration/a11y tests)

---

## Feature Inventory

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Canonical Color Tokens | Zero generic tailwind neutrals (`gray-*`, `slate-*`, etc.); 100% adherence to Marifer plum palette | M1 | ORIGINAL_REQUEST §R1, DESIGN.md §2 |
| 2 | Tabular Number Formatting | All prices, discounts, quantities, installment breakdowns, and item counts wrapped in `font-mono-tabular` | M1 | ORIGINAL_REQUEST §R1, DESIGN.md §3 |
| 3 | Custom Plum Shadows | All cards, buttons, drawers use `shadow-marifer-*`; eliminate non-canonical `shadow-xs` | M1 | ORIGINAL_REQUEST §R1, DESIGN.md §2 |
| 4 | Brand Logo & Font Rules | `Outfit` displays, `Manrope` body, `Lobster Two` logo, `JetBrains Mono` numbers; fix off-palette hex & focus rings | M1 | ORIGINAL_REQUEST §R1, MASTER.md §2 |
| 5 | Asymmetric Hero 7/5 | 7/5 split grid, `InlineWord` punctuation with mobile pill fallback, no overlaid text | M2 | ORIGINAL_REQUEST §R2, DESIGN.md §4 |
| 6 | Mirrored Bento Category Grid | 5/4/3 and 3/4/5 category layout with labels strictly outside images | M2 | ORIGINAL_REQUEST §R2, DESIGN.md §4 |
| 7 | Editorial Zig-Zag Story Blocks | Alternating 6/6 image/text editorial blocks with responsive order | M2 | ORIGINAL_REQUEST §R2, DESIGN.md §4 |
| 8 | Responsive Touch Targets (≥44px) | Upgrade catalog sort pills from `h-9` (36px) to `h-11` (44px); verify all interactive tap zones | M2 | ORIGINAL_REQUEST §R2, DESIGN.md §7 |
| 9 | Branded Error Boundary (`error.tsx`) | Custom error boundary with `EmptyIllustration`, Outfit typography, and reset CTA | M2 | Survey Finding, DESIGN.md §5 |
| 10 | Accessible Focus Trap & Return Focus | Complete focus trap loop, return focus on close, and body scroll locking in `CartDrawer` | M3 | ORIGINAL_REQUEST §R3, DESIGN.md §5 |
| 11 | WCAG 2.2 AA Contrast Adherence | Text & badge contrast verification (5.1:1 sale badges, 6.1:1 announce bar, 8.1:1 text on lila, fix footer link) | M3 | ORIGINAL_REQUEST §R3, MASTER.md §2 |
| 12 | Accessible Forms & Alerts | `htmlFor`/`id` bindings, `aria-invalid`, `aria-describedby` referencing `role="alert"` errors in auth/promo | M3 | ORIGINAL_REQUEST §R3, MASTER.md §6 |
| 13 | Spring Physics & Reduced Motion | `motion/react` spring transitions with `useReducedMotion()` and CSS media query reset | M3 | ORIGINAL_REQUEST §R3, DESIGN.md §6 |
| 14 | E2E & Component Test Infrastructure | Automated test suite with Vitest + React Testing Library + vitest-axe covering Tiers 1–4 | E2E-TEST | Project Pattern Dual Track |
| 15 | 100% E2E Pass & Adversarial Hardening | Verification of 100% test pass (Tiers 1-4) and Tier 5 adversarial stress hardening | M4 | Project Pattern Dual Track |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Test harness setup (Vitest + RTL + vitest-axe), test cases across Tiers 1-4, publication of `TEST_READY.md` | none | PLANNED |
| M1 | Design Tokens, Typography & Contrast Refinements | Fix missing tabular numbers, sort pill shadows, off-palette hex, footer contrast, input focus rings | none | PLANNED |
| M2 | Layouts, Touch Targets & Error Boundary | Upgrade sort pills to `h-11` (44px), add `src/app/error.tsx`, verify responsive layouts | M1 | PLANNED |
| M3 | Accessibility, Modal Focus Trap & Micro-interactions | Implement Focus Trap, Return Focus, and scroll locking in `CartDrawer`; verify form alerts and motion | M1 | PLANNED |
| M4 | Final Milestone (Dual Track Convergence & Hardening) | Phase 1: 100% E2E test pass (Tiers 1-4). Phase 2: Tier 5 adversarial test hardening with Challenger | E2E, M2, M3 | PLANNED |

---

## Interface Contracts

### CartContext ↔ CartDrawer / Components
- `isOpen: boolean`
- `openCart: () => void`
- `closeCart: () => void`
- `items: CartItem[]`
- `addItem: (product: Product, quantity?: number) => void`
- `updateQuantity: (productId: string, quantity: number) => void`
- `removeItem: (productId: string) => void`
- `clearCart: () => void`
- `totalItems: number`
- `subtotal: number`
- `freeShippingRemaining: number`

### Formatting Contract (`src/lib/format.ts`)
- `formatUYU(amount: number): string` -> `"$ 1.290"`
- `calculateInstallments(amount: number, cuotas?: number): InstallmentInfo` -> `{ cuotas: 6, installmentAmount: number, installmentText: string, fullText: string }`

### Shipping Contract (`src/lib/shipping.ts`)
- `FREE_SHIPPING_THRESHOLD = 3500`
- `SHIPPING_COST = 220`
- `calculateShipping(subtotal: number): { shipping: number, freeShippingProgress: number, freeShippingRemaining: number, isFreeShipping: boolean }`
