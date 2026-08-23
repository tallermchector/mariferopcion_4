// src/app/(admin)/admin/categories/new/page.tsx
import React from 'react';
import { CategoryForm } from '@/components/admin/CategoryForm';

export const dynamic = 'force-dynamic';

export default function NewCategoryPage() {
  return <CategoryForm />;
}
