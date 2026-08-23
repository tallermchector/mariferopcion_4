// src/components/admin/CategoryTable.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2, AlertCircle } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import { useToast } from './Toast';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: {
    products: number;
  };
}

interface CategoryTableProps {
  categories: CategoryItem[];
}

export const CategoryTable: React.FC<CategoryTableProps> = ({ categories }) => {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${selectedCategory.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al eliminar categoría');
      }
      showToast(`Categoría "${selectedCategory.name}" eliminada`);
      setSelectedCategory(null);
      window.location.reload();
    } catch (err: any) {
      showToast(err.message || 'No se pudo eliminar la categoría.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-[24px] border border-[#e8e3ec] p-12 text-center space-y-4 shadow-marifer-sm">
        <div className="w-14 h-14 rounded-full bg-[#f2e6f4] text-[#452453] flex items-center justify-center mx-auto">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="font-display text-lg font-bold text-[#241230]">
          No hay categorías creadas
        </h2>
        <p className="text-[14px] text-[#7d7384] max-w-sm mx-auto">
          Creá tu primera categoría para organizar las prendas del catálogo.
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
                <th scope="col" className="py-4 px-5">Categoría</th>
                <th scope="col" className="py-4 px-4">Slug</th>
                <th scope="col" className="py-4 px-4">Descripción</th>
                <th scope="col" className="py-4 px-4">Productos</th>
                <th scope="col" className="py-4 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e3ec]/70 text-[14px]">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-[#fbf9fc] transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#f2e6f4] shrink-0 border border-[#e8e3ec]">
                        <Image
                          src={c.image || 'https://picsum.photos/seed/marifer-cat-default/200/200'}
                          alt={c.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-[#241230]">{c.name}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-[13px] font-mono text-[#7d7384]">/{c.slug}</span>
                  </td>

                  <td className="py-4 px-4 max-w-xs truncate text-[#7d7384]">
                    {c.description || '—'}
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-[#f2e6f4] text-[#452453]">
                      {c._count.products} productos
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => setSelectedCategory(c)}
                      className="p-2 rounded-xl text-[#7d7384] hover:text-[#c23b64] hover:bg-[#fdebf0] transition-colors cursor-pointer"
                      aria-label={`Eliminar ${c.name}`}
                      title="Eliminar categoría"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(selectedCategory)}
        title="¿Eliminar categoría?"
        description={`Estás a punto de eliminar "${selectedCategory?.name}". Si tiene productos asignados, estos también podrían verse afectados.`}
        confirmText="Eliminar categoría"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setSelectedCategory(null)}
      />
    </>
  );
};
