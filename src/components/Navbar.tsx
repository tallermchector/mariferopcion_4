// ./src/components/Navbar.tsx
'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPriceUYU } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';

const navLinks = [
  { label: 'Catálogo', href: '/products', sort: null },
  { label: 'Novedades', href: '/products?sort=newest', sort: 'newest' },
  { label: 'Rebajas', href: '/products?sort=sale', sort: 'sale' },
];

/** Links de escritorio con subrayado animado en el activo. Usa useSearchParams, por eso va dentro de Suspense. */
function DesktopNavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const currentSort = searchParams.get('sort');

  return (
    <nav className="hidden md:flex items-center gap-6" aria-label="Secciones">
      {navLinks.map((link) => {
        const isActive =
          pathname === '/products' &&
          (link.sort === null ? currentSort === null : currentSort === link.sort);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={`relative py-2 text-[15px] font-medium transition-colors ${
              isActive ? 'text-white font-semibold' : 'text-[#e3cde8] hover:text-white'
            }`}
          >
            {link.label}
            {isActive && (
              <motion.span
                layoutId="activeNavUnderline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#caa8d3] rounded-full"
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      setMobileMenuOpen(false);
      router.push(`/products?query=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="w-full" data-surface="dark">
      {/* Barra de anuncio */}
      <div className="bg-[#fbf1de] text-[#7a5222] text-[12px] font-bold py-2 px-4 text-center tracking-wide border-b border-[#e8e3ec]">
        <p className="max-w-[1440px] mx-auto font-mono-tabular">
          Envío gratis en compras desde {formatPriceUYU(FREE_SHIPPING_THRESHOLD)} · 6 pagos sin recargo
        </p>
      </div>

      {/* Header sticky */}
      <header className="sticky top-0 z-50 w-full h-[72px] bg-[#452453] text-white shadow-marifer-sm">
        <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8 lg:gap-12">
            <Link
              href="/"
              id="nav-brand-logo"
              className="flex items-center gap-3 group py-1"
              aria-label="Marifer, ir al inicio"
            >
              <div className="relative h-10 w-10 sm:h-11 sm:w-11 transition-transform group-hover:scale-105 duration-200">
                <Image
                  src="/logo_marifer_1.png"
                  alt="MARIFER"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-xl sm:text-2xl text-white tracking-tight leading-none">
                  Marifer
                </span>
                <span className="font-logo italic text-[13px] text-[#caa8d3] -mt-0.5 leading-none">
                  Para tu vida
                </span>
              </div>
            </Link>

            <Suspense fallback={null}>
              <DesktopNavLinks />
            </Suspense>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Buscador de escritorio */}
            <form
              role="search"
              onSubmit={handleSearchSubmit}
              className="relative hidden sm:flex items-center w-[200px] lg:w-[240px]"
            >
              <label htmlFor="nav-search" className="sr-only">
                Buscar prendas
              </label>
              <input
                id="nav-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar prendas"
                className="w-full h-11 pl-4 pr-12 rounded-full bg-white text-[#241230] text-[14px] placeholder:text-[#7d7384] focus:outline-none focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2 focus:ring-offset-[#452453] transition-shadow"
              />
              <button
                type="submit"
                className="absolute right-0 w-11 h-11 rounded-full flex items-center justify-center text-[#7d7384] hover:text-[#452453] transition-colors cursor-pointer"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4 stroke-[2]" aria-hidden="true" />
              </button>
            </form>

            {/* Buscar en mobile: abre el menú con el buscador */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="sm:hidden w-11 h-11 rounded-full flex items-center justify-center text-[#e3cde8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Buscar prendas"
            >
              <Search className="w-5 h-5 stroke-[2]" aria-hidden="true" />
            </button>

            <Link
              href="/login"
              id="nav-user-account"
              className="w-11 h-11 rounded-full flex items-center justify-center text-[#e3cde8] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Mi cuenta"
            >
              <User className="w-5 h-5 stroke-[2]" aria-hidden="true" />
            </Link>

            <button
              id="navbar-cart-trigger"
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative w-11 h-11 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={totalItems > 0 ? `Abrir bolsa, ${totalItems} ${totalItems === 1 ? 'prenda' : 'prendas'}` : 'Abrir bolsa'}
            >
              <ShoppingBag className="w-5 h-5 stroke-[2]" aria-hidden="true" />
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-[#c23b64] text-white text-[12px] font-mono-tabular font-bold flex items-center justify-center"
                >
                  {totalItems}
                </span>
              )}
            </button>

            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-11 h-11 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[2]" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5 stroke-[2]" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Menú mobile: anima opacidad y transform, no height */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
              className="md:hidden absolute inset-x-0 top-full bg-[#241230] border-t border-[#452453] px-4 py-4 space-y-3 shadow-marifer-hover"
            >
              <form role="search" onSubmit={handleSearchSubmit} className="relative">
                <label htmlFor="nav-search-mobile" className="sr-only">
                  Buscar prendas
                </label>
                <input
                  id="nav-search-mobile"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar prendas"
                  className="w-full h-11 pl-4 pr-12 rounded-full bg-white text-[#241230] text-[14px] placeholder:text-[#7d7384] focus:outline-none focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2 focus:ring-offset-[#241230]"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 w-11 h-11 rounded-full flex items-center justify-center text-[#7d7384] hover:text-[#452453] cursor-pointer"
                  aria-label="Buscar"
                >
                  <Search className="w-4 h-4 stroke-[2]" aria-hidden="true" />
                </button>
              </form>

              <nav className="flex flex-col space-y-1 pt-2" aria-label="Secciones">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 h-11 flex items-center rounded-lg text-[15px] font-medium text-[#e3cde8] hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}

export default Navbar;
