// src/components/admin/Header.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { useToast } from './Toast';

interface HeaderProps {
  userEmail?: string;
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userEmail = 'admin@marifer.uy', onOpenMobileNav }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      showToast('Sesión cerrada correctamente');
      setTimeout(() => {
        router.push('/login');
        router.refresh();
      }, 500);
    } catch {
      showToast('No se pudo cerrar sesión', 'error');
      setLoggingOut(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#e8e3ec] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl text-[#7d7384] hover:text-[#241230] hover:bg-[#f2e6f4]/60"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-display font-bold text-[15px] text-[#241230] hidden sm:inline-block">
          Panel de Administración
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f8f5fa] border border-[#e8e3ec]">
          <div className="w-6 h-6 rounded-full bg-[#452453] text-white flex items-center justify-center text-[11px] font-bold">
            <UserIcon className="h-3.5 w-3.5" />
          </div>
          <span className="text-[13px] font-bold text-[#241230] max-w-[140px] sm:max-w-[200px] truncate">
            {userEmail}
          </span>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-bold text-[#c23b64] hover:bg-[#fdebf0] rounded-full transition-colors cursor-pointer"
          title="Cerrar sesión"
          aria-label="Cerrar sesión de administrador"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
};
