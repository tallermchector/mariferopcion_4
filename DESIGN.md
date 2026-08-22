# Design System: Marifer — Tu Ropa Diaria

> **Fuente de verdad única** para generación de pantallas (Google Stitch) y agentes de código. Codifica la identidad visual de Marifer, e-commerce de moda femenina con base en Montevideo (precios en UYU, "6 cuotas sin recargo", envíos a todo Uruguay). Derivado de `design-system/marifer/MASTER-archived-2026-08-22.md`, `src/app/globals.css`, `src/app/layout.tsx` y componentes de `src/components/`.
>
> **Desviación explícita del skill taste-design:** el skill pide base neutra Zinc/Slate y prohíbe el "violeta IA". Marifer ya tiene una identidad **ciruela apagada** (`#452453` = HSL 282° · 40% · 23%, saturación muy por debajo del 80%) heredada de la marca; se conserva como único acento. Lo que sí queda prohibido es el violeta neón, los glows y los degradados saturados.

<!-- STITCH:TOKEN name=brand-primary value=#452453 -->
<!-- STITCH:TOKEN name=brand-deep value=#241230 -->
<!-- STITCH:TOKEN name=brand-soft-lila value=#f2e6f4 -->
<!-- STITCH:TOKEN name=brand-border-lila value=#e3cde8 -->
<!-- STITCH:TOKEN name=brand-lavanda value=#caa8d3 -->
<!-- STITCH:TOKEN name=accent-sale value=#d94f78 -->
<!-- STITCH:TOKEN name=accent-sale-deep value=#c23b64 -->
<!-- STITCH:TOKEN name=accent-highlight value=#d4a15a -->
<!-- STITCH:TOKEN name=bar-crema value=#fbf1de -->
<!-- STITCH:TOKEN name=bar-tabaco value=#7a5222 -->
<!-- STITCH:TOKEN name=stock-text value=#146043 -->
<!-- STITCH:TOKEN name=stock-dot value=#1f8a5f -->
<!-- STITCH:TOKEN name=text-primary value=#241230 -->
<!-- STITCH:TOKEN name=text-body value=#403945 -->
<!-- STITCH:TOKEN name=text-muted value=#7d7384 -->
<!-- STITCH:TOKEN name=border-hairline value=#e8e3ec -->
<!-- STITCH:TOKEN name=border-default value=#d3ccd8 -->
<!-- STITCH:TOKEN name=bg-page value=#fffcff -->
<!-- STITCH:TOKEN name=bg-card value=#ffffff -->

## Tabla de Contenidos

1. [Visual Theme & Atmosphere](#1-visual-theme--atmosphere)
2. [Color Palette & Roles](#2-color-palette--roles)
3. [Typography Rules](#3-typography-rules)
4. [Hero Section](#4-hero-section)
5. [Component Stylings](#5-component-stylings)
6. [Layout Principles](#6-layout-principles)
7. [Responsive Rules](#7-responsive-rules)
8. [Motion & Interaction](#8-motion--interaction)
9. [Anti-Patterns](#9-anti-patterns)
10. [Copy & Content Rules](#10-copy--content-rules-rioplatense)
11. [Stack-Specific Rules](#11-stack-specific-rules-nextjs-15-app-router--tailwind-v4)
12. [Critical Gaps & Debt](#12-critical-gaps--debt)
13. [Quick Reference Card](#13-quick-reference-card)

---

## 1. Visual Theme & Atmosphere

Una interfaz de **minimalismo cálido** para "tu ropa diaria, sin vueltas". La sensación es la de entrar a una boutique de barrio bien curada en Pocitos: luz natural, percheros ordenados, una vendedora que te habla de vos. Superficies blanco cálido (`#fffcff`) y lila suave (`#f2e6f4`), un único acento ciruela (`#452453`) que sostiene header, CTAs y eyebrows, sombras teñidas de violeta en vez de gris. Radios generosos (10–28px) y píldoras en todo lo interactivo.

No es lujo (nada de dorado brillante, serifas clásicas ni glassmorphism), no es brutalismo (nada de bordes negros ni tipografía gritona) y no es "AI startup" (nada de neón, degradados ni partículas). El copy habla en voseo rioplatense, en sentence case, con referencias concretas a Uruguay (Rambla, Pocitos, Parque Rodó, OCA, Abitab, Redpagos).

**Patrón de landing** (implementado en `src/app/page.tsx`):
- Hero split **7/5** sobre violeta
- Franja de confianza (3 ítems divididos por hairlines)
- Bento de categorías (6 tiles, **5/4/3 · 3/4/5** asimétrico)
- "Lo más elegido" (4 product cards)
- Dos bloques editoriales en **zig-zag** (6/6 con `order` invertido en el segundo)

**Hero centrado prohibido.** "3 cards iguales" para features prohibido.

---

## 2. Color Palette & Roles

Tokens canónicos definidos en `:root` de `src/app/globals.css`. Los componentes los usan como hex inline con Tailwind (`bg-[#452453]`); es tolerable, pero **no introducir hex nuevos ni clases `neutral-*`, `indigo-*`, `emerald-*`, `amber-*`, `slate-*`, `gray-*`**.

### Superficies y texto

| Nombre | Hex | Token | Rol funcional |
|--------|-----|-------|---------------|
| **Blanco cálido** | `#fffcff` | `--bg-page` | Fondo de página (no clínico) |
| **Blanco puro** | `#ffffff` | `--bg-card` | Fondo de cards, drawer, header de secciones |
| **Ciruela profunda** | `#241230` | `--brand-deep` / `--text-primary` | Títulos H1–H3, hover CTA primario, fondo menú mobile, precio |
| **Tinta cuerpo** | `#403945` | `--text-body` | Párrafos y texto de lectura |
| **Malva apagado** | `#7d7384` | `--text-muted` | Metadata, captions, placeholders. **4.5:1 sobre blanco (AA justo), 3.7:1 sobre lila → nunca < 18px sobre `#f2e6f4`** |
| **Hairline** | `#e8e3ec` | `--border-hairline` | Bordes de cards, divisores franja confianza, `border-y` secciones |
| **Borde base** | `#d3ccd8` | `--border-default` | Bordes de inputs y separadores más marcados |

### Marca (único acento funcional)

| Nombre | Hex | Token | Rol funcional |
|--------|-----|-------|---------------|
| **Ciruela Marifer** | `#452453` | `--brand-primary` | Header sticky, hero, CTA primario, links activos, eyebrows sobre claro, ícono dentro círculos lila, barra progreso envío gratis, foco por teclado |
| **Lila suave** | `#f2e6f4` | `--brand-soft-lila` | Fondo tiles categoría, círculos íconos, hover botones ghost sobre claro, skeleton, chips éxito |
| **Borde lila** | `#e3cde8` | `--brand-border-lila` | Borde tiles, **texto secundario y bordes ghost sobre violeta** (8.7:1 AAA) |
| **Lavanda** | `#caa8d3` | `--brand-lavanda` | Subrayado link activo nav, eyebrow y palabra destacada H1 sobre violeta (6.2:1), ring foco sobre superficies oscuras, `ring-2 ring-[#caa8d3]/40` fotos inline |

### Acentos decorativos (solo badges y estados; nunca como acento de marca)

| Nombre | Hex | Token | Rol funcional |
|--------|-----|-------|---------------|
| **Rosa rebajas** | `#d94f78` | `--accent-sale` | Solo decorativo (swatches, relleno sin texto) |
| **Rosa rebajas AA** | `#c23b64` | `--accent-sale-deep` | Badge "-N%" con texto blanco (5.1:1), badge contador carrito, texto "Rebajas", errores formulario sobre blanco (5.1:1) |
| **Dorado** | `#d4a15a` | `--accent-highlight` | Badge "Envío gratis" **siempre con texto `#241230` encima** (blanco sobre dorado = 2.3:1, prohibido) |
| **Crema anuncio** | `#fbf1de` | `--bar-crema` | Fondo barra anuncio sobre header |
| **Tabaco anuncio** | `#7a5222` | `--bar-tabaco` | Texto 12px bold barra anuncio (6.1:1 sobre crema) |
| **Verde stock** | `#146043` | `--stock-text` | Texto "Tenés envío gratis", "En stock", estado éxito botón carrito |
| **Punto stock** | `#1f8a5f` | `--stock-dot` | Punto disponibilidad (con `.dot-pulse`) y barra progreso al 100% |

### Sombras (teñidas de ciruela, nunca grises ni neón)

| Clase | Valor | Uso |
|-------|-------|-----|
| `shadow-marifer-sm` | `0 1px 2px rgba(36,18,48,0.06)` | Reposo cards, header sticky |
| `shadow-marifer-hover` | `0 14px 36px rgba(36,18,48,0.14)` | Hover cards (`.hover-lift`), drawer, foto hero |
| `shadow-marifer-btn` | `0 6px 18px rgba(69,36,83,0.24)` | Solo CTA primario |

No usar `shadow-md/lg/xl/2xl` de Tailwind ni `drop-shadow` de color.

### Pares de contraste verificados (WCAG 2.2)

| Par | Ratio | Veredicto |
|-----|-------|-----------|
| `#e3cde8` sobre `#452453` | 8.7:1 | AAA |
| `#caa8d3` sobre `#452453` | 6.2:1 | AA |
| `#7d7384` sobre `#ffffff` | 4.5:1 | AA (justo) |
| `#7d7384` sobre `#f2e6f4` | 3.7:1 | Solo ≥ 18px o bold ≥ 14px; preferir `#403945` |
| `#7a5222` sobre `#fbf1de` | 6.1:1 | AA |
| blanco sobre `#c23b64` | 5.1:1 | AA |
| blanco sobre `#d94f78` | 3.9:1 | Prohibido para texto |
| blanco sobre `#d4a15a` | 2.3:1 | Prohibido; usar `#241230` |

---

## 3. Typography Rules

Cargadas con `next/font/google` en `src/app/layout.tsx` (variables `--font-outfit`, `--font-manrope`, `--font-brand`, `--font-mono`). Nunca `@import` de Google Fonts en CSS.

<!-- STITCH:TOKEN name=font-display value=Outfit -->
<!-- STITCH:TOKEN name=font-body value=Manrope -->
<!-- STITCH:TOKEN name=font-logo value=Lobster Two -->
<!-- STITCH:TOKEN name=font-mono value=JetBrains Mono -->

| Rol | Fuente | Clase | Especificación |
|-----|--------|-------|----------------|
| **Display / headings** | Outfit 400–800 | `.font-display` (automática en `h1–h6`) | `letter-spacing: -0.025em`, color `#241230`. H1 hero `clamp(2.75rem, 5.6vw, 4.25rem)` extrabold, `leading-[1.04]`, `text-balance`; H2 sección `clamp(1.75rem, 3vw, 2rem)` bold; H2 menor `clamp(1.5rem, 3vw, 1.75rem)`; H3 editorial `text-2xl sm:text-3xl`; nombre producto 17px bold; títulos card/drawer 15–18px. Jerarquía por peso y color, no por tamaño gigante. |
| **Body** | Manrope 400–700 | `.font-body` (default en `body`) | **Base 16px / line-height 1.5**; lead hero 16–18px sobre `#e3cde8` `max-w-[54ch]`; párrafos editoriales 16px `leading-relaxed max-w-lg`; captions 13px; eyebrows 12px bold uppercase `tracking-[0.16em–0.2em]`. Máximo 65ch por línea. |
| **Logo** | Lobster Two 700 italic | `.font-logo` | Solo la palabra "Marifer" en el header (31px). Nunca para otro texto. |
| **Precios / números** | JetBrains Mono 400–800 | `.font-mono-tabular` | `font-variant-numeric: tabular-nums` **siempre** en precios (20px en card, 18px total), tachados (13px), cantidades, contador carrito, porcentajes descuento, conteos ("12 prendas"). |

### Reglas

- Palabra destacada del H1: `font-light italic text-[#caa8d3]` ("sin vueltas.") — un solo énfasis por titular.
- Mínimos absolutos: body ≥ 14px, labels/captions/badges ≥ 12px. Nada en 11px.
- **Prohibido:** `Inter`, `Roboto`, `Arial`/system stack, serifas genéricas (`Times New Roman`, `Georgia`, `Garamond`, `Palatino`). Si se necesita serifa editorial, solo `Fraunces` o `Instrument Serif`, nunca en UI de carrito, formularios o checkout.
- Sentence case en UI; uppercase solo en eyebrows y categoría de card (12px, tracking ≥ 0.14em).

---

## 4. Hero Section

Implementado en `src/app/page.tsx` (`<section data-surface="dark">`). Primera impresión: llamativo, asimétrico, nunca genérico.

📁 **src/app/page.tsx:45-120**

- **Split-screen 7/5** en grilla de 12 sobre fondo `#452453`: texto a la izquierda (`lg:col-span-7`), foto 4:5 a la derecha (`lg:col-span-5`, radio **28px**, borde `#caa8d3/20`, `shadow-marifer-hover`, zoom 1.03 en hover a 700ms). **Hero centrado prohibido.**
- **Fotos inline como puntuación visual** (`InlineWord`): píldoras `h-[0.72em] w-[1.75em]`, `rounded-full`, fondo `#241230`, `ring-2 ring-[#caa8d3]/40`, intercaladas entre palabras del H1 ("Tu ropa [foto lino] diaria, [foto Rambla] sin vueltas."). Se ocultan del titular en mobile (`hidden sm:inline-block`) y reaparecen como fila de píldoras `h-10 w-24` debajo del H1.
- **Sin superposiciones:** nada de texto sobre la foto. El pie "Colección otoño 2026 · Diseñado en Montevideo" (12px, lavanda + borde lila) va **debajo** de la imagen.
- **Eyebrow** 12px bold uppercase `tracking-[0.2em]` en `#caa8d3` ("Temporada otoño 2026"). **Lead** 16–18px en `#e3cde8`, `max-w-[54ch]`.
- **Un solo CTA primario** (`#hero-primary-cta`: blanco sobre violeta, `h-[50px] sm:h-[54px]`, `rounded-full`, `hover:bg-[#f2e6f4]`, `active:translate-y-px`). El botón secundario (`#hero-secondary-cta`, ghost `border-[#e3cde8] text-[#e3cde8] hover:bg-white/10`) **solo se renderiza si hay descuento real** y muestra el **descuento máximo calculado desde la BD** ("Rebajas hasta N%" en mono). Nunca "Saber más" ni porcentajes inventados.
- **Sin filler:** prohibidos "Scroll to explore", "Deslizá", flechas rebotantes, chevrones, indicadores de scroll.

**Tailwind copypaste (CTA primario hero):**
```tsx
<a href="/products" id="hero-primary-cta" className="h-[50px] sm:h-[54px] px-8 rounded-full bg-white text-[#452453] font-semibold hover:bg-[#f2e6f4] active:translate-y-px transition-colors shadow-marifer-btn">
  Ver catálogo
</a>
```

---

## 5. Component Stylings

Cada componente incluye: **spec visual**, **a11y mini-checklist**, **Tailwind copypaste**, **cross-ref 📁** al source.

### 5.1 Botón primario (CTA)

Píldora `rounded-full`, altura **≥ 44px** (`h-11` en listas, `h-12` en páginas, `h-[50–56px]` en hero y ficha), `px-6–8`, 14–15px semibold/bold. `bg-[#452453] text-white hover:bg-[#241230]` + `shadow-marifer-btn`; `focus-visible:ring-2 focus-visible:ring-[#caa8d3] focus-visible:ring-offset-2`; feedback táctil `active:translate-y-px`. **Sobre violeta se invierte:** `bg-white text-[#452453] hover:bg-[#f2e6f4]`. Estado éxito: `bg-[#146043]` + ícono check. Deshabilitado: `bg-[#f2e6f4] text-[#7d7384] shadow-none`. Sin glow, sin degradado, sin cursor custom.

📁 **src/components/AddToCartButton.tsx:71-95** · **src/components/CartDrawer.tsx:205-212**

**a11y:** ✅ target ≥44×44px · ✅ focus-visible ring · ✅ aria-live en estado éxito · ✅ disabled aria-disabled · ✅ reduced-motion respeta `useReducedMotion()`

**Tailwind copypaste:**
```tsx
<button className="h-12 px-6 rounded-full bg-[#452453] text-white font-semibold hover:bg-[#241230] shadow-marifer-btn focus-visible:ring-2 focus-visible:ring-[#caa8d3] focus-visible:ring-offset-2 active:translate-y-px transition-colors">
  Iniciar compra
</button>
```

### 5.2 Botón ghost / secundario

Misma píldora y altura. Sobre violeta: `border border-[#e3cde8] text-[#e3cde8] hover:bg-white/10 hover:text-white`. Sobre claro: `border-[#e3cde8] text-[#452453] hover:bg-[#f2e6f4]` (o `border-[#e8e3ec] text-[#7d7384]` para acciones terciarias). Links de texto: 14px bold `#452453 hover:underline` con flecha 16px, `h-11` para área táctil.

📁 **src/components/Navbar.tsx:37-39** · **src/app/page.tsx:95-105**

**Tailwind copypaste (sobre claro):**
```tsx
<button className="h-11 px-6 rounded-full border border-[#e3cde8] text-[#452453] font-medium hover:bg-[#f2e6f4] transition-colors">
  Ver más
</button>
```

### 5.3 Botones de solo ícono

`w-11 h-11 rounded-full`, `aria-label` obligatorio, ícono Lucide 20px `stroke-[2]`. Sobre violeta `text-[#e3cde8] hover:text-white hover:bg-white/10`; sobre claro `text-[#7d7384] hover:bg-[#f2e6f4] hover:text-[#241230]`.

📁 **src/components/Navbar.tsx:127-177** · **src/components/CartDrawer.tsx:86-95** · **src/components/CartControl.tsx:58-67**

**a11y:** ✅ 44×44px · ✅ aria-label · ✅ focus-visible · ✅ reduced-motion

### 5.4 Badges / píldoras

`rounded-full`, 12px bold, `px-2 py-0.5`. Rebaja: `bg-[#c23b64] text-white` ("-25%" en mono). Nuevo: `bg-[#452453] text-white`. Envío gratis: `bg-[#d4a15a] text-[#241230]`. Éxito: `bg-[#f2e6f4] text-[#146043]`. Contador carrito: `min-w-[20px] h-[20px] bg-[#c23b64]` en mono. Apilados arriba-izquierda de la imagen con `gap-1.5`.

📁 **src/components/ProductCard.tsx:78-92**

**a11y:** ✅ contraste AA (texto blanco sobre `#c23b64` = 5.1:1) · ✅ font-mono-tabular para números

**Tailwind copypaste (rebaja):**
```tsx
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold tracking-wide bg-[#c23b64] text-white font-mono-tabular">
  -25%
</span>
```

### 5.5 ProductCard

Contenedor `rounded-[14px] bg-white p-3 border border-[#e8e3ec] shadow-marifer-sm`, hover `-translate-y-0.5` + `shadow-marifer-hover`. Imagen **3:4** con `next/image` + `sizes`, `rounded-[10px]`, fondo `#f2e6f4`, zoom 1.05 en hover a 300ms. Orden interno: badges → categoría 12px uppercase `#7d7384` → nombre 17px Outfit `#241230` → precio 20px mono + tachado 13px → swatches de color (círculos con borde hairline) y talle → botón "Sumar" **`h-11`** píldora con ícono bolsa, que muta a check + "Listo" 1.6s.

📁 **src/components/ProductCard.tsx:1-166**

**a11y:** ✅ target ≥44px (botón h-11) · ✅ focus-visible · ✅ aria-label en botón · ✅ alt en imagen · ✅ reduced-motion en zoom hover

**Tailwind copypaste (contenedor):**
```tsx
<div className="group relative flex flex-col justify-between rounded-[14px] bg-white p-3 border border-[#e8e3ec] shadow-marifer-sm hover:-translate-y-0.5 hover:shadow-marifer-hover transition-all duration-200">
  {/* imagen 3:4 */}
  <Link href={`/product/${product.id}`} className="relative block aspect-[3/4] w-full overflow-hidden rounded-[10px] bg-[#f2e6f4]" aria-label={`Ver ${product.name}`}>
    <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out" />
    {/* badges arriba-izquierda */}
  </Link>
  {/* info + botón Sumar h-11 */}
</div>
```

**Deuda conocida:** swatches de color y talle "S – L" hardcodeados por `product.id` (líneas 38-50). Mover a modelo `Product` cuando se extienda el schema.

### 5.6 Tiles de categoría (bento)

`rounded-[16px] bg-[#f2e6f4] border border-[#e3cde8] p-2.5 sm:p-3 hover-lift hover:border-[#452453]`. Foto arriba (`h-[168px]`, `rounded-[10px]`, zoom 1.04) y **etiqueta debajo** (nombre 17px Outfit + conteo real 12px mono), nunca texto sobre la imagen. En mobile pasan a fila horizontal: foto `h-20 w-24` a la izquierda, texto a la derecha.

📁 **src/app/page.tsx:140-200**

**a11y:** ✅ link wrapper con aria-label · ✅ contraste nombre/conteo · ✅ hover-lift usa transform/opacity · ✅ reduced-motion

### 5.7 Franja de confianza

`bg-white border-y border-[#e8e3ec]`, tres ítems en `sm:grid-cols-3` separados por `divide-x divide-[#e8e3ec]` (mobile `divide-y`). Círculo ícono `w-12 h-12 rounded-full bg-[#f2e6f4] text-[#452453]`, título 15px Outfit bold, detalle 13px `#7d7384`. No son cards: no llevan sombra ni borde propio.

📁 **src/app/page.tsx:120-140**

### 5.8 Navbar

Barra anuncio `bg-[#fbf1de] text-[#7a5222]` 12px bold centrada. Header `sticky top-0 z-50 h-[72px] bg-[#452453] shadow-marifer-sm`: logo Lobster Two 31px, nav 15px medium `#e3cde8 hover:text-white` con subrayado activo `h-[2px] bg-[#caa8d3]` animado por spring (`stiffness 300, damping 30`, `layoutId`), buscador píldora blanca `h-11` con lupa `w-11 h-11`, íconos cuenta/bolsa `w-11 h-11`. Menú mobile: panel `bg-[#241230]` que anima `opacity`/`transform` (nunca `height`), ítems `h-11`.

📁 **src/components/Navbar.tsx:1-233**

**a11y:** ✅ focus-visible global · ✅ aria-label en icon-only buttons · ✅ aria-expanded/aria-controls en toggle mobile · ✅ role="search" en buscadores · ✅ reduced-motion en menú mobile · ✅ subrayado activo con layoutId (motion)

**Tailwind copypaste (header sticky):**
```tsx
<header className="sticky top-0 z-50 w-full h-[72px] bg-[#452453] text-white shadow-marifer-sm">
  <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
    <Link href="/" className="font-logo italic text-[31px] text-white hover:text-[#caa8d3] transition-colors" aria-label="Marifer, ir al inicio">Marifer</Link>
    {/* nav links + buscador + iconos */}
  </div>
</header>
```

### 5.9 CartDrawer

Panel derecho `max-w-md bg-[#fffcff] border-l border-[#e8e3ec] shadow-marifer-hover`, backdrop `bg-[#241230]/40 backdrop-blur-xs` con click-to-close. Spring `damping 26, stiffness 260`. `role="dialog" aria-modal="true" aria-labelledby`, cierra con Escape, foco inicial en botón cerrar (`w-11 h-11`). Barra progreso envío gratis `h-1.5 rounded-full bg-[#f2e6f4]` con relleno `#452453` (→ `#1f8a5f` al completar) y `role="progressbar"`. Resumen con etiquetas 13px `#7d7384` y cifras en mono `#241230`; total 18px mono; CTA `h-12` full-width; "Vaciar bolsa" 12px `#7d7384` con `h-11`.

📁 **src/components/CartDrawer.tsx:1-232**

**a11y:** ✅ role="dialog" aria-modal · ✅ Escape cierra · ✅ foco inicial en cerrar · ✅ focus-visible · ✅ progressbar con aria-valuemin/max/now · ✅ reduced-motion en spring · ✅ backdrop click-to-close

### 5.10 Steppers de cantidad (CartControl, AddToCartButton)

Grupo `rounded-full border border-[#e8e3ec] bg-white` con botones `h-11 w-11 rounded-full` (`aria-label` "Restar/Sumar una unidad"), cifra central `w-10`/`w-8` 15px mono bold `aria-live="polite"`, deshabilitado `opacity-30`. Label "Cantidad" 12px uppercase `tracking-[0.14em]`.

📁 **src/components/CartControl.tsx:72-106** · **src/components/AddToCartButton.tsx:35-68**

**a11y:** ✅ 44×44px targets · ✅ aria-label en botones +/- · ✅ aria-live en cifra · ✅ aria-labelledby en grupo · ✅ disabled state · ✅ reduced-motion en whileTap

**Tailwind copypaste (stepper):**
```tsx
<div className="flex items-center rounded-full border border-[#e8e3ec] bg-white" role="group" aria-labelledby="qty-label">
  <button className="flex h-11 w-11 items-center justify-center rounded-full text-[#241230] hover:bg-[#f2e6f4] transition-colors" aria-label="Restar una unidad"><Minus className="h-4 w-4" /></button>
  <span id="qty-value" className="w-8 text-center text-[14px] font-mono-tabular font-bold text-[#241230]" aria-live="polite">{quantity}</span>
  <button className="flex h-11 w-11 items-center justify-center rounded-full text-[#241230] hover:bg-[#f2e6f4] transition-colors" aria-label="Sumar una unidad"><Plus className="h-4 w-4" /></button>
</div>
```

### 5.11 Inputs / formularios

Label visible encima (`htmlFor`), input `h-11+ rounded-full` o `rounded-[12px]` con `border border-[#d3ccd8] bg-white text-[#241230] placeholder:text-[#7d7384]`, foco `focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2` (nunca `focus:outline-none` sin reemplazo). Validación on blur, `aria-invalid`, error 13px `#c23b64` debajo con `role="alert"`. Sin floating labels. Buscador con ícono: `aria-label` en el input y en el botón.

📁 **src/components/Navbar.tsx:106-124** · **src/app/(auth)/login/page.tsx** · **src/app/(auth)/register/page.tsx**

**a11y:** ✅ label visible o aria-label · ✅ focus-ring visible · ✅ aria-invalid + role="alert" en error · ✅ contraste placeholder · ✅ reduced-motion

### 5.12 ProductDetailGallery

Imagen principal 3:4 `rounded-[24px] bg-[#f2e6f4] border border-[#e8e3ec] shadow-marifer-sm`; miniaturas `h-24 w-[72px] rounded-[14px] border-2` (`#452453` activa, `#e8e3ec` inactiva con `opacity-75`), `aria-pressed`, fila con `overflow-x-auto scrollbar-none`. Transición `AnimatePresence` con `reduceMotion` (0.25s scale/opacity).

📁 **src/components/ProductDetailGallery.tsx:1-91**

**a11y:** ✅ aria-pressed en miniaturas · ✅ aria-label grupo · ✅ alt en principal · ✅ reduced-motion · ✅ focus-visible en botones miniatura

### 5.13 Skeletons

Shimmer `linear-gradient(90deg, #f2e6f4 25%, #fffcff 50%, #f2e6f4 75%)`, 1.4s ease-in-out infinito, **replicando las dimensiones exactas** del layout (card 14px, imagen 3:4 10px, líneas `rounded-full`, botón `h-11`). `role="status" aria-live="polite" aria-busy`. Nunca spinners circulares.

📁 **src/app/loading.tsx** · **src/app/globals.css:119-127**

### 5.14 EmptyIllustration

Ilustración SVG propia (percha + prenda en paleta Marifer, `aria-hidden`) + título Outfit 18–20px + texto 13–15px + un CTA píldora. Usado en grilla sin resultados, drawer vacío, página de carrito y 404. Nunca solo "No hay datos".

📁 **src/components/EmptyIllustration.tsx** · **src/app/not-found.tsx**

---

## 6. Layout Principles

- **Contención:** `max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12`.
- **Grid-first:** CSS Grid de 12 columnas para hero (7/5), bento (5/4/3 · 3/4/5), editorial (6/6 con `order` invertido en el segundo bloque). `grid-cols-2/4` para product cards. Nunca `calc(33% - 1rem)` ni flexbox con porcentajes.
- **Sin superposiciones:** cada elemento ocupa su zona. El único `absolute` permitido: badges sobre imagen de producto, subrayado nav, menú mobile desplegado; nunca texto sobre fotos de hero/tiles/editoriales.
- **Features en 3 cards iguales prohibido:** franja de confianza son 3 ítems divididos por hairlines sin cards; categorías son bento asimétrico; editorial es zig-zag 6/6 con imagen 4:3 `rounded-[24px]`.
- **Ritmo vertical:** secciones `pt-[clamp(3rem,6vw,4.5rem)]`; editorial `pt-[clamp(3.5rem,7vw,5.5rem)] pb-[clamp(3.5rem,7vw,6rem)]`; hero `pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24`; franja confianza `py-6 sm:py-7`.
- **Radios:** imagen interna 10px → card 14px → tile 16px → editorial/galería 24px → hero 28px → botones, badges, inputs, chips `rounded-full`.
- **Full height:** `min-h-[100dvh]` (o `min-h-full` en body); nunca `h-screen`.
- **Capas z-index:** solo header (`z-50`), drawer/backdrop y badges (`z-10`). Nada más.

---

## 7. Responsive Rules

Verificado en 390 y 1440; diseñar para 375 / 390 / 768 / 1024 / 1440.

- **< 640px (sm):** todo a una columna; tiles categoría → fila horizontal compacta; fotos inline H1 → fila píldoras debajo; CTAs hero `w-full`; franja confianza apilada con `divide-y`.
- **< 768px (md):** nav horizontal se oculta → menú `bg-[#241230]` con buscador; product cards 1 columna (`sm:grid-cols-2` desde 640).
- **< 1024px (lg):** hero y editorial apilan (texto arriba, foto abajo; bloque 2 texto primero vía `order`); bento en 2 columnas.
- **Sin scroll horizontal** en ningún breakpoint (solo fila miniaturas galería con `overflow-x-auto scrollbar-none`).
- **Tipografía fluida:** H1 `clamp(2.75rem, 5.6vw, 4.25rem)`, H2 `clamp(1.75rem, 3vw, 2rem)`; body nunca < 16px en mobile.
- **Touch targets ≥ 44×44px** en todo interactivo (botones `h-11`, íconos `w-11 h-11`, steppers, miniaturas ≥ 72×96).
- **Imágenes:** `next/image` con `sizes` por breakpoint y `priority` **solo en hero (LCP)**.
- **Espaciado:** gaps verticales con `clamp()`; gaps grilla `gap-3 sm:gap-4` (bento) y `gap-5 sm:gap-6` (cards).

---

## 8. Motion & Interaction

> Stitch genera pantallas estáticas; esta sección es la intención de movimiento para el agente de código.

- **Spring por defecto (`motion/react`):** micro-interacciones y entrada grilla `stiffness 100, damping 20`; drawer `stiffness 260, damping 26`; subrayado nav `stiffness 300, damping 30`. Sin `linear`.
- **Transiciones CSS:** 150–300ms, `ease-out` al entrar, `ease-in` al salir; `.hover-lift` = `translateY(-2px)` + `shadow-marifer-hover` a 200ms; zoom fotos 1.03–1.05 a 300–700ms.
- **Cascada de entrada (`.reveal`):** `reveal-rise` 480ms `cubic-bezier(0.22, 1, 0.36, 1)`, `animation-delay: calc(var(--index) * 90ms)`; cada ítem recibe `style={{ '--index': i }}`. Se usa en franja confianza, bento y "Lo más elegido". Nunca montar listas de golpe.
- **Un solo micro-loop perpetuo por vista:** `.dot-pulse` (halo 1.8s sobre punto stock en ficha). El shimmer del skeleton es de carga, no decorativo. No agregar typewriters, floats ni partículas.
- **Feedback táctil:** `active:translate-y-px` en CTAs; botón "Sumar" muta a éxito 1.6s.
- **Hardware:** animar solo `transform` y `opacity` (menú mobile anima `opacity`/`transform`, nunca `height`). Nada de `top/left/width/height` animados salvo barra progreso dentro de su contenedor.
- **Reduced motion:** regla global en `globals.css` (`animation-duration: 0.01ms`, `scroll-behavior: auto`) + `useReducedMotion()` en drawer, menú, grilla, galería, auth y botones.
- **Foco:** `:focus-visible` global en `#452453` (outline 2px, offset 2px, radio 4px); dentro de `[data-surface="dark"]` pasa a `#caa8d3`.

📁 **src/app/globals.css:60-69, 130-155**

---

## 9. Anti-Patterns (prohibidos)

- Emojis en UI, íconos, alt text o copy; íconos solo de Lucide con `aria-hidden`.
- `Inter`, `Roboto`, system stack; serifas genéricas (Times, Georgia, Garamond, Palatino).
- Negro puro `#000000`; usar `#241230`.
- Paletas ajenas: `neutral-*`, `indigo-*`, `emerald-*`, `amber-*`, `slate-*`, `gray-*`, hex fuera de la tabla (`#C84B6B`, `#9A9196`, `#1A161D`, `#FAF9F7`, etc.).
- Violeta neón, glows exteriores, degradados saturados, gradient text en titulares, glassmorphism pesado, blur animado.
- Sombras grises de Tailwind (`shadow-lg/xl/2xl`); solo `shadow-marifer-*`.
- Custom cursors.
- Elementos superpuestos: texto sobre fotos de hero, tiles o editoriales; stacks con `absolute`.
- Hero centrado; "3 cards iguales en fila" para features; grillas simétricas de 3 columnas.
- Filler UI: "Scroll to explore", "Deslizá", flechas de scroll, chevrones rebotantes.
- Nombres y marcas genéricas ("John Doe", "Acme", "Nexus") y copy cliché ("Elevá tu estilo", "Seamless", "Next-Gen", "Unleash", "Revolucioná").
- Números redondos inventados (`99.99%`, `50% OFF` fijo, `+10.000 clientas`) y secciones de métricas fabricadas ("BY THE NUMBERS", "KEY STATISTICS"). El descuento del hero sale de la BD; si no hay dato real, `[metric]`.
- Formato `LABEL // YEAR` ("CATÁLOGO // 2026").
- Links de Unsplash rotos; usar `picsum.photos/seed/marifer-*/W/H` o SVG propio.
- `h-screen` (usar `min-h-[100dvh]`); animar `height`; `focus:outline-none` sin `focus:ring`.
- Spinners circulares; "No hay datos" sin ilustración ni CTA.
- Texto `#7d7384` < 18px sobre `#f2e6f4`; blanco sobre `#d4a15a`; blanco sobre `#d94f78`; texto de 11px.
- Botones o íconos de menos de 44×44px; botones de solo ícono sin `aria-label`.
- Title Case en UI; tuteo o español neutro ("Compra ahora", "Conoce más").
- Defaults de shadcn/ui sin adaptar radios, colores y sombras a este sistema.

---

## 10. Copy & Content Rules (rioplatense)

- **Voseo obligatorio:** "Comprá", "Conocé", "Tenés", "Sumá", "Elegí", "Explorá", "Ver el catálogo".
- **Sentence case** en títulos, botones y navegación.
- **Uruguay concreto:** Rambla, Pocitos, Parque Rodó, Montevideo, lino y lana merino uruguaya, OCA, Abitab, Redpagos, "tarjetas uruguayas".
- **Precios:** `formatPriceUYU` → `"$ 1.290"` (locale `es-UY`, sin decimales), siempre en `.font-mono-tabular`. 📁 **src/lib/format.ts**
- **Cuotas:** "6 cuotas sin recargo" vía `formatInstallments` / `calculateInstallmentsUYU`. 📁 **src/lib/format.ts**
- **Envío:** umbral gratis `$3.500`, costo `$220`, ambos en `src/lib/shipping.ts` (único lugar). 📁 **src/lib/shipping.ts**
- **Confianza:** "Envíos a todo el país · 24 a 72 horas hábiles", "Cambios gratis · 30 días", "6 pagos sin recargo · con tarjetas uruguayas".
- **Carrito = "bolsa"** ("Abrir bolsa", "Tu bolsa está vacía", "Vaciar bolsa"). Productos = "prendas".

---

## 11. Stack-Specific Rules (Next.js 15 App Router + Tailwind v4)

- Server Components por defecto; `'use client'` solo con hooks, `motion/react`, `localStorage`, eventos.
- Datos con Prisma en Server Components, `export const revalidate = 60`; `params`/`searchParams` son Promises → `await`.
- `next/image` con `sizes` correcto; `remotePatterns` limitados a `picsum.photos` e `images.unsplash.com`; `priority` **solo en LCP (hero)**, no en todas las cards `featured`.
- Casteo `as unknown as ProductType` antes de pasar resultados de Prisma a Client Components.
- Tailwind v4 CSS-first: tokens en `:root` de `globals.css`; utilidades propias (`shadow-marifer-*`, `hover-lift`, `skeleton`, `reveal`, `dot-pulse`, `scrollbar-none`, `font-*`) viven ahí.
- Definition of Done: `bun run build`, `bun run lint`, `bunx tsc --noEmit` en verde y captura en 390 + 1440.

---

## 12. Critical Gaps & Debt

| Gap | Ubicación | Impacto | Acción Requerida |
|-----|-----------|---------|------------------|
| **Footer links 404** | `src/components/Footer.tsx` | UX rota: `/faq`, `/about`, `/stores`, `/careers` no existen | Crear páginas o remover links del footer |
| **Footer Client Component innecesario** | `src/components/Footer.tsx` | `'use client'` sin hooks/eventos → overhead hydration | Mover a Server Component (quitar `'use client'`) |
| **`next/image priority` misuse** | `src/app/page.tsx` (featured cards), `src/app/products/page.tsx` | LCP compite con hero; bandwidth desperdiciado | Quitar `priority` de cards no-hero; solo hero LCP |
| **Swatches/talle hardcodeados** | `src/components/ProductCard.tsx:38-50` | No escalables; deuda técnica | Mover a modelo `Product` (schema Prisma) o a JSON en BD |
| **InlineWord no documentado** | `src/app/page.tsx` (componente inline) | Agentes no saben replicar comportamiento mobile/desktop | Documentado en §4; considerar extraer a `src/components/InlineWord.tsx` |

---

## 13. Quick Reference Card

### Tokens (copypaste para Tailwind config o CSS)

```css
/* Colores */
--bg-page: #fffcff;
--bg-card: #ffffff;
--brand-primary: #452453;
--brand-deep: #241230;
--brand-soft-lila: #f2e6f4;
--brand-border-lila: #e3cde8;
--brand-lavanda: #caa8d3;
--accent-sale: #d94f78;
--accent-sale-deep: #c23b64;
--accent-highlight: #d4a15a;
--bar-crema: #fbf1de;
--bar-tabaco: #7a5222;
--stock-text: #146043;
--stock-dot: #1f8a5f;
--text-primary: #241230;
--text-body: #403945;
--text-muted: #7d7384;
--border-hairline: #e8e3ec;
--border-default: #d3ccd8;

/* Sombras */
.shadow-marifer-sm { box-shadow: 0 1px 2px rgba(36,18,48,0.06); }
.shadow-marifer-hover { box-shadow: 0 14px 36px rgba(36,18,48,0.14); }
.shadow-marifer-btn { box-shadow: 0 6px 18px rgba(69,36,83,0.24); }

/* Utilidades */
.hover-lift { transition: transform 200ms ease-out, box-shadow 200ms ease-out; }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(36,18,48,0.14); }
.scrollbar-none { scrollbar-width: none; }
.scrollbar-none::-webkit-scrollbar { display: none; }
.skeleton { background: linear-gradient(90deg, #f2e6f4 25%, #fffcff 50%, #f2e6f4 75%); background-size: 200% 100%; animation: skeleton-shimmer 1.4s ease-in-out infinite; }
.reveal { animation: reveal-rise 480ms cubic-bezier(0.22,1,0.36,1) both; animation-delay: calc(var(--index,0)*90ms); }
.dot-pulse::after { content:''; position:absolute; inset:-4px; border-radius:9999px; background:currentColor; opacity:0.35; animation:dot-pulse 1.8s ease-in-out infinite; }
```

### Reglas Duras (No-Negociables)

| Regla | Verificación |
|-------|--------------|
| Solo paleta §2 — nada de `neutral-*`, `indigo-*`, hex sueltos | `grep -r "neutral\|indigo\|emerald\|amber\|slate\|gray" src/` → 0 matches |
| Contraste AA mínimo: texto ≥ 4.5:1, large ≥ 3:1 | Pares §2 verificados; `#7d7384` sobre lila solo ≥18px |
| Targets táctiles ≥ 44×44px | Botones `h-11`, íconos `w-11 h-11`, steppers `h-11 w-11` |
| Focus visible siempre | `:focus-visible` global en `globals.css:50-58` |
| Reduced motion respetado | CSS global + `useReducedMotion()` en componentes interactivos |
| `next/image priority` solo hero | Auditar `priority` en todo el repo |
| Precios solo via `formatPriceUYU` + `font-mono-tabular` | `grep -r "formatPriceUYU" src/` cubre todos los precios |
| Envío gratis solo via `FREE_SHIPPING_THRESHOLD` / `SHIPPING_COST` | `grep -r "3500\|220" src/` solo en `shipping.ts` y consumos |
| Voseo rioplatense + sentence case | Revisar copy en componentes |

### Definition of Done (ejecutable)

```bash
# 1. Build + lint + typecheck
bun run build && bun run lint && bunx tsc --noEmit

# 2. Verificar tokens DESIGN.md vs globals.css
diff <(grep -E '^\s*--\w+:' DESIGN.md | sort) <(grep -E '^\s*--\w+:' src/app/globals.css | sort)

# 3. Verificar cross-refs 📁 existen
# (manual: cada 📁 apunta a archivo:línea real)

# 4. Capturas visuales 390px + 1440px sin regresiones
# (usar play/preview de HyperFrames o navegador)

# 5. Contrastes WCAG pares §2
# (automatizable con axe-core en CI)
```

---

*Generado: 2026-08-22 · Actualizado: 2026-08-22 · Fuente: `MASTER-archived-2026-08-22.md` + `globals.css` + `layout.tsx` + `src/components/` · Para uso con Google Stitch y agentes de código.*