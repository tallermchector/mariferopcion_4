// ./src/app/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, RotateCcw, CreditCard, ChevronRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import type { ProductType } from '@/lib/types';

export const revalidate = 60;

// Bento asimétrico de categorías (DESIGN.md §6): dos filas espejadas 5/4/3 y 3/4/5 en una grilla de 12.
const BENTO_SPANS = [
  'lg:col-span-5',
  'lg:col-span-4',
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-4',
  'lg:col-span-5',
];

/** Foto pequeña dentro del titular: puntuación visual, alto de línea, forma de píldora. */
function InlineWord({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <span
      className={`relative inline-block h-[0.72em] w-[1.75em] align-[-0.08em] overflow-hidden rounded-full bg-[#241230] ring-2 ring-[#caa8d3]/40 mx-[0.06em] ${className}`}
    >
      <Image src={src} alt={alt} fill sizes="140px" className="object-cover" referrerPolicy="no-referrer" />
    </span>
  );
}

const HERO_INLINE = [
  { src: 'https://picsum.photos/seed/marifer-hero-lino/320/160', alt: 'Detalle de tela de lino' },
  { src: 'https://picsum.photos/seed/marifer-hero-rambla/320/160', alt: 'Caminando por la Rambla' },
];

export default async function HomePage() {
  const [featuredProducts, categories, saleProducts] = await Promise.all([
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
    prisma.product.findMany({
      where: { compareAtPrice: { not: null } },
      select: { price: true, compareAtPrice: true },
    }),
  ]);

  // Descuento máximo real del catálogo (nada de números redondos inventados)
  const maxDiscount = saleProducts.reduce((max, p) => {
    if (!p.compareAtPrice || p.compareAtPrice <= p.price) return max;
    return Math.max(max, Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100));
  }, 0);

  // Orden editorial de las 6 categorías; el conteo y la foto salen de la BD
  const categoryOrder = ['vestidos', 'blusas', 'pantalones', 'abrigos', 'camisas', 'polleras'];
  const categoryTiles = categories
    .map((c) => ({
      name: c.name,
      slug: c.slug,
      count: c._count.products,
      image: c.image ?? `https://picsum.photos/seed/marifer-cat-${c.slug}/400/400`,
    }))
    .sort((a, b) => categoryOrder.indexOf(a.slug) - categoryOrder.indexOf(b.slug));

  const trustItems = [
    { icon: Truck, title: 'Envíos a todo el país', detail: '24 a 72 horas hábiles' },
    { icon: RotateCcw, title: 'Cambios gratis', detail: '30 días desde la compra' },
    { icon: CreditCard, title: '6 pagos sin recargo', detail: 'Con tarjetas uruguayas' },
  ];

  return (
    <div className="w-full">
      {/* HERO: split-screen 7/5 sobre violeta, titular con fotos inline como puntuación visual */}
      <section
        data-surface="dark"
        className="w-full bg-[#452453] text-white pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Texto (col-span-7) */}
            <div className="lg:col-span-7 flex flex-col justify-center gap-6">
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#caa8d3]">
                Temporada otoño 2026
              </span>

              <h1 className="font-display font-extrabold text-white text-[clamp(2.75rem,5.6vw,4.25rem)] leading-[1.04] tracking-[-0.025em] text-balance">
                Tu ropa{' '}
                <InlineWord {...HERO_INLINE[0]} className="hidden sm:inline-block" />{' '}
                diaria,{' '}
                <InlineWord {...HERO_INLINE[1]} className="hidden sm:inline-block" />{' '}
                <span className="font-light italic text-[#caa8d3]">sin vueltas.</span>
              </h1>

              {/* En mobile las fotos inline bajan del titular (DESIGN.md §7) */}
              <div className="flex sm:hidden items-center gap-2" aria-hidden="true">
                {HERO_INLINE.map((img) => (
                  <span
                    key={img.src}
                    className="relative h-10 w-24 overflow-hidden rounded-full bg-[#241230] ring-2 ring-[#caa8d3]/40"
                  >
                    <Image src={img.src} alt="" fill sizes="96px" className="object-cover" referrerPolicy="no-referrer" />
                  </span>
                ))}
              </div>

              <p className="text-[16px] sm:text-[18px] text-[#e3cde8] max-w-[54ch] leading-[1.5] font-body">
                Prendas para todos los días, con envío a todo Uruguay y cambios gratis dentro de los 30 días.
              </p>

              {/* Un solo CTA primario; el ghost lleva a rebajas con el descuento real */}
              <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href="/products"
                  id="hero-primary-cta"
                  className="h-[50px] sm:h-[54px] w-full sm:w-auto px-8 rounded-full bg-white text-[#452453] text-[15px] font-bold hover:bg-[#f2e6f4] active:translate-y-px transition-all flex items-center justify-center gap-2 shadow-marifer-btn hover-lift cursor-pointer"
                >
                  <span>Ver el catálogo</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                </Link>

                {maxDiscount > 0 && (
                  <Link
                    href="/products?sort=sale"
                    id="hero-secondary-cta"
                    className="h-[50px] sm:h-[54px] w-full sm:w-auto px-7 rounded-full border border-[#e3cde8] text-[#e3cde8] text-[15px] font-medium hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span>
                      Rebajas hasta <span className="font-mono-tabular font-bold">{maxDiscount}%</span>
                    </span>
                  </Link>
                )}
              </div>
            </div>

            {/* Visual (col-span-5): foto 4:5 radio 28px, sin nada superpuesto; el pie va debajo */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative aspect-[4/5] w-full rounded-[28px] overflow-hidden bg-[#241230] border border-[#caa8d3]/20 shadow-marifer-hover group">
                <Image
                  src="https://picsum.photos/seed/marifer-otono26/800/1000"
                  alt="Campaña Marifer otoño 2026"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center justify-between px-1 text-[12px]">
                <span className="font-bold uppercase tracking-[0.15em] text-[#caa8d3]">Colección otoño 2026</span>
                <span className="font-semibold text-[#e3cde8]">Diseñado en Montevideo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FRANJA DE CONFIANZA: fila dividida con cascada de entrada */}
      <section className="w-full bg-[#ffffff] border-y border-[#e8e3ec] py-6 sm:py-7">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#e8e3ec]">
            {trustItems.map((item, i) => (
              <li
                key={item.title}
                style={{ '--index': i } as React.CSSProperties}
                className="reveal flex items-center gap-4 pt-4 first:pt-0 sm:pt-0 sm:px-4 first:pl-0 last:pr-0"
              >
                <div className="w-12 h-12 rounded-full bg-[#f2e6f4] text-[#452453] flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 stroke-[2]" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-display font-bold text-[15px] text-[#241230] leading-snug">{item.title}</p>
                  <p className="text-[13px] text-[#7d7384] font-body mt-0.5">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CATEGORÍAS: bento asimétrico 5/4/3 · 3/4/5 con foto arriba y etiqueta abajo (sin texto sobre imagen) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-[clamp(3rem,6vw,4.5rem)]">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display font-bold text-[clamp(1.5rem,3vw,1.75rem)] text-[#241230]">
            Comprar por categoría
          </h2>
          <span className="text-[13px] text-[#7d7384] font-body hidden sm:inline">Elegí por dónde empezar</span>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
          {categoryTiles.map((cat, i) => (
            <li
              key={cat.slug}
              style={{ '--index': i } as React.CSSProperties}
              className={`reveal ${BENTO_SPANS[i] ?? 'lg:col-span-4'}`}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                id={`cat-tile-${cat.slug}`}
                className="group flex sm:flex-col h-full rounded-[16px] bg-[#f2e6f4] border border-[#e3cde8] p-2.5 sm:p-3 gap-3 hover-lift hover:border-[#452453] cursor-pointer"
              >
                <div className="relative shrink-0 h-20 w-24 sm:h-[168px] sm:w-full overflow-hidden rounded-[10px] bg-[#e3cde8]">
                  <Image
                    src={cat.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 96px, (max-width: 1024px) 50vw, 40vw"
                    className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-1 items-center sm:items-end justify-between gap-2 sm:px-1 sm:pb-0.5">
                  <span className="font-display font-bold text-[17px] text-[#241230] group-hover:text-[#452453] transition-colors leading-tight">
                    {cat.name}
                  </span>
                  <span className="text-[12px] font-semibold text-[#403945] font-mono-tabular whitespace-nowrap">
                    {cat.count} {cat.count === 1 ? 'prenda' : 'prendas'}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* LO MÁS ELEGIDO: H2 + 4 cards con cascada */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-[clamp(3rem,6vw,4.5rem)]">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display font-bold text-[clamp(1.75rem,3vw,2rem)] text-[#241230]">
            Lo más elegido
          </h2>
          <Link
            href="/products"
            className="text-[14px] font-semibold text-[#452453] hover:underline inline-flex items-center gap-1 group h-11"
          >
            <span>Ver todo</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {featuredProducts.map((product, i) => (
            <li key={product.id} style={{ '--index': i } as React.CSSProperties} className="reveal h-full">
              <ProductCard product={product as unknown as ProductType} />
            </li>
          ))}
        </ul>
      </section>

      {/* EDITORIAL ZIG-ZAG */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-[clamp(3.5rem,7vw,5.5rem)] pb-[clamp(3.5rem,7vw,6rem)]">
        <div className="space-y-12 sm:space-y-16">
          {/* Bloque 1: imagen izquierda, texto derecha */}
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
                Confección consciente
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#241230] leading-snug">
                Materiales nobles para tu día a día
              </h3>
              <p className="text-[16px] text-[#403945] font-body leading-relaxed max-w-lg">
                Seleccionamos lino puro, algodón hilado y lana merino uruguaya. Prendas que no necesitan ocasiones especiales para brillar: cómodas desde la mañana en la oficina hasta una caminata al atardecer.
              </p>
              <div className="pt-2">
                <Link
                  href="/products?category=vestidos"
                  className="inline-flex items-center gap-2 h-11 text-[14px] font-bold text-[#452453] hover:underline"
                >
                  <span>Conocé los vestidos de lino</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bloque 2: texto izquierda, imagen derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-4">
              <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#452453] block">
                Compromiso uruguayo
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#241230] leading-snug">
                Atención cercana y envíos ágiles
              </h3>
              <p className="text-[16px] text-[#403945] font-body leading-relaxed max-w-lg">
                Comprá con total tranquilidad. Si el talle no es el indicado, tenés 30 días para cambiarlo sin costo adicional en cualquiera de nuestros canales.
              </p>
              <div className="pt-2">
                <Link
                  href="/products?sort=newest"
                  className="inline-flex items-center gap-2 h-11 text-[14px] font-bold text-[#452453] hover:underline"
                >
                  <span>Explorar novedades</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden bg-[#f2e6f4] border border-[#e8e3ec] shadow-marifer-sm">
                <Image
                  src="https://picsum.photos/seed/marifer-boutique-mvd/800/600"
                  alt="Boutique Marifer en Montevideo"
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
