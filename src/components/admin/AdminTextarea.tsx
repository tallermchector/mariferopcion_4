// src/components/admin/AdminTextarea.tsx
'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const AdminTextarea = forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
  ({ label, error, helperText, id, className, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-bold text-[#241230]">
            {label} {props.required && <span className="text-[#c23b64]">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={twMerge(
            clsx(
              'w-full min-h-[110px] rounded-xl border border-[#d3ccd8] bg-white p-3.5 text-[14px] text-[#241230] placeholder:text-[#7d7384] transition-all focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-1 resize-y',
              error && 'border-[#c23b64] focus:border-[#c23b64] focus:ring-[#c23b64]/30',
              className
            )
          )}
          {...props}
        />
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

AdminTextarea.displayName = 'AdminTextarea';
