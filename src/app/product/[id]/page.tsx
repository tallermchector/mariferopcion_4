// ./src/app/product/[id]/page.tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Truck, RotateCcw, ChevronRight, CreditCard } from 'lucide-react';
import prisma from '@/lib/prisma';
import ProductDetailGallery from '@/components/ProductDetailGallery';
import AddToCartButton from '@/components/AddToCartButton';
import ProductGrid from '@/components/ProductGrid';
import type { ProductType } from '@/lib/types';
import { formatPriceUYU, calculateInstallmentsUYU } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';

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
  const hasFreeShipping = product.price >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-16">
      {/* Breadcrumbs */}
      <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-[13px] text-[#7d7384] font-body">
        <Link href="/" className="hover:text-[#241230] transition-colors">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <Link href="/products" className="hover:text-[#241230] transition-colors">
          Catálogo
        </Link>
        {product.category && (
          <>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-[#241230] transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-[#241230] font-semibold truncate max-w-xs" aria-current="page">
          {product.name}
        </span>
      </nav>

      {/* Galería + ficha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <div className="lg:col-span-7">
          <ProductDetailGallery
            mainImage={product.image}
            imagesJson={product.images}
            productName={product.name}
          />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div>
            {product.category && (
              <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#452453]">
                {product.category.name} · Marifer Montevideo
              </span>
            )}
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#241230] tracking-tight mt-1 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-3">
              <div
                className="flex items-center gap-1 text-[#d4a15a]"
                role="img"
                aria-label={`${product.rating.toFixed(1)} de 5 estrellas`}
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden="true"
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-[#d4a15a] text-[#d4a15a]'
                        : 'text-[#e3cde8]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[13px] font-mono-tabular font-bold text-[#241230]">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-[13px] text-[#7d7384]">
                (<span className="font-mono-tabular font-semibold">{product.numReviews}</span> reseñas de clientas)
              </span>
            </div>
          </div>

          {/* Precio y cuotas */}
          <div className="p-5 rounded-[20px] bg-white border border-[#e8e3ec] shadow-marifer-sm space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <span className="text-[12px] text-[#7d7384] uppercase font-bold tracking-wider">Precio contado</span>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="font-mono-tabular text-3xl sm:text-4xl font-extrabold text-[#241230]">
                    {formatPriceUYU(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="font-mono-tabular text-base text-[#7d7384] line-through">
                      <span className="sr-only">Antes </span>
                      {formatPriceUYU(product.compareAtPrice)}
                    </span>
                  )}
                </div>
              </div>

              {discountPercent && (
                <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-[#c23b64] text-white font-mono-tabular">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="pt-3 border-t border-[#e8e3ec] flex items-center justify-between text-[13px]">
              <span className="flex items-center gap-1.5 text-[#241230] font-medium">
                <CreditCard className="w-4 h-4 text-[#452453]" aria-hidden="true" />
                6 cuotas sin recargo de
              </span>
              <span className="font-mono-tabular font-bold text-[#452453]">
                {installmentInfo.installmentText}
              </span>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#241230]">
              Detalles y caída de la prenda
            </h2>
            <p className="text-[15px] text-[#403945] font-body leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock */}
          <div className={`flex items-center gap-2.5 text-[13px] font-semibold ${product.stock > 0 ? "text-[#146043]" : "text-[#7d7384]"}`}>
            <span
              aria-hidden="true"
              className={`dot-pulse inline-block h-2 w-2 rounded-full ${product.stock > 0 ? "bg-[#1f8a5f] text-[#1f8a5f]" : "bg-[#7d7384] text-[#7d7384]"}`}
            />
            <span>
              {product.stock > 0 ? (
                <>Disponible: <span className="font-mono-tabular font-bold">{product.stock}</span> unidades para despacho inmediato</>
              ) : (
                'Prenda agotada por el momento'
              )}
            </span>
          </div>

          <div className="pt-2 border-t border-[#e8e3ec]">
            <AddToCartButton product={product as unknown as ProductType} />
          </div>

          {/* Beneficios */}
          <ul className="space-y-3 pt-4 border-t border-[#e8e3ec] text-[13px] text-[#403945] font-body">
            <li className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-[#146043] flex-shrink-0" aria-hidden="true" />
              <span>
                {hasFreeShipping ? (
                  <strong className="text-[#241230]">Envío gratis a todo el país incluido</strong>
                ) : (
                  'Envíos a Montevideo e Interior en 24 a 72 h hábiles.'
                )}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-[#452453] flex-shrink-0" aria-hidden="true" />
              <span>Aceptamos OCA, Visa, Master, Abitab y Redpagos.</span>
            </li>
            <li className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4 text-[#d4a15a] flex-shrink-0" aria-hidden="true" />
              <span>Cambios sin costo durante los primeros 30 días.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Relacionados */}
      {relatedProducts.length > 0 && (
        <div className="pt-14 border-t border-[#e8e3ec] space-y-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#452453]">
                Combiná tu look
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#241230] mt-1">
                Prendas relacionadas
              </h2>
            </div>
            <Link
              href={`/products?category=${product.category?.slug}`}
              className="text-[13px] sm:text-[14px] font-semibold text-[#452453] hover:text-[#241230] transition-colors underline underline-offset-4 whitespace-nowrap"
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
