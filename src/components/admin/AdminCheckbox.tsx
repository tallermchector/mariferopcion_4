// src/components/admin/AdminCheckbox.tsx
'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Check } from 'lucide-react';

export interface AdminCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const AdminCheckbox = forwardRef<HTMLInputElement, AdminCheckboxProps>(
  ({ label, description, id, className, checked, ...props }, ref) => {
    const checkId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <label
        htmlFor={checkId}
        className={twMerge(
          clsx(
            'inline-flex items-start gap-3 select-none cursor-pointer group py-1',
            className
          )
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="checkbox"
            id={checkId}
            ref={ref}
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div className="w-5 h-5 rounded-md border border-[#d3ccd8] bg-white transition-all peer-checked:bg-[#452453] peer-checked:border-[#452453] peer-focus-visible:ring-2 peer-focus-visible:ring-[#caa8d3] peer-focus-visible:ring-offset-2 flex items-center justify-center group-hover:border-[#452453]">
            <Check
              className={clsx(
                'w-3.5 h-3.5 text-white transition-opacity',
                checked ? 'opacity-100' : 'opacity-0'
              )}
              strokeWidth={3}
            />
          </div>
        </div>
        {(label || description) && (
          <div className="space-y-0.5">
            {label && <span className="block text-[14px] font-bold text-[#241230] leading-tight">{label}</span>}
            {description && <p className="text-[12px] text-[#7d7384] leading-normal">{description}</p>}
          </div>
        )}
      </label>
    );
  }
);

AdminCheckbox.displayName = 'AdminCheckbox';
