// ./src/components/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, Menu, X, User, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { label: 'Catálogo', href: '/products' },
    { label: 'Novedades', href: '/products?sort=newest' },
    { label: 'Rebajas', href: '/products?sort=sale' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="w-full">
      {/* 1. Barra de anuncio: franja crema 12px bold: "Envío gratis en compras mayores a $ 2.500 · 6 pagos sin recargo" */}
      <div className="bg-[#fbf1de] text-[#96662a] text-[12px] font-bold py-2 px-4 text-center tracking-wide border-b border-[#ebd7be]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2">
          <span>Envío gratis en compras mayores a $ 2.500 · 6 pagos sin recargo</span>
        </div>
      </div>

      {/* 2. Header sticky (72px, fondo violeta #452453) */}
      <header className="sticky top-0 z-50 w-full h-[72px] bg-[#452453] text-white shadow-marifer-sm transition-all">
        <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8 lg:gap-12">
            {/* Logo "Marifer" en Lobster Two italic blanco (31px) */}
            <Link
              href="/"
              id="nav-brand-logo"
              className="font-logo italic text-[31px] text-white leading-none hover:text-[#caa8d3] transition-colors"
            >
              Marifer
            </Link>

            {/* Nav "Catálogo · Novedades · Rebajas" en lila (#e3cde8) con subrayado lavanda (#caa8d3) en la activa */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href.includes('?') &&
                    typeof window !== 'undefined' &&
                    window.location.search.includes(link.href.split('?')[1]));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-1 text-[15px] font-medium transition-colors ${
                      isActive ? 'text-white font-semibold' : 'text-[#e3cde8] hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavUnderline"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#caa8d3] rounded-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Search Pill & Icon Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Input de búsqueda píldora blanca (240px) con ícono lupa y placeholder "Buscar prendas" */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden sm:flex items-center w-[200px] lg:w-[240px]"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar prendas"
                className="w-full h-[40px] pl-4 pr-10 rounded-full bg-white text-[#241230] text-[13px] placeholder:text-[#7d7384] focus:outline-none focus:ring-2 focus:ring-[#caa8d3] transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 text-[#7d7384] hover:text-[#452453] transition-colors cursor-pointer"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4 stroke-[2]" />
              </button>
            </form>

            {/* Mobile search trigger */}
            <button
              onClick={() => router.push('/products')}
              className="sm:hidden w-11 h-11 rounded-full flex items-center justify-center text-[#e3cde8] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Buscar productos"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Ícono corazón (44px) */}
            <Link
              href="/products"
              id="nav-wishlist-button"
              className="w-11 h-11 rounded-full flex items-center justify-center text-[#e3cde8] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Favoritos"
            >
              <Heart className="w-5 h-5 stroke-[2]" />
            </Link>

            {/* Ícono usuario (44px) */}
            <Link
              href="/login"
              id="nav-user-account"
              className="w-11 h-11 rounded-full flex items-center justify-center text-[#e3cde8] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Mi Cuenta"
            >
              <User className="w-5 h-5 stroke-[2]" />
            </Link>

            {/* Ícono bolsa (44px) con badge frambuesa "2" o dinámico en la bolsa */}
            <button
              id="navbar-cart-trigger"
              onClick={() => setIsOpen(true)}
              className="relative w-11 h-11 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Abrir bolsa de compras"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2]" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#d94f78] text-white text-[11px] font-mono-tabular font-bold flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Botón hamburguesa mobile */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-11 h-11 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2]" /> : <Menu className="w-5 h-5 stroke-[2]" />}
            </button>
          </div>
        </div>

        {/* Menú Mobile Desplegable */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#241230] border-t border-[#452453] px-4 py-4 space-y-3"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar prendas"
                  className="w-full h-[44px] pl-4 pr-10 rounded-full bg-white text-[#241230] text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-3.5 top-3 text-[#7d7384]"
                  aria-label="Buscar"
                >
                  <Search className="w-4 h-4 stroke-[2]" />
                </button>
              </form>

              <div className="flex flex-col space-y-1 pt-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#e3cde8] hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}

export default Navbar;


