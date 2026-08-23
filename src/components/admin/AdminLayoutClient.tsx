// src/components/admin/AdminLayoutClient.tsx
'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastProvider } from './Toast';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userEmail?: string;
}

export const AdminLayoutClient: React.FC<AdminLayoutClientProps> = ({ children, userEmail }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#fbf9fc] flex">
        <Sidebar isOpenMobile={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)} />

        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <Header userEmail={userEmail} onOpenMobileNav={() => setIsMobileOpen(true)} />
          <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};
