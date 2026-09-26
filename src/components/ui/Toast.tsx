"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { X, CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export interface ToastOptions {
  type?: ToastType;
  title?: string;
  description?: string;
  duration?: number;
  closable?: boolean;
  action?: { label: string; onClick: () => void };
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const positionClasses: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4 items-end",
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

const typeConfig: Record<
  ToastType,
  { icon: ReactNode; bar: string; iconClass: string }
> = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    bar: "bg-emerald-500",
    iconClass: "text-emerald-400",
  },
  error: {
    icon: <XCircle className="w-5 h-5" />,
    bar: "bg-red-500",
    iconClass: "text-red-400",
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bar: "bg-amber-500",
    iconClass: "text-amber-400",
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    bar: "bg-blue-500",
    iconClass: "text-blue-400",
  },
};

// ─── Single Toast ─────────────────────────────────────────────────────────────

function Toast({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const cfg = typeConfig[item.type ?? "info"];

  return (
    <div className="relative flex items-start gap-3 w-80 bg-[#0d1117] border border-white/15 rounded-xl shadow-2xl shadow-black/60 overflow-hidden p-4">
      {/* Color bar */}
      <div className={`absolute top-0 left-0 bottom-0 w-1 ${cfg.bar}`} />

      <span className={`shrink-0 mt-0.5 ${cfg.iconClass}`}>{cfg.icon}</span>

      <div className="flex-1 min-w-0">
        {item.title && (
          <p className="font-semibold text-white text-sm leading-tight">
            {item.title}
          </p>
        )}
        {item.description && (
          <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
            {item.description}
          </p>
        )}
        {item.action && (
          <button
            onClick={item.action.onClick}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 mt-1.5 underline underline-offset-2"
          >
            {item.action.label}
          </button>
        )}
      </div>

      {(item.closable ?? true) && (
        <button
          onClick={() => onDismiss(item.id)}
          className="shrink-0 text-gray-500 hover:text-white transition-colors p-0.5 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

export function ToastProvider({
  children,
  position = "bottom-right",
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => setToasts([]), []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = Math.random().toString(36).slice(2);
      const item: ToastItem = {
        ...options,
        id,
        type: options.type ?? "info",
        closable: options.closable ?? true,
      };

      setToasts((prev) => {
        const next = [item, ...prev].slice(0, maxToasts);
        return next;
      });

      if (options.duration !== 0) {
        setTimeout(() => dismiss(id), options.duration ?? 4000);
      }
    },
    [dismiss, maxToasts],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
      {children}

      {/* Toast Container */}
      <div
        className={`fixed z-[200] flex flex-col gap-3 pointer-events-none ${positionClasses[position]}`}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="pointer-events-auto"
            >
              <Toast item={item} onDismiss={dismiss} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
