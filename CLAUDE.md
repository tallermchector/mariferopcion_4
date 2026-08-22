# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este proyecto

**Marifer — Tu Ropa Diaria**: tienda online de moda femenina uruguaya (Montevideo, precios en UYU, "6 cuotas sin recargo", envíos a todo el país). Es un applet generado en Google AI Studio (`metadata.json`, `assets/.aistudio/`, `GEMINI_API_KEY` en `.env.example`) construido con Next.js 15 App Router + React 19 + Tailwind v4 + Prisma 6 sobre SQLite.

Este repo es independiente del workspace padre `C:\Users\prest\proyectos\CLAUDE.md` (Envíos DosRuedas): **no aplican** sus reglas de paleta, tarifas ni `pnpm`. Acá el package manager es **Bun** (`bun.lock`).

## Comandos

| Acción | Comando |
|---|---|
| Instalar deps | `bun install` |
| Dev server | `bun run dev` |
| Build | `bun run build` (ejecuta `prisma generate && next build`) |
| Lint | `bun run lint` (`eslint .`, flat config `eslint.config.mjs` extendiendo `eslint-config-next`) |
| Typecheck | `bunx tsc --noEmit` |
| Generar cliente Prisma | `bunx prisma generate` |
| Aplicar schema a SQLite | `bunx prisma db push` |
| Seed de datos | `bun run prisma/seed.ts` (no hay script `prisma.seed` en `package.json`; el archivo se autoejecuta con `require.main === module`) |
| Prisma Studio | `bunx prisma studio` |

No hay tests configurados (ni Vitest ni Playwright).

`next.config.ts` tiene `eslint.ignoreDuringBuilds: true` y `typescript.ignoreBuildErrors: false`: el build pasa con errores de lint pero falla con errores de tipos. Correr lint por separado.

## Arquitectura

### Datos
- **SQLite local** en `prisma/dev.db` (commiteado). `src/lib/prisma.ts` exporta un singleton y, si `DATABASE_URL` no está seteada o no empieza con `file:`, la resuelve a `prisma/dev.db` relativo a `process.cwd()`.
- Modelos: `User`, `Category`, `Product`, `CartItem`. `Product.images` es un **string JSON** con el array de URLs de galería (SQLite no tiene arrays); hay que `JSON.parse` al leerlo (ver `ProductDetailGallery`). `Product.compareAtPrice` es el precio tachado; si es mayor a `price` se muestra el % OFF.
- `prisma/seed.ts` es la fuente de verdad de categorías (`vestidos`, `blusas`, `pantalones`, `abrigos`, `camisas`, `polleras`) y productos demo; borra todo y recrea. Exporta `INITIAL_CATEGORIES` / `INITIAL_PRODUCTS`.
- Las imágenes vienen de `picsum.photos` / `images.unsplash.com` (únicos `remotePatterns` permitidos en `next.config.ts`).

### Rendering
- Las páginas (`src/app/page.tsx`, `products/page.tsx`, `product/[id]/page.tsx`) son **Server Components** que consultan Prisma directamente con `export const revalidate = 60`. `params` y `searchParams` son **Promises** (Next 15): siempre `await`.
- `/product/[id]` acepta id **o** slug (`findFirst` con `OR`).
- `/products` filtra por `?category=<slug>`, `?query=`, y ordena por `?sort=newest|price-asc|price-desc|rating|sale`.
- Los Server Components castean resultados de Prisma a `ProductType` (`src/lib/types.ts`) con `as unknown as ProductType` antes de pasarlos a componentes cliente.

### Carrito (solo cliente)
- `src/context/CartContext.tsx` (`CartProvider` + `useCart`) guarda el carrito en `localStorage` bajo la clave `marifer_ecommerce_cart`; lo lee de forma lazy en el `useState` y lo expone vacío hasta que el cliente hidrata (`useSyncExternalStore`), así el HTML del servidor y el primer render coinciden. **No usa la tabla `CartItem` de la BD** (esa solo la llena el seed).
- Reglas de negocio: cantidad limitada por `product.stock` (fallback 99); costo y umbral de envío gratis viven en **`src/lib/shipping.ts`** (`SHIPPING_COST = 220`, `FREE_SHIPPING_THRESHOLD = 3500`) y lo consumen `CartContext`, `Navbar` (barra de anuncio), `ProductCard` (badge) y la ficha de producto. Cambiar el umbral solo ahí.
- `layout.tsx` monta `CartProvider` → `Navbar` + `CartDrawer` + `main` + `Footer`. Los componentes de `src/components/` son `'use client'` salvo `Footer`.
- `CartDrawer` es un `role="dialog"` que se cierra con Escape y lleva el foco al botón cerrar al abrir.

### Auth
`(auth)/login` y `(auth)/register` son **mocks**: simulan con `setTimeout` y redirigen; no hay backend ni sesión.

### Formato de precios
`src/lib/format.ts`: `formatPriceUYU` (`"$ 1.290"`, locale `es-UY`, sin decimales), `formatInstallments` y `calculateInstallmentsUYU` (6 cuotas por defecto). Usar siempre estos helpers, no formatear a mano.

## Diseño y copy

- **Fuente de verdad del sistema de diseño: `design-system/marifer/MASTER.md`** (tokens, pares de contraste verificados, reglas de componentes, motion y checklist de accesibilidad). Leerlo antes de tocar UI.
- **Paleta Marifer** definida como CSS vars en `src/app/globals.css` (`--brand-primary: #452453` violeta, `--brand-deep: #241230`, `--brand-soft-lila: #f2e6f4`, `--brand-border-lila: #e3cde8`, `--brand-lavanda: #caa8d3`, `--accent-sale: #d94f78` solo decorativo, `--accent-sale-deep: #c23b64` para texto/badges con contraste AA, `--accent-highlight: #d4a15a` siempre con texto oscuro encima, textos `#241230/#403945/#7d7384`, bordes `#e8e3ec/#d3ccd8`). Los componentes usan esos hex inline con Tailwind (`bg-[#452453]`); **no introducir hex ni clases `neutral-*`/`indigo-*` fuera de esta paleta**.
- Tipografía vía `next/font/google` en `layout.tsx`: Outfit (`.font-display`, headings), Manrope (`.font-body`, base 16px), Lobster Two (`.font-logo`), JetBrains Mono (`.font-mono-tabular` para precios). Texto mínimo 12px.
- Utilidades propias en `globals.css`: `shadow-marifer-sm|hover|btn`, `hover-lift`, `scrollbar-none`, `skeleton`. Foco global con `:focus-visible` (violeta; lavanda dentro de `[data-surface="dark"]`). `prefers-reduced-motion` se respeta globalmente en CSS y con `useReducedMotion()` de `motion/react` en los componentes animados.
- Interactivos: mínimo 44×44px, `aria-label` en botones de solo ícono, errores de formulario con `role="alert"`.
- Copy en **español rioplatense con voseo** ("Comprá", "Conocé", "tenés"), sentence case, y referencias a Uruguay/Montevideo (Rambla, Pocitos, Parque Rodó, OCA, Abitab, Redpagos).

## Gotchas conocidos

- Si `bun` no está instalado, `pnpm install --config.lockfile=false --config.dangerouslyAllowAllBuilds=true` funciona para verificar (borrar después `pnpm-lock.yaml` y `pnpm-workspace.yaml` que genera). Si `tsc` marca "implicitly any" en resultados de Prisma, falta `prisma generate`.
- `prisma/dev.db` está commiteado; si aparece "database disk image is malformed", regenerarlo con `bunx prisma db push` + seed (el archivo anterior estaba corrupto en el repo y se regeneró el 2026-08-22).
- `ProductCard` tiene swatches de color y el talle "S – L" hardcodeados por id de producto; no están en el modelo `Product`.
- Los links del footer a `/faq`, `/about`, `/stores`, `/careers` apuntan a páginas que no existen (404 en prefetch).
- `next.config.ts`: con `DISABLE_HMR=true` (entorno AI Studio) se apaga el file watching de webpack; no tocar ese bloque.
- El `tsconfig` mapea `@/*` tanto a `./src/*` como a `./*`.
