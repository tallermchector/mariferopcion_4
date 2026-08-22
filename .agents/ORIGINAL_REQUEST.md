# Original User Request

## Initial Request — 2026-08-22T10:30:42Z

<USER_REQUEST>
Optimizar y auditar integralmente la experiencia de usuario, diseño visual y fidelidad con el sistema de diseño en todo el e-commerce Marifer (Landing Page, Catálogo de Productos, Ficha de Detalle de Prenda, Bolsa/Drawer de Carrito, Checkout y Autenticación).

Working directory: C:\Users\prest\proyectos\0mariferopcion_4
Integrity mode: development

Referencia de diseño principal: DESIGN.md y design-system/marifer/MASTER.md

## Requirements

### R1. Fidelidad estricta al Sistema de Diseño y Tokens
- Asegurar coherencia visual absoluta en todas las páginas con la paleta canónica: Ciruela Marifer (#452453), Ciruela profunda (#241230), Blanco cálido de fondo (#fffcff), Lila suave (#f2e6f4), Lavanda (#caa8d3) y Rosa rebajas AA (#c23b64).
- Eliminar cualquier uso de paletas neutras o clases genéricas prohibidas por DESIGN.md (e.g. gray-*, slate-*, neutral-*, indigo-*).
- Aplicar estrictamente las fuentes declaradas: Outfit para encabezados y displays, Manrope para textos y párrafos, Lobster Two exclusivamente para el logo "Marifer", y JetBrains Mono con formato tabular (font-variant-numeric: tabular-nums) en todos los precios, cuotas, contadores y descuentos.

### R2. Refinamiento de Layouts Asimétricos y Responsive
- Garantizar la asimetría intencional requerida: Hero 7/5 con fotos inline como puntuación visual (InlineWord), bento espejado de categorías (5/4/3 · 3/4/5) con etiquetas fuera de la imagen, y bloques editoriales en zig-zag.
- Optimizar la adaptabilidad mobile (<640px, 390px) y desktop (1440px) asegurando touch targets mínimos de 44×44px en todos los botones, selectores de cantidad, íconos y miniaturas, sin desbordamiento ni scroll horizontal.

### R3. Micro-interacciones, Estados y Accesibilidad WCAG 2.2
- Implementar transiciones y animaciones fluidas con resortes (motion/react) respetando useReducedMotion().
- Validar contrastes accesibles WCAG 2.2 AA/AAA (especialmente badges sobre fondo claro/oscuro y textos muted).
- Preservar accesibilidad en modales y drawers (diálogo modal de carrito con foco accesible, aria-modal, role="dialog", escape key handler, y roles en barras de progreso y alertas).

## Acceptance Criteria

### Consistencia Visual y Tokens
- [ ] Todas las vistas (Home, /products, /product/[id], /cart, /login, /register, not-found, loading) utilizan exclusivamente los tokens y clases de sombra shadow-marifer-* y paleta Marifer.
- [ ] Todos los precios y cuotas se muestran formateados en moneda uruguaya con números tabulares monoespaciados (font-mono-tabular).
- [ ] No existen textos de bajo contraste en violación de WCAG 2.2.

### Experiencia Interactiva y Accesibilidad
- [ ] Todos los elementos interactivos cumplen con el tamaño táctil mínimo de 44×44px.
- [ ] El Drawer de Carrito y los formularios de autenticación responden con foco accesible por teclado, navegación accesible y validaciones en línea.
- [ ] Las animaciones soportan modo de movimiento reducido (prefers-reduced-motion: reduce).
</USER_REQUEST>
