// src/app/(admin)/admin/products/new/page.tsx
import React from 'react';
import prisma from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return <ProductForm mode="create" categories={categories} />;
}
