# Handoff Report — Milestone 1: Design Tokens, Typography & Contrast Refinements

## 1. Observation

Direct investigation of the codebase confirmed the exact locations, line numbers, and verbatim code for all 5 scope items of Milestone 1:

### Scope 1: Missing `font-mono-tabular` on Numeric Counts & Badges
- **`src/app/products/page.tsx:81`**: Catalog count `{products.length}` is currently rendered as raw text inside a paragraph without `font-mono-tabular`.
  - Verbatim (lines 80–82):
    ```tsx
    <p className="text-[13px] sm:text-sm text-[#7d7384] font-body mt-1" aria-live="polite">
      {products.length} {products.length === 1 ? 'modelo disponible' : 'modelos disponibles para envío a todo el país'}
    </p>
    ```
- **`src/app/product/[id]/page.tsx:131,156,189`**:
  - Reviews count (lines 130–132): `({product.numReviews} reseñas de clientas)` is inside a generic `<span>` without tabular figures.
  - Discount badge (lines 154–158): `className="px-3 py-1 rounded-full text-[12px] font-bold bg-[#c23b64] text-white"` lacks `font-mono-tabular`.
  - Stock count (lines 188–193): `Disponible: ${product.stock} unidades para despacho inmediato` is rendered as template string without tabular figures.
- **`src/components/ProductCard.tsx:81`**:
  - Discount badge (lines 79–82): `className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold tracking-wide bg-[#c23b64] text-white"` lacks `font-mono-tabular`.
- **`src/components/CartDrawer.tsx:81`**:
  - Header count (lines 80–82): `{totalItems} {totalItems === 1 ? 'prenda' : 'prendas'}` inside `<p className="text-[13px] text-[#7d7384] font-body">` lacks `font-mono-tabular`.
- **`src/components/CartPageContent.tsx:157,255`**:
  - Selected items header (line 156–157): `Prendas seleccionadas ({totalItems})` lacks `font-mono-tabular` around `{totalItems}`.
  - Installment breakdown (line 254–256): `O 6 cuotas sin recargo de {installmentInfo.installmentText}` lacks `font-mono-tabular` around `{installmentInfo.installmentText}`.

### Scope 2: Non-canonical `shadow-xs` in `src/app/products/page.tsx`
- Ripgrep confirmed `shadow-xs` appears on exactly 6 lines in `src/app/products/page.tsx`:
  - Line 96 (Sort button: newest)
  - Line 109 (Sort button: price-asc)
  - Line 120 (Sort button: price-desc)
  - Line 131 (Sort button: sale)
  - Line 147 (Category filter pill: all)
  - Line 161 (Category filter pill: selected category)
- The canonical token defined in `src/app/globals.css:90-92` and `DESIGN.md §2` is `shadow-marifer-sm` (`box-shadow: 0 1px 2px rgba(36, 18, 48, 0.06)`).

### Scope 3: Off-palette Border Hex in `src/components/Navbar.tsx:75`
- Line 75: `<div className="bg-[#fbf1de] text-[#7a5222] text-[12px] font-bold py-2 px-4 text-center tracking-wide border-b border-[#ebd7be]">`
- `#ebd7be` is an off-palette color token. The canonical hairline border token for Marifer is `#e8e3ec` (`--border-hairline`).

### Scope 4: Contrast Violation in `src/components/Footer.tsx:46`
- Line 46: `<Link href="/products?sort=sale" className="text-[#d94f78] font-semibold hover:underline">Rebajas</Link>`
- The footer sits on a dark surface (`bg-[#241230]`). On dark surfaces, `--brand-lavanda` (`#caa8d3`) provides 8.5:1 AAA contrast and conforms to the dark surface text styling rules in `DESIGN.md §2` (`#caa8d3` on `#241230`).

### Scope 5: Non-standardized Input Focus Rings
- **`src/app/(auth)/login/page.tsx:22`**: `inputClass` uses `focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#452453]/25`.
- **`src/app/(auth)/register/page.tsx:23`**: `inputClass` uses `focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#452453]/25`.
- **`src/components/CartPageContent.tsx:200`**: Promo code `<input>` uses `focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#452453]/25`.
- All inputs must standardize to `focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2` (matching `Navbar.tsx:115,202`).

---

## 2. Logic Chain

1. **Design System Consistency**:
   - `DESIGN.md §3` & `PROJECT.md §1`: All numeric quantities, stock amounts, item counts, discount badges, and currency breakdowns must use `.font-mono-tabular` (`font-family: var(--font-mono); font-variant-numeric: tabular-nums`). Wrapping numbers in `<span className="font-mono-tabular">` or adding `font-mono-tabular` to the badge class enforces strict tabular alignment.
2. **Shadow System Normalization**:
   - `shadow-xs` is a generic Tailwind v4 shadow that does not use the plum tint `rgba(36, 18, 48, 0.06)`. Replacing with `shadow-marifer-sm` ensures 100% compliance with Marifer's custom shadow system without layout shifts.
3. **Palette Harmonization**:
   - Replacing `#ebd7be` with `#e8e3ec` in the announcement bar border eliminates foreign off-palette values and unifies section hairlines.
4. **WCAG Contrast & Readability**:
   - Replacing `text-[#d94f78]` with `text-[#caa8d3]` in `Footer.tsx` elevates text contrast on `#241230` to > 8:1 (AAA), meeting WCAG 2.2 requirements while maintaining semantic distinction for the sale link.
5. **Interactive Focus State Accessibility**:
   - Upgrading focus rings on all text inputs from low-contrast `focus:ring-[#452453]/25` to `focus:ring-[#caa8d3] focus:ring-offset-2` provides visible 2px lavender focus indicators compliant with WCAG 2.4.7 Focus Visible and `MASTER.md §5`.

---

## 3. Caveats

- **No layout or structural breaking changes**: All modifications are purely class name and span wrapper adjustments; no API contracts or business logic are altered.
- **Future Milestone Dependencies**: Catalog sort pill touch-target height (`h-9` -> `h-11`) is scheduled for Milestone 2 (`M2`); this milestone exclusively handles `shadow-xs` replacement on those pills.

---

## 4. Conclusion & Implementation Blueprint

The Worker should apply the following exact modifications across the 9 targeted files:

### File 1: `src/app/products/page.tsx`
#### Edit 1.1: Tabular count (Line 80–82)
**Before:**
```tsx
          <p className="text-[13px] sm:text-sm text-[#7d7384] font-body mt-1" aria-live="polite">
            {products.length} {products.length === 1 ? 'modelo disponible' : 'modelos disponibles para envío a todo el país'}
          </p>
```
**After:**
```tsx
          <p className="text-[13px] sm:text-sm text-[#7d7384] font-body mt-1" aria-live="polite">
            <span className="font-mono-tabular">{products.length}</span> {products.length === 1 ? 'modelo disponible' : 'modelos disponibles para envío a todo el país'}
          </p>
```

#### Edit 1.2: Sort buttons `shadow-xs` -> `shadow-marifer-sm` (Lines 89–137)
**Before:**
```tsx
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug && { category: categorySlug }),
                sort: 'newest',
              }).toString()}`}
              className={`h-9 px-3.5 inline-flex items-center rounded-full font-medium transition-all ${
                sortBy === 'newest'
                  ? 'bg-[#452453] text-white font-semibold shadow-xs'
                  : 'text-[#7d7384] hover:text-[#241230]'
              }`}
            >
              Recientes
            </Link>
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug && { category: categorySlug }),
                sort: 'price-asc',
              }).toString()}`}
              className={`h-9 px-3.5 inline-flex items-center rounded-full font-medium transition-all ${
                sortBy === 'price-asc'
                  ? 'bg-[#452453] text-white font-semibold shadow-xs'
                  : 'text-[#7d7384] hover:text-[#241230]'
              }`}
            >Menor precio</Link>
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug && { category: categorySlug }),
                sort: 'price-desc',
              }).toString()}`}
              className={`h-9 px-3.5 inline-flex items-center rounded-full font-medium transition-all ${
                sortBy === 'price-desc'
                  ? 'bg-[#452453] text-white font-semibold shadow-xs'
                  : 'text-[#7d7384] hover:text-[#241230]'
              }`}
            >Mayor precio</Link>
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug && { category: categorySlug }),
                sort: 'sale',
              }).toString()}`}
              className={`h-9 px-3.5 inline-flex items-center rounded-full font-medium transition-all ${
                sortBy === 'sale'
                  ? 'bg-[#c23b64] text-white font-semibold shadow-xs'
                  : 'text-[#c23b64] hover:text-[#241230]'
              }`}
            >
              Rebajas
            </Link>
```
**After:**
```tsx
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug && { category: categorySlug }),
                sort: 'newest',
              }).toString()}`}
              className={`h-9 px-3.5 inline-flex items-center rounded-full font-medium transition-all ${
                sortBy === 'newest'
                  ? 'bg-[#452453] text-white font-semibold shadow-marifer-sm'
                  : 'text-[#7d7384] hover:text-[#241230]'
              }`}
            >
              Recientes
            </Link>
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug && { category: categorySlug }),
                sort: 'price-asc',
              }).toString()}`}
              className={`h-9 px-3.5 inline-flex items-center rounded-full font-medium transition-all ${
                sortBy === 'price-asc'
                  ? 'bg-[#452453] text-white font-semibold shadow-marifer-sm'
                  : 'text-[#7d7384] hover:text-[#241230]'
              }`}
            >Menor precio</Link>
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug && { category: categorySlug }),
                sort: 'price-desc',
              }).toString()}`}
              className={`h-9 px-3.5 inline-flex items-center rounded-full font-medium transition-all ${
                sortBy === 'price-desc'
                  ? 'bg-[#452453] text-white font-semibold shadow-marifer-sm'
                  : 'text-[#7d7384] hover:text-[#241230]'
              }`}
            >Mayor precio</Link>
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug && { category: categorySlug }),
                sort: 'sale',
              }).toString()}`}
              className={`h-9 px-3.5 inline-flex items-center rounded-full font-medium transition-all ${
                sortBy === 'sale'
                  ? 'bg-[#c23b64] text-white font-semibold shadow-marifer-sm'
                  : 'text-[#c23b64] hover:text-[#241230]'
              }`}
            >
              Rebajas
            </Link>
```

#### Edit 1.3: Category filter pills `shadow-xs` -> `shadow-marifer-sm` (Lines 143–169)
**Before:**
```tsx
        <Link
          href={`/products?${sortBy ? `sort=${sortBy}` : ''}`}
          className={`h-11 px-5 inline-flex items-center rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${
            !categorySlug || categorySlug === 'all'
              ? 'bg-[#452453] text-white shadow-xs'
              : 'bg-white border border-[#e8e3ec] text-[#7d7384] hover:text-[#241230] hover:bg-[#f2e6f4]'
          }`}
        >
          Todas las prendas
        </Link>
        {categories.map((cat) => {
          const isSelected = categorySlug === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}${sortBy ? `&sort=${sortBy}` : ''}`}
              className={`h-11 px-5 inline-flex items-center rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-[#452453] text-white shadow-xs'
                  : 'bg-white border border-[#e8e3ec] text-[#7d7384] hover:text-[#241230] hover:bg-[#f2e6f4]'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
```
**After:**
```tsx
        <Link
          href={`/products?${sortBy ? `sort=${sortBy}` : ''}`}
          className={`h-11 px-5 inline-flex items-center rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${
            !categorySlug || categorySlug === 'all'
              ? 'bg-[#452453] text-white shadow-marifer-sm'
              : 'bg-white border border-[#e8e3ec] text-[#7d7384] hover:text-[#241230] hover:bg-[#f2e6f4]'
          }`}
        >
          Todas las prendas
        </Link>
        {categories.map((cat) => {
          const isSelected = categorySlug === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}${sortBy ? `&sort=${sortBy}` : ''}`}
              className={`h-11 px-5 inline-flex items-center rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-[#452453] text-white shadow-marifer-sm'
                  : 'bg-white border border-[#e8e3ec] text-[#7d7384] hover:text-[#241230] hover:bg-[#f2e6f4]'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
```

---

### File 2: `src/app/product/[id]/page.tsx`
#### Edit 2.1: Reviews count tabular figure (Lines 130–133)
**Before:**
```tsx
              <span className="text-[13px] text-[#7d7384]">
                ({product.numReviews} reseñas de clientas)
              </span>
```
**After:**
```tsx
              <span className="text-[13px] text-[#7d7384]">
                (<span className="font-mono-tabular">{product.numReviews}</span> reseñas de clientas)
              </span>
```

#### Edit 2.2: Discount badge tabular figure (Lines 154–158)
**Before:**
```tsx
              {discountPercent && (
                <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-[#c23b64] text-white">
                  {discountPercent}% OFF
                </span>
              )}
```
**After:**
```tsx
              {discountPercent && (
                <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-[#c23b64] text-white font-mono-tabular">
                  {discountPercent}% OFF
                </span>
              )}
```

#### Edit 2.3: Stock count tabular figure (Lines 188–193)
**Before:**
```tsx
            <span>
              {product.stock > 0
                ? `Disponible: ${product.stock} unidades para despacho inmediato`
                : 'Prenda agotada por el momento'}
            </span>
```
**After:**
```tsx
            <span>
              {product.stock > 0 ? (
                <>Disponible: <span className="font-mono-tabular">{product.stock}</span> unidades para despacho inmediato</>
              ) : (
                'Prenda agotada por el momento'
              )}
            </span>
```

---

### File 3: `src/components/ProductCard.tsx`
#### Edit 3.1: Discount badge tabular figure (Lines 79–83)
**Before:**
```tsx
            {discountPercent ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold tracking-wide bg-[#c23b64] text-white">
                -{discountPercent}%
              </span>
            ) : isNew ? (
```
**After:**
```tsx
            {discountPercent ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold tracking-wide bg-[#c23b64] text-white font-mono-tabular">
                -{discountPercent}%
              </span>
            ) : isNew ? (
```

---

### File 4: `src/components/CartDrawer.tsx`
#### Edit 4.1: Header total items count tabular figure (Lines 80–83)
**Before:**
```tsx
                    <p className="text-[13px] text-[#7d7384] font-body">
                      {totalItems} {totalItems === 1 ? 'prenda' : 'prendas'}
                    </p>
```
**After:**
```tsx
                    <p className="text-[13px] text-[#7d7384] font-body">
                      <span className="font-mono-tabular">{totalItems}</span> {totalItems === 1 ? 'prenda' : 'prendas'}
                    </p>
```

---

### File 5: `src/components/CartPageContent.tsx`
#### Edit 5.1: Selected items count tabular figure (Lines 155–157)
**Before:**
```tsx
            <h2 className="font-display text-base font-bold text-[#241230]">
              Prendas seleccionadas ({totalItems})
            </h2>
```
**After:**
```tsx
            <h2 className="font-display text-base font-bold text-[#241230]">
              Prendas seleccionadas (<span className="font-mono-tabular">{totalItems}</span>)
            </h2>
```

#### Edit 5.2: Promo code input focus ring (Lines 199–201)
**Before:**
```tsx
                aria-describedby={promoError ? 'promo-error' : appliedPromo ? 'promo-ok' : undefined}
                className="flex-1 min-w-0 h-11 rounded-full border border-[#d3ccd8] px-4 text-[14px] uppercase placeholder:normal-case placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#452453]/25 aria-[invalid=true]:border-[#c23b64]"
              />
```
**After:**
```tsx
                aria-describedby={promoError ? 'promo-error' : appliedPromo ? 'promo-ok' : undefined}
                className="flex-1 min-w-0 h-11 rounded-full border border-[#d3ccd8] px-4 text-[14px] uppercase placeholder:normal-case placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2 aria-[invalid=true]:border-[#c23b64]"
              />
```

#### Edit 5.3: Installment text tabular figure (Lines 254–256)
**Before:**
```tsx
              <p className="text-[12px] text-[#452453] font-semibold text-right">
                O 6 cuotas sin recargo de {installmentInfo.installmentText}
              </p>
```
**After:**
```tsx
              <p className="text-[12px] text-[#452453] font-semibold text-right">
                O 6 cuotas sin recargo de <span className="font-mono-tabular">{installmentInfo.installmentText}</span>
              </p>
```

---

### File 6: `src/components/Navbar.tsx`
#### Edit 6.1: Announcement bar border hex (Line 74–76)
**Before:**
```tsx
      {/* Barra de anuncio */}
      <div className="bg-[#fbf1de] text-[#7a5222] text-[12px] font-bold py-2 px-4 text-center tracking-wide border-b border-[#ebd7be]">
```
**After:**
```tsx
      {/* Barra de anuncio */}
      <div className="bg-[#fbf1de] text-[#7a5222] text-[12px] font-bold py-2 px-4 text-center tracking-wide border-b border-[#e8e3ec]">
```

---

### File 7: `src/components/Footer.tsx`
#### Edit 7.1: Dark surface link contrast (Lines 45–49)
**Before:**
```tsx
              <li>
                <Link href="/products?sort=sale" className="text-[#d94f78] font-semibold hover:underline">
                  Rebajas
                </Link>
              </li>
```
**After:**
```tsx
              <li>
                <Link href="/products?sort=sale" className="text-[#caa8d3] font-semibold hover:underline">
                  Rebajas
                </Link>
              </li>
```

---

### File 8: `src/app/(auth)/login/page.tsx`
#### Edit 8.1: Input focus ring (Lines 21–23)
**Before:**
```tsx
const inputClass =
  'w-full h-12 rounded-full border border-[#d3ccd8] bg-white pl-11 pr-4 text-[15px] text-[#241230] placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#452453]/25 transition-shadow aria-[invalid=true]:border-[#c23b64]';
```
**After:**
```tsx
const inputClass =
  'w-full h-12 rounded-full border border-[#d3ccd8] bg-white pl-11 pr-4 text-[15px] text-[#241230] placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2 transition-shadow aria-[invalid=true]:border-[#c23b64]';
```

---

### File 9: `src/app/(auth)/register/page.tsx`
#### Edit 9.1: Input focus ring (Lines 22–24)
**Before:**
```tsx
const inputClass =
  'w-full h-12 rounded-full border border-[#d3ccd8] bg-white pl-11 pr-4 text-[15px] text-[#241230] placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#452453]/25 transition-shadow aria-[invalid=true]:border-[#c23b64]';
```
**After:**
```tsx
const inputClass =
  'w-full h-12 rounded-full border border-[#d3ccd8] bg-white pl-11 pr-4 text-[15px] text-[#241230] placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2 transition-shadow aria-[invalid=true]:border-[#c23b64]';
```

---

## 5. Verification Method

To independently verify the implementation:

1. **Grep Validation**:
   - Verify `shadow-xs` no longer exists: `grep -rn "shadow-xs" src/` -> 0 matches.
   - Verify `#ebd7be` no longer exists: `grep -rn "#ebd7be" src/` -> 0 matches.
   - Verify `text-[#d94f78]` does not appear in `src/components/Footer.tsx`: `grep -rn "text-\[#d94f78\]" src/components/Footer.tsx` -> 0 matches.
   - Verify `focus:ring-[#452453]/25` no longer exists in auth / cart forms: `grep -rn "focus:ring-\[#452453\]/25" src/` -> 0 matches.
2. **Build and Lint Commands**:
   - Run: `npm run lint`
   - Run: `npm run build`
3. **Invalidation Condition**:
   - If any `font-mono-tabular` element disrupts line-height or text baseline, or if any input ring clips on rounded borders, adjustments to container padding or line-height should be made.
