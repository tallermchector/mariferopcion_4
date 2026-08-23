// src/components/admin/AdminBadge.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AdminBadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'purple' | 'neutral';
  className?: string;
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  children,
  variant = 'neutral',
  className,
}) => {
  const variantStyles = {
    success: 'bg-[#e8f5ec] text-[#146043] border-[#bfe2ce]',
    warning: 'bg-[#fbf1de] text-[#7a5222] border-[#edd6ae]',
    danger: 'bg-[#fdebf0] text-[#c23b64] border-[#f6cad6]',
    purple: 'bg-[#f2e6f4] text-[#452453] border-[#e3cde8]',
    neutral: 'bg-[#f8f5fa] text-[#7d7384] border-[#e8e3ec]',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-bold border tracking-wide',
          variantStyles[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
};
