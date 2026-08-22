# Design System: Marifer — Tu Ropa Diaria

> **Fuente de verdad:** Este documento codifica la identidad visual de Marifer (e-commerce de moda femenina, Uruguay) para generación de pantallas con Google Stitch. Derivado de `design-system/marifer/MASTER.md` y `src/app/globals.css`.

---

## Configuration — Parámetros de Estilo

| Dial | Nivel | Descripción |
|------|-------|-------------|
| **Creatividad** | `6` | Minimalismo cálido con personalidad editorial. No es experimental ni ultra-minimalista. |
| **Densidad** | `5` | Balanceado: secciones aireadas pero funcionales. Layout de "Feature-Rich Showcase". |
| **Varianza** | `5` | Asimetría moderada: Hero split-screen, tiles de categorías en grid 2/3/4 col, zig-zag en bloques editoriales. |
| **Intención de Movimiento** | `5` | Micro-interacciones sutiles (hover-lift, skeleton shimmer, drawer spring). Sin coreografías cinemáticas. |

---

## 1. Visual Theme & Atmosphere

Una interfaz de **minimalismo cálido** para "ropa diaria, sin vueltas". La atmósfera es cercana, rioplatense, cotidiana — como entrar a una tienda de barrio bien curada en Pocitos: superficies blancas y lila suave (`#f2e6f4`), acentos violeta profundo (`#452453`, `#241230`), sombras violáceas sutiles. No hay glassmorphism pesado, ni blur animado, ni "Vibrant & Block-based". El tono es funcional y humano: voseo en copy ("Comprá", "Conocé", "tenés"), precios en UYU, "6 cuotas sin recargo", envíos a todo el país. La estructura de landing sigue el patrón **Feature-Rich Showcase**: Hero (propuesta de valor) → franja de confianza (3 ítems) → categorías (4–6 tiles) → productos destacados → bloques editoriales → CTA.

---

## 2. Color Palette & Roles

**Tokens canónicos** (definidos en `:root` de `globals.css`). **Usar solo estos valores**; no introducir hex nuevos.

| Token | Hex | Rol Funcional |
|-------|-----|---------------|
| `--bg-page` | `#fffcff` | Fondo de página (blanco cálido, no clínico) |
| `--bg-card` | `#ffffff` | Fondo de cards y contenedores |
| `--brand-primary` | `#452453` | **Violeta principal**: Header, CTA primario, links activos, eyebrows |
| `--brand-deep` | `#241230` | **Violeta oscuro**: Texto principal, hover de CTA, fondos oscuros |
| `--brand-soft-lila` | `#f2e6f4` | **Lila suave**: Fondos de tiles, círculos de íconos, secciones alternadas |
| `--brand-border-lila` | `#e3cde8` | **Borde lila**: Bordes sobre violeta, texto secundario sobre violeta (8.7:1) |
| `--brand-lavanda` | `#caa8d3` | **Lavanda**: Subrayado activo, eyebrow sobre violeta, focus ring (6.2:1) |
| `--accent-sale` | `#d94f78` | **Rosa rebajas**: Badges de descuento, etiqueta "Rebajas", badge del carrito (solo decorativo) |
| `--accent-sale-deep` | `#c23b64` | **Rosa profundo AA**: Texto blanco sobre badge sale (5.1:1) / texto sobre blanco (5.1:1) |
| `--accent-highlight` | `#d4a15a` | **Dorado**: Badge "Envío gratis" — **siempre con texto `#241230` encima** (2.3:1 con blanco → NO usar blanco) |
| `--bar-crema` | `#fbf1de` | Fondo barra de anuncio |
| `--bar-tabaco` | `#7a5222` | Texto barra de anuncio (6.1:1 sobre crema) |
| `--stock-text` | `#146043` | Texto de stock / éxito |
| `--stock-dot` | `#1f8a5f` | Punto indicador de stock |
| `--text-primary` | `#241230` | Títulos (H1–H3) |
| `--text-body` | `#403945` | Cuerpo de texto |
| `--text-muted` | `#7d7384` | Texto secundario, metadata — **4.5:1 sobre blanco, 3.7:1 sobre lila** → no usar < 18px sobre `#f2e6f4` |
| `--border-hairline` | `#e8e3ec` | Bordes finos (hairline) |
| `--border-default` | `#d3ccd8` | Bordes por defecto |

### Restricciones de Color
- **Máximo 1 acento funcional** (violeta `#452453`); rosa y dorado son **solo decorativos** para badges
- **Nunca** puro black (`#000000`) — usar `--brand-deep` (`#241230`)
- **Nunca** paletas ajenas: `neutral-*`, `indigo-*`, `emerald-*`, `amber-*`, `#C84B6B`, `#9A9196`, etc. (eliminadas 2026-08-22)
- Sombras **solo** las de `globals.css`: `shadow-marifer-sm`, `shadow-marifer-hover`, `shadow-marifer-btn` (tinte violeta)

---

## 3. Typography Rules

Cargadas con `next/font/google` en `layout.tsx`.

| Rol | Fuente | Clase CSS | Especificaciones |
|-----|--------|-----------|------------------|
| **Display / Headings** | Outfit 400–800 | `.font-display` | `letter-spacing: -0.025em`; H1 Hero 60–68px, H2 28px, H3 20–24px; color `--text-primary` |
| **Body** | Manrope 400–700 | `.font-body` (default en `body`) | **Base 15px** (subir a 16px en mobile), line-height 1.45 (recomendado 1.5), color `--text-body`; máx 65ch |
| **Logo** | Lobster Two 700 italic | `.font-logo` | Solo para la palabra "Marifer" |
| **Precios / Números** | JetBrains Mono | `.font-mono-tabular` | `tabular-nums` **siempre** en precios, cantidades, steppers |

### Restricciones Tipográficas
- **Inter: BANNED** — no usar en ningún contexto
- **Serif genéricos BANNED** (`Times New Roman`, `Georgia`, `Garamond`, `Palatino`) — solo serifs modernos distintivos si fuera editorial (`Fraunces`, `Instrument Serif`); **nunca en dashboard/software UI**
- Mínimos: body ≥ 14px (mobile 16px); labels/captions ≥ 12px (hoy hay 11px en badges → corregir a 12px)
- Escala fluida: H1 `clamp(3.75rem, 6vw, 4.25rem)`, H2 `clamp(1.75rem, 3vw, 2rem)`, Body `1rem` / `1.125rem`

---

## 4. Component Stylings

### Botón Primario (CTA)
- `h-[50px]+`, `rounded-full`, `bg-[#452453] text-white hover:bg-[#241230]`
- `shadow-marifer-btn` (`0 6px 18px rgba(69,36,83,0.24)`)
- `focus-visible:ring-2 focus-visible:ring-[#caa8d3] focus-visible:ring-offset-2`
- **Sobre fondo violeta (Hero): invertido** → `bg-white text-[#452453]`
- Active state: táctil `-1px translateY` o `scale(0.98)`

### Botón Ghost / Secundario
- Sobre violeta: `border border-[#e3cde8] text-[#e3cde8] hover:bg-white/10`
- Sobre claro: `border-[#e8e3ec] text-[#7d7384] hover:bg-[#f2e6f4]`
- Mismo `rounded-full`, height ≥ 44px

### Product Card (`ProductCard.tsx`)
- Imagen 3:4 con `next/image` + `sizes` correcto
- Badge píldora arriba-izquierda (sale / nuevo / envío gratis)
- Categoría: 12px uppercase Manrope
- Nombre: 17px Outfit (`.font-display`)
- Precio: 20px JetBrains Mono (`.font-mono-tabular`) + tachado 13px
- **Botón "Sumar": h-11 (44px) mínimo** — hoy corregido
- Swatches de color y talle "S–L" **hardcodeados por id** → mover a modelo `Product` si persisten

### Steppers de Cantidad (`CartControl`, `AddToCartButton`)
- Botones `+`/`−` **mínimo 44×44px** (h-11 w-11)
- `aria-label` obligatorio

### Drawer de Carrito (`CartDrawer`)
- Spring: `damping 26 / stiffness 260`
- Backdrop con click-to-close
- Botón cerrar con `aria-label`, `role="dialog" aria-modal="true"`, focus trap
- Cerrar con `Escape`

### Inputs / Formularios
- Label visible (o `aria-label` si buscador con ícono)
- **Nunca** `focus:outline-none` sin reemplazo → `focus:ring-2 focus:ring-[#caa8d3]`
- Error text below en `--accent-sale-deep` (`#c23b64`) con `role="alert"`

### Navigation (`Navbar`)
- Sticky, horizontal en desktop
- Search input con lupa (w-11 h-11 touch target)
- Mobile: slide-in overlay animando `opacity`/`transform` (no `height`)
- Cart button con badge contador

### Loaders / Skeletons
- **Skeletal shimmer** (`.skeleton` en `globals.css`) matching exact layout dimensions
- Gradient: `#f2e6f4` → `#fffcff` → `#f2e6f4`, animation 1.4s ease-in-out infinite
- **Nunca** circular spinners

### Empty States
- Composición ilustrada + texto de guía — nunca solo "No data found"
- Usar `picsum.photos/seed/{id}/800/600` o SVG avatars (no Unsplash)

---

## 5. Hero Section

El Hero es la primera impresión — **creativo, striking, nunca genérico**.

- **Estructura Asimétrica (Split-Screen):** Texto a la izquierda, visual a la derecha (50/50 o 60/40). **Centrado BANNED** a este nivel de varianza.
- **Inline Image Typography:** Pequeñas fotos contextuales **entre palabras** del headline (altura de línea, rounded, como puntuación visual). Ej: "Tu ropa [foto prenda] diaria [foto mujer caminando] sin vueltas".
- **No Overlapping:** Texto **nunca** sobre imágenes u otro texto. Cada elemento en su zona espacial limpia.
- **No Filler Text:** "Scroll to explore", "Swipe down", flechas, chevrones rebotantes **BANNED**.
- **CTA Restraint:** **Máximo 1 CTA primario**. Sin "Learn more" secundario.

---

## 6. Layout Principles

- **Grid-First:** CSS Grid para layouts estructurales. **Nunca** flexbox percentage math (`calc(33% - 1rem)` BANNED).
- **No Overlapping:** Elementos nunca se solapan. Sin `absolute` apilando contenido. Zonas espaciales limpias y separadas.
- **Feature Sections:** "3 cards iguales en fila" **BANNED**. Usar: 2-column Zig-Zag, Bento asimétrico (2fr 1fr 1fr), o horizontal scroll.
- **Contención:** `max-w-[1440px]` centrado. Padding horizontal: `px-4 sm:px-6 lg:px-12`.
- **Full-Height:** `min-h-[100dvh]` — **nunca** `h-screen` (salto catastrófico iOS Safari).
- **Bento Architecture:** Row 1: 3 columnas | Row 2: 2 columnas (70/30). Cada tile con micro-animación perpetua.
- **Espaciado entre secciones:** 16–64px (`pt-14 sm:pt-18` en home).

### Radios
- Cards: 14px (`rounded-xl`)
- Imagen interna: 10px (`rounded-lg`)
- Tiles categorías: 16px (`rounded-2xl`)
- Bloques editoriales: 24px (`rounded-3xl`)
- Hero: 28px (`rounded-4xl`)
- Botones/píldoras: `rounded-full`

---

## 7. Responsive Rules

**Responsive no es opcional — requisito duro. Verificar en 375px, 390px, 768px, 1024px, 1440px.**

- **Mobile-First Collapse (< 768px):** Todo multi-columna → single column. `width: 100%`, `padding: 1rem`, `gap: 1.5rem`. Sin excepciones.
- **No Horizontal Scroll:** Overflow horizontal en mobile = fallo crítico.
- **Tipografía:** Headlines via `clamp()`. Body **mínimo 1rem/16px** en mobile. Legible en 375px.
- **Touch Targets:** Todo interactivo **≥ 44×44px**. Botones full-width en mobile. Espaciado generoso entre clicables.
- **Imágenes:** Hero e inline escalan proporcionalmente. Inline typography images → stack below headline en mobile.
- **Navigation:** Desktop horizontal → mobile menu limpio (slide-in/full-screen). Sin hamburguesas minúsculas sin label.
- **Cards/Grids:** Bento/asimétrico → stacked single-column cards full-width. Padding interno `1rem`.
- **Spacing:** Gaps verticales reducen proporcionalmente `clamp(3rem, 8vw, 6rem)`. Ni apretado ni excesivamente aireado.

---

## 8. Motion & Interaction (Code-Phase Intent)

> **Nota:** Stitch genera pantallas estáticas. Esta sección documenta el **comportamiento de movimiento intencionado** para el agente de código (Antigravity, Cursor, etc.).

- **Physics Engine:** Spring-based exclusivamente. `stiffness: 260, damping: 26` (drawer) / `100/20` (micro-interacciones). **No linear easing**.
- **Micro-Interacciones:** 150–300ms, `ease-out` entrada / `ease-in` salida. Hover cards: `translateY(-2px)` + `shadow-marifer-hover` (clase `.hover-lift`).
- **Perpetual Micro-Loops:** Skeleton shimmer (infinite), status dots pulse, search bar typewriter, feature icons float — **máx 1–2 por vista**.
- **Staggered Orchestration:** Listas/grids montan con cascade delays (`animation-delay: calc(var(--index) * 100ms)`). Waterfall reveals, nunca instant mount.
- **Layout Transitions:** Re-ordering suave via shared element IDs.
- **Hardware Rules:** Animar **SOLO** `transform` y `opacity`. Nunca `top`, `left`, `width`, `height`. Grain/noise en pseudo-elementos fijos `pointer-events-none`.
- **Performance:** Animaciones CPU-intensive en leaf components microscópicos. No re-renders de padres. Target 60fps.
- **Reduced Motion:** `@media (prefers-reduced-motion: reduce)` en `globals.css` + `useReducedMotion()` de `motion/react` en drawer, menú, grilla, galería, auth, botones.

---

## 9. Anti-Patterns (Banned)

- ❌ **Emojis** — en UI, código, alt text
- ❌ **Inter font** — usar Outfit / Manrope / JetBrains Mono / Lobster Two
- ❌ **Serif genéricos** — Times, Georgia, Garamond, Palatino
- ❌ **Pure black** (`#000000`) — usar `#241230`
- ❌ **Neon/outer glows** — sombras solo violeta difusas de `globals.css`
- ❌ **Acentos oversaturados** > 80%
- ❌ **Gradient text excesivo** en headers grandes
- ❌ **Custom mouse cursors**
- ❌ **Overlapping elements** — separación espacial limpia siempre
- ❌ **3-column equal card layouts** para features
- ❌ **Centered Hero sections** (a este nivel de varianza)
- ❌ **Filler UI text:** "Scroll to explore", "Swipe down", "Discover more", flechas, chevrones
- ❌ **Nombres genéricos:** "John Doe", "Acme", "Nexus", "SmartFlow"
- ❌ **Números redondos fake:** `99.99%`, `50%`, `1234567` — usar datos orgánicos: `47.2%`, `+598 99 123 456`
- ❌ **Datos/estadísticas fabricados** — nunca inventar métricas, uptime, response times, deploy cycles. Si no hay dato real → placeholder `[metric]`
- ❌ **Secciones fake de métricas** — "SYSTEM PERFORMANCE", "KEY STATISTICS", "BY THE NUMBERS" con datos inventados
- ❌ **Formato `LABEL // YEAR`** — "SYSTEM // 2024" es convención perezosa de IA
- ❌ **Clichés copywriting IA:** "Elevate", "Seamless", "Unleash", "Next-Gen", "Revolutionize"
- ❌ **Unsplash links rotos** — usar `picsum.photos/seed/{id}/800/600` o SVG avatars
- ❌ **Defaults genéricos shadcn/ui** — personalizar radios, colores, sombras a este sistema
- ❌ **z-index spam** — solo Navbar, Modal, Overlay layer contexts
- ❌ **`h-screen`** — siempre `min-h-[100dvh]`
- ❌ **Circular loading spinners** — skeletal shimmer only
- ❌ **Animar `height`** (menú mobile) → usar `clip-path`/`transform` o `grid-template-rows`
- ❌ **`focus:outline-none` sin `focus:ring`** replacement
- ❌ **Texto muted `< 18px` sobre lila** (`#f2e6f4`) — ratio 3.7:1 insuficiente
- ❌ **Blanco sobre dorado** (`#d4a15a`) — ratio 2.3:1 → usar `#241230`
- ❌ **Blanco sobre rosa sale** (`#d94f78`) en 11px — usar `#c23b64` o fondo `#241230`

---

## 10. Copy & Content Rules (Rioplatense)

- **Voseo obligatorio:** "Comprá", "Conocé", "Tenés", "Sumá", "Elegí"
- **Sentence case** (no Title Case en UI)
- **Referencias Uruguay/Montevideo:** Rambla, Pocitos, Parque Rodó, OCA, Abitab, Redpagos
- **Precios:** Formato `"$ 1.290"` (locale `es-UY`, sin decimales) via `formatPriceUYU`
- **Cuotas:** "6 cuotas sin recargo" via `formatInstallments` / `calculateInstallmentsUYU`
- **Envío gratis:** Umbral `$3.500`, costo `$220` — unificado en `src/lib/shipping.ts`

---

## 11. Stack-Specific Rules (Next.js 15 App Router)

- **Server Components por defecto**; `'use client'` solo con hooks/eventos (`Footer.tsx` es client sin necesidad → revisar)
- **Datos en Server Components con Prisma**; no `useEffect` para carga inicial
- **`next/image`** con `sizes` correcto y `remotePatterns` acotados (`picsum.photos`, `images.unsplash.com`); `priority` solo en LCP (hero)
- **Revalidación:** `export const revalidate = 60` en páginas de datos
- **Params/Async:** `params` y `searchParams` son **Promises** (Next 15) → siempre `await`
- **Casteo Prisma → Types:** `as unknown as ProductType` antes de pasar a Client Components

---

*Generado con taste-design skill • Alineado a MASTER.md 2026-08-22 • Para uso con Google Stitch*