// src/components/admin/ProductFilters.tsx
'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, RotateCcw } from 'lucide-react';
import { AdminSelect } from './AdminSelect';

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: CategoryOption[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ categories }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const category = searchParams.get('category') || '';
  const featured = searchParams.get('featured') || '';
  const stock = searchParams.get('stock') || '';

  const updateFilters = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set(key, val);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('query', query);
  };

  const handleReset = () => {
    setQuery('');
    router.push(pathname);
  };

  const hasActiveFilters = Boolean(
    searchParams.get('query') ||
    searchParams.get('category') ||
    searchParams.get('featured') ||
    searchParams.get('stock')
  );

  return (
    <div className="bg-white p-5 rounded-[20px] border border-[#e8e3ec] shadow-marifer-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Búsqueda por texto */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <label htmlFor="filter-search" className="sr-only">
            Buscar productos
          </label>
          <input
            id="filter-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o descripción…"
            className="w-full h-11 rounded-xl border border-[#d3ccd8] bg-white pl-10 pr-4 text-[14px] text-[#241230] placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3]"
          />
          <Search className="h-4 w-4 text-[#7d7384] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        {/* Categoría */}
        <AdminSelect
          options={[
            { value: '', label: 'Todas las Categorías' },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
          value={category}
          onChange={(e) => updateFilters('category', e.target.value)}
          aria-label="Filtrar por categoría"
        />

        {/* Destacados */}
        <AdminSelect
          options={[
            { value: '', label: 'Destacados: Todos' },
            { value: 'true', label: 'Solo Destacados' },
            { value: 'false', label: 'No Destacados' },
          ]}
          value={featured}
          onChange={(e) => updateFilters('featured', e.target.value)}
          aria-label="Filtrar por estado destacado"
        />

        {/* Stock */}
        <AdminSelect
          options={[
            { value: '', label: 'Stock: Todos' },
            { value: 'low', label: 'Stock Bajo (≤ 5)' },
            { value: 'out', label: 'Sin Stock (0)' },
            { value: 'available', label: 'Disponible (> 0)' },
          ]}
          value={stock}
          onChange={(e) => updateFilters('stock', e.target.value)}
          aria-label="Filtrar por estado de inventario"
        />
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end pt-1">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#c23b64] hover:underline cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Limpiar filtros</span>
          </button>
        </div>
      )}
    </div>
  );
};
