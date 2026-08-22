// ./src/app/products/page.tsx
import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductGrid from '@/components/ProductGrid';
import type { ProductType } from '@/lib/types';

export const revalidate = 60;

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    query?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const sortBy = params.sort || 'newest';
  const query = params.query;

  // Consultar categorías disponibles para los filtros
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  // Construir filtro para Prisma
  const whereClause: any = {};

  if (categorySlug && categorySlug !== 'all') {
    whereClause.category = {
      slug: categorySlug,
    };
  }

  if (query) {
    whereClause.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
    ];
  }

  // Ordenamiento
  let orderByClause: any = { createdAt: 'desc' };
  if (sortBy === 'price-asc') {
    orderByClause = { price: 'asc' };
  } else if (sortBy === 'price-desc') {
    orderByClause = { price: 'desc' };
  } else if (sortBy === 'rating') {
    orderByClause = { rating: 'desc' };
  } else if (sortBy === 'sale') {
    // Rebajas: solo prendas con precio anterior
    whereClause.compareAtPrice = { not: null };
  }

  // Consulta directa a la base de datos (RSC)
  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: orderByClause,
    include: {
      category: true,
    },
  });

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 space-y-8">
      {/* Header del Catálogo */}
      <div className="border-b border-[#e8e3ec] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#452453]">
            Catálogo Marifer
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#241230] tracking-tight mt-1">
            {activeCategory ? activeCategory.name : (sortBy === 'sale' ? 'Rebajas de temporada' : 'Todas las prendas')}
          </h1>
          <p className="text-[13px] sm:text-sm text-[#7d7384] font-body mt-1" aria-live="polite">
            {products.length} {products.length === 1 ? 'modelo disponible' : 'modelos disponibles para envío a todo el país'}
          </p>
        </div>

        {/* Barra de Ordenamiento */}
        <div className="flex items-center gap-2.5 max-w-full overflow-x-auto scrollbar-none pb-1 -mb-1">
          <span className="text-[13px] font-semibold text-[#7d7384] whitespace-nowrap">Ordenar:</span>
          <div className="flex flex-shrink-0 rounded-full border border-[#e8e3ec] bg-white p-1 text-[13px] whitespace-nowrap shadow-marifer-sm">
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug && { category: categorySlug }),
                sort: 'newest',
              }).toString()}`}
              className={`h-9 px-3.5 inline-flex items-center rounded-full font-medium transition-all ${
                sortBy === 'newest'
                  ? 'bg-[#452453] text-white font-semibold shadow-xs'
                  : 'text-[#7d7384] hover:text-[#241230]'
              }`}
            >
              Recientes
            </Link>
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug && { category: categorySlug }),
                sort: 'price-asc',
              }).toString()}`}
              className={`h-9 px-3.5 inline-flex items-center rounded-full font-medium transition-all ${
                sortBy === 'price-asc'
                  ? 'bg-[#452453] text-white font-semibold shadow-xs'
                  : 'text-[#7d7384] hover:text-[#241230]'
              }`}
            >Menor precio</Link>
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug && { category: categorySlug }),
                sort: 'price-desc',
              }).toString()}`}
              className={`h-9 px-3.5 inline-flex items-center rounded-full font-medium transition-all ${
                sortBy === 'price-desc'
                  ? 'bg-[#452453] text-white font-semibold shadow-xs'
                  : 'text-[#7d7384] hover:text-[#241230]'
              }`}
            >Mayor precio</Link>
            <Link
              href={`/products?${new URLSearchParams({
                ...(categorySlug && { category: categorySlug }),
                sort: 'sale',
              }).toString()}`}
              className={`h-9 px-3.5 inline-flex items-center rounded-full font-medium transition-all ${
                sortBy === 'sale'
                  ? 'bg-[#c23b64] text-white font-semibold shadow-xs'
                  : 'text-[#c23b64] hover:text-[#241230]'
              }`}
            >
              Rebajas
            </Link>
          </div>
        </div>
      </div>

      {/* Píldoras de Filtros por Categoría */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href={`/products?${sortBy ? `sort=${sortBy}` : ''}`}
          className={`h-11 px-5 inline-flex items-center rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${
            !categorySlug || categorySlug === 'all'
              ? 'bg-[#452453] text-white shadow-xs'
              : 'bg-white border border-[#e8e3ec] text-[#7d7384] hover:text-[#241230] hover:bg-[#f2e6f4]'
          }`}
        >
          Todas las prendas
        </Link>
        {categories.map((cat) => {
          const isSelected = categorySlug === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}${sortBy ? `&sort=${sortBy}` : ''}`}
              className={`h-11 px-5 inline-flex items-center rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-[#452453] text-white shadow-xs'
                  : 'bg-white border border-[#e8e3ec] text-[#7d7384] hover:text-[#241230] hover:bg-[#f2e6f4]'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* Grilla interactiva */}
      <ProductGrid
        products={products as unknown as ProductType[]}
        columns={4}
        emptyMessage="No encontramos prendas que coincidan con la categoría o filtros seleccionados."
      />
    </div>
  );
}


