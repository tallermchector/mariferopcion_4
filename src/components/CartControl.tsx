// ./src/components/CartControl.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart, CartItem } from '@/context/CartContext';
import { formatPriceUYU } from '@/lib/format';

interface CartControlProps {
  item: CartItem;
}

export function CartControl({ item }: CartControlProps) {
  const { updateQuantity, removeItem } = useCart();
  const reduceMotion = useReducedMotion();
  const { product, quantity } = item;
  const isMaxStock = quantity >= (product.stock || 99);
  const tap = reduceMotion ? undefined : { scale: 0.9 };

  return (
    <div
      id={`cart-item-${product.id}`}
      className="flex items-start gap-3.5 py-4"
    >
      {/* Miniatura */}
      <Link
        href={`/product/${product.id}`}
        className="relative h-24 w-[72px] flex-shrink-0 overflow-hidden rounded-[12px] bg-[#f2e6f4] border border-[#e8e3ec]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="72px"
          className="object-cover object-center"
          referrerPolicy="no-referrer"
        />
      </Link>

      {/* Info y controles */}
      <div className="flex flex-1 flex-col min-w-0 gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/product/${product.id}`}
              className="text-[14px] font-semibold text-[#241230] hover:text-[#452453] transition-colors truncate block"
            >
              {product.name}
            </Link>
            <p className="text-[12px] text-[#7d7384] font-mono-tabular mt-0.5">
              {formatPriceUYU(product.price)} c/u
            </p>
          </div>

          <motion.button
            id={`remove-item-${product.id}`}
            type="button"
            onClick={() => removeItem(product.id)}
            whileTap={tap}
            className="-mt-2 -mr-2 w-11 h-11 flex items-center justify-center rounded-full text-[#7d7384] hover:text-[#c23b64] hover:bg-[#f2e6f4] transition-colors cursor-pointer flex-shrink-0"
            aria-label={`Quitar ${product.name} de la bolsa`}
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* Stepper de cantidad: targets de 44px */}
          <div
            className="flex items-center rounded-full border border-[#e8e3ec] bg-white"
            role="group"
            aria-label={`Cantidad de ${product.name}`}
          >
            <motion.button
              id={`decrease-qty-${product.id}`}
              type="button"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              whileTap={tap}
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#241230] hover:bg-[#f2e6f4] transition-colors cursor-pointer"
              aria-label={quantity === 1 ? 'Quitar prenda' : 'Restar una unidad'}
            >
              <Minus className="h-4 w-4" />
            </motion.button>

            <span
              className="w-8 text-center text-[14px] font-mono-tabular font-bold text-[#241230]"
              aria-live="polite"
            >
              {quantity}
            </span>

            <motion.button
              id={`increase-qty-${product.id}`}
              type="button"
              onClick={() => updateQuantity(product.id, quantity + 1)}
              disabled={isMaxStock}
              whileTap={tap}
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#241230] hover:bg-[#f2e6f4] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Sumar una unidad"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>

          <span className="font-mono-tabular text-[15px] font-extrabold text-[#241230]">
            {formatPriceUYU(product.price * quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartControl;
