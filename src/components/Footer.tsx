// ./src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer data-surface="dark" className="w-full bg-[#241230] text-white pt-16 pb-12 border-t border-[#452453]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-[#452453]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-logo italic text-[31px] text-white leading-none hover:text-[#caa8d3] transition-colors">
                Marifer
              </span>
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

          {/* Columna Comprar: Vestidos, Blusas, Abrigos, Rebajas */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-[15px] tracking-wide">
              Comprar
            </h4>
            <ul className="space-y-2 text-[14px] text-[#e3cde8]">
              <li>
                <Link href="/products?category=vestidos" className="hover:text-white transition-colors">Vestidos</Link>
              </li>
              <li>
                <Link href="/products?category=blusas" className="hover:text-white transition-colors">Blusas</Link>
              </li>
              <li>
                <Link href="/products?category=abrigos" className="hover:text-white transition-colors">Abrigos</Link>
              </li>
              <li>
                <Link href="/products?sort=sale" className="text-[#d94f78] font-semibold hover:underline">
                  Rebajas
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna Ayuda: Envíos, Cambios y devoluciones, Guía de talles, Contacto */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-[15px] tracking-wide">
              Ayuda
            </h4>
            <ul className="space-y-2 text-[14px] text-[#e3cde8]">
              <li>
                <Link href="/faq#envios" className="hover:text-white transition-colors">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/faq#cambios" className="hover:text-white transition-colors">
                  Cambios y devoluciones
                </Link>
              </li>
              <li>
                <Link href="/faq#talles" className="hover:text-white transition-colors">
                  Guía de talles
                </Link>
              </li>
              <li>
                <Link href="/faq#contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna Marifer: Nuestra historia, Locales, Trabajá con nosotros */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-[15px] tracking-wide">
              Marifer
            </h4>
            <ul className="space-y-2 text-[14px] text-[#e3cde8]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Nuestra historia
                </Link>
              </li>
              <li>
                <Link href="/stores" className="hover:text-white transition-colors">
                  Locales
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Trabajá con nosotros
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
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


