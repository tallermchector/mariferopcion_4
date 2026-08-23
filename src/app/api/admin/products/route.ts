// src/app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      description,
      price,
      compareAtPrice,
      stock,
      featured,
      categoryId,
      image,
      images,
      rating,
      numReviews,
    } = body;

    if (!name || !slug || !description || price === undefined || !categoryId || !image) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Comprobar slug único
    const existing = await prisma.product.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe un producto con este slug. Elegí uno diferente.' },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        stock: Number(stock) || 0,
        featured: Boolean(featured),
        categoryId,
        image,
        images: Array.isArray(images) ? JSON.stringify(images) : null,
        rating: rating ? Number(rating) : 4.8,
        numReviews: numReviews ? Number(numReviews) : 12,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error('Error al crear producto:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
