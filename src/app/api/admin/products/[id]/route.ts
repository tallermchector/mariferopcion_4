// src/app/api/admin/products/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Context) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Context) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.compareAtPrice !== undefined)
      updateData.compareAtPrice = body.compareAtPrice ? Number(body.compareAtPrice) : null;
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.featured !== undefined) updateData.featured = Boolean(body.featured);
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.images !== undefined)
      updateData.images = Array.isArray(body.images) ? JSON.stringify(body.images) : null;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Error al actualizar producto:', error);
    return NextResponse.json({ error: error.message || 'Error al actualizar' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Context) {
  try {
    const session = await getSessionFromCookies();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;

    // Eliminar referencias asociadas si las hay
    await prisma.cartItem.deleteMany({
      where: { productId: id },
    });

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json({ error: error.message || 'Error al eliminar' }, { status: 500 });
  }
}
