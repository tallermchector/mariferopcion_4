# Marifer — Design System MASTER

> Fuente de verdad global. Las páginas pueden tener overrides en `design-system/marifer/pages/<page>.md`; si existe un override, sus reglas mandan sobre este archivo.
>
> Generado con `ui-ux-pro-max` (2026-08-22) y **ajustado a la identidad ya existente** en `src/app/globals.css` y `src/app/layout.tsx`. La base de datos de la skill proponía "Liquid Glass + rosa/dorado + Cormorant/Montserrat" para e-commerce de lujo; se descartó porque Marifer ya tiene una identidad violeta cálida y moderna que funciona mejor para "ropa diaria" (no lujo).

## 1. Posicionamiento

- **Producto:** e-commerce de moda femenina, Uruguay, precios en UYU, "6 cuotas sin recargo".
- **Tono:** cercano, rioplatense con voseo, cotidiano ("Tu ropa diaria, sin vueltas"). No es lujo ni brutalismo.
- **Patrón de landing:** Feature-Rich Showcase → Hero (propuesta de valor) → franja de confianza (3 ítems) → categorías (4–6 tiles) → productos destacados → bloques editoriales → CTA. Ya implementado en `src/app/page.tsx`.
- **Estilo:** Minimalismo cálido con acentos violeta; superficies blancas/lila suave, radios 14–28px, sombras violáceas sutiles. **Evitar:** glassmorphism pesado, blur animado, "Vibrant & Block-based", emojis como íconos.

## 2. Color (tokens canónicos)

Definidos en `:root` de `globals.css`. Usar **solo estos valores**; hoy muchos componentes los escriben como hex inline en Tailwind (`bg-[#452453]`), lo cual es tolerable, pero **no introducir hex nuevos**.

| Token | Hex | Uso |
|---|---|---|
| `--brand-primary` | `#452453` | Header, CTA primario, links activos, eyebrows |
| `--brand-deep` | `#241230` | Texto principal, hover de CTA, fondos oscuros |
| `--brand-soft-lila` | `#f2e6f4` | Fondos suaves, tiles, círculos de íconos |
| `--brand-border-lila` | `#e3cde8` | Bordes lila, texto secundario sobre violeta |
| `--brand-lavanda` | `#caa8d3` | Subrayado activo, eyebrow sobre violeta, ring de focus |
| `--accent-sale` | `#d94f78` | Badges de descuento, "Rebajas", badge del carrito |
| `--accent-highlight` | `#d4a15a` | Badge "Envío gratis" (⚠ ver contraste abajo) |
| `--bar-crema` / `--bar-tabaco` | `#fbf1de` / `#96662a` | Barra de anuncio |
| `--stock-text` / `--stock-dot` | `#146043` / `#1f8a5f` | Estados de stock / éxito |
| `--text-primary` | `#241230` | Títulos |
| `--text-body` | `#403945` | Cuerpo |
| `--text-muted` | `#7d7384` | Secundario (4.5:1 sobre blanco, **3.7:1 sobre lila** → no usar en tamaño < 18px sobre `#f2e6f4`) |
| `--border-hairline` / `--border-default` | `#e8e3ec` / `#d3ccd8` | Bordes |
| `--bg-page` / `--bg-card` | `#fffcff` / `#ffffff` | Fondos |

### Pares de contraste verificados (WCAG)

| Par | Ratio | Veredicto |
|---|---|---|
| `#e3cde8` sobre `#452453` (nav) | 8.7:1 | ✓ AAA |
| `#caa8d3` sobre `#452453` (eyebrow) | 6.2:1 | ✓ AA |
| `#7d7384` sobre `#ffffff` | 4.5:1 | ✓ AA (justo) |
| `#7d7384` sobre `#f2e6f4` | 3.7:1 | ✗ solo texto ≥ 18px/bold |
| `#96662a` sobre `#fbf1de` (anuncio 12px bold) | 4.4:1 | ✗ subir a `#7a5222` o texto 14px |
| blanco sobre `#d94f78` (badge sale) | 3.9:1 | ✗ para 11px; usar `#c23b64` o fondo `#241230` |
| blanco sobre `#d4a15a` (badge envío gratis) | 2.3:1 | ✗ usar texto `#241230` sobre dorado |
| `#9A9196` sobre blanco (CartDrawer "Vaciar bolsa") | 3.1:1 | ✗ paleta ajena, reemplazar por `#7d7384` |

### Paletas ajenas (eliminadas el 2026-08-22; no reintroducir)

- Carrito y ficha usaban `#C84B6B`, `#B03D5C`, `#1A161D`, `#6B6368`, `#9A9196`, `#FAF9F7`, `#3D8B5A`, `#C4963A`, `rgba(26,22,29,*)` → hoy mapeados a `#c23b64`/`#452453`, `#241230`, `#7d7384`, `#f2e6f4`, `#146043`, `#d4a15a`, `#e8e3ec`.
- Login/Register usaban `neutral-*`, `indigo-*`, `emerald-*`, `amber-*` → reescritos con la paleta Marifer.
- Token agregado: `--accent-sale-deep: #c23b64` (texto blanco encima 5.1:1; como texto sobre blanco 5.1:1). `--bar-tabaco` pasó de `#96662a` a `#7a5222` (6.1:1 sobre crema).

## 3. Tipografía

Cargada con `next/font/google` en `layout.tsx` (no usar `@import`):

| Rol | Fuente | Clase | Notas |
|---|---|---|---|
| Display / headings | Outfit 400–800 | `.font-display` | `letter-spacing: -0.025em`; H1 hero 60–68px, H2 28px, H3 20–24px |
| Body | Manrope 400–700 | `.font-body` (default en `body`) | base **15px**, line-height 1.45 (la guía recomienda 16px/1.5 → subir en mobile) |
| Logo | Lobster Two 700 italic | `.font-logo` | Solo para la palabra "Marifer" |
| Precios / números | JetBrains Mono | `.font-mono-tabular` | `tabular-nums` siempre en precios y cantidades |

Mínimos: body ≥ 14px; labels/captions ≥ 12px (hoy hay 11px en badges, "Vaciar bolsa" y footer de carrito → subir a 12px).

## 4. Espaciado, radios, sombras

- Contenedor: `max-w-[1440px]`, padding `px-4 sm:px-6 lg:px-12`.
- Escala de espaciado estándar (16–64px entre secciones; `pt-14 sm:pt-18` entre bloques de home).
- Radios: cards 14px, imagen interna 10px, tiles 16px, bloques editoriales 24px, hero 28px, botones/píldoras `rounded-full`.
- Sombras (solo las de `globals.css`): `shadow-marifer-sm`, `shadow-marifer-hover`, `shadow-marifer-btn`. No usar `shadow-xl`/`shadow-2xl` genéricas.

## 5. Componentes

### Botón primario
`h-[50px]+`, `rounded-full`, `bg-[#452453] text-white hover:bg-[#241230]`, `shadow-marifer-btn`, `cursor-pointer`, `focus-visible:ring-2 focus-visible:ring-[#caa8d3] focus-visible:ring-offset-2`. Sobre fondo violeta (hero): invertido `bg-white text-[#452453]`.

### Botón ghost / secundario
`border border-[#e3cde8] text-[#e3cde8] hover:bg-white/10` (sobre violeta) o `border-[#e8e3ec] text-[#7d7384] hover:bg-[#f2e6f4]` (sobre claro).

### Product card (`ProductCard.tsx`)
Imagen 3:4 con `next/image` + `sizes`, badge píldora arriba-izquierda (sale / nuevo / envío gratis), categoría 12px uppercase, nombre 17px Outfit, precio 20px mono + tachado 13px. **Botón "Sumar" debe medir ≥ 44px de alto** (hoy `h-9` = 36px).

### Steppers de cantidad
Botones `+`/`−` mínimo **44×44px** de área táctil (hoy 24px en `CartControl` y 32px en `AddToCartButton`). Mantener `aria-label`.

### Drawer de carrito
Spring `damping 26 / stiffness 260` está bien; backdrop con click-to-close y botón cerrar con `aria-label`. Agregar `role="dialog" aria-modal="true"` y trap de foco; cerrar con `Escape`.

### Inputs
Label visible (o `aria-label` si es un buscador con ícono). Nunca `focus:outline-none` sin reemplazo: usar `focus:ring-2 focus:ring-[#caa8d3]`.

## 6. Motion

- Micro-interacciones 150–300ms, `ease-out` al entrar / `ease-in` al salir. Hover de cards: `translateY(-2px)` + `shadow-marifer-hover` (ya en `.hover-lift`).
- Máximo 1–2 elementos animados por vista.
- **No animar `height`** (menú mobile en `Navbar` lo hace) → usar `clip-path`/`transform` o `grid-template-rows`.
- **Respetar `prefers-reduced-motion`**: hoy no hay ninguna referencia en el proyecto. Agregar en `globals.css`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
  ```
  y usar `useReducedMotion()` de `motion/react` en drawer y menú.

## 7. Accesibilidad y UX — checklist del proyecto

Estado al 2026-08-22 (implementado en la misma sesión en que se generó este archivo):

- [x] Targets táctiles ≥ 44×44px: botón "Sumar" de `ProductCard` (h-11), steppers de `CartControl` y `AddToCartButton` (h-11 w-11), cerrar drawer y lupa del buscador (w-11 h-11).
- [x] Focus visible global (`:focus-visible` en `globals.css`, lavanda en `[data-surface="dark"]`); los `focus:outline-none` restantes van siempre con `focus:ring-2`.
- [x] Contraste ≥ 4.5:1: badge rebaja y texto de rebajas usan `#c23b64`; badge dorado con texto `#241230`; barra de anuncio `#7a5222`; muted sobre lila reemplazado por `#403945`.
- [x] `prefers-reduced-motion` en CSS + `useReducedMotion()` en drawer, menú, grilla, galería, auth y botones.
- [x] `src/app/loading.tsx` (skeleton de grilla) y `src/app/not-found.tsx`.
- [x] Login/register con labels `htmlFor`, validación on blur, `aria-invalid`, errores `role="alert"` y paleta Marifer.
- [x] Ícono "Favoritos" quitado del Navbar (no hay wishlist).
- [x] Búsqueda: Navbar envía `?query=` (lo que lee `/products`).
- [x] Umbral de envío gratis unificado en `src/lib/shipping.ts` (**$3.500**, costo $220) y usado por anuncio, card, ficha y carrito.
- [x] `?sort=sale` filtra por `compareAtPrice` (antes usaba un campo inexistente).
- [x] Menú mobile anima `opacity`/`transform` en vez de `height`; `CartDrawer` es `role="dialog"` con Escape y foco inicial.
- [x] Paleta ajena eliminada de carrito, ficha, grilla, galería y auth.
- [x] Responsive verificado con capturas en 390 y 1440; build, lint y typecheck en verde.
- [ ] Swatches de color y talle "S – L" de `ProductCard` siguen hardcodeados por id; si se mantienen, moverlos al modelo `Product`.
- [ ] Links del footer a `/faq`, `/about`, `/stores`, `/careers` apuntan a páginas inexistentes.

## 8. Stack (Next.js 15) — reglas aplicables

- Server Components por defecto; `'use client'` solo con hooks/eventos (hoy `Footer.tsx` es client sin necesidad aparente → revisar).
- Datos en Server Components con Prisma (ya se cumple); no `useEffect` para carga inicial.
- `next/image` con `sizes` correcto y `remotePatterns` acotados (ya se cumple); `priority` solo en LCP (hero), no en todas las cards `featured`.
