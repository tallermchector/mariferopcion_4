// src/app/(admin)/admin/categories/page.tsx
import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Plus } from 'lucide-react';
import { CategoryTable } from '@/components/admin/CategoryTable';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-[#241230]">
            Categorías
          </h1>
          <p className="text-[14px] text-[#7d7384] mt-0.5">
            Organiza las secciones y familias de productos de tu tienda.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[#452453] text-white text-[14px] font-bold hover:bg-[#241230] shadow-marifer-btn transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Categoría</span>
        </Link>
      </div>

      <CategoryTable categories={categories} />
    </div>
  );
}
