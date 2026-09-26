"use client";

import { ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closable?: boolean;
  closeOnOverlay?: boolean;
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-full mx-4 my-4 h-[calc(100vh-2rem)]",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closable = true,
  closeOnOverlay = true,
  className = "",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closable) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, closable, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (open && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable[0]?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => closeOnOverlay && closable && onClose()}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={[
          "relative z-10 w-full flex flex-col",
          "bg-panel-1 border border-panel-6 rounded-2xl shadow-xl",
          "max-h-[90vh]",
          sizeClasses[size],
          className,
        ].join(" ")}
      >
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-6 to-transparent rounded-t-2xl" />

        {/* Header */}
        {(title || closable) && (
          <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-panel-6 shrink-0 bg-panel-2 rounded-t-2xl">
            <div>
              {title && (
                <h2 className="text-lg font-bold text-panel-12 leading-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-panel-11 mt-1">{description}</p>
              )}
            </div>
            {closable && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-panel-11 hover:text-panel-12 hover:bg-panel-4 transition-colors shrink-0"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        {children && (
          <div className="flex-1 overflow-y-auto px-6 py-5 text-panel-12 text-sm leading-relaxed">
            {children}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-panel-6 shrink-0 bg-panel-2 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
