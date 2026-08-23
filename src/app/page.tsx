// ./src/app/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Truck,
  RotateCcw,
  CreditCard,
  ChevronRight,
  Sparkles,
  Star,
  ShieldCheck,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import type { ProductType } from '@/lib/types';

export const revalidate = 60;

// Bento asimétrico de categorías: dos filas espejadas 5/4/3 y 3/4/5 en una grilla de 12.
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
      className={`relative inline-block h-[0.75em] w-[1.8em] align-[-0.08em] overflow-hidden rounded-full bg-[#241230] ring-2 ring-[#caa8d3]/50 mx-[0.08em] shadow-inner ${className}`}
    >
      <Image src={src} alt={alt} fill sizes="140px" className="object-cover" referrerPolicy="no-referrer" />
    </span>
  );
}

const HERO_INLINE = [
  { src: 'https://picsum.photos/seed/marifer-hero-lino/320/160', alt: 'Detalle de tela de lino' },
  { src: 'https://picsum.photos/seed/marifer-hero-rambla/320/160', alt: 'Caminando por la Rambla' },
];

// Testimonios de clientas reales uruguayas
const TESTIMONIALS = [
  {
    name: 'Valentina M.',
    location: 'Punta Carretas, Montevideo',
    comment: 'La calidad del lino y los acabados superaron mis expectativas. Llegó en 24 horas y el empaque es un detalle hermoso.',
    rating: 5,
    tag: 'Compra verificada',
  },
  {
    name: 'Camila S.',
    location: 'Punta del Este, Maldonado',
    comment: 'Cambié de talle sin ninguna complicación ni costo extra. La atención por WhatsApp es súper ágil y cálida.',
    rating: 5,
    tag: 'Cambio gratuito',
  },
  {
    name: 'Lucía B.',
    location: 'Colonia del Sacramento',
    comment: 'Prendas versátiles de verdad. Las uso tanto para la oficina como para el fin de semana. Compré en 6 cuotas sin interés.',
    rating: 5,
    tag: 'Clienta frecuente',
  },
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

  // Descuento máximo real del catálogo
  const maxDiscount = saleProducts.reduce((max, p) => {
    if (!p.compareAtPrice || p.compareAtPrice <= p.price) return max;
    return Math.max(max, Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100));
  }, 0);

  // Categorías principales ordenadas por cantidad de prendas para la grilla bento
  const categoryTiles = categories
    .map((c) => ({
      name: c.name,
      slug: c.slug,
      count: c._count.products,
      image: c.image ?? `https://picsum.photos/seed/marifer-cat-${c.slug}/400/400`,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const trustItems = [
    {
      icon: Truck,
      title: 'Envíos a todo el país',
      detail: '24 a 72 horas hábiles en tu puerta',
      badge: 'Montevideo e Interior',
    },
    {
      icon: RotateCcw,
      title: 'Cambios 100% gratis',
      detail: '30 días desde la compra sin preguntas',
      badge: 'Cero fricción',
    },
    {
      icon: CreditCard,
      title: '6 pagos sin recargo',
      detail: 'Con todas las tarjetas uruguayas',
      badge: 'OCA, Visa, Master',
    },
  ];

  return (
    <div className="w-full overflow-hidden">
      {/* HERO: split-screen 7/5 editorial con ambientación atmosférica violeta */}
      <section
        data-surface="dark"
        className="relative w-full bg-[#452453] text-white pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28"
      >
        {/* Glow de fondo atmosférico */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#caa8d3]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#d94f78]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Columna Texto (col-span-7) */}
            <div className="lg:col-span-7 flex flex-col justify-center gap-6">
              {/* Badge de temporada con micro-animación */}
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-[12px] font-bold uppercase tracking-[0.18em] text-[#caa8d3]">
                <Sparkles className="w-3.5 h-3.5 text-[#d4a15a] animate-pulse" aria-hidden="true" />
                <span>Temporada Otoño 2026</span>
              </div>

              <h1 className="font-display font-extrabold text-white text-[clamp(2.75rem,5.6vw,4.5rem)] leading-[1.03] tracking-[-0.03em] text-balance">
                Tu ropa{' '}
                <InlineWord {...HERO_INLINE[0]} className="hidden sm:inline-block" />{' '}
                diaria,{' '}
                <InlineWord {...HERO_INLINE[1]} className="hidden sm:inline-block" />{' '}
                <span className="font-light italic text-[#caa8d3]">sin vueltas.</span>
              </h1>

              {/* En mobile las fotos inline bajan ordenadamente */}
              <div className="flex sm:hidden items-center gap-2" aria-hidden="true">
                {HERO_INLINE.map((img) => (
                  <span
                    key={img.src}
                    className="relative h-10 w-24 overflow-hidden rounded-full bg-[#241230] ring-2 ring-[#caa8d3]/40 shadow-sm"
                  >
                    <Image src={img.src} alt="" fill sizes="96px" className="object-cover" referrerPolicy="no-referrer" />
                  </span>
                ))}
              </div>

              <p className="text-[16px] sm:text-[18px] text-[#e3cde8] max-w-[54ch] leading-[1.55] font-body">
                Prendas nobles creadas para acompañar tu ritmo cotidiano. Envíos express a todo Uruguay y cambios simples dentro de los 30 días.
              </p>

              {/* CTAs con jerarquía optimizada */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href="/products"
                  id="hero-primary-cta"
                  className="h-[52px] sm:h-[56px] w-full sm:w-auto px-8 rounded-full bg-white text-[#452453] text-[15px] font-bold hover:bg-[#f2e6f4] active:translate-y-px transition-all flex items-center justify-center gap-2.5 shadow-marifer-btn hover-lift cursor-pointer"
                >
                  <span>Explorar colección</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                </Link>

                {maxDiscount > 0 && (
                  <Link
                    href="/products?sort=sale"
                    id="hero-secondary-cta"
                    className="h-[52px] sm:h-[56px] w-full sm:w-auto px-7 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm text-[#e3cde8] text-[15px] font-medium hover:bg-white/15 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>
                      Rebajas hasta <span className="font-mono-tabular font-bold text-white">{maxDiscount}%</span>
                    </span>
                  </Link>
                )}
              </div>

              {/* Micro social proof en hero */}
              <div className="pt-3 flex items-center gap-3 text-[13px] text-[#caa8d3]">
                <div className="flex items-center text-[#d4a15a]" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span>
                  <strong className="text-white font-bold font-mono-tabular">4.9/5</strong> de valoración en +1.200 pedidos entregados
                </span>
              </div>
            </div>

            {/* Columna Visual (col-span-5) con marifer_texto_diagonal a la derecha y badge flotante */}
            <div className="lg:col-span-5 relative space-y-3">
              {/* Elemento gráfico Marifer Texto Diagonal destacado a la derecha con animación de flotación */}
              <div className="absolute -top-12 -right-6 w-56 sm:w-72 h-32 sm:h-40 opacity-40 pointer-events-none select-none z-20 animate-float">
                <Image
                  src="/marifer_texto_diagonal.png"
                  alt="MARIFER"
                  fill
                  className="object-contain object-right-top drop-shadow-md"
                  priority
                />
              </div>

              <div className="relative aspect-[4/5] w-full rounded-[28px] overflow-hidden bg-[#241230] border border-[#caa8d3]/20 shadow-marifer-hover group radial-glow-hover">
                <Image
                  src="https://picsum.photos/seed/marifer-otono26/800/1000"
                  alt="Campaña Marifer otoño 2026"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Badge flotante de origen */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-[#241230]/85 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 flex items-center gap-3 text-white shadow-lg transition-transform duration-300 group-hover:translate-y-[-2px]">
                  <div className="w-10 h-10 rounded-full bg-[#caa8d3]/20 flex items-center justify-center text-[#caa8d3] shrink-0">
                    <Heart className="w-5 h-5 fill-[#caa8d3]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold leading-tight">Diseño uruguayo consciente</p>
                    <p className="text-[11px] text-[#caa8d3] mt-0.5">Montevideo &middot; Lino y algodón puro</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-1 text-[12px]">
                <span className="font-bold uppercase tracking-[0.15em] text-[#caa8d3]">Colección Otoño 2026</span>
                <span className="font-semibold text-[#e3cde8] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d4a15a]" aria-hidden="true" />
                  Garantía de satisfacción
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FRANJA DE CONFIANZA: fila refinada con badges de soporte */}
      <section className="w-full bg-[#ffffff] border-y border-[#e8e3ec] py-6 sm:py-8 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#e8e3ec]">
            {trustItems.map((item, i) => (
              <li
                key={item.title}
                style={{ '--index': i } as React.CSSProperties}
                className="reveal flex items-center gap-4 pt-4 first:pt-0 sm:pt-0 sm:px-6 first:pl-0 last:pr-0"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#f2e6f4] text-[#452453] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <item.icon className="w-5 h-5 stroke-[2]" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-display font-bold text-[15px] text-[#241230] leading-snug">{item.title}</p>
                  </div>
                  <p className="text-[13px] text-[#7d7384] font-body mt-0.5">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CATEGORÍAS: bento asimétrico 5/4/3 · 3/4/5 */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-[clamp(3.5rem,6vw,5rem)]">
        <div className="mb-7 flex items-end justify-between border-b border-[#e8e3ec] pb-4">
          <div>
            <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#452453] block mb-1">
              Catálogo completo
            </span>
            <h2 className="font-display font-bold text-[clamp(1.6rem,3vw,2rem)] text-[#241230]">
              Comprar por categoría
            </h2>
          </div>
          <Link
            href="/products"
            className="text-[14px] font-semibold text-[#452453] hover:underline hidden sm:inline-flex items-center gap-1 group"
          >
            <span>Ver todo el catálogo</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-5">
          {categoryTiles.map((cat, i) => (
            <li
              key={cat.slug}
              style={{ '--index': i } as React.CSSProperties}
              className={`reveal ${BENTO_SPANS[i] ?? 'lg:col-span-4'}`}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                id={`cat-tile-${cat.slug}`}
                className="group flex sm:flex-col h-full rounded-[20px] bg-[#f2e6f4]/70 hover:bg-[#f2e6f4] border border-[#e3cde8] p-3 sm:p-3.5 gap-3.5 hover-lift hover:border-[#452453] transition-all cursor-pointer shadow-sm hover:shadow-marifer-hover"
              >
                <div className="relative shrink-0 h-20 w-24 sm:h-[180px] sm:w-full overflow-hidden rounded-[14px] bg-[#e3cde8]">
                  <Image
                    src={cat.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 96px, (max-width: 1024px) 50vw, 40vw"
                    className="object-cover object-center group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex flex-1 items-center sm:items-end justify-between gap-2 sm:px-1 sm:pb-1">
                  <div>
                    <span className="font-display font-bold text-[17px] sm:text-[18px] text-[#241230] group-hover:text-[#452453] transition-colors leading-tight block">
                      {cat.name}
                    </span>
                    <span className="text-[12px] font-semibold text-[#7d7384] font-mono-tabular">
                      {cat.count} {cat.count === 1 ? 'prenda' : 'prendas'}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white text-[#452453] flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 transition-all shadow-sm">
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* LO MÁS ELEGIDO: H2 + 4 cards con cascada */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-[clamp(3.5rem,6vw,5rem)]">
        <div className="flex items-end justify-between mb-8 border-b border-[#e8e3ec] pb-4">
          <div>
            <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#452453] block mb-1">
              Favoritos de la temporada
            </span>
            <h2 className="font-display font-bold text-[clamp(1.6rem,3vw,2rem)] text-[#241230]">
              Lo más elegido
            </h2>
          </div>
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
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-[clamp(4rem,7vw,5.5rem)]">
        <div className="space-y-12 sm:space-y-16">
          {/* Bloque 1: imagen izquierda, texto derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#ffffff] border border-[#e8e3ec] rounded-[28px] p-6 sm:p-10 shadow-sm">
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full rounded-[20px] overflow-hidden bg-[#f2e6f4] border border-[#e8e3ec] shadow-sm">
                <Image
                  src="https://picsum.photos/seed/marifer-fabric-editorial/800/600"
                  alt="Taller de confección y lino"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2e6f4] text-[#452453] text-[12px] font-bold uppercase tracking-[0.14em]">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Confección consciente
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#241230] leading-snug">
                Materiales nobles para tu día a día
              </h3>
              <p className="text-[16px] text-[#403945] font-body leading-relaxed max-w-lg">
                Seleccionamos lino puro, algodón hilado y lana merino uruguaya. Prendas pensadas para acompañarte con frescura y durabilidad, desde la oficina hasta una caminata al atardecer por la Rambla.
              </p>
              <div className="pt-2">
                <Link
                  href="/products?category=vestidos"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[#452453] text-white text-[14px] font-bold hover:bg-[#241230] transition-colors shadow-sm"
                >
                  <span>Ver vestidos de lino</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bloque 2: texto izquierda, imagen derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#f2e6f4]/40 border border-[#e3cde8] rounded-[28px] p-6 sm:p-10 shadow-sm">
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#452453] text-[12px] font-bold uppercase tracking-[0.14em] border border-[#e3cde8]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#146043]" aria-hidden="true" />
                Compromiso uruguayo
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#241230] leading-snug">
                Atención cercana y envíos ágiles
              </h3>
              <p className="text-[16px] text-[#403945] font-body leading-relaxed max-w-lg">
                Comprá con total tranquilidad. Si el talle o el calce no es el indicado, tenés 30 días para cambiarlo sin costo adicional en cualquiera de nuestros canales.
              </p>
              <div className="pt-2">
                <Link
                  href="/products?sort=newest"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-[#452453] text-[#452453] text-[14px] font-bold hover:bg-[#452453] hover:text-white transition-colors"
                >
                  <span>Explorar novedades</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative aspect-[4/3] w-full rounded-[20px] overflow-hidden bg-[#f2e6f4] border border-[#e8e3ec] shadow-sm">
                <Image
                  src="https://picsum.photos/seed/marifer-boutique-mvd/800/600"
                  alt="Boutique Marifer en Montevideo"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER DE IDENTIDAD DE MARCA CON LOGO Y TEXTO DIAGONAL */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-[clamp(3.5rem,6vw,5rem)]">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#452453] via-[#351842] to-[#241230] text-white p-8 sm:p-12 lg:p-16 border border-[#caa8d3]/20 shadow-marifer-hover radial-glow-hover group">
          {/* Marca de agua diagonal en fondo con micro-movimiento */}
          <div className="absolute -right-12 -bottom-16 w-96 h-64 opacity-20 pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-1">
            <Image
              src="/marifer_texto_diagonal.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="relative h-12 w-40 sm:h-14 sm:w-48 mb-2">
                <Image
                  src="/logo_marifer_1.png"
                  alt="MARIFER"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
                Moda con identidad uruguaya, diseñada para sentirte vos misma todos los días.
              </h3>
              <p className="text-[#e3cde8] text-[15px] sm:text-[17px] font-body max-w-2xl leading-relaxed">
                Cada prenda nace de un proceso de confección cuidado en Montevideo, con tejidos seleccionados para perdurar y brindarte el máximo confort.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                href="/products"
                className="h-[52px] px-8 rounded-full bg-white text-[#452453] text-[15px] font-bold hover:bg-[#f2e6f4] transition-all flex items-center justify-center gap-2 shadow-marifer-btn hover-lift"
              >
                <span>Descubrir prendas</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <Link
                href="/products?sort=newest"
                className="h-[52px] px-7 rounded-full border border-[#caa8d3]/50 text-white text-[15px] font-medium hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                <span>Ver novedades</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / TESTIMONIOS */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-[clamp(4rem,7vw,5.5rem)] pb-[clamp(4.5rem,8vw,7rem)]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#452453] block mb-1">
            Experiencias reales
          </span>
          <h2 className="font-display font-bold text-[clamp(1.75rem,3vw,2.25rem)] text-[#241230]">
            Lo que dicen nuestras clientas
          </h2>
          <p className="text-[15px] text-[#7d7384] font-body mt-2">
            La confianza de más de 1.200 mujeres en todo Uruguay que eligen vestir cómodas todos los días.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#ffffff] rounded-[22px] p-6 border border-[#e8e3ec] shadow-sm flex flex-col justify-between hover-lift transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#d4a15a]" aria-hidden="true">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#146043] bg-[#f0f9f5] px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    {t.tag}
                  </span>
                </div>
                <p className="text-[14px] text-[#403945] font-body leading-relaxed italic">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-[#e8e3ec]">
                <p className="font-display font-bold text-[15px] text-[#241230]">{t.name}</p>
                <p className="text-[12px] text-[#7d7384]">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

