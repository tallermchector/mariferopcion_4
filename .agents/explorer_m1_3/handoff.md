# Milestone 1 Exploration & Implementation Plan Report: Design Tokens, Typography & Contrast Refinements

**Date**: 2026-08-22T10:48:00Z  
**Author**: Explorer Agent (`explorer_m1_3`)  
**Scope**: Verification of Design System Tokens in `globals.css` and all token consumers across `src/`. Clean implementation plan for tabular numbers, shadow classes, border hexes, footer contrasts, and focus rings to guarantee 100% adherence to `DESIGN.md` and `design-system/marifer/MASTER.md`.

---

## 1. Observation

Direct observations from analyzing `DESIGN.md`, `design-system/marifer/MASTER.md`, `PROJECT.md`, `src/app/globals.css`, `src/app/layout.tsx`, and all 25 source files across `src/app/`, `src/components/`, `src/context/`, and `src/lib/`:

### A. Global Design Tokens Definition (`src/app/globals.css:5-100`)

1. **Color Variables in `:root` (`globals.css:5-26`)**:
   - `--bg-page: #fffcff` (Warm white page background)
   - `--bg-card: #ffffff` (Pure white card background)
   - `--brand-primary: #452453` (Primary Plum)
   - `--brand-deep: #241230` / `--text-primary: #241230` (Deep Plum)
   - `--brand-soft-lila: #f2e6f4` (Soft Lilac)
   - `--brand-border-lila: #e3cde8` (Border Lilac)
   - `--brand-lavanda: #caa8d3` (Lavender accent & focus ring)
   - `--accent-sale: #d94f78` (Decorative sale pink)
   - `--accent-sale-deep: #c23b64` (Accessible sale pink AA, 5.1:1 on white)
   - `--accent-highlight: #d4a15a` (Highlight gold, for use with `#241230` text)
   - `--bar-crema: #fbf1de` (Announcement bar cream)
   - `--bar-tabaco: #7a5222` (Announcement bar tobacco, 6.1:1 on cream)
   - `--stock-text: #146043` (Stock available text)
   - `--stock-dot: #1f8a5f` (Stock dot pulse & 100% progress)
   - `--text-body: #403945` (Body text ink)
   - `--text-muted: #7d7384` (Muted mauve text)
   - `--border-hairline: #e8e3ec` (Hairline border)
   - `--border-default: #d3ccd8` (Default border)

2. **Typography Font Family & Classes (`src/app/layout.tsx:10-37`, `globals.css:72-87`)**:
   - Display / Headings: `Outfit` (`--font-outfit`, `.font-display`, auto on `h1–h6`, letter-spacing `-0.025em`)
   - Body: `Manrope` (`--font-manrope`, `.font-body`, default on `body`, base 16px, line-height 1.5)
   - Brand Logo: `Lobster Two` 700 Italic (`--font-brand`, `.font-logo`, cursive, strictly for "Marifer" mark)
   - Tabular Numerals: `JetBrains Mono` (`--font-mono`, `.font-mono-tabular`, `font-variant-numeric: tabular-nums`)

3. **Plum Shadow System (`globals.css:89-100`)**:
   - `shadow-marifer-sm`: `0 1px 2px rgba(36, 18, 48, 0.06)`
   - `shadow-marifer-hover`: `0 14px 36px rgba(36, 18, 48, 0.14)`
   - `shadow-marifer-btn`: `0 6px 18px rgba(69, 36, 83, 0.24)`

4. **Global Focus Ring (`globals.css:50-58`)**:
   - `:focus-visible`: `outline: 2px solid var(--brand-primary); outline-offset: 2px; border-radius: 4px;`
   - `[data-surface="dark"] :focus-visible`: `outline-color: var(--brand-lavanda);`

---

### B. Complete Hex Frequency Distribution Across `src/`

Command executed:
`Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts,*.css | Select-String -Pattern '#[0-9a-fA-F]{3,8}' -AllMatches`

| Count | Hex Code | Semantic Token / Role | Status | Notes |
|:-----:|:--------:|:---------------------|:------:|:------|
| 102 | `#241230` | `--brand-deep` / `--text-primary` | ✅ Canonical | Primary text, dark surfaces, headings |
| 81 | `#452453` | `--brand-primary` | ✅ Canonical | Header sticky, primary CTA, active states |
| 65 | `#7d7384` | `--text-muted` | ✅ Canonical | Muted secondary text, metadata, captions |
| 45 | `#e8e3ec` | `--border-hairline` | ✅ Canonical | Dividers, card borders, section separators |
| 36 | `#f2e6f4` | `--brand-soft-lila` | ✅ Canonical | Soft surface backgrounds, icon badges, skeletons |
| 20 | `#e3cde8` | `--brand-border-lila` | ✅ Canonical | Tile borders, secondary text on plum surfaces |
| 19 | `#caa8d3` | `--brand-lavanda` | ✅ Canonical | Focus rings, underlines, accents on plum |
| 17 | `#c23b64` | `--accent-sale-deep` | ✅ Canonical | AA sale badges ("-N%"), cart counter badge, errors |
| 16 | `#146043` | `--stock-text` | ✅ Canonical | In-stock text, free shipping qualified text |
| 12 | `#403945` | `--text-body` | ✅ Canonical | Main paragraph text ink |
| 10 | `#ffffff` | `--bg-card` | ✅ Canonical | Pure white surface |
| 8 | `#d4a15a` | `--accent-highlight` | ✅ Canonical | Free shipping badge background (with `#241230` text) |
| 5 | `#1f8a5f` | `--stock-dot` | ✅ Canonical | Availability pulse dot & 100% progress fill |
| 5 | `#d94f78` | `--accent-sale` (decorative) | ⚠️ 1 Defect | 4 compliant (1 in globals.css, 1 in EmptyIllustration SVG, 2 in ProductCard swatches); **1 defect in `Footer.tsx:46`** (used as text on dark background, failing AA) |
| 4 | `#d3ccd8` | `--border-default` | ✅ Canonical | Form input borders |
| 4 | `#fffcff` | `--bg-page` | ✅ Canonical | Warm white page background |
| 2 | `#7a5222` | `--bar-tabaco` | ✅ Canonical | Announcement bar text (6.1:1 on cream) |
| 2 | `#fbf1de` | `--bar-crema` | ✅ Canonical | Announcement bar background |
| 1 | `#546e7a` | Jean swatch | ✅ Allowed | Visual fabric swatch representation in `ProductCard.tsx:41` |
| 1 | `#2b3a4a` | Jean swatch | ✅ Allowed | Visual fabric swatch representation in `ProductCard.tsx:41` |
| 1 | `#ebd7be` | Off-palette border | ❌ **Defect** | Non-canonical border in `Navbar.tsx:75` |

---

### C. Specific Defect Inventory for Milestone 1

| # | Domain | File & Exact Line(s) | Current Code (Defect) | Required Spec Alignment |
|---|--------|---------------------|----------------------|-------------------------|
| **1** | **Tabular Numbers** | `src/app/products/page.tsx:81` | `<p ...>{products.length} {products.length === 1 ? ...}</p>` | Wrap `{products.length}` in `<span className="font-mono-tabular font-semibold">` |
| **2** | **Shadow Classes** | `src/app/products/page.tsx:96, 109, 120, 131, 147, 161` | `shadow-xs` (Tailwind default gray shadow on 6 sort & filter pills) | Replace `shadow-xs` with `shadow-marifer-sm` |
| **3** | **Tabular Numbers** | `src/app/product/[id]/page.tsx:131` | `({product.numReviews} reseñas de clientas)` | Wrap count in `<span className="font-mono-tabular font-semibold">{product.numReviews}</span>` |
| **4** | **Tabular Numbers** | `src/app/product/[id]/page.tsx:156` | `<span className="... bg-[#c23b64] text-white">{discountPercent}% OFF</span>` | Wrap percentage in `<span className="font-mono-tabular font-bold">-{discountPercent}%</span> OFF` |
| **5** | **Tabular Numbers** | `src/app/product/[id]/page.tsx:189-191` | `Disponible: ${product.stock} unidades para despacho inmediato` | Wrap stock count in `<span className="font-mono-tabular font-bold">{product.stock}</span>` |
| **6** | **Tabular Numbers** | `src/components/ProductCard.tsx:81` | `<span className="... bg-[#c23b64] text-white">-{discountPercent}%</span>` | Wrap percentage in `<span className="font-mono-tabular font-bold">-{discountPercent}%</span>` |
| **7** | **Tabular Numbers** | `src/components/CartDrawer.tsx:81` | `<p ...>{totalItems} {totalItems === 1 ? 'prenda' : 'prendas'}</p>` | Wrap `{totalItems}` in `<span className="font-mono-tabular font-semibold">{totalItems}</span>` |
| **8** | **Tabular Numbers** | `src/components/CartPageContent.tsx:156-157` | `<h2 ...>Prendas seleccionadas ({totalItems})</h2>` | Wrap count in `Prendas seleccionadas (<span className="font-mono-tabular font-semibold">{totalItems}</span>)` |
| **9** | **Tabular Numbers** | `src/components/CartPageContent.tsx:255` | `<p ...>O 6 cuotas sin recargo de {installmentInfo.installmentText}</p>` | Wrap installment text in `<span className="font-mono-tabular font-bold">{installmentInfo.installmentText}</span>` |
| **10** | **Tabular Numbers** | `src/components/Navbar.tsx:77` | `Envío gratis en compras desde {formatPriceUYU(FREE_SHIPPING_THRESHOLD)}` | Wrap formatted threshold in `<span className="font-mono-tabular font-bold">{formatPriceUYU(FREE_SHIPPING_THRESHOLD)}</span>` |
| **11** | **Border Hexes** | `src/components/Navbar.tsx:75` | `border-b border-[#ebd7be]` (off-palette light brown border) | Replace with canonical hairline border `border-b border-[#e8e3ec]` |
| **12** | **Footer Contrast** | `src/components/Footer.tsx:46` | `<Link ... className="text-[#d94f78] font-semibold hover:underline">Rebajas</Link>` (3.88:1 ratio on `#241230`) | Replace with `text-[#caa8d3] font-semibold hover:underline hover:text-white` (8.3:1 AAA) or `text-[#e3cde8]` (11.8:1 AAA) |
| **13** | **Focus Rings** | `src/app/(auth)/login/page.tsx:22` | `inputClass`: `focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#452453]/25` | Update to `focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2` |
| **14** | **Focus Rings** | `src/app/(auth)/register/page.tsx:23` | `inputClass`: `focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#452453]/25` | Update to `focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2` |
| **15** | **Focus Rings** | `src/components/CartPageContent.tsx:200` | Promo input: `focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#452453]/25` | Update to `focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2` |

---

## 2. Logic Chain

1. **Design System Authority & Constraints**:
   - `DESIGN.md` §2 and `MASTER.md` §2 dictate that the color system is strictly bounded to the canonical Marifer plum tokens (`#452453`, `#241230`, `#fffcff`, `#f2e6f4`, `#caa8d3`, `#c23b64`, `#e8e3ec`, `#d3ccd8`, `#403945`, `#7d7384`, `#d4a15a`, `#fbf1de`, `#7a5222`, `#146043`, `#1f8a5f`).
   - Generic Tailwind neutrals (`gray-*`, `slate-*`, `neutral-*`) and unapproved hex values are forbidden.

2. **Typography Rule Enforcement**:
   - `DESIGN.md` §3 specifies:
     > "Precios / números: JetBrains Mono `.font-mono-tabular` con `font-variant-numeric: tabular-nums` **siempre** en precios, tachados, cantidades, contador del carrito, porcentajes de descuento, conteos ('12 prendas')."
   - While prices are largely wrapped in `.font-mono-tabular`, several quantitative figures (product catalog counts, review counts, discount percentage badges, stock counts, cart drawer item counts, section header totals, installment amounts, and announcement bar amounts) were omitted from the tabular font wrapper.
   - Wrapping every single numerical output in `.font-mono-tabular` ensures monospaced digit alignment, visual rhythm, and 100% adherence to §3.

3. **Plum Shadow System Consistency**:
   - `DESIGN.md` §2 states:
     > "Sombras (teñidas de ciruela, nunca grises ni neón)... No usar shadow-md/lg/xl/2xl de Tailwind ni drop-shadow de color."
   - In `src/app/products/page.tsx:96, 109, 120, 131, 147, 161`, the active states of sort and filter pills use `shadow-xs` (which defaults to a generic black/gray opacity shadow in Tailwind CSS v4).
   - Replacing `shadow-xs` with `shadow-marifer-sm` ensures that all active pill elevations use the canonical plum tint (`rgba(36, 18, 48, 0.06)`).

4. **Off-Palette Border Elimination**:
   - In `src/components/Navbar.tsx:75`, `border-[#ebd7be]` is a non-canonical tan/brown color that is not part of the design system palette.
   - Replacing it with `border-[#e8e3ec]` (the canonical `--border-hairline` token) harmonizes the announcement bar with the rest of the application.

5. **Accessibility Contrast Compliance (WCAG 2.2 AA / AAA)**:
   - In `src/components/Footer.tsx:46`, the "Rebajas" link text is rendered using `#d94f78` on a dark `#241230` surface.
   - Calculating luminance:
     - Surface `#241230`: relative luminance = `0.0084`
     - Text `#d94f78`: relative luminance = `0.1770`
     - Contrast ratio = `(0.1770 + 0.05) / (0.0084 + 0.05) = 0.2270 / 0.0584 = 3.88:1` (Fails WCAG 2.2 AA requirement of 4.5:1 for 14px regular text).
   - Changing this link to `--brand-lavanda` (`#caa8d3`, luminance `0.4350`, contrast ratio `8.3:1` AAA) or `--brand-border-lila` (`#e3cde8`, luminance `0.6400`, contrast ratio `11.8:1` AAA) with `font-semibold hover:underline hover:text-white` eliminates the contrast violation completely.

6. **Input Focus Ring Standardization**:
   - In `src/app/(auth)/login/page.tsx:22`, `src/app/(auth)/register/page.tsx:23`, and `src/components/CartPageContent.tsx:200`, the focus ring is defined as `focus:ring-[#452453]/25` without offset.
   - `DESIGN.md` §5 specifies: `focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2`.
   - Standardizing input classes across all forms guarantees visual consistency with `Navbar.tsx` and provides a visible, accessible lavender ring against white inputs.

---

## 3. Caveats

1. **Product Fabric Swatches**:
   - `src/components/ProductCard.tsx:41` contains hardcoded swatch hexes `#2b3a4a` and `#546e7a` for denim products. These represent specific physical garment fabrics and are permitted for visual swatches (with migration to database fields recommended in future backend tracks).
2. **SVG Illustration Fills**:
   - `src/components/EmptyIllustration.tsx:47` contains `fill="#d94f78"`. This is a non-text decorative SVG rect fill (price tag illustration) and complies with `DESIGN.md:59` ("Rosa rebajas #d94f78: Solo decorativo, relleno sin texto").

---

## 4. Conclusion & Implementation Plan

### Summary Assessment
The Marifer design system foundations are solid: `globals.css` defines all canonical variables, fonts, and shadows accurately, and 0 forbidden generic Tailwind classes exist. Implementing the 15 targeted refinements below will achieve **100% adherence** to `DESIGN.md` and `MASTER.md` across all token consumers.

---

### Step-by-Step Code Changes Plan

#### 1. `src/app/products/page.tsx`
- **Line 81**: Wrap `{products.length}` in `font-mono-tabular`.
- **Lines 96, 109, 120, 131, 147, 161**: Replace `shadow-xs` with `shadow-marifer-sm`.

```diff
--- a/src/app/products/page.tsx
+++ b/src/app/products/page.tsx
@@ -80,3 +80,3 @@
           <p className="text-[13px] sm:text-sm text-[#7d7384] font-body mt-1" aria-live="polite">
-            {products.length} {products.length === 1 ? 'modelo disponible' : 'modelos disponibles para envío a todo el país'}
+            <span className="font-mono-tabular font-semibold">{products.length}</span> {products.length === 1 ? 'modelo disponible' : 'modelos disponibles para envío a todo el país'}
           </p>
@@ -95,3 +95,3 @@
                 sortBy === 'newest'
-                  ? 'bg-[#452453] text-white font-semibold shadow-xs'
+                  ? 'bg-[#452453] text-white font-semibold shadow-marifer-sm'
                   : 'text-[#7d7384] hover:text-[#241230]'
@@ -108,3 +108,3 @@
                 sortBy === 'price-asc'
-                  ? 'bg-[#452453] text-white font-semibold shadow-xs'
+                  ? 'bg-[#452453] text-white font-semibold shadow-marifer-sm'
                   : 'text-[#7d7384] hover:text-[#241230]'
@@ -119,3 +119,3 @@
                 sortBy === 'price-desc'
-                  ? 'bg-[#452453] text-white font-semibold shadow-xs'
+                  ? 'bg-[#452453] text-white font-semibold shadow-marifer-sm'
                   : 'text-[#7d7384] hover:text-[#241230]'
@@ -130,3 +130,3 @@
                 sortBy === 'sale'
-                  ? 'bg-[#c23b64] text-white font-semibold shadow-xs'
+                  ? 'bg-[#c23b64] text-white font-semibold shadow-marifer-sm'
                   : 'text-[#c23b64] hover:text-[#241230]'
@@ -146,3 +146,3 @@
             !categorySlug || categorySlug === 'all'
-              ? 'bg-[#452453] text-white shadow-xs'
+              ? 'bg-[#452453] text-white shadow-marifer-sm'
               : 'bg-white border border-[#e8e3ec] text-[#7d7384] hover:text-[#241230] hover:bg-[#f2e6f4]'
@@ -160,3 +160,3 @@
                 isSelected
-                  ? 'bg-[#452453] text-white shadow-xs'
+                  ? 'bg-[#452453] text-white shadow-marifer-sm'
                   : 'bg-white border border-[#e8e3ec] text-[#7d7384] hover:text-[#241230] hover:bg-[#f2e6f4]'
```

---

#### 2. `src/app/product/[id]/page.tsx`
- **Line 131**: Wrap `{product.numReviews}` in `font-mono-tabular`.
- **Line 156**: Wrap `{discountPercent}%` in `font-mono-tabular`.
- **Lines 189–191**: Wrap `{product.stock}` in `font-mono-tabular`.

```diff
--- a/src/app/product/[id]/page.tsx
+++ b/src/app/product/[id]/page.tsx
@@ -130,3 +130,3 @@
               <span className="text-[13px] text-[#7d7384]">
-                ({product.numReviews} reseñas de clientas)
+                (<span className="font-mono-tabular font-semibold">{product.numReviews}</span> reseñas de clientas)
               </span>
@@ -155,3 +155,3 @@
                 <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-[#c23b64] text-white">
-                  {discountPercent}% OFF
+                  <span className="font-mono-tabular font-bold">-{discountPercent}%</span> OFF
                 </span>
@@ -189,3 +189,3 @@
                 ? `Disponible: ${product.stock} unidades para despacho inmediato`
+                ? <>Disponible: <span className="font-mono-tabular font-bold">{product.stock}</span> unidades para despacho inmediato</>
                 : 'Prenda agotada por el momento'}
```

---

#### 3. `src/components/ProductCard.tsx`
- **Line 81**: Wrap `-{discountPercent}%` in `font-mono-tabular`.

```diff
--- a/src/components/ProductCard.tsx
+++ b/src/components/ProductCard.tsx
@@ -80,3 +80,3 @@
               <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold tracking-wide bg-[#c23b64] text-white">
-                -{discountPercent}%
+                <span className="font-mono-tabular font-bold">-{discountPercent}%</span>
               </span>
```

---

#### 4. `src/components/CartDrawer.tsx`
- **Line 81**: Wrap `{totalItems}` in `font-mono-tabular`.

```diff
--- a/src/components/CartDrawer.tsx
+++ b/src/components/CartDrawer.tsx
@@ -80,3 +80,3 @@
                     <p className="text-[13px] text-[#7d7384] font-body">
-                      {totalItems} {totalItems === 1 ? 'prenda' : 'prendas'}
+                      <span className="font-mono-tabular font-semibold">{totalItems}</span> {totalItems === 1 ? 'prenda' : 'prendas'}
                     </p>
```

---

#### 5. `src/components/CartPageContent.tsx`
- **Line 156**: Wrap `{totalItems}` in `font-mono-tabular`.
- **Line 200**: Update promo input focus ring to canonical `focus:ring-[#caa8d3] focus:ring-offset-2`.
- **Line 255**: Wrap `{installmentInfo.installmentText}` in `font-mono-tabular`.

```diff
--- a/src/components/CartPageContent.tsx
+++ b/src/components/CartPageContent.tsx
@@ -155,3 +155,3 @@
             <h2 className="font-display text-base font-bold text-[#241230]">
-              Prendas seleccionadas ({totalItems})
+              Prendas seleccionadas (<span className="font-mono-tabular font-semibold">{totalItems}</span>)
             </h2>
@@ -200,3 +200,3 @@
                 aria-describedby={promoError ? 'promo-error' : appliedPromo ? 'promo-ok' : undefined}
-                className="flex-1 min-w-0 h-11 rounded-full border border-[#d3ccd8] px-4 text-[14px] uppercase placeholder:normal-case placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#452453]/25 aria-[invalid=true]:border-[#c23b64]"
+                className="flex-1 min-w-0 h-11 rounded-full border border-[#d3ccd8] px-4 text-[14px] uppercase placeholder:normal-case placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2 aria-[invalid=true]:border-[#c23b64] transition-shadow"
               />
@@ -254,3 +254,3 @@
               <p className="text-[12px] text-[#452453] font-semibold text-right">
-                O 6 cuotas sin recargo de {installmentInfo.installmentText}
+                O 6 cuotas sin recargo de <span className="font-mono-tabular font-bold">{installmentInfo.installmentText}</span>
               </p>
```

---

#### 6. `src/components/Navbar.tsx`
- **Line 75**: Replace off-palette `border-[#ebd7be]` with canonical `border-[#e8e3ec]`.
- **Line 77**: Wrap `{formatPriceUYU(FREE_SHIPPING_THRESHOLD)}` in `font-mono-tabular`.

```diff
--- a/src/components/Navbar.tsx
+++ b/src/components/Navbar.tsx
@@ -74,4 +74,4 @@
       {/* Barra de anuncio */}
-      <div className="bg-[#fbf1de] text-[#7a5222] text-[12px] font-bold py-2 px-4 text-center tracking-wide border-b border-[#ebd7be]">
+      <div className="bg-[#fbf1de] text-[#7a5222] text-[12px] font-bold py-2 px-4 text-center tracking-wide border-b border-[#e8e3ec]">
         <p className="max-w-[1440px] mx-auto">
-          Envío gratis en compras desde {formatPriceUYU(FREE_SHIPPING_THRESHOLD)} · 6 pagos sin recargo
+          Envío gratis en compras desde <span className="font-mono-tabular font-bold">{formatPriceUYU(FREE_SHIPPING_THRESHOLD)}</span> · 6 pagos sin recargo
         </p>
       </div>
```

---

#### 7. `src/components/Footer.tsx`
- **Line 46**: Replace `text-[#d94f78]` with accessible `text-[#caa8d3] font-semibold hover:underline hover:text-white`.

```diff
--- a/src/components/Footer.tsx
+++ b/src/components/Footer.tsx
@@ -45,3 +45,3 @@
               <li>
-                <Link href="/products?sort=sale" className="text-[#d94f78] font-semibold hover:underline">
+                <Link href="/products?sort=sale" className="text-[#caa8d3] font-semibold hover:underline hover:text-white transition-colors">
                   Rebajas
                 </Link>
```

---

#### 8. `src/app/(auth)/login/page.tsx` & `src/app/(auth)/register/page.tsx`
- **Line 22 / 23**: Update `inputClass` focus ring to `focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2`.

```diff
--- a/src/app/(auth)/login/page.tsx
+++ b/src/app/(auth)/login/page.tsx
@@ -21,2 +21,2 @@
 const inputClass =
-  'w-full h-12 rounded-full border border-[#d3ccd8] bg-white pl-11 pr-4 text-[15px] text-[#241230] placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#452453]/25 transition-shadow aria-[invalid=true]:border-[#c23b64]';
+  'w-full h-12 rounded-full border border-[#d3ccd8] bg-white pl-11 pr-4 text-[15px] text-[#241230] placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2 transition-shadow aria-[invalid=true]:border-[#c23b64]';
```

```diff
--- a/src/app/(auth)/register/page.tsx
+++ b/src/app/(auth)/register/page.tsx
@@ -22,2 +22,2 @@
 const inputClass =
-  'w-full h-12 rounded-full border border-[#d3ccd8] bg-white pl-11 pr-4 text-[15px] text-[#241230] placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#452453]/25 transition-shadow aria-[invalid=true]:border-[#c23b64]';
+  'w-full h-12 rounded-full border border-[#d3ccd8] bg-white pl-11 pr-4 text-[15px] text-[#241230] placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2 transition-shadow aria-[invalid=true]:border-[#c23b64]';
```

---

## 5. Verification Method

To independently verify the implementation and ensure zero regressions:

1. **Verify Complete Absence of Forbidden Neutral Classes:**
   ```bash
   Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts,*.css | Select-String -Pattern '\b(bg|text|border|ring)-(gray|slate|neutral|zinc|stone|indigo|emerald|amber)-[0-9]+'
   # Expected Output: 0 matches
   ```

2. **Verify Elimination of `shadow-xs`:**
   ```bash
   Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts,*.css | Select-String -Pattern 'shadow-xs'
   # Expected Output: 0 matches
   ```

3. **Verify Elimination of Off-Palette Border `#ebd7be`:**
   ```bash
   Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts,*.css | Select-String -Pattern '#ebd7be'
   # Expected Output: 0 matches
   ```

4. **Verify Elimination of Footer Contrast Defect (`#d94f78` in Footer.tsx):**
   ```bash
   Get-ChildItem -Path src/components/Footer.tsx | Select-String -Pattern '#d94f78'
   # Expected Output: 0 matches
   ```

5. **Verify Standardization of Input Focus Rings:**
   ```bash
   Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts,*.css | Select-String -Pattern '#452453]/25'
   # Expected Output: 0 matches
   ```

6. **Verify Next.js Typecheck & Build:**
   ```bash
   bunx tsc --noEmit
   bun run lint
   bun run build
   ```

7. **Invalidation Conditions:**
   - If any price, count, quantity, or percentage is rendered without `.font-mono-tabular`.
   - If any element uses a generic Tailwind shadow or off-palette hex.
   - If any text element on dark surfaces fails WCAG 2.2 AA (4.5:1).
