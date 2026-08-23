// src/components/admin/ProductTable.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit2, Trash2, Star, AlertCircle } from 'lucide-react';
import { AdminBadge } from './AdminBadge';
import { ConfirmDialog } from './ConfirmDialog';
import { useToast } from './Toast';

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  featured: boolean;
  image: string;
  category: {
    id: string;
    name: string;
  };
}

interface ProductTableProps {
  products: ProductItem[];
  onProductDeleted?: () => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const { showToast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar producto');
      showToast(`Producto "${selectedProduct.name}" eliminado correctamente`);
      setSelectedProduct(null);
      window.location.reload();
    } catch {
      showToast('No se pudo eliminar el producto. Intentalo de nuevo.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFeatured = async (product: ProductItem) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !product.featured }),
      });
      if (!res.ok) throw new Error('Error al actualizar estado');
      showToast(`Producto ${!product.featured ? 'destacado' : 'quitado de destacados'}`);
      window.location.reload();
    } catch {
      showToast('Error al actualizar estado destacado', 'error');
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-[24px] border border-[#e8e3ec] p-12 text-center space-y-4 shadow-marifer-sm">
        <div className="w-14 h-14 rounded-full bg-[#f2e6f4] text-[#452453] flex items-center justify-center mx-auto">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="font-display text-lg font-bold text-[#241230]">
          No se encontraron productos
        </h2>
        <p className="text-[14px] text-[#7d7384] max-w-sm mx-auto">
          Probá ajustando los filtros de búsqueda o creá un nuevo producto para tu catálogo.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-[24px] border border-[#e8e3ec] shadow-marifer-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e8e3ec] bg-[#fdfbfe] text-[#7d7384] text-[12px] uppercase font-bold tracking-wider">
                <th scope="col" className="py-4 px-5">Producto</th>
                <th scope="col" className="py-4 px-4">Categoría</th>
                <th scope="col" className="py-4 px-4">Precio (UYU)</th>
                <th scope="col" className="py-4 px-4">Stock</th>
                <th scope="col" className="py-4 px-4 text-center">Destacado</th>
                <th scope="col" className="py-4 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e3ec]/70 text-[14px]">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[#fbf9fc] transition-colors group">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-[#f2e6f4] shrink-0 border border-[#e8e3ec]">
                        <Image
                          src={p.image || 'https://picsum.photos/seed/marifer-fallback/200/300'}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="font-bold text-[#241230] hover:text-[#452453] hover:underline line-clamp-1"
                        >
                          {p.name}
                        </Link>
                        <span className="text-[12px] text-[#7d7384] font-mono">
                          /{p.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-[#403945] font-medium">{p.category?.name || '—'}</span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-mono text-[#241230] font-bold">
                      ${p.price.toLocaleString('es-UY')}
                      {p.compareAtPrice && (
                        <span className="block text-[12px] text-[#7d7384] line-through font-normal">
                          ${p.compareAtPrice.toLocaleString('es-UY')}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    {p.stock === 0 ? (
                      <AdminBadge variant="danger">Sin stock</AdminBadge>
                    ) : p.stock <= 5 ? (
                      <AdminBadge variant="warning">{p.stock} un. (Bajo)</AdminBadge>
                    ) : (
                      <AdminBadge variant="success">{p.stock} un.</AdminBadge>
                    )}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        p.featured
                          ? 'text-[#d4a15a] bg-[#fbf1de]'
                          : 'text-[#d3ccd8] hover:text-[#d4a15a] hover:bg-[#fbf1de]/50'
                      }`}
                      aria-label={p.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                      title={p.featured ? 'Destacado' : 'No destacado'}
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </button>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="p-2 rounded-xl text-[#7d7384] hover:text-[#452453] hover:bg-[#f2e6f4] transition-colors"
                        aria-label={`Editar ${p.name}`}
                        title="Editar producto"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="p-2 rounded-xl text-[#7d7384] hover:text-[#c23b64] hover:bg-[#fdebf0] transition-colors cursor-pointer"
                        aria-label={`Eliminar ${p.name}`}
                        title="Eliminar producto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(selectedProduct)}
        title="¿Eliminar producto?"
        description={`Estás a punto de eliminar "${selectedProduct?.name}". Esta acción no se puede deshacer y borrará el producto del catálogo.`}
        confirmText="Eliminar permanentemente"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};
