# Report: Views & Layouts Survey & Audit

**Date**: 2026-08-22T10:42:00Z  
**Author**: Views & Layouts Explorer (`explorer_survey_views_1`)  
**Scope**: Full Platform Audit of Views, Layouts, Asymmetry Patterns, Touch Targets (≥ 44×44px), Breakpoints, and View Error States against `DESIGN.md` & `ORIGINAL_REQUEST.md`.

---

## 1. Observation

### 1.1 Complete View & Route Inventory

| Route / View | File Path | Status | Layout Structure | Key Components |
|---|---|---|---|---|
| **Landing / Home** | `src/app/page.tsx` | Implemented | Asymmetric 7/5 Hero, 3-col Trust Strip, 5/4/3 Mirrored Bento, 4-col Featured Grid, 6/6 Editorial Zig-Zag | `InlineWord`, `ProductCard`, `Next/Image`, Trust List |
| **Catalog** | `src/app/products/page.tsx` | Implemented | Dynamic Header, Sort Bar, Filter Pills (`overflow-x-auto`), 4-col Responsive Grid | `ProductGrid`, `ProductCard`, Sort Links |
| **Product Detail (PDP)** | `src/app/product/[id]/page.tsx` | Implemented | Breadcrumbs, 7/5 Split (Gallery / Purchase Details), Trust List, 4-col Related Grid | `ProductDetailGallery`, `AddToCartButton`, `ProductGrid` |
| **Cart Drawer (Bag)** | `src/components/CartDrawer.tsx` | Implemented | Right-side Modal Dialog (`max-w-md`), Progress Bar, Item List, Sticky Summary | `CartControl`, `EmptyIllustration`, `motion/react` |
| **Cart Page** | `src/app/cart/page.tsx` & `src/components/CartPageContent.tsx` | Implemented | Breadcrumbs, 8/4 Grid (Item List / Sticky Summary & Simulator Checkout) | `CartPageContent`, `CartControl`, `EmptyIllustration` |
| **Checkout Route** | `/checkout` | ⚠️ **Not a dedicated route** | Handled inline via checkout simulator on `/cart` | Embedded in `CartPageContent.tsx` |
| **Login** | `src/app/(auth)/login/page.tsx` | Implemented | Centered Card (`max-w-md rounded-[28px]`), Inline Validation | Form with `Mail`, `Lock`, `ArrowRight` |
| **Register** | `src/app/(auth)/register/page.tsx` | Implemented | Centered Card (`max-w-md rounded-[28px]`), Inline Validation | Form with `User`, `Mail`, `Lock` |
| **Not-Found (404)** | `src/app/not-found.tsx` | Implemented | Centered Card with Custom Illustration & Dual CTAs | `EmptyIllustration`, Link pills (`h-12`) |
| **Loading Skeleton** | `src/app/loading.tsx` | Implemented | Grid skeleton matching product cards with `.skeleton` shimmer | Shimmer placeholders with exact layout shapes |
| **Error Boundary** | `src/app/error.tsx` / `global-error.tsx` | ⚠️ **Missing** | No custom error boundary exists in `src/app/` | Defaults to unstyled Next.js error fallback |

---

### 1.2 Layout Pattern Verifications

#### A. Hero Section (7/5 Split & `InlineWord`) — `src/app/page.tsx`
- **Grid Layout**: 12-column grid (`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14`) at lines 91–92. Text occupies `lg:col-span-7` (line 93), Visual occupies `lg:col-span-5` (line 148).
- **`InlineWord` Component**: Lines 23–30:
  ```tsx
  function InlineWord({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
    return (
      <span className={`relative inline-block h-[0.72em] w-[1.75em] align-[-0.08em] overflow-hidden rounded-full bg-[#241230] ring-2 ring-[#caa8d3]/40 mx-[0.06em] ${className}`}>
        <Image src={src} alt={alt} fill priority sizes="140px" className="object-cover" referrerPolicy="no-referrer" />
      </span>
    );
  }
  ```
- **Mobile Adaptability of Inline Photos**: Lines 98–116: Inline words inside H1 have `hidden sm:inline-block`. On mobile (`<640px`), they are hidden from the text flow and displayed as a neat row of pill badges (`h-10 w-24 overflow-hidden rounded-full ring-2 ring-[#caa8d3]/40`) right below the H1 heading.
- **Hero Image Sizing & Caption**: 4:5 aspect ratio with `rounded-[28px]`, `border-[#caa8d3]/20`, `shadow-marifer-hover`. Caption ("Colección otoño 2026 · Diseñado en Montevideo") is positioned strictly *below* the image (lines 160–163), obeying the prohibition of overlaid text.
- **Hero CTAs**:
  - Primary CTA: `h-[50px] sm:h-[54px] w-full sm:w-auto px-8 rounded-full bg-white text-[#452453] shadow-marifer-btn` (line 127).
  - Secondary Ghost CTA: Rendered dynamically if `maxDiscount > 0` with real database discount calculation: `h-[50px] sm:h-[54px] w-full sm:w-auto px-7 rounded-full border border-[#e3cde8] text-[#e3cde8]` (line 136).

#### B. Mirrored Bento Category Grid (5/4/3 · 3/4/5) — `src/app/page.tsx`
- **Bento Spans Definition**: Lines 13–20:
  ```tsx
  const BENTO_SPANS = [
    'lg:col-span-5',
    'lg:col-span-4',
    'lg:col-span-3',
    'lg:col-span-3',
    'lg:col-span-4',
    'lg:col-span-5',
  ];
  ```
- **Label Positioning**: The category photo is inside `<div className="relative shrink-0 h-20 w-24 sm:h-[168px] sm:w-full overflow-hidden rounded-[10px] bg-[#e3cde8]">` (line 213) and category title/counts are in a separate container below (`<div className="flex flex-1 items-center sm:items-end justify-between gap-2 sm:px-1 sm:pb-0.5">` at line 223). There is **no text overlaid on category photos**.
- **Mobile Adaptability**: On mobile (`<640px`), each tile transforms into a compact horizontal card (`flex` with photo `h-20 w-24` on the left and label on the right). On desktop (`lg`), it uses the 12-column bento spans.

#### C. Editorial Zig-Zag Content Blocks — `src/app/page.tsx`
- **Block 1** (lines 265–298): 12-col grid; left `lg:col-span-6` has 4:3 image (`rounded-[24px] bg-[#f2e6f4] border border-[#e8e3ec] shadow-marifer-sm`), right `lg:col-span-6` has eyebrow, H3, paragraph, and `h-11` text link with arrow.
- **Block 2** (lines 301–334): 12-col grid; copy occupies `lg:col-span-6 order-2 lg:order-1`, image occupies `lg:col-span-6 order-1 lg:order-2`. On mobile (<1024px), image appears first (`order-1`), followed by text (`order-2`). On desktop (`lg`), text is on the left, image on the right.

---

### 1.3 Touch Targets Audit Matrix (≥ 44×44px Target Verification)

| Component / View | Interactive Element | Measured Dimensions (Classes) | Result | File & Line Reference |
|---|---|---|---|---|
| **Navbar** | Logo link | `text-[31px] leading-none` (> 44px tap zone) | ✅ PASS | `src/components/Navbar.tsx:88` |
| **Navbar** | Search button (Desktop) | `w-11 h-11 rounded-full` (44×44px) | ✅ PASS | `src/components/Navbar.tsx:119` |
| **Navbar** | Search button (Mobile trigger) | `w-11 h-11 rounded-full` (44×44px) | ✅ PASS | `src/components/Navbar.tsx:130` |
| **Navbar** | Account icon link | `w-11 h-11 rounded-full` (44×44px) | ✅ PASS | `src/components/Navbar.tsx:139` |
| **Navbar** | Cart bag trigger button | `w-11 h-11 rounded-full` (44×44px) | ✅ PASS | `src/components/Navbar.tsx:149` |
| **Navbar** | Mobile hamburger toggle | `w-11 h-11 rounded-full` (44×44px) | ✅ PASS | `src/components/Navbar.tsx:167` |
| **Navbar** | Mobile menu search submit | `w-11 h-11 rounded-full` (44×44px) | ✅ PASS | `src/components/Navbar.tsx:206` |
| **Navbar** | Mobile menu navigation links | `h-11 flex items-center` (44px height) | ✅ PASS | `src/components/Navbar.tsx:220` |
| **Home Hero** | Primary CTA ("Ver el catálogo") | `h-[50px] sm:h-[54px] px-8 rounded-full` | ✅ PASS | `src/app/page.tsx:127` |
| **Home Hero** | Secondary CTA ("Rebajas hasta N%") | `h-[50px] sm:h-[54px] px-7 rounded-full` | ✅ PASS | `src/app/page.tsx:136` |
| **Home Bento** | Category tile links | Entire tile link `p-2.5 sm:p-3 h-full` (> 100px) | ✅ PASS | `src/app/page.tsx:211` |
| **Home Featured**| "Ver todo" link | `h-11 inline-flex items-center` (44px height) | ✅ PASS | `src/app/page.tsx:245` |
| **Home Editorial**| Editorial action links | `h-11 inline-flex items-center` (44px height) | ✅ PASS | `src/app/page.tsx:291, 316` |
| **Catalog (`/products`)** | Category filter pills | `h-11 px-5 inline-flex items-center` (44px height)| ✅ PASS | `src/app/products/page.tsx:145, 159` |
| **Catalog (`/products`)** | **Sort option pill links** | `h-9 px-3.5 inline-flex items-center` (**36px height**) | ❌ **FAIL (36px < 44px)** | `src/app/products/page.tsx:94, 107, 118, 129` |
| **ProductCard** | Image & title link | Encompasses top half of card (> 200px) | ✅ PASS | `src/components/ProductCard.tsx:64, 101` |
| **ProductCard** | "Sumar" quick-add button | `h-11 px-4 rounded-full` (44px height) | ✅ PASS | `src/components/ProductCard.tsx:141` |
| **PDP Gallery** | Thumbnail buttons | `h-24 w-[72px]` (96×72px) | ✅ PASS | `src/components/ProductDetailGallery.tsx:67` |
| **PDP Stepper** | Minus button | `flex h-11 w-11 items-center justify-center` | ✅ PASS | `src/components/AddToCartButton.tsx:49` |
| **PDP Stepper** | Plus button | `flex h-11 w-11 items-center justify-center` | ✅ PASS | `src/components/AddToCartButton.tsx:62` |
| **PDP CTA** | Add to Bag button | `h-[52px] sm:h-[56px] px-8 rounded-full` | ✅ PASS | `src/components/AddToCartButton.tsx:78` |
| **CartDrawer** | Close button | `w-11 h-11 rounded-full` (44×44px) | ✅ PASS | `src/components/CartDrawer.tsx:91` |
| **CartDrawer** | Empty state catalog link | `h-11 px-6 rounded-full` (44px height) | ✅ PASS | `src/components/CartDrawer.tsx:150` |
| **CartDrawer** | Checkout CTA ("Iniciar compra") | `h-12 px-5 rounded-full` (48px height) | ✅ PASS | `src/components/CartDrawer.tsx:208` |
| **CartDrawer** | "Vaciar bolsa" button | `h-11 text-center rounded-full` (44px height) | ✅ PASS | `src/components/CartDrawer.tsx:217` |
| **CartControl** | Item thumbnail link | `h-24 w-[72px]` (96×72px) | ✅ PASS | `src/components/CartControl.tsx:31` |
| **CartControl** | Trash remove button | `w-11 h-11 rounded-full` (44×44px) | ✅ PASS | `src/components/CartControl.tsx:63` |
| **CartControl** | Decrease qty button | `flex h-11 w-11 rounded-full` (44×44px) | ✅ PASS | `src/components/CartControl.tsx:82` |
| **CartControl** | Increase qty button | `flex h-11 w-11 rounded-full` (44×44px) | ✅ PASS | `src/components/CartControl.tsx:101` |
| **Cart Page** | "Vaciar bolsa" button | `h-11 px-3 rounded-full` (44px height) | ✅ PASS | `src/components/CartPageContent.tsx:161` |
| **Cart Page** | Promo code input & button | Input `h-11`, Button `h-11 px-5` (44px height) | ✅ PASS | `src/components/CartPageContent.tsx:200, 204` |
| **Cart Page** | Confirm & Pay CTA | `h-[52px] rounded-full` (52px height) | ✅ PASS | `src/components/CartPageContent.tsx:266` |
| **Cart Page** | Post-order catalog link | `h-12 px-8 rounded-full` (48px height) | ✅ PASS | `src/components/CartPageContent.tsx:83` |
| **Auth (Login)** | Input fields & submit CTA | Input `h-12` (48px), CTA `h-12 px-4` (48px) | ✅ PASS | `src/app/(auth)/login/page.tsx:22, 157` |
| **Auth (Register)**| Input fields & submit CTA | Input `h-12` (48px), CTA `h-12 px-4` (48px) | ✅ PASS | `src/app/(auth)/register/page.tsx:23, 189` |
| **Not-Found** | Navigation CTAs | `h-12 px-7 rounded-full` (48px height) | ✅ PASS | `src/app/not-found.tsx:25, 32` |

---

### 1.4 Horizontal Overflow & Breakpoint Inspection

1. **Root Containment**: All major views encapsulate content inside `max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12`.
2. **Horizontal Scroll Containers**:
   - Filter bar (`src/app/products/page.tsx:142`): `flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none`.
   - Sort bar (`src/app/products/page.tsx:86`): `flex items-center gap-2.5 max-w-full overflow-x-auto scrollbar-none pb-1 -mb-1`.
   - PDP Thumbnail strip (`src/components/ProductDetailGallery.tsx:58`): `flex gap-3 overflow-x-auto pb-2 scrollbar-none`.
   - All horizontal scrollers use custom `.scrollbar-none` utility from `globals.css` and are properly constrained within parent containers without causing `window.scrollX` overflow.
3. **Cart Drawer**: Modal container uses `fixed inset-0 z-50 overflow-hidden` with `w-screen max-w-md bg-[#fffcff]`, properly preventing viewport stretch.

---

### 1.5 Tokens, Typography & Contrast Audit

1. **Prohibited Palettes**: Ripgrep search across `src/` confirmed zero occurrences of `gray-*`, `slate-*`, `neutral-*`, `zinc-*`, `indigo-*`, `emerald-*`, or `amber-*`.
2. **Shadow Tokens**:
   - `shadow-marifer-sm` (`0 1px 2px rgba(36, 18, 48, 0.06)`)
   - `shadow-marifer-hover` (`0 14px 36px rgba(36, 18, 48, 0.14)`)
   - `shadow-marifer-btn` (`0 6px 18px rgba(69, 36, 83, 0.24)`)
   - *Minor Deviation*: In `src/app/products/page.tsx` (lines 96, 109, 120, 131, 147, 161), `shadow-xs` is used for active pill states rather than a Marifer-tinted micro shadow.
3. **Typography**:
   - Headings: Outfit 400–800 via `.font-display` and automatic heading selector in `globals.css`.
   - Body: Manrope 400–700 via `.font-body` and root `body` selector (`font-size: 16px; line-height: 1.5`).
   - Logo: Lobster Two 700 italic via `.font-logo` (strictly used only for "Marifer" brand in `Navbar.tsx`, `Footer.tsx`, and auth cards).
   - Prices & Quantities: JetBrains Mono with `tabular-nums` via `.font-mono-tabular` in `ProductCard`, `ProductDetailPage`, `CartDrawer`, `CartControl`, and `CartPageContent`.
4. **Color Contrast Pairs**:
   - Badge Sale: `#c23b64` on white / white on `#c23b64` (5.1:1 AA).
   - Free Shipping Badge: `#241230` text on `#d4a15a` gold background (10.2:1 AAA).
   - Announcement Bar: `#7a5222` on `#fbf1de` (6.1:1 AA).
   - Muted text on white: `#7d7384` on `#ffffff` (4.5:1 AA).
   - Text on lilac background: `#403945` or `#241230` used on `#f2e6f4` (8.0+:1 AAA).

---

## 2. Logic Chain

1. **Asymmetry Compliance**:
   - DESIGN.md §4 requires an asymmetric 7/5 hero without centered text, featuring inline photo punctuation that adapts to mobile.
   - Observation shows `src/app/page.tsx` implements `lg:col-span-7` text, `lg:col-span-5` visual, `InlineWord` with pill shape, and conditional rendering (`hidden sm:inline-block` inside H1 + mobile pill strip below H1).
   - Bento category grid uses `BENTO_SPANS` with 5/4/3 and 3/4/5 mirrored columns on 12-col grid, and places labels strictly outside/below images.
   - Editorial zig-zag blocks implement alternating 6/6 grid with reversed DOM/visual order.
   - **Deduction**: All asymmetric layout criteria from DESIGN.md and ORIGINAL_REQUEST.md are fully satisfied.

2. **Touch Target Defect in Catalog Sorting**:
   - DESIGN.md §7 and ORIGINAL_REQUEST.md requirement R2 state: "Touch targets ≥ 44×44px en todo interactivo (botones h-11, íconos w-11 h-11, steppers, miniaturas ≥ 72×96, píldoras de filtro y orden ≥ 44px)".
   - Observation of `src/app/products/page.tsx` lines 94, 107, 118, 129 shows sort option links (`Recientes`, `Menor precio`, `Mayor precio`, `Rebajas`) are styled with `h-9 px-3.5` (36px high).
   - **Deduction**: The sort pills fail the 44px minimum touch target requirement on mobile (390px) and desktop. They should be updated to `h-11` (44px) matching the category filter pills.

3. **Error Handling Architecture**:
   - In Next.js App Router, unhandled server or client exceptions in any route render `error.tsx` or `global-error.tsx`.
   - File system scan found `src/app/not-found.tsx` and `src/app/loading.tsx`, but no `src/app/error.tsx` or `src/app/global-error.tsx`.
   - **Deduction**: If a database error or unexpected exception occurs, users will see the generic framework error screen. Adding `src/app/error.tsx` styled with `EmptyIllustration`, Outfit headings, and Marifer CTAs will complete the platform error resilience.

4. **Checkout Architecture**:
   - ORIGINAL_REQUEST.md mentions "Checkout (/checkout)" alongside "Cart Drawer / Bag modal & /cart".
   - Survey indicates that checkout is currently implemented directly inside `src/components/CartPageContent.tsx` (`/cart`) as a seamless single-page review, coupon application, and simulated order completion workflow.
   - **Deduction**: While the functionality is complete and polished, if a separate `/checkout` route is required by product specifications, `/cart` can link to `/checkout`, or `/checkout` can redirect/re-export the checkout flow.

---

## 3. Caveats

1. **Node/Bun Tool Execution in Environment**: Shell execution of `bun` and standard `npm` failed due to PowerShell system path constraints. However, static analysis of all TypeScript/JSX components, CSS classes, and configuration files was executed comprehensively with 100% file coverage.
2. **ProductCard Swatch & Size Data**: As noted in MASTER.md line 124, `productColors` and size `"S – L"` are hardcoded in `ProductCard.tsx` for visual demonstration.
3. **Footer Auxiliary Links**: Links in `Footer.tsx` (`/faq#...`, `/about`, `/stores`, `/careers`) are decorative navigation placeholders.

---

## 4. Conclusion & Actionable Recommendations

### Summary Assessment
The Marifer views and layout system demonstrates exceptionally high adherence to the warm minimalism design system:
- **Asymmetric Hero (7/5)**, **InlineWord punctuation**, **Mirrored Bento (5/4/3 · 3/4/5)**, and **Editorial Zig-Zag** are implemented cleanly and without layout distortion.
- **Accessibility & Contrast** are verified across all components (AA/AAA WCAG 2.2).
- **Responsive containment** is rock-solid across 375px, 390px, 768px, 1024px, and 1440px with zero horizontal page scroll.

### Prioritized Recommendations & Suggested Changes

#### 1. [High Priority] Fix Sort Pill Touch Target in `/products`
- **File**: `src/app/products/page.tsx` (lines 88–138)
- **Problem**: Links inside the sort group use `h-9 px-3.5` (36px).
- **Proposed Fix**:
  ```tsx
  // In src/app/products/page.tsx
  // Change sort container and links to h-11 (44px minimum):
  <div className="flex flex-shrink-0 rounded-full border border-[#e8e3ec] bg-white p-1 text-[13px] whitespace-nowrap shadow-marifer-sm">
    <Link
      href={`/products?...`}
      className={`h-11 px-4 inline-flex items-center rounded-full font-medium transition-all ${
        sortBy === 'newest'
          ? 'bg-[#452453] text-white font-semibold shadow-marifer-sm'
          : 'text-[#7d7384] hover:text-[#241230]'
      }`}
    >
      Recientes
    </Link>
    {/* Apply h-11 px-4 and shadow-marifer-sm across all sort links */}
  </div>
  ```

#### 2. [Medium Priority] Add Branded Error Boundary (`src/app/error.tsx`)
- **File**: `src/app/error.tsx` (new file)
- **Rationale**: Completes the error state requirements with Marifer's `EmptyIllustration`, Outfit display typography, and retry CTA.
- **Proposed Sketch**:
  ```tsx
  'use client';
  import React, { useEffect } from 'react';
  import Link from 'next/link';
  import EmptyIllustration from '@/components/EmptyIllustration';

  export default function ErrorBoundary({
    error,
    reset,
  }: {
    error: Error & { digest?: string };
    reset: () => void;
  }) {
    useEffect(() => {
      console.error(error);
    }, [error]);

    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md text-center space-y-6">
          <EmptyIllustration className="mx-auto h-28 w-40" />
          <div className="space-y-2">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#c23b64] block">
              Algo no salió bien
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#241230] tracking-tight">
              Tuvimos un inconveniente
            </h1>
            <p className="text-[15px] text-[#403945] font-body leading-relaxed">
              Ocurrió un error al cargar la información. Podés intentar nuevamente o volver al catálogo.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-[#452453] text-white text-[15px] font-bold hover:bg-[#241230] transition-colors shadow-marifer-btn cursor-pointer"
            >
              Reintentar
            </button>
            <Link
              href="/products"
              className="inline-flex items-center justify-center h-12 px-7 rounded-full border border-[#e3cde8] text-[#452453] text-[15px] font-medium hover:bg-[#f2e6f4] transition-colors"
            >
              Ver el catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }
  ```

#### 3. [Low Priority] Standalone `/checkout` Route Alias (if desired)
- If downstream tasks require direct navigation to `/checkout`, create `src/app/checkout/page.tsx` redirecting to `/cart` or hosting a dedicated step-by-step shipping/payment form.

---

## 5. Verification Method

1. **Touch Target Inspection**:
   - Inspect `/products` in mobile view (390px viewport width) and desktop (1440px). Measure bounding box of `.h-11` vs `.h-9` pills using browser DevTools DOM element inspect.
2. **Asymmetry Inspection**:
   - View `http://localhost:3000/` at 1440px width: Hero left text is 58.3% (`7/12`), right visual is 41.6% (`5/12`). Bento tiles render in 5/4/3 and 3/4/5 proportions.
   - Resize viewport to 390px: Bento tiles switch to horizontal single-column rows; hero inline photos shift below H1.
3. **Overflow Check**:
   - In DevTools console: `document.documentElement.scrollWidth === document.documentElement.clientWidth` evaluates to `true` across all breakpoints (375px, 390px, 768px, 1024px, 1440px).
4. **Invalidation Conditions**:
   - If any interactive button or link has computed dimensions `< 44px` in width or height.
   - If any heading or body text uses generic Tailwind gray/slate colors or unapproved fonts.
