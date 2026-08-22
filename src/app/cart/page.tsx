// ./src/app/cart/page.tsx
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import CartPageContent from '@/components/CartPageContent';

export const metadata = {
  title: 'Tu bolsa | Marifer — Tu Ropa Diaria',
  description: 'Revisá tus prendas seleccionadas, opciones de envío en Uruguay y cuotas sin recargo.',
};

export default function CartPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 space-y-8">
      <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-[13px] text-[#7d7384] font-body">
        <Link href="/" className="hover:text-[#241230] transition-colors">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <Link href="/products" className="hover:text-[#241230] transition-colors">
          Catálogo
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-[#241230] font-semibold" aria-current="page">Tu bolsa</span>
      </nav>

      <div className="border-b border-[#e8e3ec] pb-6">
        <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#452453]">
          Marifer · Bolsa
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#241230] tracking-tight mt-1">
          Tu bolsa
        </h1>
      </div>

      <CartPageContent />
    </div>
  );
}
