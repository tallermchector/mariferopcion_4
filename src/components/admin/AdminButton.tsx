// src/components/admin/AdminButton.tsx
'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const AdminButton = React.forwardRef<HTMLButtonElement, AdminButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold tracking-tight rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

    const sizeStyles = {
      sm: 'h-9 px-3.5 text-[13px] gap-1.5',
      md: 'h-11 px-5 text-[14px] gap-2',
      lg: 'h-12 px-6 text-[15px] gap-2.5',
    };

    const variantStyles = {
      primary:
        'bg-[#452453] text-white hover:bg-[#241230] shadow-marifer-btn active:scale-[0.99]',
      secondary:
        'bg-[#f2e6f4] text-[#452453] hover:bg-[#e3cde8] active:scale-[0.99]',
      outline:
        'border border-[#d3ccd8] bg-white text-[#241230] hover:bg-[#fffcff] hover:border-[#452453] active:scale-[0.99]',
      danger:
        'bg-[#c23b64] text-white hover:bg-[#a62b50] shadow-sm active:scale-[0.99]',
      ghost:
        'text-[#7d7384] hover:text-[#241230] hover:bg-[#f2e6f4]/60 active:scale-[0.99]',
    };

    return (
      <button
        ref={ref}
        className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Cargando…</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

AdminButton.displayName = 'AdminButton';
