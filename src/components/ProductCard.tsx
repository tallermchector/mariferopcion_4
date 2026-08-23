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
      className="group relative flex flex-col justify-between rounded-[20px] bg-white p-4 border border-[#502A55]/10 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      <div>
        {/* Imagen 1:1 o 3:4 con radio 14px */}
        <Link
          href={`/product/${product.id}`}
          className="relative block aspect-square w-full overflow-hidden rounded-[14px] bg-[#FDFBF7] p-2"
          aria-label={`Ver ${product.name}`}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Badge píldora arriba-izquierda: rebaja / nuevo / popular */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discountPercent ? (
              <span className="oe-sticker bg-[#D97D54] text-white">
                -{discountPercent}%
              </span>
            ) : isNew ? (
              <span className="oe-sticker bg-[#D97D54] text-white">
                Nuevo
              </span>
            ) : isFreeShipping ? (
              <span className="oe-sticker bg-[#DFA84A] text-[#19091B]">
                Artesanal
              </span>
            ) : (
              <span className="oe-sticker bg-[#502A55] text-white">
                Popular
              </span>
            )}
          </div>
        </Link>

        {/* Info de producto */}
        <div className="pt-3 pb-2 text-center space-y-1">
          <Link href={`/product/${product.id}`} className="block group-hover:text-[#D97D54] transition-colors">
            <h3 className="font-serif text-[16px] font-bold text-[#19091B] leading-snug line-clamp-2 min-h-[44px]">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="font-mono-tabular font-extrabold text-[19px] text-[#502A55] leading-none">
              {formatPriceUYU(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="font-mono-tabular text-[13px] text-[#817E80] line-through">
                {formatPriceUYU(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Botón de compra OneEntry */}
      <div className="pt-2">
        <button
          id={`add-to-cart-btn-${product.id}`}
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full h-11 rounded-[30px] text-[13px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            added
              ? 'bg-[#146043] text-white'
              : 'bg-[#D97D54] text-white hover:bg-[#C46840] hover:shadow-md'
          } disabled:bg-[#f2e6f4] disabled:text-[#817E80] disabled:cursor-not-allowed`}
          aria-label={`Agregar ${product.name} al carrito`}
          aria-live="polite"
        >
          {added ? (
            <>
              <Check className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
              <span>Agregado</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 stroke-[2]" aria-hidden="true" />
              <span>{isAlreadyInCart ? '+1 al Carrito' : 'Agregar al Carrito'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
