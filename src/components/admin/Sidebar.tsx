// src/components/admin/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, FolderTree, ArrowLeft, X } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      href: '/admin/products',
      label: 'Productos',
      icon: Package,
      active: pathname.startsWith('/admin/products'),
    },
    {
      href: '/admin/categories',
      label: 'Categorías',
      icon: FolderTree,
      active: pathname.startsWith('/admin/categories'),
    },
  ];

  return (
    <>
      {/* Backdrop en Mobile */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-[#241230]/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#e8e3ec] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        )}
        role="navigation"
        aria-label="Menú principal de administración"
      >
        <div className="p-6 space-y-8">
          {/* Logo & Close Button (Mobile) */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="relative h-9 w-28">
                <Image
                  src="/logo_marifer_1.png"
                  alt="MARIFER Admin"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#f2e6f4] text-[#452453] tracking-wider">
                Admin
              </span>
            </Link>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-[#7d7384] hover:text-[#241230] rounded-lg"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navegación */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold transition-all',
                    item.active
                      ? 'bg-[#452453] text-white shadow-marifer-sm'
                      : 'text-[#403945] hover:bg-[#f2e6f4]/60 hover:text-[#241230]'
                  )}
                  aria-current={item.active ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={item.active ? 2.5 : 2} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-6 border-t border-[#e8e3ec]">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold text-[#7d7384] hover:text-[#452453] hover:bg-[#f2e6f4]/40 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a la tienda</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
