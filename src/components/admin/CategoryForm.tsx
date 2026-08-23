// src/components/admin/CategoryForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminInput } from './AdminInput';
import { AdminTextarea } from './AdminTextarea';
import { AdminButton } from './AdminButton';
import { useToast } from './Toast';

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

export const CategoryForm: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'El nombre de la categoría es requerido.';
    if (!slug.trim()) newErrors.slug = 'El slug es requerido.';
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          description: description.trim() || null,
          image: image.trim() || `https://picsum.photos/seed/marifer-cat-${slug}/400/400`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al crear categoría');
      }

      showToast('Categoría creada con éxito');
      setTimeout(() => {
        router.push('/admin/categories');
        router.refresh();
      }, 500);
    } catch (err: any) {
      showToast(err.message || 'Error al guardar categoría', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="p-2 rounded-xl text-[#7d7384] hover:text-[#241230] hover:bg-white border border-[#e8e3ec] shadow-xs"
            aria-label="Volver a categorías"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[#241230]">
              Nueva Categoría
            </h1>
            <p className="text-[13px] text-[#7d7384]">
              Creá una sección para agrupar tus prendas y accesorios.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/categories">
            <AdminButton variant="outline" type="button">
              Cancelar
            </AdminButton>
          </Link>
          <AdminButton variant="primary" type="submit" isLoading={loading}>
            Guardar
          </AdminButton>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[24px] border border-[#e8e3ec] shadow-marifer-sm space-y-5">
        <AdminInput
          label="Nombre de la categoría"
          required
          placeholder="Ej: Abrigos y Camperas"
          value={name}
          onChange={handleNameChange}
          error={errors.name}
        />

        <AdminInput
          label="Slug (URL amigable)"
          required
          placeholder="abrigos-y-camperas"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          error={errors.slug}
          helperText="Identificador único en el filtro del catálogo"
        />

        <AdminTextarea
          label="Descripción (Opcional)"
          placeholder="Breve detalle sobre los productos de esta categoría…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <AdminInput
          label="URL de Imagen de Portada (Opcional)"
          placeholder="https://..."
          value={image}
          onChange={(e) => setImage(e.target.value)}
          helperText="Si lo dejás vacío se generará una imagen temática automática"
        />
      </div>
    </form>
  );
};
