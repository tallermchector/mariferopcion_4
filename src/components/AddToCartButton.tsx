// ./src/components/AddToCartButton.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Check, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { ProductType } from '@/lib/types';

interface AddToCartButtonProps {
  product: ProductType;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, setIsOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

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
        <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#6B6368]">
          Cantidad:
        </label>
        <div className="flex items-center rounded-full border border-[rgba(26,22,29,0.12)] bg-[#FAF9F7] p-1">
          <motion.button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            whileTap={{ scale: 0.88 }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#1A161D] hover:bg-white hover:shadow-xs transition-colors disabled:opacity-30 cursor-pointer"
            aria-label="Disminuir cantidad"
          >
            <Minus className="h-4 w-4" />
          </motion.button>
          <span className="w-12 text-center text-sm font-mono-tabular font-bold text-[#1A161D]">
            {quantity}
          </span>
          <motion.button
            onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
            disabled={quantity >= (product.stock || 99)}
            whileTap={{ scale: 0.88 }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#1A161D] hover:bg-white hover:shadow-xs transition-colors disabled:opacity-30 cursor-pointer"
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Botón principal de compra con animación táctil Marifer */}
      <div className="flex gap-3">
        <motion.button
          id={`add-to-cart-detail-${product.id}`}
          onClick={handleAdd}
          disabled={product.stock <= 0}
          whileTap={{ scale: 0.98, y: 1 }}
          className={`flex-1 flex items-center justify-center gap-3 h-[52px] sm:h-[56px] px-8 rounded-full text-sm font-semibold transition-all shadow-sm cursor-pointer ${
            added
              ? 'bg-[#3D8B5A] text-white'
              : 'bg-[#C84B6B] text-white hover:bg-[#B03D5C]'
          } disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed`}
        >
          {added ? (
            <>
              <Check className="h-5 w-5" />
              <span>¡Agregado a tu Bolsa!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5" />
              <span>{product.stock > 0 ? 'Agregar a la Bolsa' : 'Prenda Agotada'}</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

export default AddToCartButton;

