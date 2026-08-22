# Test Infrastructure Documentation

## Overview
The testing infrastructure for Marifer E-commerce is powered by **Vitest**, **React Testing Library**, **jsdom**, and **vitest-axe** (Axe Core WCAG 2.2). It is organized following a 4-tier testing hierarchy to ensure strict behavioral correctness, boundary safety, cross-feature integration, and accessible user journeys.

---

## Tooling & Dependencies

| Tool | Role | Configuration |
|---|---|---|
| **Vitest** | Fast modern test runner with native ESM & TypeScript support | `vitest.config.ts` |
| **@testing-library/react** | Component rendering and user interaction simulation | React 19 compatible |
| **@testing-library/user-event** | Realistic browser event dispatching (clicks, typing, keyboard) | Setup in individual suites |
| **jsdom** | In-memory DOM implementation for Node.js environment | Configured in Vitest environment |
| **vitest-axe** | Automated WCAG 2.2 AA accessibility audits | Matchers extended in `test/setup.ts` |
| **@testing-library/jest-dom** | Custom DOM element matchers (`toBeInTheDocument`, `toBeDisabled`, etc.) | Configured in `test/setup.ts` |

---

## Directory Layout

```
test/
├── setup.ts                                # Global Vitest setup, matchers, Next.js mocks
├── test-utils.tsx                          # Test fixtures, mock products, renderWithCart wrapper
├── tier1-features/                         # Tier 1: Feature Coverage (Isolated Units & Components)
│   ├── format.test.ts                      # formatPriceUYU, formatInstallments, calculateInstallmentsUYU
│   ├── shipping.test.ts                    # FREE_SHIPPING_THRESHOLD ($3500) and SHIPPING_COST ($220)
│   ├── ProductCard.test.tsx                # Badges, pricing, stock limits, quick add
│   ├── CartControl.test.tsx                # Stepper, 44px tap targets, trash button
│   ├── AddToCartButton.test.tsx            # Quantity selector, stock bounds, PDP CTA
│   ├── Navbar.test.tsx                     # Logo, nav links, announce bar, search, mobile menu
│   └── EmptyIllustration.test.tsx          # SVG illustration rendering and a11y
├── tier2-boundaries/                       # Tier 2: Boundary & Corner Cases
│   └── boundaries.test.tsx                 # Zero cart, stock limits, $3499 vs $3500 threshold, discounts
├── tier3-cross-features/                   # Tier 3: Cross-Feature Combinations & State Integration
│   └── cart-integration.test.tsx          # CartContext -> CartDrawer, quick add, promo code application
└── tier4-application-a11y/                 # Tier 4: Real-World Applications & A11y Scenarios
    └── journey-and-a11y.test.tsx           # Full checkout journey, WCAG 2.2 axe audits, Escape key dismiss
```

---

## 4-Tier Testing Methodology

### Tier 1: Feature Coverage (Isolated Units & Components)
- Unit tests for UYU currency formatting, installment breakdowns, and shipping constants.
- Component rendering tests in isolation (ProductCard, CartControl, AddToCartButton, Navbar, EmptyIllustration).
- Verification of default props, labels, prices, and disabled states.

### Tier 2: Boundary & Corner Cases
- Zero-item cart states (subtotal $0, shipping $0, total $0, empty illustration).
- Stock boundary caps (adding beyond available stock, quantity stepper bounds).
- Free shipping threshold edge: exactly $3499 (shipping $220) vs $3500 (free shipping $0) vs $3501 ($0).
- Discount calculations (equal compare-at-price, lower compare-at-price, whitespace handling in promo codes).

### Tier 3: Cross-Feature Combinations & State Integration
- State synchronization: CartContext updates reflecting across Navbar badge, CartDrawer, and CartPageContent.
- Quick-add from catalog / PDP triggering CartDrawer auto-open.
- Promo code application applying 10% discounts across subtotal and installment figures.
- Quantity decrementing down to 0 automatically evicting item from cart.

### Tier 4: Real-World Applications & Accessibility Scenarios
- End-to-end shopping journey simulation (catalog browsing -> PDP selection -> cart drawer -> checkout review -> promo application -> order confirmation with generated tracking ID).
- Automated WCAG 2.2 AA accessibility audits with `axe()` on all key components.
- Keyboard navigation (Escape key dismissing CartDrawer, focus management).
- Support for `prefers-reduced-motion`.

---

## Test Execution Commands

```bash
# Run all tests once
pnpm test
# or
npm test

# Run tests in watch mode
pnpm run test:watch
# or
npm run test:watch

# Run a specific tier
pnpm vitest run test/tier1-features
pnpm vitest run test/tier2-boundaries
pnpm vitest run test/tier3-cross-features
pnpm vitest run test/tier4-application-a11y
```
