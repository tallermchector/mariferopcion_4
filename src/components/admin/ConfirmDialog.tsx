// src/components/admin/ConfirmDialog.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { AdminButton } from './AdminButton';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => confirmBtnRef.current?.focus(), 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isLoading) onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#241230]/40 backdrop-blur-sm"
          onClick={() => !isLoading && onClose()}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-[24px] border border-[#e8e3ec] p-6 shadow-marifer-hover z-10 space-y-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  variant === 'danger'
                    ? 'bg-[#fdebf0] text-[#c23b64]'
                    : 'bg-[#f2e6f4] text-[#452453]'
                }`}
              >
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 id="confirm-dialog-title" className="font-display text-lg font-bold text-[#241230]">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1 rounded-full text-[#7d7384] hover:text-[#241230] hover:bg-[#f2e6f4] transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <p id="confirm-dialog-desc" className="text-[14px] text-[#7d7384] leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <AdminButton
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </AdminButton>
            <AdminButton
              ref={confirmBtnRef}
              variant={variant === 'danger' ? 'danger' : 'primary'}
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmText}
            </AdminButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
