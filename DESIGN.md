---
name: Tienda Marifer ("Para tu vida") — OneEntry Architecture
colors:
  canvas-lino: "#FDFBF7"
  pure-surface: "#FFFFFF"
  card-surface: "#F8FAFC"
  violet-brand: "#502A55"
  violet-deep: "#19091B"
  violet-lavender: "#F3EEF5"
  terracotta-accent: "#D97D54"
  terracotta-hover: "#C46840"
  botanical-gold: "#DFA84A"
  charcoal-text: "#4C4D56"
  text-dark: "#1E293B"
  muted-steel: "#B0BCCE"
  border-hairline: "rgba(80, 42, 85, 0.10)"
  border-stone: "#D6D3D1"
  highlight-glow: "rgba(217, 125, 84, 0.35)"
---

# Design System: Tienda Marifer ("Para tu vida")

## 1. Visual Theme & Atmosphere

Tienda Marifer (*"Para tu vida"*) fusiona la precisión y modularidad de la arquitectura e-commerce contemporánea (*OneEntry Block Cards* con micro-interacciones interactivas) con la calidez táctil, reposada y artesanal de una boutique de cercanía uruguaya.

El entorno visual se asienta sobre una superficie base cálida en **Canvas Lino Orgánico** (`#FDFBF7`) y **Superficies Puras** (`#FFFFFF`, `#F8FAFC`), garantizando un contraste visual suave que elimina la frialdad clínica del blanco puro estándar. Los encabezados y la estructura de marca se anclan en un **Violeta Ciruela Profundo** (`#502A55` / `#19091B`), complementados por un único acento vibrante pero cálido: **Terracota Cálido Teja** (`#D97D54`) para llamadas a la acción, badges de disponibilidad y enlaces relacionales.

- **Density:** 5/10 (Equilibrada, respirable, optimizada para experiencia táctil móvil y catálogo de alta resolución).
- **Variance:** 8/10 (Layouts modulares asimétricos desfasados, contrastes en bloque 16:10 y micro-destacados).
- **Motion:** 7/10 (Física de resorte `stiffness: 100, damping: 20`, micro-interacciones de cursor tracking y notificaciones toast con feedback instantáneo).

---

## 2. Color Palette & Roles

### Bases & Superficies
- **Canvas Lino Orgánico (`#FDFBF7`)** — Fondo general de la aplicación web; textura cromática natural que disminuye la fatiga ocular.
- **Superficie Blanca Pura (`#FFFFFF`)** — Fondo para tarjetas activas, lookbook cards, inputs y navbar superior.
- **Card Surface Slate (`#F8FAFC`)** — Neutro sutil para el contenedor de productos y paneles de catálogo sin bordes pesados.
- **Lila Lavanda Suave (`#F3EEF5`)** — Fondos de contenedor secundarios, chips de categoría y fondos de soporte.

### Marca & Acento Singular
- **Violeta Ciruela Profundo (`#502A55`)** — Color identitario de marca para encabezados display, isotipo corporativo, bordes estructurales y pie de página institucional.
- **Terracota Cálido Teja (`#D97D54`)** — **Acento singular prioritario** (Saturación < 75%) para botones primarios de acción, contadores de carrito/favoritos, foco interactivo y asesoramiento WhatsApp.
- **Terracota Hover Intenso (`#C46840`)** — Estado hover/active de los botones de acción principal.
- **Dorado Botánico (`#DFA84A`)** — Detalles secundarios de envoltura artesanal, sellos de autenticidad y certificaciones textiles.
- **Terracota Glow (`rgba(217, 125, 84, 0.35)`)** — Efecto radial interactivo (`radial-hover`) en las tarjetas de bloque promocionales.

### Tipografía & Neutros
- **Charcoal Ciruela Tinta (`#19091B` / `#4C4D56`)** — Color principal de lectura con ratio de contraste WCAG AAA (> 7:1).
- **Muted Steel Gray (`#817E80` / `#B0BCCE`)** — Iconografía secundaria, placeholders y bordes de tarjetas sutiles.
- **Whisper Border (`rgba(80, 42, 85, 0.10)`)** — Divisores ultrafinos de 1px.

*(Banned: Prohibidos los colores fluorescentes, degradados de neón cian/púrpura de IA y negros puros `#000000`).*

---

## 3. Typography Rules

### Jerarquía Tipográfica
- **Display & Títulos Editoriales (H1, H2):** `Playfair Display` — Serif moderna y distinguida con ligaduras refinadas y tracking track-tight (`-0.015em`).
- **Body, UI & Controles:** `Outfit` (alternativa oficial con soporte `Lato`) — Proporciones humanas, calidez geométrica y legibilidad sin fatiga. Longitud de línea máxima: 65 caracteres.
- **Precios, Códigos & Badges:** `JetBrains Mono` — Para precios en moneda nacional uruguaya (`$UYU`), códigos de taller artesanal y contadores numéricos.
- **Firma de Marca & Toques de Afecto:** `Lobster Two` (Italic) — Exclusivo para el imagotipo tradicional de cabecera y citas manuscritas en envolturas de regalo.
- **Banned:** `Inter` (prohibida para contextos boutique), `Times New Roman`, `Georgia` y tipografías genéricas sin carácter.

---

## 4. Component Stylings (OneEntry Architecture + Marifer Taste)

### Botones (Pill Geometry)
- **Shape & Radio:** Estructura tipo píldora `--radius-btn: 30px` (`border-radius: 9999px`).
- **Botón Primario (`.btn-primary`):**
  - Relleno: Terracota Cálido (`#D97D54`).
  - Texto: Blanco Puro (`#FFFFFF`), `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.05em`.
  - Spring Physics: En hover eleva `translateY(-3px) scale(1.01)` con sombra tintada `0 8px 22px rgba(217, 125, 84, 0.35)`; en active `scale(0.98) translateY(1px)`.
- **Botón Secundario Outlined (`.btn-o`):**
  - Fondo: Transparente con borde `1.5px` en Violeta Ciruela (`#502A55`) o Terracota (`#D97D54`).
  - Hover: Fondo sutil lavanda con elevación suave.

### Block Cards & Radial Hover Glow
- **Promo Block Cards (`.block-card`):**
  - Radio de esquinas: `20px` (`--radius-card`).
  - Tipografía interna en alto contraste con sombra de texto difusa.
  - **Micro-interacción `radial-hover` con Cursor Tracking:** Un gradiente radial de 300px en **Terracota Cálido (`rgba(217, 125, 84, 0.4)`)** que sigue las coordenadas exactas del mouse en `mousemove` y escala elásticamente de 0 a 1.4 al hacer hover.

### Tarjetas de Producto (`.product-card`)
- **Estructura:**
  - Fondo: `#F8FAFC` o `#FFFFFF` con esquinas redondeadas de `20px`.
  - Fila superior: Badge de estado a la izquierda ("Nuevo", "Hecho a Mano", "Favorito") y botón corazón interactivo a la derecha.
  - Centro: Contenedor con marco lino limpio y zoom elástico de imagen (`scale(1.06)`) en hover.
  - Base: Título balanceado en `Playfair Display`/`Outfit`, precio en `$UYU` monoespaciado y botón píldora "Agregar al Carrito".

### Formularios con Subrayado Minimalista (Underline Inputs)
- **Inputs:** Fondo transparente sin caja pesada, con subrayado inferior de `1.5px solid #D6D3D1`.
- **Foco:** En `:focus` el borde inferior transiciona fluidamente a **Terracota Cálido (`#D97D54`)** con oscurecimiento del texto a `#19091B`.
- **Labels:** Tipografía `Outfit` en mayúsculas pequeñas (`0.85rem`) con asterisco rojo para campos obligatorios.

### Sistema de Notificaciones Flotantes (Toastify Engine)
- Toast emergente con animación elástica `toastSlideIn`, fondo carbón ciruela `#1E293B`, borde fino y checkmark terracota tras interactuar con el carrito o lista de deseos.

---

## 5. Layout Principles & Grid Structure

- **Container Max Width:** `1240px` (`--oe-max-width`) centrado con padding lateral de `20px`.
- **Grilla de Banners de Autor (6 Bloques):**
  - Bloque 1: Banner de Catálogo general (`100% width`, `200px` altura).
  - Bloques 2, 3 y 4: Colecciones específicas en 3 columnas (`33.33% width`, `260px` altura).
  - Bloques 5 y 6: Asesoramiento WhatsApp & Taller Comunitario en 2 columnas (`50% width`, `260px` altura).
- **Mobile-First Collapse (< 768px):** Todos los bloques multicolumna colapsan a una columna vertical fluida manteniendo objetivos táctiles superiores a `44px`.

---

## 6. Motion Philosophy & Spring Physics

- **Curvas de Aceleración:** `--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.15)` para rebotes táctiles y `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` para transiciones de panel.
- **Micro-interacciones continuas:**
  - Cursor tracking reactivo en `mousemove` para tarjetas de bloque.
  - Animación `fadeIn` de `400ms` para elementos que se montan en el DOM.
- **Rendimiento Exclusivo por GPU:** Uso estricto de `transform` y `opacity` con `will-change: transform`. Prohibido animar dimensiones geométricas (`width`, `height`, `top`, `left`).

---

## 7. Anti-Patterns (Reglas Banned)

- ❌ **No emojis** en botones, encabezados, títulos de producto ni filtros (reemplazados por iconos SVG vectoriales de trazo limpio).
- ❌ **No tipografía `Inter`** ni combinaciones genéricas de fuentes de sistema sin personalidad.
- ❌ **No negro puro (`#000000`)** ni blancos fríos de laboratorio.
- ❌ **No colores neón o degradados cian/púrpura artificiales de IA**.
- ❌ **No métricas o números inventados por IA** ("99.9% satisfacción", "10k pedidos").
- ❌ **No textos de relleno vacíos** ("Scroll to explore", flechas de scroll rebotantes).
- ❌ **No clichés de redacción AI** ("Seamless", "Unleash", "Next-Gen", "Elevate").
- ❌ **No enlaces rotos o imágenes placeholder de baja calidad**.
- ❌ **No cursores personalizados por JS** que degraden la accesibilidad nativa del usuario.

---

## 8. Prompts Semánticos para Generación en Google Stitch

- **Product Card Prompt:** *"Create a 20px rounded product card on a #F8FAFC slate background, top artisan badge and heart wishlist toggle, centered product photo on crisp linen backing, balanced title in Playfair Display, price formatted in $UYU JetBrains Mono, and a 30px pill-shaped terracotta (#D97D54) 'Agregar al Carrito' button."*
- **Hero Feature Block Prompt:** *"Design a high-impact promo block card with 20px rounded corners, dark plum overlay, bold Playfair typography, and a hardware-accelerated radial hover glow in warm terracotta (#D97D54) that tracks cursor position."*
- **Underline Form Prompt:** *"Design a minimalist consultation form with stone-300 underline-only inputs, uppercase labels, and a smooth orange-terracotta bottom border transition on focus."*
