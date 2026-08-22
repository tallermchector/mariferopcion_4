// ./src/app/cart/page.tsx
import React from 'react';
import Link from 'next/link';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import CartPageContent from '@/components/CartPageContent';

export const metadata = {
  title: 'Bolsa de Compras | Marifer — Tu Ropa Diaria',
  description: 'Revisa tus prendas seleccionadas, opciones de envío en Uruguay y cuotas sin recargo.',
};

export default function CartPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#6B6368] font-body">
        <Link href="/" className="hover:text-[#1A161D] transition-colors">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-[#1A161D] transition-colors">
          Catálogo
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[#1A161D] font-semibold">Bolsa de Compras</span>
      </nav>

      <div className="flex items-center justify-between border-b border-[rgba(26,22,29,0.08)] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C84B6B]">
            BOUTIQUE URUGUAY // BOLSA
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#1A161D] tracking-tight mt-1">
            Bolsa de Compras
          </h1>
        </div>
      </div>

      <CartPageContent />
    </div>
  );
}

