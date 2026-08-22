// ./src/components/AddToCartButton.tsx
'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ShoppingBag, Check, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { ProductType } from '@/lib/types';

interface AddToCartButtonProps {
  product: ProductType;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, setIsOpen } = useCart();
  const reduceMotion = useReducedMotion();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const maxStock = product.stock || 99;
  const tap = reduceMotion ? undefined : { scale: 0.9 };

  const handleAdd = () => {
    if (product.stock <= 0) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setIsOpen(true);
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* Selector de cantidad */}
      <div className="flex items-center gap-4">
        <span id="qty-label" className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7d7384]">
          Cantidad
        </span>
        <div
          className="flex items-center rounded-full border border-[#e8e3ec] bg-white"
          role="group"
          aria-labelledby="qty-label"
        >
          <motion.button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            whileTap={tap}
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#241230] hover:bg-[#f2e6f4] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Restar una unidad"
          >
            <Minus className="h-4 w-4" />
          </motion.button>
          <span className="w-10 text-center text-[15px] font-mono-tabular font-bold text-[#241230]" aria-live="polite">
            {quantity}
          </span>
          <motion.button
            type="button"
            onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
            disabled={quantity >= maxStock}
            whileTap={tap}
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#241230] hover:bg-[#f2e6f4] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Sumar una unidad"
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* CTA principal */}
      <motion.button
        id={`add-to-cart-detail-${product.id}`}
        type="button"
        onClick={handleAdd}
        disabled={product.stock <= 0}
        whileTap={reduceMotion ? undefined : { scale: 0.98, y: 1 }}
        aria-live="polite"
        className={`w-full flex items-center justify-center gap-3 h-[52px] sm:h-[56px] px-8 rounded-full text-[15px] font-semibold transition-colors shadow-marifer-btn cursor-pointer ${
          added
            ? 'bg-[#146043] text-white'
            : 'bg-[#452453] text-white hover:bg-[#241230]'
        } disabled:bg-[#f2e6f4] disabled:text-[#7d7384] disabled:shadow-none disabled:cursor-not-allowed`}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" aria-hidden="true" />
            <span>Agregado a tu bolsa</span>
          </>
        ) : (
          <>
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <span>{product.stock > 0 ? 'Agregar a la bolsa' : 'Prenda agotada'}</span>
          </>
        )}
      </motion.button>
    </div>
  );
}

export default AddToCartButton;
