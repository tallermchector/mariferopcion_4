// src/app/(admin)/admin/products/page.tsx
import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Plus } from 'lucide-react';
import { ProductTable } from '@/components/admin/ProductTable';
import { ProductFilters } from '@/components/admin/ProductFilters';
import { Pagination } from '@/components/admin/Pagination';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    query?: string;
    category?: string;
    featured?: string;
    stock?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Math.max(1, parseInt(resolvedSearchParams.page || '1', 10));
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const query = resolvedSearchParams.query || '';
  const categoryId = resolvedSearchParams.category || '';
  const featured = resolvedSearchParams.featured;
  const stock = resolvedSearchParams.stock;

  // Build Prisma where clause
  const where: any = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { slug: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (featured === 'true') {
    where.featured = true;
  } else if (featured === 'false') {
    where.featured = false;
  }

  if (stock === 'low') {
    where.stock = { lte: 5, gt: 0 };
  } else if (stock === 'out') {
    where.stock = 0;
  } else if (stock === 'available') {
    where.stock = { gt: 0 };
  }

  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-[#241230]">
            Gestión de Productos
          </h1>
          <p className="text-[14px] text-[#7d7384] mt-0.5">
            Administrá el catálogo de prendas, precios, fotos y stock disponible.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[#452453] text-white text-[14px] font-bold hover:bg-[#241230] shadow-marifer-btn transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Producto</span>
        </Link>
      </div>

      {/* Filters */}
      <ProductFilters categories={categories} />

      {/* Table */}
      <ProductTable products={products} />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalCount}
        pageSize={pageSize}
      />
    </div>
  );
}
