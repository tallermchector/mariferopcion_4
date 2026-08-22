// ./src/components/ProductGrid.tsx
'use client';

import React from 'react';
import { motion, Variants } from 'motion/react';
import Link from 'next/link';
import { Sparkles, ShoppingBag } from 'lucide-react';
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
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

export function ProductGrid({
  products,
  columns = 3,
  emptyMessage = 'No encontramos prendas que coincidan con tu búsqueda.',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FAF9F7] border border-[rgba(26,22,29,0.08)] flex items-center justify-center text-[#9A9196]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="font-display text-xl font-bold text-[#1A161D]">
          Colección en actualización
        </h3>
        <p className="mt-2 text-sm text-[#6B6368] font-body leading-relaxed">
          {emptyMessage}
        </p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#C84B6B] text-white text-xs font-semibold hover:bg-[#B03D5C] transition-colors shadow-xs"
          >
            Ver catálogo completo
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={gridColsClass}
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants} className="h-full">
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default ProductGrid;

