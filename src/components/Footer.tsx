import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer data-surface="dark" className="w-full bg-[#241230] text-white pt-16 pb-12 border-t border-[#452453]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-[#452453]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <div className="relative h-12 w-36 transition-transform group-hover:scale-105 duration-200">
                <Image
                  src="/logo_marifer_1.png"
                  alt="MARIFER"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <div className="text-[12px] font-bold tracking-[0.2em] text-[#caa8d3] uppercase">
              Moda · Tu ropa diaria
            </div>
            <p className="text-[14px] text-[#e3cde8] max-w-sm leading-relaxed font-body">
              Tienda online uruguaya. Envíos a todo el país en 24 a 72 h hábiles.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-[#caa8d3]">
              <span>Montevideo, Uruguay</span>
              <span>·</span>
              <span>contacto@marifer.uy</span>
            </div>
          </div>

          {/* Columna Comprar */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-[15px] tracking-wide">
              Comprar
            </h4>
            <ul className="space-y-2 text-[14px] text-[#e3cde8]">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">Todas las prendas</Link>
              </li>
              <li>
                <Link href="/products?category=vestidos" className="hover:text-white transition-colors">Vestidos</Link>
              </li>
              <li>
                <Link href="/products?category=blusas" className="hover:text-white transition-colors">Blusas</Link>
              </li>
              <li>
                <Link href="/products?sort=sale" className="text-[#caa8d3] font-semibold hover:underline hover:text-white transition-colors">
                  Rebajas de temporada
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna Confianza y Servicio */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-[15px] tracking-wide">
              Servicio
            </h4>
            <ul className="space-y-2 text-[14px] text-[#e3cde8]">
              <li>
                <span className="text-[#e3cde8]/90 block">Envíos a todo el país</span>
              </li>
              <li>
                <span className="text-[#e3cde8]/90 block">Cambios gratis 30 días</span>
              </li>
              <li>
                <span className="text-[#e3cde8]/90 block">6 cuotas sin recargo</span>
              </li>
              <li>
                <span className="text-[#caa8d3] block">contacto@marifer.uy</span>
              </li>
            </ul>
          </div>

          {/* Columna Categorías */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-[15px] tracking-wide">
              Colección
            </h4>
            <ul className="space-y-2 text-[14px] text-[#e3cde8]">
              <li>
                <Link href="/products?category=pantalones" className="hover:text-white transition-colors">
                  Pantalones
                </Link>
              </li>
              <li>
                <Link href="/products?category=abrigos" className="hover:text-white transition-colors">
                  Abrigos
                </Link>
              </li>
              <li>
                <Link href="/products?category=camisas" className="hover:text-white transition-colors">
                  Camisas
                </Link>
              </li>
              <li>
                <Link href="/products?sort=newest" className="hover:text-white transition-colors">
                  Novedades
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea final */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#caa8d3]">
          <p>© 2026 MARIFER · Montevideo, Uruguay</p>
          <div className="flex items-center gap-6">
            <span>6 pagos sin recargo con OCA, Visa, Master y Creditel</span>
            <Link href="/admin" className="hover:text-white underline text-[12px] opacity-70 hover:opacity-100 transition-opacity">
              Acceso Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


