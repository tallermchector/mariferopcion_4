// ./src/components/ProductGrid.tsx
'use client';

import React from 'react';
import { motion, Variants, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import EmptyIllustration from "./EmptyIllustration";
import ProductCard from './ProductCard';
import type { ProductType } from '@/lib/types';

interface ProductGridProps {
  products: ProductType[];
  columns?: 3 | 4;
  emptyMessage?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

const staticVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

export function ProductGrid({
  products,
  columns = 3,
  emptyMessage = 'No encontramos prendas que coincidan con tu búsqueda.',
}: ProductGridProps) {
  const reduceMotion = useReducedMotion();

  if (products.length === 0) {
    return (
      <div className="py-20 px-4 text-center max-w-md mx-auto">
        <EmptyIllustration className="mx-auto mb-5 h-28 w-40" />
        <h3 className="font-display text-xl font-bold text-[#241230]">
          No hay prendas para mostrar
        </h3>
        <p className="mt-2 text-[15px] text-[#403945] font-body leading-relaxed">
          {emptyMessage}
        </p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-[#452453] text-white text-[14px] font-semibold hover:bg-[#241230] transition-colors shadow-marifer-btn"
          >
            Ver todo el catálogo
          </Link>
        </div>
      </div>
    );
  }

  const gridColsClass =
    columns === 4
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6'
      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';

  return (
    <motion.div
      id="product-grid-container"
      variants={reduceMotion ? staticVariants : containerVariants}
      initial="hidden"
      animate="visible"
      className={gridColsClass}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={reduceMotion ? staticVariants : itemVariants} className="h-full">
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default ProductGrid;
