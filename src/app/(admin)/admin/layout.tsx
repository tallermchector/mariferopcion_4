// src/app/(admin)/admin/layout.tsx
import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionFromCookies } from '@/lib/auth';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();

  if (!session) {
    redirect('/login?redirect=/admin');
  }

  if (session.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <AdminLayoutClient userEmail={session.email}>
      {children}
    </AdminLayoutClient>
  );
}
