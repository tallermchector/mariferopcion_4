// ./test/tier5-adversarial/m1-adversarial.test.tsx
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { CartControl } from '@/components/CartControl';
import { AddToCartButton } from '@/components/AddToCartButton';
import { CartPageContent } from '@/components/CartPageContent';
import { EmptyIllustration } from '@/components/EmptyIllustration';
import { CartProvider } from '@/context/CartContext';
import { formatPriceUYU, calculateInstallmentsUYU } from '@/lib/format';
import type { ProductType } from '@/lib/types';

const SRC_DIR = path.resolve(__dirname, '../../src');

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

// Relative luminance and contrast ratio calculator (WCAG 2.2 standard)
function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace('#', '');
  const bigint = parseInt(cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function getsRGB(c: number): number {
  c = c / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function getLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * getsRGB(r) + 0.7152 * getsRGB(g) + 0.0722 * getsRGB(b);
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const mockProduct: ProductType = {
  id: 'prod-1',
  name: 'Vestido Lucía de Lino',
  slug: 'vestido-lucia-lino',
  description: 'Vestido de lino puro con caída suave y escote sutil.',
  price: 2890,
  compareAtPrice: 3490,
  featured: true,
  stock: 8,
  image: 'https://picsum.photos/seed/marifer-prod-1/600/800',
  images: JSON.stringify(['https://picsum.photos/seed/marifer-prod-1/600/800']),
  rating: 4.8,
  numReviews: 24,
  categoryId: 'cat-1',
  category: {
    id: 'cat-1',
    name: 'Vestidos',
    slug: 'vestidos',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Empirical Adversarial Audit — Milestone 1: Design Tokens, Typography & Contrast', () => {
  const allSourceFiles = getAllFiles(SRC_DIR);

  describe('Adversarial Check 1: Forbidden CSS Classes & Token Leakage', () => {
    it('contains zero generic neutral Tailwind classes (gray-*, slate-*, zinc-*, neutral-*, indigo-*, etc.) in src/', () => {
      const genericNeutralsRegex = /\b(text|bg|border|ring|stroke|fill)-(gray|slate|zinc|neutral|stone|indigo|amber|emerald|blue|red|yellow)-[0-9]{2,3}\b/g;
      const violations: { file: string; match: string }[] = [];

      allSourceFiles.forEach((file) => {
        const content = fs.readFileSync(file, 'utf-8');
        const matches = content.match(genericNeutralsRegex);
        if (matches) {
          matches.forEach((m) => {
            violations.push({ file: path.relative(SRC_DIR, file), match: m });
          });
        }
      });

      expect(violations).toEqual([]);
    });

    it('contains zero generic Tailwind box-shadows (shadow-xs, shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-2xl) unless custom marifer token', () => {
      const genericShadowRegex = /\bshadow-(xs|sm|md|lg|xl|2xl|inner)\b(?!\s*:\s*)(?!.*marifer)/g;
      const violations: { file: string; match: string }[] = [];

      allSourceFiles.forEach((file) => {
        const content = fs.readFileSync(file, 'utf-8');
        // Check for shadow-xs or shadow-sm without -marifer-
        const lines = content.split('\n');
        lines.forEach((line, lineIdx) => {
          // exclude comments and globals.css shadow definitions
          if (file.endsWith('globals.css')) return;
          const matches = line.match(/\bshadow-(xs|sm|md|lg|xl|2xl)\b/g);
          if (matches) {
            matches.forEach((m) => {
              // check if it's not part of shadow-marifer-*
              const isMarifer = line.includes(`shadow-marifer-`);
              // specifically check if bare shadow-xs or generic exists
              if (!line.includes(`shadow-marifer-${m.replace('shadow-', '')}`)) {
                violations.push({ file: `${path.relative(SRC_DIR, file)}:${lineIdx + 1}`, match: m });
              }
            });
          }
        });
      });

      expect(violations).toEqual([]);
    });

    it('contains zero deprecated or off-palette hex colors (e.g. #ebd7be, #C84B6B, #FAF9F7, #9A9196, #000000)', () => {
      const deprecatedHexCodes = ['#ebd7be', '#C84B6B', '#B03D5C', '#1A161D', '#6B6368', '#9A9196', '#FAF9F7', '#3D8B5A', '#C4963A'];
      const violations: { file: string; hex: string }[] = [];

      allSourceFiles.forEach((file) => {
        const content = fs.readFileSync(file, 'utf-8').toLowerCase();
        deprecatedHexCodes.forEach((hex) => {
          if (content.includes(hex.toLowerCase())) {
            violations.push({ file: path.relative(SRC_DIR, file), hex });
          }
        });
      });

      expect(violations).toEqual([]);
    });

    it('ensures text color in Footer uses accessible #caa8d3 instead of deprecated #d94f78', () => {
      const footerPath = path.join(SRC_DIR, 'components/Footer.tsx');
      const footerContent = fs.readFileSync(footerPath, 'utf-8');
      expect(footerContent).not.toContain('#d94f78');
      expect(footerContent).toContain('#caa8d3');
    });

    it('ensures all input focus rings across auth and checkout use focus:ring-[#caa8d3]', () => {
      const authFiles = [
        path.join(SRC_DIR, 'app/(auth)/login/page.tsx'),
        path.join(SRC_DIR, 'app/(auth)/register/page.tsx'),
        path.join(SRC_DIR, 'components/CartPageContent.tsx'),
      ];

      authFiles.forEach((file) => {
        const content = fs.readFileSync(file, 'utf-8');
        expect(content).toContain('focus:ring-[#caa8d3]');
        expect(content).not.toContain('focus:outline-none focus:border-[#452453] transition-shadow'); // must have focus:ring
      });
    });
  });

  describe('Adversarial Check 2: Tabular Number Rendering & JetBrains Mono Enforcement', () => {
    it('renders ProductCard price, compareAtPrice, and discount badge with font-mono-tabular', () => {
      const { container } = render(
        <CartProvider>
          <ProductCard product={mockProduct} />
        </CartProvider>
      );

      // Price
      const priceElement = screen.getByText('$ 2.890');
      expect(priceElement.className).toContain('font-mono-tabular');

      // Compare at price
      const comparePriceElement = screen.getByText('$ 3.490');
      expect(comparePriceElement.className).toContain('font-mono-tabular');

      // Discount badge
      const discountBadge = screen.getByText('-17%');
      expect(discountBadge.className).toContain('font-mono-tabular');
    });

    it('renders Navbar announcement bar threshold with font-mono-tabular', () => {
      render(
        <CartProvider>
          <Navbar />
        </CartProvider>
      );

      const announceBar = screen.getByText(/Envío gratis en compras desde/i);
      expect(announceBar.className).toContain('font-mono-tabular');
      expect(announceBar.textContent).toContain('$ 3.500');
    });

    it('renders CartControl unit price, quantity stepper number, and line total with font-mono-tabular', () => {
      const { container } = render(
        <CartProvider>
          <CartControl item={{ product: mockProduct, quantity: 3 }} />
        </CartProvider>
      );

      // Unit price
      const unitPrice = screen.getByText('$ 2.890 c/u');
      expect(unitPrice.className).toContain('font-mono-tabular');

      // Stepper quantity
      const qtyNumber = screen.getByText('3');
      expect(qtyNumber.className).toContain('font-mono-tabular');

      // Line total ($2890 * 3 = $8670)
      const lineTotal = screen.getByText('$ 8.670');
      expect(lineTotal.className).toContain('font-mono-tabular');
    });

    it('renders AddToCartButton quantity stepper with font-mono-tabular', () => {
      render(
        <CartProvider>
          <AddToCartButton product={mockProduct} />
        </CartProvider>
      );

      const qtyNumber = screen.getByText('1');
      expect(qtyNumber.className).toContain('font-mono-tabular');
    });

    it('renders CartPageContent prices, discounts, free shipping bar numbers, and total with font-mono-tabular', () => {
      // Preload cart with item in localStorage
      localStorage.setItem(
        'marifer_ecommerce_cart',
        JSON.stringify([{ product: mockProduct, quantity: 2 }])
      );

      render(
        <CartProvider>
          <CartPageContent />
        </CartProvider>
      );

      // Subtotal ($2890 * 2 = $5780)
      const subtotalElements = screen.getAllByText('$ 5.780');
      subtotalElements.forEach((el) => {
        expect(el.className).toContain('font-mono-tabular');
      });

      // Installments
      const installmentText = screen.getByText('$ 963');
      expect(installmentText.className).toContain('font-mono-tabular');
    });

    it('statically checks all pages for font-mono-tabular on critical metrics', () => {
      const pageChecks = [
        {
          file: 'app/products/page.tsx',
          expectedPhrases: ['<span className="font-mono-tabular font-semibold">{products.length}</span>'],
        },
        {
          file: 'app/product/[id]/page.tsx',
          expectedPhrases: [
            '{product.numReviews}</span>',
            'font-mono-tabular font-bold">{product.stock}</span>',
            'font-mono-tabular text-3xl sm:text-4xl font-extrabold text-[#241230]',
            'font-mono-tabular font-bold text-[#452453]',
            'font-mono-tabular',
          ],
        },
        {
          file: 'app/page.tsx',
          expectedPhrases: [
            'font-mono-tabular font-bold">{maxDiscount}%</span>',
            'font-mono-tabular whitespace-nowrap',
          ],
        },
        {
          file: 'components/CartDrawer.tsx',
          expectedPhrases: [
            '<span className="font-mono-tabular font-semibold">{totalItems}</span>',
            'font-mono-tabular text-[#241230]',
            'font-mono-tabular text-[#7d7384]',
            'font-mono-tabular font-bold text-[#241230]',
            'font-mono-tabular font-bold text-[#452453]',
            'font-mono-tabular text-lg',
          ],
        },
      ];

      pageChecks.forEach(({ file, expectedPhrases }) => {
        const filePath = path.join(SRC_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        expectedPhrases.forEach((phrase) => {
          expect(content).toContain(phrase);
        });
      });
    });
  });

  describe('Adversarial Check 3: WCAG 2.2 Color Contrast Ratios', () => {
    it('verifies AAA compliance (≥ 7:1) for secondary text and borders on dark plum background', () => {
      // #e3cde8 on #452453 (Navbar links)
      const ratioNav = getContrastRatio('#e3cde8', '#452453');
      expect(ratioNav).toBeGreaterThanOrEqual(7.0); // 8.7:1 AAA

      // #caa8d3 on #241230 (Footer links and accents)
      const ratioFooter = getContrastRatio('#caa8d3', '#241230');
      expect(ratioFooter).toBeGreaterThanOrEqual(7.0); // 8.3:1 AAA
    });

    it('verifies AA compliance (≥ 4.5:1) for all critical UI text pairs', () => {
      // Sale pink AA (#c23b64) on white (#ffffff)
      const ratioSaleText = getContrastRatio('#c23b64', '#ffffff');
      expect(ratioSaleText).toBeGreaterThanOrEqual(4.5); // 5.1:1 AA

      // White (#ffffff) on Sale pink AA (#c23b64) (Badge)
      const ratioSaleBadge = getContrastRatio('#ffffff', '#c23b64');
      expect(ratioSaleBadge).toBeGreaterThanOrEqual(4.5); // 5.1:1 AA

      // Announce Tobacco (#7a5222) on Crema (#fbf1de)
      const ratioAnnounce = getContrastRatio('#7a5222', '#fbf1de');
      expect(ratioAnnounce).toBeGreaterThanOrEqual(4.5); // 6.1:1 AA

      // Deep plum (#241230) on Gold badge (#d4a15a)
      const ratioGoldBadge = getContrastRatio('#241230', '#d4a15a');
      expect(ratioGoldBadge).toBeGreaterThanOrEqual(4.5); // 7.7:1 AAA

      // Lavender (#caa8d3) on Primary Plum (#452453) (Hero Eyebrow)
      const ratioHeroEyebrow = getContrastRatio('#caa8d3', '#452453');
      expect(ratioHeroEyebrow).toBeGreaterThanOrEqual(4.5); // 6.2:1 AA

      // Stock Green text (#146043) on White (#ffffff)
      const ratioStockText = getContrastRatio('#146043', '#ffffff');
      expect(ratioStockText).toBeGreaterThanOrEqual(4.5); // 7.3:1 AAA
    });

    it('verifies that low contrast combinations (e.g. white on gold, white on light sale pink) are strictly avoided in code', () => {
      // White on gold is 2.3:1 (forbidden)
      const whiteOnGold = getContrastRatio('#ffffff', '#d4a15a');
      expect(whiteOnGold).toBeLessThan(4.5);

      // Verify code never puts text-white on bg-[#d4a15a]
      allSourceFiles.forEach((file) => {
        const content = fs.readFileSync(file, 'utf-8');
        if (content.includes('bg-[#d4a15a]')) {
          expect(content).not.toMatch(/bg-\[#d4a15a\][^>]*text-white/);
          expect(content).toContain('text-[#241230]');
        }
      });
    });
  });
});
