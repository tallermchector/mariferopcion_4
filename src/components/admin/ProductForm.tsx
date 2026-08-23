// src/components/admin/ProductForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { AdminInput } from './AdminInput';
import { AdminTextarea } from './AdminTextarea';
import { AdminSelect } from './AdminSelect';
import { AdminCheckbox } from './AdminCheckbox';
import { AdminButton } from './AdminButton';
import { useToast } from './Toast';

export interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  featured: boolean;
  categoryId: string;
  image: string;
  images?: string[];
  rating?: number;
  numReviews?: number;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData?: ProductFormData;
  categories: CategoryOption[];
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export const ProductForm: React.FC<ProductFormProps> = ({ mode, initialData, categories }) => {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    compareAtPrice: initialData?.compareAtPrice || null,
    stock: initialData?.stock ?? 10,
    featured: initialData?.featured || false,
    categoryId: initialData?.categoryId || (categories[0]?.id || ''),
    image: initialData?.image || 'https://picsum.photos/seed/marifer-new/600/800',
    images: initialData?.images || [],
    rating: initialData?.rating || 4.8,
    numReviews: initialData?.numReviews || 12,
  });

  const [galleryInput, setGalleryInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: mode === 'create' ? slugify(val) : prev.slug,
    }));
  };

  const addGalleryImage = () => {
    if (!galleryInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), galleryInput.trim()],
    }));
    setGalleryInput('');
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre del producto es obligatorio.';
    if (!formData.slug.trim()) newErrors.slug = 'El slug es obligatorio.';
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria.';
    if (formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0.';
    if (formData.stock < 0) newErrors.stock = 'El stock no puede ser negativo.';
    if (!formData.categoryId) newErrors.categoryId = 'Seleccioná una categoría.';
    if (!formData.image.trim()) newErrors.image = 'La imagen principal es obligatoria.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Por favor revisá los campos con errores.', 'error');
      return;
    }

    setLoading(true);
    try {
      const url = mode === 'create' ? '/api/admin/products' : `/api/admin/products/${initialData?.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar el producto');
      }

      showToast(
        mode === 'create' ? '¡Producto creado con éxito!' : '¡Producto actualizado correctamente!'
      );

      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 600);
    } catch (err: any) {
      showToast(err.message || 'Ocurrió un error al guardar.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl text-[#7d7384] hover:text-[#241230] hover:bg-white border border-[#e8e3ec] shadow-xs"
            aria-label="Volver al listado"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[#241230]">
              {mode === 'create' ? 'Crear Nuevo Producto' : `Editar: ${initialData?.name}`}
            </h1>
            <p className="text-[13px] text-[#7d7384]">
              {mode === 'create'
                ? 'Completá los detalles para publicar una prenda en la tienda.'
                : 'Modificá precios, stock, fotos o descripción.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <AdminButton variant="outline" type="button">
              Cancelar
            </AdminButton>
          </Link>
          <AdminButton variant="primary" type="submit" isLoading={loading}>
            {mode === 'create' ? 'Guardar Producto' : 'Guardar Cambios'}
          </AdminButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[24px] border border-[#e8e3ec] shadow-marifer-sm space-y-5">
            <h2 className="font-display text-base font-bold text-[#241230]">
              Información General
            </h2>

            <AdminInput
              label="Nombre del producto"
              required
              placeholder="Ej: Remera Clásica Lino Violeta"
              value={formData.name}
              onChange={handleNameChange}
              error={errors.name}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminInput
                label="Slug (URL amigable)"
                required
                placeholder="remera-clasica-lino-violeta"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                error={errors.slug}
                helperText="Identificador único en la URL"
              />

              <AdminSelect
                label="Categoría"
                required
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                error={errors.categoryId}
              />
            </div>

            <AdminTextarea
              label="Descripción detallada"
              required
              placeholder="Describí los materiales, corte, calce y cuidados de la prenda…"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={errors.description}
            />
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white p-6 rounded-[24px] border border-[#e8e3ec] shadow-marifer-sm space-y-5">
            <h2 className="font-display text-base font-bold text-[#241230]">
              Precio e Inventario
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <AdminInput
                label="Precio (UYU)"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="1890"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                error={errors.price}
              />

              <AdminInput
                label="Precio anterior / Oferta"
                type="number"
                step="0.01"
                min="0"
                placeholder="2290"
                value={formData.compareAtPrice || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    compareAtPrice: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                helperText="Opcional: se mostrará tachado"
              />

              <AdminInput
                label="Stock Disponible"
                type="number"
                min="0"
                required
                placeholder="15"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                error={errors.stock}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="bg-white p-6 rounded-[24px] border border-[#e8e3ec] shadow-marifer-sm space-y-4">
            <h2 className="font-display text-base font-bold text-[#241230]">
              Imagen Principal
            </h2>

            <AdminInput
              label="URL de la imagen"
              required
              placeholder="https://..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              error={errors.image}
            />

            {formData.image && (
              <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-[#f2e6f4] border border-[#e8e3ec]">
                <Image
                  src={formData.image}
                  alt="Vista previa"
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>
            )}
          </div>

          {/* Gallery Images */}
          <div className="bg-white p-6 rounded-[24px] border border-[#e8e3ec] shadow-marifer-sm space-y-4">
            <h2 className="font-display text-base font-bold text-[#241230]">
              Galería de Fotos
            </h2>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="URL de foto adicional…"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                className="flex-1 h-10 px-3 rounded-xl border border-[#d3ccd8] text-[13px] focus:outline-none focus:border-[#452453]"
              />
              <button
                type="button"
                onClick={addGalleryImage}
                className="h-10 px-3 rounded-xl bg-[#f2e6f4] text-[#452453] font-bold text-[13px] hover:bg-[#e3cde8] transition-colors"
                aria-label="Agregar foto a la galería"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              {(formData.images || []).map((imgUrl, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[#e8e3ec] group">
                  <Image src={imgUrl} alt={`Galería ${idx + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute inset-0 bg-[#241230]/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Eliminar foto ${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Visibility & Settings */}
          <div className="bg-white p-6 rounded-[24px] border border-[#e8e3ec] shadow-marifer-sm space-y-4">
            <h2 className="font-display text-base font-bold text-[#241230]">
              Configuración
            </h2>

            <AdminCheckbox
              label="Producto Destacado"
              description="Aparecerá en la sección de destacados del Home"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
          </div>
        </div>
      </div>
    </form>
  );
};
