// ./src/components/ProductCard.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { ProductType } from '@/lib/types';
import { formatPriceUYU } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';

interface ProductCardProps {
  product: ProductType;
  priorityImage?: boolean;
}

export function ProductCard({ product, priorityImage = false }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const title = product.name || (product as any).title || 'Producto';

  const parsedImages: string[] = useMemo(() => {
    if (Array.isArray(product.images)) return product.images;
    if (typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback to product.image
      }
    }
    return [product.image || '/images/products/placeholder.webp'];
  }, [product.images, product.image]);

  const mainImage = parsedImages[0] || product.image || '/images/products/placeholder.webp';

  const hasDiscount = Boolean(
    product.compareAtPrice && product.compareAtPrice > product.price
  );
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const isFreeShipping = product.price >= FREE_SHIPPING_THRESHOLD;
  const isNew = product.id === 'prod-3' || (!hasDiscount && product.featured);

  const isAlreadyInCart = items.some((i) => i.product.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    addItem(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1800);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col justify-between rounded-[20px] bg-white p-4 border border-[#502A55]/10 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      <div>
        {/* Imagen del Producto con Badges y Favorito */}
        <Link
          href={`/product/${product.slug || product.id}`}
          className="relative block aspect-square w-full overflow-hidden rounded-[14px] bg-[#FDFBF7] p-2"
          aria-label={`Ver ${title}`}
        >
          <Image
            src={mainImage}
            alt={title}
            fill
            priority={priorityImage}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Badges y Stickers Superior */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {hasDiscount ? (
              <span className="oe-sticker bg-[#D97D54] text-white font-mono-tabular font-bold">
                -{discountPercent}%
              </span>
            ) : isNew ? (
              <span className="oe-sticker bg-[#502A55] text-white">
                Nuevo
              </span>
            ) : isFreeShipping ? (
              <span className="oe-sticker bg-[#D97D54] text-white font-medium">
                Envío gratis
              </span>
            ) : (
              <span className="oe-sticker bg-[#502A55] text-white">
                Popular
              </span>
            )}
          </div>

          {/* Botón Lista de Deseos (Favorito) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            aria-label={isWishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#502A55] shadow-md backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? 'fill-[#D97D54] text-[#D97D54]' : 'text-[#502A55]'
              }`}
            />
          </button>
        </Link>

        {/* Título, Categoría & Información de Precio */}
        <div className="pt-3 pb-2 text-center space-y-1">
          {product.category?.name && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97D54] block">
              {product.category.name}
            </span>
          )}

          <Link
            href={`/product/${product.slug || product.id}`}
            className="block group-hover:text-[#D97D54] transition-colors"
          >
            <h3 className="font-serif text-[16px] font-bold text-[#19091B] leading-snug line-clamp-2 min-h-[44px]">
              {title}
            </h3>
          </Link>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="font-mono-tabular font-extrabold text-[19px] text-[#502A55] leading-none">
              {formatPriceUYU(product.price)}
            </span>
            {hasDiscount && product.compareAtPrice && (
              <span className="font-mono-tabular text-[13px] text-[#817E80] line-through">
                {formatPriceUYU(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Botón Principal de Acción */}
      <div className="pt-2">
        <button
          id={`add-to-cart-btn-${product.id}`}
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          aria-live="polite"
          aria-label={
            product.stock <= 0
              ? `Agregar ${title} a la bolsa`
              : `Agregar ${title} a la bolsa`
          }
          className={`w-full h-11 rounded-[30px] text-[13px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            addedAnimation
              ? 'bg-[#146043] text-white scale-[1.02]'
              : 'bg-[#D97D54] text-white hover:bg-[#C46840] hover:shadow-md'
          } disabled:bg-[#f2e6f4] disabled:text-[#817E80] disabled:cursor-not-allowed`}
        >
          {addedAnimation ? (
            <>
              <Check className="h-4 w-4 stroke-[3]" aria-hidden="true" />
              <span>Listo</span>
            </>
          ) : product.stock <= 0 ? (
            <span>Sin Stock</span>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 stroke-[2]" aria-hidden="true" />
              <span>{isAlreadyInCart ? 'Sumar' : 'Sumar'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
