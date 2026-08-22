# Milestone 1 Handoff Report: Design Tokens, Typography & Contrast Refinements

## 1. Observation

A systematic codebase audit was conducted across the 9 scoped files, global CSS, layout, and related components:
- `src/app/products/page.tsx`
- `src/app/product/[id]/page.tsx`
- `src/components/ProductCard.tsx`
- `src/components/CartDrawer.tsx`
- `src/components/CartPageContent.tsx`
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- Related: `src/components/AddToCartButton.tsx`, `src/components/CartControl.tsx`, `src/components/ProductDetailGallery.tsx`, `src/components/ProductGrid.tsx`, `src/app/page.tsx`, `src/app/loading.tsx`, `src/app/not-found.tsx`, `src/app/cart/page.tsx`, `src/lib/format.ts`, `src/lib/shipping.ts`, `src/app/globals.css`.

Direct observations and findings by file:

### Observation O1: `src/app/products/page.tsx`
1. **Line 81**: Missing tabular formatting on product count:
   ```tsx
   80: <p className="text-[13px] sm:text-sm text-[#7d7384] font-body mt-1" aria-live="polite">
   81:   {products.length} {products.length === 1 ? 'modelo disponible' : 'modelos disponibles para envío a todo el país'}
   82: </p>
   ```
   `{products.length}` is plain text without `font-mono-tabular` or `tabular-nums`.
2. **Lines 96, 109, 120, 131, 147, 161**: Non-canonical shadow class `shadow-xs`:
   - Line 96: `sortBy === 'newest' ? 'bg-[#452453] text-white font-semibold shadow-xs' : ...`
   - Line 109: `sortBy === 'price-asc' ? 'bg-[#452453] text-white font-semibold shadow-xs' : ...`
   - Line 120: `sortBy === 'price-desc' ? 'bg-[#452453] text-white font-semibold shadow-xs' : ...`
   - Line 131: `sortBy === 'sale' ? 'bg-[#c23b64] text-white font-semibold shadow-xs' : ...`
   - Line 147: `!categorySlug || categorySlug === 'all' ? 'bg-[#452453] text-white shadow-xs' : ...`
   - Line 161: `isSelected ? 'bg-[#452453] text-white shadow-xs' : ...`
   Generic Tailwind shadow `shadow-xs` violates DESIGN.md §2, §4, §9 & PROJECT.md Feature 3.

### Observation O2: `src/app/product/[id]/page.tsx`
1. **Line 156**: Missing tabular formatting on discount percentage badge:
   ```tsx
   154: {discountPercent && (
   155:   <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-[#c23b64] text-white">
   156:     {discountPercent}% OFF
   157:   </span>
   158: )}
   ```
   `{discountPercent}%` is rendered in standard font instead of `font-mono-tabular`.
2. **Line 190**: Missing tabular formatting on stock count number:
   ```tsx
   189: <span>
   190:   {product.stock > 0
   191:     ? `Disponible: ${product.stock} unidades para despacho inmediato`
   192:     : 'Prenda agotada por el momento'}
   193: </span>
   ```
   `product.stock` is rendered in body font.

### Observation O3: `src/components/ProductCard.tsx`
1. **Line 80-82**: Missing tabular formatting on discount percentage badge:
   ```tsx
   79: {discountPercent ? (
   80:   <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold tracking-wide bg-[#c23b64] text-white">
   81:     -{discountPercent}%
   82:   </span>
   83: ) : ...
   ```
   The `-{discountPercent}%` text is not using `font-mono-tabular`.

### Observation O4: `src/components/CartDrawer.tsx`
1. **Line 81**: Missing tabular formatting on item count:
   ```tsx
   80: <p className="text-[13px] text-[#7d7384] font-body">
   81:   {totalItems} {totalItems === 1 ? 'prenda' : 'prendas'}
   82: </p>
   ```
   `{totalItems}` is not wrapped in `font-mono-tabular`.

### Observation O5: `src/components/CartPageContent.tsx`
1. **Line 156**: Missing tabular formatting on total item count in header:
   ```tsx
   155: <h2 className="font-display text-base font-bold text-[#241230]">
   156:   Prendas seleccionadas ({totalItems})
   157: </h2>
   ```
   `({totalItems})` lacks `font-mono-tabular`.
2. **Line 255**: Missing tabular formatting on installment text in order summary:
   ```tsx
   254: <p className="text-[12px] text-[#452453] font-semibold text-right">
   255:   O 6 cuotas sin recargo de {installmentInfo.installmentText}
   256: </p>
   ```
   `{installmentInfo.installmentText}` lacks `font-mono-tabular`.
3. **Line 200**: Non-canonical focus ring on coupon input:
   ```tsx
   200: className="flex-1 min-w-0 h-11 rounded-full border border-[#d3ccd8] px-4 text-[14px] uppercase placeholder:normal-case placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#452453]/25 aria-[invalid=true]:border-[#c23b64]"
   ```
   Uses `focus:ring-[#452453]/25` instead of `focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2`.

### Observation O6: `src/components/Navbar.tsx`
1. **Line 77**: Missing tabular formatting on free shipping threshold in announcement bar:
   ```tsx
   76: <p className="max-w-[1440px] mx-auto">
   77:   Envío gratis en compras desde {formatPriceUYU(FREE_SHIPPING_THRESHOLD)} · 6 pagos sin recargo
   78: </p>
   ```
   `{formatPriceUYU(FREE_SHIPPING_THRESHOLD)}` lacks `font-mono-tabular`.

### Observation O7: `src/components/Footer.tsx`
1. **Line 46**: Off-palette / forbidden text color rule for Rebajas link on dark background:
   ```tsx
   46: <Link href="/products?sort=sale" className="text-[#d94f78] font-semibold hover:underline">
   47:   Rebajas
   48: </Link>
   ```
   DESIGN.md §2 states: "`#d94f78` (Rosa rebajas): Solo decorativo (swatches, relleno sin texto)". Furthermore, on the `#241230` footer background, `#d94f78` has ~4.0:1 contrast (under WCAG AA 4.5:1 for normal text). Using `--brand-lavanda` (`#caa8d3`, 8.5:1 AAA) or `--brand-border-lila` (`#e3cde8`, 11.5:1 AAA) or a badge `<span className="px-2 py-0.5 rounded-full text-[12px] font-mono-tabular font-bold bg-[#c23b64] text-white">Rebajas</span>` provides compliant contrast and adheres to token constraints.

### Observation O8: `src/app/(auth)/login/page.tsx` & `src/app/(auth)/register/page.tsx`
1. **Line 21-22 in login/page.tsx & Line 22-23 in register/page.tsx**: Non-canonical focus ring on inputs:
   ```tsx
   const inputClass =
     'w-full h-12 rounded-full border border-[#d3ccd8] bg-white pl-11 pr-4 text-[15px] text-[#241230] placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#452453]/25 transition-shadow aria-[invalid=true]:border-[#c23b64]';
   ```
   Uses `focus:ring-[#452453]/25` instead of `focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2`.

---

## 2. Logic Chain

1. **Premise 1 (R1 & DESIGN.md §3 Tabular Numerals)**: All numerical values (prices, currency amounts, installment quotes, item counts, quantities, discount percentages, ratings) must be displayed with JetBrains Mono (`font-mono-tabular` / `font-variant-numeric: tabular-nums`).
   - Observations O1.1, O2.1, O2.2, O3.1, O4.1, O5.1, O5.2, O6.1 demonstrate exact locations where numbers or currency strings are currently rendered in proportional typography (`Outfit` or `Manrope`).
   - Therefore, adding `<span className="font-mono-tabular">` (or class `font-mono-tabular` to the badge / container) directly satisfies Requirement R1 and Acceptance Criteria §Consistencia Visual.

2. **Premise 2 (R1 & DESIGN.md §2 Custom Shadow System)**: Generic Tailwind shadows (`shadow-xs`, `shadow-md`, `shadow-lg`, etc.) are forbidden; all surfaces must use `shadow-marifer-sm`, `shadow-marifer-hover`, or `shadow-marifer-btn`.
   - Observation O1.2 shows `shadow-xs` used across active sort and category pills in `src/app/products/page.tsx`.
   - Therefore, replacing `shadow-xs` with `shadow-marifer-sm` (or removing non-canonical shadow) enforces system compliance.

3. **Premise 3 (R1, R3 & DESIGN.md §2 Focus Rings & Colors)**: Focus rings on light and dark inputs must use the declared brand token `--brand-lavanda` (`#caa8d3`) with `focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2`.
   - Observations O5.3 and O8.1 show `focus:ring-[#452453]/25` used in auth inputs and coupon input.
   - Therefore, replacing with `focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2` ensures consistent, high-contrast, accessible focus indicators.

4. **Premise 4 (R1, R3 & DESIGN.md §2 Dark Surface Contrast & Color Roles)**: `#d94f78` is restricted to decorative swatches/fills without text. On `#241230` (footer), text must maintain ≥ 4.5:1 AA contrast.
   - Observation O7.1 shows `text-[#d94f78]` used in footer link.
   - Therefore, updating to `#caa8d3` (8.5:1 AAA on `#241230`) or a badge `bg-[#c23b64] text-white` resolves the contrast deficit and satisfies token rules.

---

## 3. Caveats

- **Sort Pill Height (Touch Targets)**: In `src/app/products/page.tsx`, sort pills are currently `h-9` (36px). While Milestone 1 focuses on token classes and shadows (`shadow-xs` removal), Milestone 2 will handle interactive touch target resizing to `h-11` (44px) across catalog filters.
- **Color Swatches in `ProductCard`**: Swatch colors (`#2b3a4a`, `#546e7a` for jeans) are garment sample previews rather than UI theme tokens. This is documented in `DESIGN.md §5` as known static data.
- **No other regressions found**: All other components (`AddToCartButton.tsx`, `CartControl.tsx`, `ProductDetailGallery.tsx`, `ProductGrid.tsx`, `page.tsx`, `loading.tsx`, `not-found.tsx`) already conform to the Marifer design token and tabular numeral guidelines.

---

## 4. Conclusion & Precise Execution Plan

The Milestone 1 audit is complete with zero ambiguity. All 9 scoped files have precise diffs planned below:

### Concrete Diff Specifications for Implementation:

#### File 1: `src/app/products/page.tsx`
- Replace `{products.length}` on line 81 with:
  `<span className="font-mono-tabular font-bold">{products.length}</span>`
- In lines 96, 109, 120, 131, 147, 161: Replace `shadow-xs` with `shadow-marifer-sm`.

#### File 2: `src/app/product/[id]/page.tsx`
- In line 155-157: Add `font-mono-tabular` to discount badge:
  `<span className="px-3 py-1 rounded-full text-[12px] font-bold font-mono-tabular bg-[#c23b64] text-white">`
- In line 190-191: Wrap stock number in tabular span:
  `Disponible: <strong className="font-mono-tabular">{product.stock}</strong> unidades para despacho inmediato`

#### File 3: `src/components/ProductCard.tsx`
- In line 80: Add `font-mono-tabular` to discount badge:
  `<span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold font-mono-tabular tracking-wide bg-[#c23b64] text-white">`

#### File 4: `src/components/CartDrawer.tsx`
- In line 81: Wrap total items in tabular span:
  `<span className="font-mono-tabular font-bold">{totalItems}</span> {totalItems === 1 ? 'prenda' : 'prendas'}`

#### File 5: `src/components/CartPageContent.tsx`
- In line 156: Wrap total items in tabular span:
  `Prendas seleccionadas (<span className="font-mono-tabular">{totalItems}</span>)`
- In line 200: Update focus ring classes to `focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2`
- In line 255: Wrap installment text in tabular span:
  `O 6 cuotas sin recargo de <span className="font-mono-tabular font-bold">{installmentInfo.installmentText}</span>`

#### File 6: `src/components/Navbar.tsx`
- In line 77: Wrap threshold in tabular span:
  `Envío gratis en compras desde <span className="font-mono-tabular font-bold">{formatPriceUYU(FREE_SHIPPING_THRESHOLD)}</span> · 6 pagos sin recargo`

#### File 7: `src/components/Footer.tsx`
- In line 46: Replace `text-[#d94f78]` with `text-[#caa8d3] hover:text-white` or `text-[#e3cde8] hover:text-white` for Rebajas link on dark `#241230` background.

#### File 8: `src/app/(auth)/login/page.tsx`
- In line 22: Update `inputClass` to:
  `'w-full h-12 rounded-full border border-[#d3ccd8] bg-white pl-11 pr-4 text-[15px] text-[#241230] placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2 transition-shadow aria-[invalid=true]:border-[#c23b64]'`

#### File 9: `src/app/(auth)/register/page.tsx`
- In line 23: Update `inputClass` to:
  `'w-full h-12 rounded-full border border-[#d3ccd8] bg-white pl-11 pr-4 text-[15px] text-[#241230] placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2 transition-shadow aria-[invalid=true]:border-[#c23b64]'`

---

## 5. Verification Method

To verify these changes independently after implementation:
1. **Type & Lint Check**:
   ```bash
   bun run lint
   bunx tsc --noEmit
   ```
2. **Build Verification**:
   ```bash
   bun run build
   ```
3. **Automated Search Verification**:
   - Verify zero occurrences of `shadow-xs`:
     `grep -rn "shadow-xs" src/`
   - Verify zero occurrences of forbidden text colors (`#d94f78` in text):
     `grep -rn "text-\[#d94f78\]" src/`
   - Verify all discount badges have `font-mono-tabular`:
     `grep -rn "discountPercent" src/`
   - Verify focus rings in inputs use `#caa8d3`:
     `grep -rn "focus:ring-\[#caa8d3\]" src/`
