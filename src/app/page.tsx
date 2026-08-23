// ./src/app/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronRight,
  Sparkles,
  Heart,
  MessageCircle,
  Truck,
  Gift,
  Check,
  CheckCircle2,
  Star,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import type { ProductType } from '@/lib/types';
import { formatPriceUYU } from '@/lib/format';

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      take: 8,
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

  return (
    <div className="w-full overflow-hidden bg-[#FDFBF7]">
      {/* 1. Barra de Colecciones Superior de la Boutique */}
      <nav className="bg-white border-b border-[#502A55]/10 py-3">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex items-center justify-between font-bold text-[13px] uppercase tracking-wider">
          <Link
            href="/products"
            className="text-[#502A55] hover:text-[#D97D54] flex items-center gap-1.5 transition-colors"
          >
            <span>Colecciones</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-[#4C4D56]">
            <Link href="/products?category=ropa-diaria" className="hover:text-[#502A55] transition-colors">
              Ropa Diaria
            </Link>
            <Link href="/products?category=vestidos" className="hover:text-[#502A55] transition-colors">
              Vestidos &amp; Lino
            </Link>
            <Link href="/products?category=abrigos" className="hover:text-[#502A55] transition-colors">
              Textiles &amp; Abrigo
            </Link>
            <Link href="/products?sort=sale" className="text-[#D97D54] hover:underline">
              Rebajas de Autor
            </Link>
          </div>
          <span className="text-[#D97D54] text-[12px] font-black">
            &bull; Montevideo, UY
          </span>
        </div>
      </nav>

      {/* 2. Block Cards Grid de Autor (Con Terracotta Radial Hover Glow) */}
      <section className="py-8 sm:py-10">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Bloque 1: Banner Principal Colección Completa (col-span-12) */}
            <div className="md:col-span-12 block-card h-[220px] sm:h-[250px] bg-[#502A55] p-6 sm:p-9 flex flex-col justify-end border border-[#502A55]/20 group">
              <div className="radial-hover" />
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80"
                alt="Catálogo Marifer"
                fill
                priority
                className="object-cover opacity-40 rounded-[20px] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="relative z-10 space-y-2">
                <span className="oe-sticker bg-[#D97D54] text-white">
                  Temporada 2026
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-md">
                  Colección Completa de Atelier
                </h2>
              </div>
            </div>

            {/* Bloque 2: Ropa Diaria (col-span-4) */}
            <Link
              href="/products"
              className="md:col-span-4 block-card h-[260px] bg-[#502A55] p-6 flex flex-col justify-between group border border-[#502A55]/20"
            >
              <div className="radial-hover" />
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
                alt="Ropa Diaria"
                fill
                className="object-cover opacity-45 rounded-[20px] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-10">
                <span className="oe-sticker bg-white text-[#502A55]">
                  Esenciales
                </span>
              </div>
              <h2 className="relative z-10 font-serif text-2xl font-black text-white tracking-wide uppercase drop-shadow-md">
                ROPA DIARIA
              </h2>
            </Link>

            {/* Bloque 3: Regalos Especiales (col-span-4) */}
            <Link
              href="/products?category=vestidos"
              className="md:col-span-4 block-card h-[260px] bg-[#D97D54] p-6 flex flex-col justify-between group border border-[#D97D54]/20"
            >
              <div className="radial-hover" />
              <Image
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
                alt="Regalos Especiales"
                fill
                className="object-cover opacity-50 rounded-[20px] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-10">
                <span className="oe-sticker bg-white text-[#D97D54]">
                  Envoltura Gratis
                </span>
              </div>
              <h2 className="relative z-10 font-serif text-2xl font-black text-white tracking-wide uppercase drop-shadow-md">
                REGALOS DE AUTOR
              </h2>
            </Link>

            {/* Bloque 4: Textiles de Abrigo (col-span-4) */}
            <Link
              href="/products?category=abrigos"
              className="md:col-span-4 block-card h-[260px] bg-[#19091B] p-6 flex flex-col justify-between group border border-[#19091B]/20"
            >
              <div className="radial-hover" />
              <Image
                src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80"
                alt="Textiles"
                fill
                className="object-cover opacity-45 rounded-[20px] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-10">
                <span className="oe-sticker bg-[#DFA84A] text-[#19091B]">
                  Textil Suave
                </span>
              </div>
              <h2 className="relative z-10 font-serif text-2xl font-black text-white tracking-wide uppercase drop-shadow-md">
                CHALINAS &amp; SACOS
              </h2>
            </Link>

            {/* Bloque 5: Asesoramiento Directo WhatsApp (col-span-6) */}
            <a
              href="https://wa.me/59899123456"
              target="_blank"
              rel="noopener noreferrer"
              className="md:col-span-6 block-card h-[260px] bg-[#19091B] p-7 flex flex-col justify-between group border border-white/10"
            >
              <div className="radial-hover" />
              <div className="relative z-10 space-y-2">
                <span className="oe-sticker bg-[#25D366] text-white flex items-center gap-1.5 w-fit">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Atención en Vivo
                </span>
                <p className="text-[#F3EEF5] text-[15px] max-w-[32ch] leading-relaxed">
                  Escribinos para asesoramiento en talles, combinaciones y pedidos especiales.
                </p>
              </div>
              <h2 className="relative z-10 font-serif text-2xl sm:text-3xl font-black text-white tracking-wide uppercase">
                WHATSAPP DIRECTO
              </h2>
            </a>

            {/* Bloque 6: Taller Comunitario & Envíos (col-span-6) */}
            <div className="md:col-span-6 block-card h-[260px] bg-[#502A55] p-7 flex flex-col justify-between group border border-[#502A55]/30">
              <div className="radial-hover" />
              <div className="relative z-10 space-y-2">
                <span className="oe-sticker bg-[#DFA84A] text-[#502A55] flex items-center gap-1.5 w-fit">
                  <Truck className="w-3.5 h-3.5" />
                  Envíos a Todo Uruguay
                </span>
                <p className="text-[#F3EEF5] text-[15px] max-w-[32ch] leading-relaxed">
                  Retiro en taller Montevideo o despacho seguro a cualquier rincón del país.
                </p>
              </div>
              <h2 className="relative z-10 font-serif text-2xl sm:text-3xl font-black text-white tracking-wide uppercase">
                TALLER &amp; ENVÍOS
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Catálogo de Creaciones Destacadas de Atelier */}
      <section className="py-12 sm:py-16" id="catalog">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#502A55]/10 gap-4">
            <div>
              <span className="text-[13px] font-bold text-[#D97D54] uppercase tracking-wider block mb-1">
                Creaciones Destacadas
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-[#502A55]">
                Catálogo de Atelier Marifer
              </h2>
            </div>
            <Link
              href="/products"
              className="text-[#D97D54] font-bold text-[15px] flex items-center gap-1.5 hover:underline"
            >
              <span>Ver todas las colecciones</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <div key={product.id} style={{ '--index': i } as React.CSSProperties} className="reveal h-full">
                <ProductCard product={product as unknown as ProductType} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Minimalist Underline Form Section (Asesoramiento Personalizado Marifer) */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="bg-white rounded-[24px] border border-[#502A55]/10 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Columna Informativa */}
            <div className="space-y-4">
              <span className="text-[13px] font-bold text-[#D97D54] uppercase tracking-wider block">
                Atención de Autor &amp; WhatsApp
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-[#502A55] leading-tight">
                ¿Buscás una prenda a medida, talle o armado de regalo especial?
              </h3>
              <p className="text-[#4C4D56] text-[15px] sm:text-[16px] leading-relaxed">
                Dejanos tu consulta y nos comunicamos directamente por WhatsApp para brindarte fotos de texturas, guía de medidas y coordinar retiro o envío.
              </p>

              <div className="pt-2 space-y-2.5 text-[14px] font-semibold text-[#19091B]">
                <div className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-[#D97D54] stroke-[3]" />
                  <span>Asesoramiento personalizado sin compromiso</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-[#D97D54] stroke-[3]" />
                  <span>Envíos a todo el interior de Uruguay</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-[#D97D54] stroke-[3]" />
                  <span>Envoltura artesanal de regalo incluida</span>
                </div>
              </div>
            </div>

            {/* Underline Inputs Form */}
            <form
              action="https://wa.me/59899123456"
              target="_blank"
              className="space-y-5 bg-[#FDFBF7] p-6 sm:p-8 rounded-[20px] border border-[#502A55]/10"
            >
              <div className="space-y-1">
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#502A55] block">
                  Nombre Completo <span className="text-[#D97D54]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: María Fernández"
                  required
                  className="w-full bg-transparent border-b-2 border-[#D6D3D1] focus:border-[#D97D54] py-2 text-[15px] text-[#19091B] outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#502A55] block">
                  Número de WhatsApp <span className="text-[#D97D54]">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Ej: 099 123 456"
                  required
                  className="w-full bg-transparent border-b-2 border-[#D6D3D1] focus:border-[#D97D54] py-2 text-[15px] text-[#19091B] outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#502A55] block">
                  Detalle de tu Consulta
                </label>
                <input
                  type="text"
                  placeholder="Prenda de interés, talle o fecha de regalo..."
                  className="w-full bg-transparent border-b-2 border-[#D6D3D1] focus:border-[#D97D54] py-2 text-[15px] text-[#19091B] outline-none transition-colors"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full h-12 rounded-[30px] bg-[#D97D54] hover:bg-[#C46840] text-white text-[15px] font-bold tracking-wide uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enviar Consulta por WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}


