// src/components/admin/AdminSelect.tsx
'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
}

export interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
}

export const AdminSelect = forwardRef<HTMLSelectElement, AdminSelectProps>(
  ({ label, options, error, helperText, id, className, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="block text-[13px] font-bold text-[#241230]">
            {label} {props.required && <span className="text-[#c23b64]">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
            className={twMerge(
              clsx(
                'w-full h-11 appearance-none rounded-xl border border-[#d3ccd8] bg-white pl-3.5 pr-10 text-[14px] text-[#241230] transition-all focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-1 cursor-pointer',
                error && 'border-[#c23b64] focus:border-[#c23b64] focus:ring-[#c23b64]/30',
                className
              )
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="h-4 w-4 text-[#7d7384] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
        </div>
        {error && (
          <p id={`${selectId}-error`} role="alert" className="text-[12px] font-medium text-[#c23b64]">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="text-[12px] text-[#7d7384]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

AdminSelect.displayName = 'AdminSelect';
