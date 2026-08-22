// ./src/components/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { ProductType } from '@/lib/types';
import { formatPriceUYU } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';

interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const isAlreadyInCart = items.some((i) => i.product.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  // Descuento calculado
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  // Swatches de color por producto para la estética Marifer
  const productColors: Record<string, string[]> = {
    'prod-1': ['#452453', '#d94f78', '#241230'], // Vestido Lucía
    'prod-2': ['#ffffff', '#f2e6f4', '#452453'], // Blusa Ana
    'prod-3': ['#2b3a4a', '#546e7a'], // Jean Malena
    'prod-4': ['#e3cde8', '#d4a15a', '#452453'], // Buzo Rambla
    'prod-5': ['#ffffff', '#caa8d3', '#241230'],
    'prod-6': ['#d94f78', '#241230', '#f2e6f4'],
    'prod-7': ['#241230', '#7d7384', '#d4a15a'],
    'prod-8': ['#452453', '#241230'],
    'prod-9': ['#ffffff', '#e3cde8'],
  };

  const colors = productColors[product.id] || ['#452453', '#caa8d3', '#ffffff'];

  // Determinar badge
  const isNew = product.id === 'prod-3' || (!product.compareAtPrice && product.featured);
  const isFreeShipping = product.price >= FREE_SHIPPING_THRESHOLD;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col justify-between rounded-[14px] bg-[#ffffff] p-3 border border-[#e8e3ec] shadow-marifer-sm hover:-translate-y-0.5 hover:shadow-marifer-hover transition-all duration-200"
    >
      <div>
        {/* Imagen 3:4 con radio 10px */}
        <Link
          href={`/product/${product.id}`}
          className="relative block aspect-[3/4] w-full overflow-hidden rounded-[10px] bg-[#f2e6f4]"
          aria-label={`Ver ${product.name}`}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Badge píldora arriba-izquierda: rebaja / nuevo / envío gratis */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {discountPercent ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold tracking-wide bg-[#c23b64] text-white font-mono-tabular">
                -{discountPercent}%
              </span>
            ) : isNew ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold tracking-wide bg-[#452453] text-white">
                Nuevo
              </span>
            ) : isFreeShipping ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold tracking-wide bg-[#d4a15a] text-[#241230]">
                Envío gratis
              </span>
            ) : null}
          </div>
        </Link>

        {/* Info de producto */}
        <div className="pt-3 pb-1 space-y-1">
          <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#7d7384] block">
            {product.category?.name || 'Marifer'}
          </span>

          <Link href={`/product/${product.id}`} className="block group-hover:text-[#452453] transition-colors">
            <h3 className="font-display text-[17px] font-bold text-[#241230] leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="font-mono-tabular font-extrabold text-[20px] text-[#241230] leading-none">
              {formatPriceUYU(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="font-mono-tabular text-[13px] text-[#7d7384] line-through">
                <span className="sr-only">Antes </span>
                {formatPriceUYU(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Fila inferior: swatches + talles + compra rápida */}
      <div className="pt-2 mt-2 flex items-center justify-between gap-2 border-t border-[#e8e3ec]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {colors.map((c, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full border border-[#241230]/10"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <span className="text-[12px] font-medium text-[#7d7384]">S – L</span>
        </div>

        <button
          id={`add-to-cart-btn-${product.id}`}
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`h-11 px-4 rounded-full text-[13px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            added
              ? 'bg-[#146043] text-white'
              : 'bg-[#452453] text-white hover:bg-[#241230] shadow-marifer-btn'
          } disabled:bg-[#f2e6f4] disabled:text-[#7d7384] disabled:shadow-none disabled:cursor-not-allowed`}
          aria-label={`Agregar ${product.name} a la bolsa`}
          aria-live="polite"
        >
          {added ? (
            <>
              <Check className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
              <span>Listo</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 stroke-[2]" aria-hidden="true" />
              <span>{isAlreadyInCart ? '+1' : 'Sumar'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
