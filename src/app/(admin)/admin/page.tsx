// src/app/(admin)/admin/page.tsx
import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Package, FolderTree, AlertTriangle, Plus, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [totalProducts, totalCategories, lowStockCount, featuredCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
    prisma.product.count({ where: { featured: true } }),
  ]);

  const recentProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 lg:p-8 rounded-[24px] border border-[#e8e3ec] shadow-marifer-sm">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-[#241230]">
            Panel de Control
          </h1>
          <p className="text-[14px] text-[#7d7384] mt-1">
            Gestioná el catálogo, stock y categorías de Marifer Ecommerce.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[#452453] text-white text-[14px] font-bold hover:bg-[#241230] shadow-marifer-btn transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Producto</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-[20px] border border-[#e8e3ec] shadow-marifer-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f2e6f4] text-[#452453] flex items-center justify-center shrink-0">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[13px] font-semibold text-[#7d7384]">Total Productos</span>
            <p className="font-display text-2xl font-extrabold text-[#241230]">{totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] border border-[#e8e3ec] shadow-marifer-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f8f5fa] text-[#452453] flex items-center justify-center shrink-0">
            <FolderTree className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[13px] font-semibold text-[#7d7384]">Categorías</span>
            <p className="font-display text-2xl font-extrabold text-[#241230]">{totalCategories}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] border border-[#e8e3ec] shadow-marifer-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fdebf0] text-[#c23b64] flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[13px] font-semibold text-[#7d7384]">Stock Bajo (≤ 5)</span>
            <p className="font-display text-2xl font-extrabold text-[#c23b64]">{lowStockCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] border border-[#e8e3ec] shadow-marifer-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#e8f5ec] text-[#146043] flex items-center justify-center shrink-0">
            <span className="text-lg font-bold">★</span>
          </div>
          <div>
            <span className="text-[13px] font-semibold text-[#7d7384]">Destacados</span>
            <p className="font-display text-2xl font-extrabold text-[#241230]">{featuredCount}</p>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-[24px] border border-[#e8e3ec] p-6 lg:p-8 shadow-marifer-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-[#241230]">
            Últimos Productos Agregados
          </h2>
          <Link
            href="/admin/products"
            className="text-[13px] font-bold text-[#452453] hover:underline inline-flex items-center gap-1"
          >
            Ver todos los productos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#e8e3ec] text-[#7d7384] text-[12px] uppercase tracking-wider font-bold">
                <th className="pb-3">Nombre</th>
                <th className="pb-3">Categoría</th>
                <th className="pb-3">Precio (UYU)</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e3ec]/60">
              {recentProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#fbf9fc] transition-colors">
                  <td className="py-3.5 font-bold text-[#241230]">{p.name}</td>
                  <td className="py-3.5 text-[#7d7384]">{p.category.name}</td>
                  <td className="py-3.5 font-mono text-[#241230]">${p.price.toLocaleString('es-UY')}</td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-bold ${
                        p.stock <= 5
                          ? 'bg-[#fdebf0] text-[#c23b64]'
                          : 'bg-[#e8f5ec] text-[#146043]'
                      }`}
                    >
                      {p.stock} un.
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-[13px] font-bold text-[#452453] hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
