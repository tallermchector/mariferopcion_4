// src/components/admin/AdminInput.tsx
'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  ({ label, error, helperText, leftIcon, id, className, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-bold text-[#241230]">
            {label} {props.required && <span className="text-[#c23b64]">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d7384] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={twMerge(
              clsx(
                'w-full h-11 rounded-xl border border-[#d3ccd8] bg-white px-3.5 text-[14px] text-[#241230] placeholder:text-[#7d7384] transition-all focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-1',
                leftIcon && 'pl-10',
                error && 'border-[#c23b64] focus:border-[#c23b64] focus:ring-[#c23b64]/30',
                className
              )
            )}
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-[12px] font-medium text-[#c23b64]">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-[12px] text-[#7d7384]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

AdminInput.displayName = 'AdminInput';
