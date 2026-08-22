# Accessibility, Micro-interactions & Test Infra Survey Report

## 1. Observation

### 1.1 Micro-interactions & Animation Infrastructure
- **Animation Library**: Modern `motion` (`^12.23.24`) is installed in `package.json:20` and imported from `'motion/react'` across components:
  - `src/app/(auth)/login/page.tsx:7` (`import { motion, useReducedMotion } from 'motion/react'`)
  - `src/app/(auth)/register/page.tsx:7` (`import { motion, useReducedMotion } from 'motion/react'`)
  - `src/components/AddToCartButton.tsx:5` (`import { motion, useReducedMotion } from 'motion/react'`)
  - `src/components/CartControl.tsx:7` (`import { motion, useReducedMotion } from 'motion/react'`)
  - `src/components/CartDrawer.tsx:6` (`import { motion, AnimatePresence, useReducedMotion } from 'motion/react'`)
  - `src/components/CartPageContent.tsx:6` (`import { motion, useReducedMotion } from 'motion/react'`)
  - `src/components/Navbar.tsx:7` (`import { motion, AnimatePresence, useReducedMotion } from 'motion/react'`)
  - `src/components/ProductDetailGallery.tsx:6` (`import { motion, AnimatePresence, useReducedMotion } from 'motion/react'`)
  - `src/components/ProductGrid.tsx:5` (`import { motion, Variants, useReducedMotion } from 'motion/react'`)
- **Spring Transition Parameters**:
  - `src/components/CartDrawer.tsx:67`: `transition={reduceMotion ? { duration: 0 } : { type: 'spring', damping: 26, stiffness: 260 }}`
  - `src/components/Navbar.tsx:46`: `transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}`
  - `src/components/ProductGrid.tsx:33`: `transition: { type: 'spring', stiffness: 100, damping: 20 }`
- **Reduced Motion Support**:
  - `src/app/globals.css:60-69`:
    ```css
    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
    ```
  - `src/components/ProductGrid.tsx:85`: switches between `reduceMotion ? staticVariants : itemVariants`.
  - `src/components/AddToCartButton.tsx:20` & `src/components/CartControl.tsx:21`: `tap = reduceMotion ? undefined : { scale: 0.9 }`.
  - `src/app/page.tsx:176` and `src/app/globals.css:130-137`: CSS `.reveal` uses `--index` cascading animation, silenced by global reduced-motion rule.

### 1.2 Contrast Ratios & WCAG 2.2 AA/AAA Compliance
- **Color Tokens in `src/app/globals.css:5-26`**:
  - Primary violet: `--brand-primary: #452453` (9.8:1 AAA on `#ffffff` / `#fffcff`)
  - Deep plum text: `--brand-deep: #241230` (14.8:1 AAA on `#ffffff` / `#fffcff`)
  - Body text: `--text-body: #403945` (9.8:1 AAA on `#ffffff`, 8.1:1 AAA on `#f2e6f4`)
  - Muted text: `--text-muted: #7d7384` (4.54:1 AA on `#ffffff`; 3.75:1 on `#f2e6f4` - below AA for small text)
  - Announce bar: `--bar-crema: #fbf1de` + `--bar-tabaco: #7a5222` (6.1:1 AA)
  - Sale accent: `--accent-sale-deep: #c23b64` (5.1:1 AA on `#ffffff` and for white text over `#c23b64`)
  - Highlight gold: `--accent-highlight: #d4a15a` with dark text `#241230` (6.3:1 AA)
  - Stock green: `--stock-text: #146043` (7.3:1 AAA on `#ffffff`, 6.1:1 AA on `#f2e6f4`)
- **Prohibited Classes**: Ripgrep verification across `src/` for `gray-*`, `slate-*`, `neutral-*`, `indigo-*`, `zinc-*`, `stone-*`, `emerald-*`, `amber-*` returned **0 matches**.
- **Touch Targets**:
  - `Navbar.tsx:115,119,130,139,148,167`: All buttons & inputs `h-11`, `w-11 h-11` (44×44px).
  - `ProductCard.tsx:141`: Add to cart button `h-11 px-4`.
  - `AddToCartButton.tsx:49,62,78`: Steppers `h-11 w-11`, CTA `h-[52px] sm:h-[56px]`.
  - `CartControl.tsx:63,82,101`: Steppers and remove button `h-11 w-11` (44×44px).
  - `CartDrawer.tsx:90,208,217`: Close button `w-11 h-11`, checkout `h-12`, clear button `h-11`.
  - `products/page.tsx:94,107,118,129`: Sort buttons use `h-9` inside a `p-1` rounded-full bar (~44px total container, but individual button height is 36px).

### 1.3 Modal & Drawer Accessibility (`src/components/CartDrawer.tsx`)
- **Positive Observations**:
  - `CartDrawer.tsx:61-63`: Contains `role="dialog"`, `aria-modal="true"`, `aria-labelledby="cart-drawer-title"`.
  - `CartDrawer.tsx:77`: `<h2 id="cart-drawer-title">Tu bolsa</h2>` matches the label.
  - `CartDrawer.tsx:93`: Close button has `aria-label="Cerrar bolsa"`.
  - `CartDrawer.tsx:33-37`: Listens for `Escape` key and closes drawer.
  - `CartDrawer.tsx:32`: Calls `closeButtonRef.current?.focus()` on open for initial focus.
  - `CartDrawer.tsx:122-127`: Free shipping progress bar has `role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={...} aria-label="..."`.
- **Identified Deficiencies**:
  - **No Focus Trap (`CartDrawer.tsx:29-38`)**: When the user presses `Tab` / `Shift+Tab`, focus can cycle into the background DOM (Navbar links, page body) behind the open drawer.
  - **No Return Focus (`CartDrawer.tsx:29-38`)**: When the drawer is closed (via Escape, close button, or backdrop), focus is not returned to the invoking trigger (e.g. `navbar-cart-trigger` or `add-to-cart-detail-*`).
  - **No Body Scroll Lock (`CartDrawer.tsx:29-38`)**: Background content can still scroll while the drawer modal is active.
  - **No `inert` attribute on `#main`**: The background DOM tree remains interactive for screen readers / accessibility APIs when the modal is open.

### 1.4 Form Accessibility
- **Authentication Forms (`(auth)/login/page.tsx`, `(auth)/register/page.tsx`)**:
  - Explicit `<label htmlFor="...">` matching each input (`login-email`, `login-password`, `register-name`, etc.).
  - `aria-invalid` set dynamically based on validation state (`aria-invalid={showEmailError ? true : undefined}`).
  - `aria-describedby` properly points to error elements (`id="login-email-error" role="alert"`) or helper text (`id="register-password-help"`).
  - High contrast error text `#c23b64` (5.1:1 AA).
  - Validation runs `onBlur` and on change once touched.
- **Search & Promo Forms (`Navbar.tsx:101-124`, `CartPageContent.tsx:183-220`)**:
  - `Navbar.tsx:106,193`: Inputs have `<label className="sr-only">Buscar prendas</label>` and explicit `id="nav-search"`.
  - `CartPageContent.tsx:184-218`: Promo code input linked with `<label htmlFor="promo-code">`, `aria-describedby="promo-error"`, and error with `role="alert"`.

### 1.5 Build & Test Infrastructure
- **`package.json:5-11` Scripts**:
  ```json
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "eslint .",
    "clean": "next clean"
  }
  ```
- **Test Frameworks**: **0 test frameworks installed**. No Vitest, Jest, React Testing Library, Playwright, or Axe.
- **Test Files**: **0 test files** present in the repository.

---

## 2. Logic Chain

1. **Micro-interactions**: The codebase consistently uses `motion/react` with spring physics and integrates `useReducedMotion()` across all animated client components. Coupled with the global CSS reset in `src/app/globals.css:60-69`, the application meets the animation criteria of WCAG 2.2 Success Criterion 2.3.3 (Animation from Interactions).
2. **Contrast & Color Compliance**:
   - The token `--accent-sale-deep: #c23b64` successfully delivers a 5.1:1 contrast ratio against `#ffffff`, resolving previous contrast failures with `#d94f78` (3.9:1).
   - In `src/app/page.tsx:227`, category counts on light lila (`#f2e6f4`) use `#403945` (8.1:1 AAA), preventing the 3.75:1 contrast deficiency of `#7d7384`.
   - The announce bar uses `#7a5222` on `#fbf1de` (6.1:1 AA).
   - Thus, text contrast satisfies WCAG 2.2 Success Criterion 1.4.3 (Contrast Minimum - AA).
3. **Dialog / Drawer Focus Management**:
   - While `CartDrawer.tsx` has `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, initial focus, and `Escape` handling, it lacks a complete focus trap loop and return focus tracking.
   - This violates WCAG 2.2 Success Criterion 2.4.3 (Focus Order) and Success Criterion 2.1.2 (No Keyboard Trap / Modal Focus Containment).
4. **Form Semantics**:
   - All forms (`login`, `register`, `cart` promo, `navbar` search) have explicit `htmlFor` / `id` pairings, `aria-invalid`, `aria-describedby` referencing `role="alert"` errors, satisfying WCAG 2.2 Success Criterion 3.3.1 (Error Identification) and 3.3.2 (Labels or Instructions).
5. **Testing Gap**:
   - Without test runners or automated accessibility auditing (such as `vitest`, `@testing-library/react`, `vitest-axe`, `@playwright/test`, `@axe-core/playwright`), regressions in focus trapping, contrast, or server rendering cannot be caught automatically in CI/CD.

---

## 3. Caveats

1. **Catalog Sort Buttons Touch Target**: In `src/app/products/page.tsx:94,107,118,129`, sort buttons use `h-9` (36px height). Although they sit within a pill container with padding, their individual clickable height is slightly under the 44px recommended threshold (`h-11`).
2. **Hardcoded Color Swatches**: In `src/components/ProductCard.tsx:38-48`, product swatches are hardcoded by product ID rather than driven dynamically from the Prisma database schema.
3. **Simulated Auth & Checkout**: `login`, `register`, and `checkout` are client-side UI mocks without persistent sessions or backend API routes.

---

## 4. Conclusion & Actionable Recommendations

### 4.1 Accessibility & Interaction Fixes (Ready for Implementation)
1. **Focus Trap & Return Focus in `CartDrawer.tsx`**:
   - Add a focus trap handler that captures `Tab` / `Shift+Tab` and wraps between the first focusable element (`closeButtonRef`) and the last focusable element in the drawer.
   - Capture `document.activeElement` before opening and call `.focus()` on it when the drawer closes.
   - Lock body scroll on open (`document.body.style.overflow = 'hidden'`).
2. **Catalog Sort Touch Target**:
   - Change sort buttons in `src/app/products/page.tsx` from `h-9 px-3.5` to `h-10 px-4` or `h-11 px-4` to guarantee >= 44px touch targets on mobile.

### 4.2 Test Infrastructure Blueprint (Recommended Setup)
1. **Unit & Component Testing (`Vitest` + `React Testing Library` + `vitest-axe`)**:
   - Install dependencies:
     ```bash
     bun add -d vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom vitest-axe
     ```
   - Add `vitest.config.ts`:
     ```ts
     import { defineConfig } from 'vitest/config';
     import react from '@vitejs/plugin-react';
     import path from 'path';

     export default defineConfig({
       plugins: [react()],
       test: {
         environment: 'jsdom',
         setupFiles: ['./test/setup.ts'],
         alias: {
           '@': path.resolve(__dirname, './src'),
         },
       },
     });
     ```
   - Add `test/setup.ts`:
     ```ts
     import '@testing-library/jest-dom';
     import 'vitest-axe/extend-expect';

     Object.defineProperty(window, 'matchMedia', {
       writable: true,
       value: (query: string) => ({
         matches: false,
         media: query,
         onchange: null,
         addListener: () => {},
         removeListener: () => {},
         addEventListener: () => {},
         removeEventListener: () => {},
         dispatchEvent: () => {},
       }),
     });
     ```
   - Add scripts to `package.json`:
     - `"test": "vitest run"`
     - `"test:watch": "vitest"`
     - `"test:coverage": "vitest run --coverage"`

2. **E2E & Automated A11y Suite (`Playwright` + `@axe-core/playwright`)**:
   - Install dependencies:
     ```bash
     bun add -d @playwright/test @axe-core/playwright
     ```
   - Create `playwright.config.ts` and test files:
     - `e2e/a11y.spec.ts`: Automated axe audits for `/`, `/products`, `/product/[id]`, `/cart`, `/login`, `/register`.
     - `e2e/cart-drawer.spec.ts`: Focus trap, Escape key handling, return focus, add/remove item flows.
     - `e2e/forms.spec.ts`: Validation errors, `aria-invalid`, `role="alert"` announcements on blur and submit.

---

## 5. Verification Method

To independently verify these findings:
1. **Motion & Reduced Motion Verification**:
   - Inspect `src/app/globals.css:60-69` to verify global CSS overrides.
   - Inspect `src/components/CartDrawer.tsx:6,26,67`, `src/components/ProductGrid.tsx:5,47,85`, `src/components/Navbar.tsx:7,23,46`.
2. **Contrast & Tokens Verification**:
   - Inspect `src/app/globals.css:5-26` and `design-system/marifer/MASTER.md:35-53`.
   - Test `#c23b64` on `#ffffff` (5.1:1), `#7a5222` on `#fbf1de` (6.1:1), `#d4a15a` with `#241230` (6.3:1).
3. **Cart Drawer Focus Trap Inspection**:
   - Open `src/components/CartDrawer.tsx:29-38` and verify that no `keydown` tab-wrapping handler or return-focus ref exists.
4. **Form Semantics Inspection**:
   - Open `src/app/(auth)/login/page.tsx:84-151` and `src/app/(auth)/register/page.tsx:84-183` to verify `htmlFor`, `aria-invalid`, `aria-describedby`, and `role="alert"`.
5. **Test Infrastructure Inspection**:
   - Open `package.json` to verify the absence of `"test"` scripts and testing libraries.
