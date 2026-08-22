// ./src/app/product/[id]/page.tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, ShieldCheck, Truck, RotateCcw, ChevronRight, Check, CreditCard, Sparkles, Heart } from 'lucide-react';
import prisma from '@/lib/prisma';
import ProductDetailGallery from '@/components/ProductDetailGallery';
import AddToCartButton from '@/components/AddToCartButton';
import ProductGrid from '@/components/ProductGrid';
import type { ProductType } from '@/lib/types';
import { formatPriceUYU, calculateInstallmentsUYU } from '@/lib/format';

export const revalidate = 60;

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  // Consulta directa a la base de datos (RSC)
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: id }, { slug: id }],
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Productos relacionados en la misma categoría
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    include: {
      category: true,
    },
  });

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const installmentInfo = calculateInstallmentsUYU(product.price, 6);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#6B6368] font-body">
        <Link href="/" className="hover:text-[#1A161D] transition-colors">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-[#1A161D] transition-colors">
          Catálogo
        </Link>
        {product.category && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-[#1A161D] transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[#1A161D] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Contenido Principal: Galería + Ficha Técnica y Compra */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Columna Izquierda: Galería Interactiva */}
        <div className="lg:col-span-7">
          <ProductDetailGallery
            mainImage={product.image}
            imagesJson={product.images}
            productName={product.name}
          />
        </div>

        {/* Columna Derecha: Información y Botón de Compra */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {product.category && (
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C84B6B]">
                {product.category.name} &bull; MARIFER MONTEVIDEO
              </span>
            )}
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#1A161D] tracking-tight mt-1 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-[#C4963A]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-[#C4963A] text-[#C4963A]'
                        : 'text-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-mono-tabular font-bold text-[#1A161D]">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-[#9A9196]">
                ({product.numReviews} reseñas de clientas)
              </span>
            </div>
          </div>

          {/* Bloque de Precios y Cuotas */}
          <div className="p-5 rounded-[20px] bg-white border border-[rgba(26,22,29,0.08)] shadow-diffused space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-[#6B6368] uppercase font-bold tracking-wider">Precio Contado</span>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="font-mono-tabular text-3xl sm:text-4xl font-extrabold text-[#1A161D]">
                    {formatPriceUYU(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="font-mono-tabular text-base text-[#9A9196] line-through">
                      {formatPriceUYU(product.compareAtPrice)}
                    </span>
                  )}
                </div>
              </div>

              {discountPercent && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C84B6B] text-white shadow-xs">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Cuotas sin recargo */}
            <div className="pt-3 border-t border-[rgba(26,22,29,0.06)] flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#1A161D] font-medium">
                <CreditCard className="w-4 h-4 text-[#C84B6B]" />
                Hasta 6 cuotas de
              </span>
              <span className="font-mono-tabular font-bold text-[#C84B6B]">
                {installmentInfo.installmentText} sin recargo
              </span>
            </div>
          </div>

          {/* Descripción de la Prenda */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1A161D]">
              Detalles & Caída de la Prenda
            </h3>
            <p className="text-sm text-[#6B6368] font-body leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Estado de Stock */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#3D8B5A]">
            <Check className="h-4 w-4" />
            <span>
              {product.stock > 0
                ? `Disponible en boutique (${product.stock} unidades para despacho inmediato)`
                : 'Prenda agotada temporalmente'}
            </span>
          </div>

          {/* Componente Cliente de Compra (Interactividad con framer motion) */}
          <div className="pt-2 border-t border-[rgba(26,22,29,0.08)]">
            <AddToCartButton product={product as unknown as ProductType} />
          </div>

          {/* Garantías y Beneficios Boutique */}
          <div className="space-y-3 pt-4 border-t border-[rgba(26,22,29,0.08)] text-xs text-[#6B6368] font-body">
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-[#3D8B5A] flex-shrink-0" />
              <span>
                {product.price >= 3500 ? (
                  <strong className="text-[#1A161D]">¡Envío Gratis a todo el país incluido!</strong>
                ) : (
                  'Envíos en Montevideo e Interior en 24 a 72 h hábiles.'
                )}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-[#C84B6B] flex-shrink-0" />
              <span>Aceptamos OCA, Visa, Master, Abitab y Redpagos.</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4 text-[#C4963A] flex-shrink-0" />
              <span>Cambios sin costo durante los primeros 30 días.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <div className="pt-14 border-t border-[rgba(26,22,29,0.08)] space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#C84B6B]">
                COMBINÁ TU LOOK
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1A161D] mt-1">
                Prendas Relacionadas
              </h2>
            </div>
            <Link
              href={`/products?category=${product.category?.slug}`}
              className="text-xs sm:text-sm font-semibold text-[#1A161D] hover:text-[#C84B6B] transition-colors underline underline-offset-4"
            >
              Ver más en {product.category?.name}
            </Link>
          </div>

          <ProductGrid products={relatedProducts as unknown as ProductType[]} columns={4} />
        </div>
      )}
    </div>
  );
}

