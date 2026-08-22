// ./src/components/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { ProductType } from '@/lib/types';
import { formatPriceUYU } from '@/lib/format';

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
  const isFreeShipping = product.price >= 2500;

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
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
            referrerPolicy="no-referrer"
            priority={product.featured}
          />

          {/* Badge píldora arriba-izquierda (frambuesa "-32%", violeta "NUEVO", dorado "ENVÍO GRATIS") */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {discountPercent ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-[#d94f78] text-white">
                -{discountPercent}%
              </span>
            ) : isNew ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-[#452453] text-white">
                NUEVO
              </span>
            ) : isFreeShipping ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-[#d4a15a] text-white">
                ENVÍO GRATIS
              </span>
            ) : null}
          </div>
        </Link>

        {/* Info de producto */}
        <div className="pt-3 pb-1 space-y-1">
          {/* Categoría en mayúsculas 12px gris (#7d7384) */}
          <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#7d7384] block">
            {product.category?.name || 'MARIFER'}
          </span>

          {/* Nombre 17px Outfit (#241230) */}
          <Link href={`/product/${product.id}`} className="block group-hover:text-[#452453] transition-colors">
            <h3 className="font-display text-[17px] font-bold text-[#241230] leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Precio 20px 800 (#241230) + precio anterior tachado gris (#7d7384) */}
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="font-display font-extrabold text-[20px] text-[#241230] font-mono-tabular leading-none">
              {formatPriceUYU(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="font-mono-tabular text-[13px] text-[#7d7384] line-through">
                {formatPriceUYU(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Fila inferior: puntos de color (12px) + rango de talles "S – L" + botón de compra rápida */}
      <div className="pt-2 mt-2 flex items-center justify-between border-t border-[#e8e3ec]">
        <div className="flex items-center gap-3">
          {/* Fila de 2–3 puntos de color (12px) */}
          <div className="flex items-center gap-1.5">
            {colors.map((c, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full border border-black/10 shadow-xs"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Rango de talles "S – L" */}
          <span className="text-[12px] font-medium text-[#7d7384]">
            S – L
          </span>
        </div>

        {/* Botón táctil min 44px */}
        <button
          id={`add-to-cart-btn-${product.id}`}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`h-9 px-3 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            added
              ? 'bg-[#146043] text-white'
              : 'bg-[#452453] text-white hover:bg-[#241230] shadow-marifer-btn'
          } disabled:bg-[#f2e6f4] disabled:text-[#7d7384] disabled:cursor-not-allowed`}
          aria-label={`Agregar ${product.name} al carrito`}
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Listo</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-3.5 w-3.5 stroke-[2]" />
              <span>{isAlreadyInCart ? '+1' : 'Sumar'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;


