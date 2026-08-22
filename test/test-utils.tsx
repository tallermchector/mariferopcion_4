import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { CartProvider } from '@/context/CartContext';
import type { ProductType } from '@/lib/types';

export const mockProduct1: ProductType = {
  id: 'prod-1',
  name: 'Vestido Lino Lucía',
  slug: 'vestido-lino-lucia',
  description: 'Vestido midi confeccionado en 100% lino uruguayo.',
  price: 3890,
  compareAtPrice: 4890,
  image: '/images/products/vestido-lucia.webp',
  images: JSON.stringify(['/images/products/vestido-lucia.webp']),
  rating: 4.9,
  numReviews: 38,
  stock: 5,
  featured: true,
  categoryId: 'cat-vestidos',
  category: {
    id: 'cat-vestidos',
    name: 'Vestidos',
    slug: 'vestidos',
    description: 'Vestidos de lino',
    image: '/images/categories/vestidos.webp',
  },
};

export const mockProduct2: ProductType = {
  id: 'prod-2',
  name: 'Blusa Seda Ana',
  slug: 'blusa-seda-ana',
  description: 'Blusa en seda lavada con corte fluido.',
  price: 2490,
  compareAtPrice: null,
  image: '/images/products/blusa-ana.webp',
  images: JSON.stringify(['/images/products/blusa-ana.webp']),
  rating: 4.8,
  numReviews: 24,
  stock: 3,
  featured: false,
  categoryId: 'cat-blusas',
  category: {
    id: 'cat-blusas',
    name: 'Blusas',
    slug: 'blusas',
    description: 'Blusas y camisas',
    image: '/images/categories/blusas.webp',
  },
};

export const mockOutOfStockProduct: ProductType = {
  id: 'prod-out',
  name: 'Falda Agotada',
  slug: 'falda-agotada',
  description: 'Falda de lino sin stock disponible.',
  price: 1990,
  compareAtPrice: null,
  image: '/images/products/falda.webp',
  images: null,
  rating: 4.5,
  numReviews: 12,
  stock: 0,
  featured: false,
  categoryId: 'cat-faldas',
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialCart?: { product: ProductType; quantity: number }[];
}

export function renderWithCart(ui: React.ReactElement, options?: CustomRenderOptions) {
  if (options?.initialCart && typeof window !== 'undefined') {
    window.localStorage.setItem('marifer_ecommerce_cart', JSON.stringify(options.initialCart));
  }

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}
