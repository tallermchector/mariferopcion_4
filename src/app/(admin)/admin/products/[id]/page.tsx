// src/app/(admin)/admin/products/[id]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { category: true },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!product) {
    notFound();
  }

  let parsedGallery: string[] = [];
  if (product.images) {
    try {
      parsedGallery = JSON.parse(product.images);
    } catch {
      parsedGallery = [];
    }
  }

  return (
    <ProductForm
      mode="edit"
      categories={categories}
      initialData={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        featured: product.featured,
        categoryId: product.categoryId,
        image: product.image,
        images: parsedGallery,
        rating: product.rating,
        numReviews: product.numReviews,
      }}
    />
  );
}
