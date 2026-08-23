# Plan: Admin Product Management Section — Marifer Ecommerce

> **Documento de planificación completo** para implementar la sección de administración de productos. Incluye 3 fases progresivas desde el core hasta funcionalidades avanzadas.

---

## Contexto Actual

| Aspecto | Estado |
|---------|--------|
| **Auth** | Mock only (`setTimeout` + redirect en `/login`, `/register`) |
| **DB** | PostgreSQL (schema usa `provider = "postgresql"`) |
| **User model** | Tiene campo `role` (`'USER'` | `'ADMIN'`) |
| **Product model** | Completo: name, slug, description, price, compareAtPrice, image, images (JSON), stock, featured, categoryId, rating, numReviews |
| **Category model** | Completo: name, slug, description, image |
| **UI Patterns** | Establecidos en `login/register`, `Navbar`, `ProductCard`, `CartDrawer` |
| **Design System** | `design-system/marifer/MASTER-archived-2026-08-22.md` + `DESIGN.md` |

---

## Fase 1 — Core (MVP Administrable)

**Objetivo**: Admin puede autenticarse, ver listado de productos, crear/editar/eliminar productos y gestionar categorías.

### 1.1 Autenticación Real + Autorización

| Archivo | Acción |
|---------|--------|
| `src/lib/auth.ts` | **Nuevo**. Helper `getServerSession()` usando JWT en cookie HTTP-only. Funciones: `getSession()`, `requireAdmin()`, `requireAuth()` |
| `middleware.ts` | **Nuevo**. Proteger `/admin/*` → redirigir a `/login?redirect=` si no autenticado; 403 si no es ADMIN |
| `src/app/(auth)/login/page.tsx` | Modificar: POST real a `/api/auth/login` (credentials), setear cookie, redirect a `searchParams.redirect` o `/admin` |
| `src/app/(auth)/register/page.tsx` | Mantener mock o conectar a `/api/auth/register` (crear USER) |
| `src/app/api/auth/login/route.ts` | **Nuevo**. Validar credenciales vs DB, generar JWT, setear cookie `HttpOnly; Secure; SameSite=Lax; Path=/` |
| `src/app/api/auth/logout/route.ts` | **Nuevo**. Limpiar cookie |
| `src/app/api/auth/me/route.ts` | **Nuevo**. Devolver usuario actual desde cookie (para cliente) |

**Decisión de implementación**: **Custom JWT** (no NextAuth) para mantener dependencias mínimas. Librería: `jose` (Edge-compatible) o `jsonwebtoken`.

### 1.2 Shell Admin + Navegación

| Archivo | Descripción |
|---------|-------------|
| `src/app/(admin)/layout.tsx` | Layout raíz del grupo admin. Verifica sesión server-side. Renderiza `<Sidebar />` + `<main>{children}</main>` |
| `src/app/(admin)/admin/layout.tsx` | Igual que arriba o consolidar en uno solo |
| `src/components/admin/Sidebar.tsx` | **Nuevo**. Navegación colapsable (mobile: drawer; desktop: fija 260px). Items: Dashboard, Productos, Categorías, Configuración. `role="navigation" aria-label="Admin"` |
| `src/components/admin/Header.tsx` | **Nuevo**. Top bar: breadcrumbs, user avatar (logout), search global opcional |
| `src/app/(admin)/admin/page.tsx` | **Nuevo**. Dashboard: stats cards (total productos, categorías, stock bajo, pedidos mock), accesos rápidos |

**Rutas finales**:
```
/admin                    → Dashboard
/admin/products           → Lista productos
/admin/products/new       → Crear producto
/admin/products/[id]      → Ver/Editar producto
/admin/categories         → Lista categorías
/admin/categories/new     → Crear categoría
```

### 1.3 Productos — Listado (RSC)

| Archivo | Detalles |
|---------|----------|
| `src/app/(admin)/admin/products/page.tsx` | **Server Component**. `revalidate = 60`. `searchParams`: `page`, `search`, `categoryId`, `featured`, `stockStatus`. Prisma: `findMany` con `where`, `orderBy`, `skip/take`, `include: { category: true }`. Retorna tabla + paginación. |
| `src/components/admin/ProductTable.tsx` | **Client Component**. Tabla responsive: checkbox (bulk), thumbnail, nombre (link a edit), categoría, precio, stock (badge color), featured (toggle), acciones (edit/delete). `useReducedMotion` para animaciones. |
| `src/components/admin/ProductFilters.tsx` | **Client**. Buscador (debounce 300ms), select categoría, select featured, select stock status. URL sync con `useRouter().push()`. |
| `src/components/admin/Pagination.tsx` | **Client**. Botones prev/next + números. `aria-label` en cada link. |

### 1.4 Productos — Formulario Crear/Editar (Client)

| Archivo | Detalles |
|---------|----------|
| `src/components/admin/ProductForm.tsx` | **Componente compartido**. `mode: 'create' | 'edit'`, `initialData?: ProductType`. React Hook Form + Zod schema. Campos: |
| | • **name** (required, max 120) |
| | • **slug** (auto de name, editable, unique check blur) |
| | • **description** (textarea, required, min 20) |
| | • **price** (number, step 0.01, min 0, required) |
| | • **compareAtPrice** (number, optional, > price) |
| | • **stock** (number, min 0, default 10) |
| | • **featured** (checkbox) |
| | • **rating** (number 0-5, step 0.1, default 4.8) |
| | • **numReviews** (number, default 12) |
| | • **categoryId** (select desde `/api/admin/categories`) |
| | • **image** (URL input + preview `next/image`) |
| | • **images** (array de URLs: botón "Agregar imagen", drag-reorder, delete) |
| | Submit: `POST /api/admin/products` o `PATCH /api/admin/products/[id]` |
| | Toast éxito/error (reutilizar patrón `CartDrawer`) |
| `src/app/(admin)/admin/products/new/page.tsx` | Client wrapper: `<ProductForm mode="create" />` |
| `src/app/(admin)/admin/products/[id]/page.tsx` | **Server Component**. `await params`, `prisma.product.findUnique({ include: { category: true } })`. Si no existe → `notFound()`. Pasa datos a `<ProductForm mode="edit" initialData={...} />` |

### 1.5 API Routes — Productos

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/admin/products` | GET | Listado paginado + filtros (para tabla server-side si se migra) |
| `/api/admin/products` | POST | Crear. Validar Zod. `slug` unique. `images` → `JSON.stringify()`. Retornar 201 + product. |
| `/api/admin/products/[id]` | GET | Detalle single (para edit) |
| `/api/admin/products/[id]` | PATCH | Actualizar. Validar parcial. `images` JSON. |
| `/api/admin/products/[id]` | DELETE | Eliminar. Verificar no hay `CartItem` referenciando (o cascade). |
| `/api/admin/products/bulk` | POST | **Opcional Fase 1**. Body: `{ ids: string[], action: 'delete' | 'feature' | 'unfeature' }` |

### 1.6 Categorías — CRUD Básico

| Archivo | Descripción |
|---------|-------------|
| `src/app/(admin)/admin/categories/page.tsx` | RSC. Tabla simple: nombre, slug, # productos, acciones. |
| `src/app/(admin)/admin/categories/new/page.tsx` | Client. Form: name, slug (auto), description, image (URL). |
| `src/app/(admin)/admin/categories/[id]/page.tsx` | RSC + Client form para editar. |
| `src/app/api/admin/categories/route.ts` | GET (list), POST (create) |
| `src/app/api/admin/categories/[id]/route.ts` | GET, PATCH, DELETE |

### 1.7 Componentes UI Reutilizables (Admin)

| Componente | Basado en |
|------------|-----------|
| `AdminInput` | `inputClass` de login/register |
| `AdminSelect` | Mismo estilo, `role="combobox"` |
| `AdminTextarea` | Mismo estilo |
| `AdminCheckbox` | 24×24px, focus ring lavanda |
| `AdminButton` | Primary/secondary/ghost/danger variants |
| `AdminTable` | Wrapper con scroll horizontal mobile |
| `AdminBadge` | Stock: verde/amarillo/rojo; Featured: violeta |
| `ConfirmDialog` | Modal accesible (focus trap, Escape, `role="dialog" aria-modal="true"`) |
| `Toast` | Portal, auto-dismiss 3s, action button opcional |

---

## Fase 2 — Polish (Experiencia de Producción)

**Objetivo**: Subir imágenes, editor rico, acciones en lote, métricas en dashboard.

### 2.1 Subida de Imágenes

| Archivo | Descripción |
|---------|-------------|
| `src/app/api/admin/upload/route.ts` | **Nuevo**. `POST` multipart/form-data. Validar: tipo `image/*`, max 5MB. Guardar en `public/uploads/products/` (dev) o S3-compatible (prod). Retornar `{ url: '/uploads/products/uuid.webp' }`. |
| `src/components/admin/ImageUploader.tsx` | **Nuevo**. Dropzone + click. Preview grid. Drag-reorder. Botón eliminar. Genera array de URLs para `ProductForm.images`. |
| `next.config.ts` | Agregar `images.remotePatterns` para `localhost` en dev si se sirve local. |
| `middleware.ts` | Permitir `/uploads/*` sin auth (assets estáticos). |

**Decisión**: Local filesystem en dev (`public/uploads`), S3/R2 en prod. Variable `UPLOAD_PROVIDER: 'local' | 's3'`.

### 2.2 Editor de Texto Rico (Descripción)

| Opción | Pros | Contras |
|--------|------|---------|
| **TipTap** | Headless, extensible, ProseMirror | +15KB gz, curva aprendizaje |
| **Plate (udecode)** | React-first, plugins | Similar tamaño |
| **Simple toolbar** | Bold, italic, list, link. Output HTML sanitizado (DOMPurify) | Suficiente para e-commerce |

**Recomendación**: **Simple toolbar custom** (bold, italic, ul/ol, link) + `DOMPurify` en server. Evita dependencias pesadas.

### 2.3 Acciones en Lote (Bulk Actions)

| Archivo | Cambio |
|---------|--------|
| `ProductTable.tsx` | Checkbox header (select all visible), checkbox por fila. Toolbar flotante aparece cuando `selected.length > 0`: "Eliminar (N)", "Destacar", "Quitar destacado", "Cambiar categoría". |
| `/api/admin/products/bulk` | Implementar transacción Prisma para atomicidad. |

### 2.4 Dashboard Stats Reales

| Métrica | Query Prisma |
|---------|--------------|
| Total productos | `prisma.product.count()` |
| Total categorías | `prisma.category.count()` |
| Stock bajo (≤5) | `prisma.product.count({ where: { stock: { lte: 5 } } })` |
| Productos sin imagen | `prisma.product.count({ where: { image: { equals: '' } } })` |
| Valor inventario | `prisma.product.aggregate({ _sum: { price: true } })` (aprox) |
| Últimos 7 días | `createdAt: { gte: subDays(now, 7) }` |

### 2.5 Validación de Slug Único (Debounce)

- En `ProductForm`: `onBlur` en slug → `GET /api/admin/products/check-slug?slug=xxx&excludeId=yyy` → muestra "Disponible" / "Ocupado" inline.

### 2.6 SEO Fields (Opcional)

Agregar a `Product` model (migración):
```prisma
seoTitle        String?
seoDescription  String?
seoKeywords     String?
```
Y campos en formulario.

---

## Fase 3 — Advanced (Escalabilidad y Operaciones)

**Objetivo**: Variantes de producto, import/export, auditoría, multiidioma.

### 3.1 Variantes de Producto (Talla/Color)

**Modelo nuevo** (migración):
```prisma
model ProductVariant {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  sku       String   @unique
  size      String?  // S, M, L, XL, Único
  color     String?  // Nombre + hex
  colorHex  String?
  stock     Int      @default(0)
  price     Float?   // Override opcional
  images    String?  // JSON array específico de variante
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([productId])
}
```

**Cambios en cascada**:
- `ProductCard` → leer variantes del producto (no hardcodeado)
- `ProductDetailGallery` → mostrar imágenes por variante seleccionada
- `CartContext` → `CartItem` incluye `variantId`
- `ProductForm` → sección "Variantes" (tabla inline add/edit/delete)
- API: `/api/admin/products/[id]/variants` (CRUD)

### 3.2 Import/Export CSV

| Archivo | Descripción |
|---------|-------------|
| `src/app/api/admin/products/import/route.ts` | POST multipart. Parsear CSV (reutilizar `parseCSV` de `seed.ts`). Validar cada fila con Zod. Transacción: crear/actualizar por slug. Reporte: `{ created: N, updated: M, errors: [...] }`. |
| `src/app/api/admin/products/export/route.ts` | GET. `prisma.product.findMany()` → generar CSV con headers. `Content-Disposition: attachment`. |
| `ProductTable.tsx` | Botones "Importar CSV", "Exportar CSV". Modal import con preview de primeras 5 filas. |

### 3.3 Auditoría / Log de Cambios

**Modelo**:
```prisma
model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  entity    String   // 'Product', 'Category'
  entityId  String
  action    String   // 'CREATE', 'UPDATE', 'DELETE'
  diff      Json     // { before: {}, after: {} }
  createdAt DateTime @default(now())

  @@index([entity, entityId])
  @@index([userId])
}
```

Middleware en API routes: capturar `before` (findUnique), ejecutar acción, capturar `after`, crear `AuditLog`.

UI: Pestaña "Historial" en `/admin/products/[id]`.

### 3.4 Multiidioma (i18n) — Preparación

- Agregar `locale` a `Product` y `Category` (default `'es-UY'`)
- `ProductTranslation` model para name/description/seo por locale
- Middleware detecta `Accept-Language` o cookie
- UI: selector de idioma en admin header

### 3.5 Permisos Granulares (RBAC)

Extender `User`:
```prisma
model Permission {
  id        String   @id @default(cuid())
  name      String   @unique // 'products:create', 'products:delete', etc.
  role      Role     @default(USER)
}
```

Hook `usePermission('products:delete')` en componentes.

---

## Archivos a Crear — Resumen por Fase

### Fase 1 (Core) — ~25 archivos nuevos
```
src/lib/auth.ts
middleware.ts
src/app/api/auth/login/route.ts
src/app/api/auth/logout/route.ts
src/app/api/auth/me/route.ts
src/app/(admin)/layout.tsx
src/app/(admin)/admin/layout.tsx
src/app/(admin)/admin/page.tsx
src/app/(admin)/admin/products/page.tsx
src/app/(admin)/admin/products/new/page.tsx
src/app/(admin)/admin/products/[id]/page.tsx
src/app/(admin)/admin/categories/page.tsx
src/app/(admin)/admin/categories/new/page.tsx
src/app/(admin)/admin/categories/[id]/page.tsx
src/app/api/admin/products/route.ts
src/app/api/admin/products/[id]/route.ts
src/app/api/admin/products/bulk/route.ts
src/app/api/admin/categories/route.ts
src/app/api/admin/categories/[id]/route.ts
src/components/admin/Sidebar.tsx
src/components/admin/Header.tsx
src/components/admin/ProductTable.tsx
src/components/admin/ProductForm.tsx
src/components/admin/ProductFilters.tsx
src/components/admin/Pagination.tsx
src/components/admin/ConfirmDialog.tsx
src/components/admin/Toast.tsx
src/components/admin/AdminInput.tsx
src/components/admin/AdminSelect.tsx
src/components/admin/AdminTextarea.tsx
src/components/admin/AdminCheckbox.tsx
src/components/admin/AdminButton.tsx
src/components/admin/AdminBadge.tsx
```

### Fase 2 (Polish) — ~8 archivos
```
src/app/api/admin/upload/route.ts
src/components/admin/ImageUploader.tsx
src/components/admin/RichTextEditor.tsx
src/app/api/admin/products/check-slug/route.ts
src/app/(admin)/admin/products/import/page.tsx (o modal en ProductTable)
prisma/migrations/xxx_add_seo_fields.ts
```

### Fase 3 (Advanced) — ~15 archivos
```
prisma/migrations/xxx_add_variants.ts
prisma/migrations/xxx_add_audit_log.ts
src/app/api/admin/products/[id]/variants/route.ts
src/components/admin/VariantTable.tsx
src/components/admin/VariantForm.tsx
src/app/api/admin/products/import/route.ts
src/app/api/admin/products/export/route.ts
src/components/admin/ImportModal.tsx
src/lib/audit.ts
src/components/admin/AuditLogTab.tsx
prisma/migrations/xxx_add_translations.ts
```

---

## Dependencias Nuevas Requeridas

| Paquete | Fase | Uso |
|---------|------|-----|
| `jose` / `jsonwebtoken` | 1 | JWT auth |
| `zod` | 1 | Validación formularios + API |
| `react-hook-form` | 1 | Form state (si no está; ya en deps: `@hookform/resolvers`) |
| `date-fns` | 2 | Fechas en dashboard |
| `dompurify` | 2 | Sanitizar HTML rich text |
| `csv-parse` / `csv-stringify` | 3 | Import/export CSV |

> Verificar `package.json`: `react-hook-form` y `@hookform/resolvers` ya están. `zod` **falta**.

---

## Checklist de Accesibilidad (Todas las Fases)

- [ ] Focus visible en todos los interactivos (ring lavanda `#caa8d3`)
- [ ] `aria-label` en botones solo ícono (eliminar, editar, cerrar modal)
- [ ] `role="dialog" aria-modal="true"` en modales (ConfirmDialog, ImportModal)
- [ ] Trap de foco en modales y Sidebar mobile
- [ ] Cerrar con `Escape`
- [ ] `prefers-reduced-motion` respetado (animaciones 0ms)
- [ ] Contraste ≥ 4.5:1 (usar tokens MASTER)
- [ ] Tamaños táctiles ≥ 44×44px (botones tabla, checkboxes)
- [ ] Labels asociados (`htmlFor` + `id`) en todos los inputs
- [ ] Errores con `role="alert"` y `aria-describedby`
- [ ] Tablas: `<th scope="col">`, `aria-sort` en headers ordenables

---

## Decisiones Pendientes (Requieren Confirmación)

1. **Auth**: ¿Custom JWT o NextAuth.js? (NextAuth = más robusto, +deps)
2. **Imágenes**: ¿Solo URLs externas (picsum/unsplash) o subir archivos ya en Fase 1?
3. **Variantes**: ¿Incluir en Fase 1 o esperar a Fase 3? (Impacta `ProductCard`, `Cart`, `ProductDetail`)
4. **Rich text**: ¿Editor simple custom o TipTap/Plate?
5. **Multiidioma**: ¿Preparar campos i18n ahora (Fase 2) o solo Fase 3?
6. **Despliegue**: ¿Vercel? ¿Docker? Afecta `public/uploads` (ephemeral en Vercel → necesitar S3/R2).

---

## Orden de Ejecución Sugerido

```
1. auth.ts + middleware.ts + login API + login page real
2. Admin shell (layout, Sidebar, Header)
3. Products list (RSC + ProductTable + Filters + Pagination)
4. ProductForm (create) + POST API
5. ProductForm (edit) + PATCH/DELETE API + [id] page
6. Categories CRUD
7. Toast + ConfirmDialog + Admin UI components
8. Dashboard stats
--- Fase 1 completa ---

9. Upload API + ImageUploader + integrar en ProductForm
10. Rich text editor simple + DOMPurify
11. Bulk actions + bulk API
12. Slug check debounce
13. SEO fields migration + form
--- Fase 2 completa ---

14. Variants migration + API + UI
15. Import/Export CSV
16. Audit log + UI
17. i18n prep
--- Fase 3 completa ---
```

---

## Estimación de Esfuerzo

| Fase | Archivos | Días (1 dev) | Riesgo |
|------|----------|--------------|--------|
| 1 Core | ~25 | 4-5 | Medio (auth + RSC/Client boundary) |
| 2 Polish | ~8 | 2-3 | Bajo |
| 3 Advanced | ~15 | 4-5 | Alto (variants tocan carrito + PDP) |
| **Total** | **~48** | **10-13** | |

---

## Próximos Pasos

1. **Confirmar decisiones pendientes** (auth, imágenes, variantes, rich text)
2. **Crear branch** `feat/admin-products`
3. **Ejecutar Fase 1** en orden sugerido
4. **Testing**: `bun run lint`, `bunx tsc --noEmit`, `bun run test` tras cada hito
5. **Documentar** en `AGENTS.md` comandos nuevos (`bun run admin:seed` para crear admin user)

---

*Generado automáticamente — revisar y ajustar antes de iniciar implementación.*