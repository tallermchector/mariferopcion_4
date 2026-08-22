// ./src/app/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, RotateCcw, CreditCard, ChevronRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import type { ProductType } from '@/lib/types';

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      take: 4,
      orderBy: { id: 'asc' },
      include: { category: true },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    }),
  ]);

  // Orden editorial de las 6 categorías; el conteo sale de la BD
  const categoryOrder = ['vestidos', 'blusas', 'pantalones', 'abrigos', 'camisas', 'polleras'];
  const categoryTiles = categories
    .map((c) => ({ name: c.name, slug: c.slug, count: c._count.products }))
    .sort((a, b) => categoryOrder.indexOf(a.slug) - categoryOrder.indexOf(b.slug));

  return (
    <div className="w-full">
      {/* 3. HERO SECTION (Fondo violeta #452453, grilla 55/45) */}
      <section data-surface="dark" className="w-full bg-[#452453] text-white pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Columna Izquierda (55% / col-span-7) */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              {/* Eyebrow en lavanda (#caa8d3) */}
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#caa8d3]">
                TEMPORADA OTOÑO 26
              </span>

              {/* H1 blanco "Tu ropa diaria, sin vueltas." */}
              <h1 className="font-display font-extrabold text-white text-4xl sm:text-5xl lg:text-[60px] xl:text-[68px] leading-[1.04] tracking-[-0.025em]">
                Tu ropa diaria, <br className="hidden sm:inline" />
                <span className="font-light italic text-[#caa8d3]">sin vueltas.</span>
              </h1>

              {/* Párrafo lila (#e3cde8) */}
              <p className="text-[16px] sm:text-[18px] text-[#e3cde8] max-w-[54ch] leading-[1.5] font-body">
                Prendas para todos los días, con envío a todo Uruguay y cambios gratis dentro de los 30 días.
              </p>

              {/* Botones de acción: Primario blanco + Ghost lila */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                {/* Botón primario blanco con texto violeta (#452453) */}
                <Link
                  href="/products"
                  id="hero-primary-cta"
                  className="h-[50px] sm:h-[54px] px-8 rounded-full bg-white text-[#452453] text-[15px] font-bold hover:bg-[#f2e6f4] transition-all flex items-center justify-center gap-2 shadow-marifer-btn hover-lift cursor-pointer"
                >
                  <span>Ver el catálogo</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                {/* Botón ghost "Rebajas hasta 40%" */}
                <Link
                  href="/products?sort=sale"
                  id="hero-secondary-cta"
                  className="h-[50px] sm:h-[54px] px-7 rounded-full border border-[#e3cde8] text-[#e3cde8] text-[15px] font-medium hover:bg-white/10 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                >
                  <span>Rebajas hasta 40%</span>
                </Link>
              </div>
            </div>

            {/* Columna Derecha (45% / col-span-5) - Imagen 4:5 con radio 28px */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] w-full rounded-[28px] overflow-hidden bg-[#241230] border border-[#caa8d3]/20 shadow-marifer-hover group">
                <Image
                  src="https://picsum.photos/seed/marifer-otono26/800/1000"
                  alt="Campaña Marifer Otoño 26"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Badge sutil boutique */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-[18px] bg-[#241230]/90 backdrop-blur-md border border-[#caa8d3]/25 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#caa8d3] block">
                      Diseñado en Montevideo
                    </span>
                    <span className="font-display font-bold text-sm text-white">
                      Colección Otoño 2026
                    </span>
                  </div>
                  <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-[#452453] text-[#e3cde8] border border-[#e3cde8]/30">
                    Prendas Nobles
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FRANJA DE CONFIANZA (Fondo blanco #ffffff, 3 ítems en línea con ícono en círculo lila #f2e6f4) */}
      <section className="w-full bg-[#ffffff] border-y border-[#e8e3ec] py-6 sm:py-7">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#e8e3ec]">
            
            {/* Ítem 1 */}
            <div className="flex items-center gap-4 pt-4 first:pt-0 sm:pt-0 sm:px-4 first:pl-0">
              <div className="w-12 h-12 rounded-full bg-[#f2e6f4] text-[#452453] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-display font-bold text-[15px] text-[#241230] leading-snug">
                  Envíos a todo el país
                </h4>
                <p className="text-[13px] text-[#7d7384] font-body mt-0.5">
                  24 a 72 horas hábiles
                </p>
              </div>
            </div>

            {/* Ítem 2 */}
            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-12 h-12 rounded-full bg-[#f2e6f4] text-[#452453] flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-display font-bold text-[15px] text-[#241230] leading-snug">
                  Cambios gratis
                </h4>
                <p className="text-[13px] text-[#7d7384] font-body mt-0.5">
                  30 días desde la compra
                </p>
              </div>
            </div>

            {/* Ítem 3 */}
            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4 last:pr-0">
              <div className="w-12 h-12 rounded-full bg-[#f2e6f4] text-[#452453] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-display font-bold text-[15px] text-[#241230] leading-snug">
                  6 pagos sin recargo
                </h4>
                <p className="text-[13px] text-[#7d7384] font-body mt-0.5">
                  Con tarjetas uruguayas
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. COMPRAR POR CATEGORÍA (6 tiles píldora-rectángulo, 92px alto) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-14 sm:pt-18">
        <div className="mb-6">
          <h2 className="font-display font-bold text-[20px] text-[#241230]">
            Comprar por categoría
          </h2>
        </div>

        {/* 6 tiles píldora-rectángulo: fondo lila suave #f2e6f4, borde lila #e3cde8, 92px alto */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categoryTiles.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              id={`cat-tile-${cat.slug}`}
              className="h-[92px] rounded-[16px] bg-[#f2e6f4] border border-[#e3cde8] p-3.5 flex flex-col justify-end text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-marifer-hover hover:border-[#452453] group cursor-pointer"
            >
              <span className="font-display font-bold text-[16px] text-[#241230] group-hover:text-[#452453] transition-colors leading-tight">
                {cat.name}
              </span>
              <span className="text-[12px] text-[#403945] font-body mt-0.5">
                {cat.count} {cat.count === 1 ? 'prenda' : 'prendas'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. LO MÁS ELEGIDO (H2 28px + grilla de 4 tarjetas de producto) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-14 sm:pt-18">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display font-bold text-[28px] text-[#241230]">
            Lo más elegido
          </h2>
          <Link
            href="/products"
            className="text-[14px] font-semibold text-[#452453] hover:underline inline-flex items-center gap-1 group"
          >
            <span>Ver todo</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grilla de 4 tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product as unknown as ProductType} />
          ))}
        </div>
      </section>

      {/* 7. SECCIÓN EDITORIAL ZIG-ZAG (Montevideo Lifestyle & Calidad) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-16 sm:pt-22 pb-16 sm:pb-24">
        <div className="space-y-12 sm:space-y-16">
          
          {/* Bloque 1: Imagen izquierda, Texto derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden bg-[#f2e6f4] border border-[#e8e3ec] shadow-marifer-sm">
                <Image
                  src="https://picsum.photos/seed/marifer-fabric-editorial/800/600"
                  alt="Taller de confección y lino"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#452453] block">
                CONFECCIÓN CONSCIENTE
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#241230] leading-snug">
                Materiales nobles para tu día a día
              </h3>
              <p className="text-[15px] text-[#403945] font-body leading-relaxed max-w-lg">
                Seleccionamos lino puro, algodón hilado y lana merino uruguaya. Prendas que no necesitan ocasiones especiales para brillar: cómodas desde la mañana en la oficina hasta una caminata al atardecer.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-[14px] font-bold text-[#452453] hover:underline"
                >
                  <span>Conocé nuestra historia</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bloque 2: Texto izquierda, Imagen derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-4">
              <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#452453] block">
                COMPROMISO URUGUAYO
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#241230] leading-snug">
                Atención cercana y envíos ágiles
              </h3>
              <p className="text-[15px] text-[#403945] font-body leading-relaxed max-w-lg">
                Comprá con total tranquilidad. Si el talle no es el indicado, tenés 30 días para cambiarlo sin costo adicional en cualquiera de nuestros canales.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-[14px] font-bold text-[#452453] hover:underline"
                >
                  <span>Explorar novedades</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden bg-[#f2e6f4] border border-[#e8e3ec] shadow-marifer-sm">
                <Image
                  src="https://picsum.photos/seed/marifer-boutique-mvd/800/600"
                  alt="Boutique Marifer Montevideo"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}


