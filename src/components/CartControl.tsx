// ./src/components/CartControl.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart, CartItem } from '@/context/CartContext';
import { formatPriceUYU } from '@/lib/format';

interface CartControlProps {
  item: CartItem;
}

export function CartControl({ item }: CartControlProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;
  const isMaxStock = quantity >= (product.stock || 99);

  return (
    <div
      id={`cart-item-${product.id}`}
      className="flex items-center gap-3.5 py-4 border-b border-[rgba(26,22,29,0.06)] last:border-0"
    >
      {/* Imagen Thumbnail */}
      <Link
        href={`/product/${product.id}`}
        className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-[16px] bg-[#FAF9F7] border border-[rgba(26,22,29,0.08)]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="64px"
          className="object-cover object-center"
          referrerPolicy="no-referrer"
        />
      </Link>

      {/* Info & Controles */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/product/${product.id}`}
              className="text-sm font-semibold text-[#1A161D] hover:text-[#C84B6B] transition-colors truncate block"
            >
              {product.name}
            </Link>
            <p className="text-xs text-[#6B6368] font-mono-tabular mt-0.5">
              {formatPriceUYU(product.price)} c/u
            </p>
          </div>

          <motion.button
            id={`remove-item-${product.id}`}
            onClick={() => removeItem(product.id)}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.08 }}
            className="text-[#9A9196] hover:text-[#C84B6B] p-1 transition-colors cursor-pointer"
            aria-label={`Eliminar ${product.name} del carrito`}
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          {/* Stepper de Cantidad */}
          <div className="flex items-center rounded-full border border-[rgba(26,22,29,0.12)] bg-[#FAF9F7] p-0.5">
            <motion.button
              id={`decrease-qty-${product.id}`}
              onClick={() => updateQuantity(product.id, quantity - 1)}
              whileTap={{ scale: 0.88 }}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[#1A161D] hover:bg-white hover:shadow-xs transition-all cursor-pointer"
              aria-label="Disminuir cantidad"
            >
              <Minus className="h-3 w-3" />
            </motion.button>

            <span className="w-7 text-center text-xs font-mono-tabular font-bold text-[#1A161D]">
              {quantity}
            </span>

            <motion.button
              id={`increase-qty-${product.id}`}
              onClick={() => updateQuantity(product.id, quantity + 1)}
              disabled={isMaxStock}
              whileTap={{ scale: 0.88 }}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[#1A161D] hover:bg-white hover:shadow-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-3 w-3" />
            </motion.button>
          </div>

          {/* Subtotal del item */}
          <span className="font-mono-tabular text-sm font-extrabold text-[#1A161D]">
            {formatPriceUYU(product.price * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartControl;

