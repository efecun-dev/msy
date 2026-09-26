"use client";

import { ReactNode, useState } from "react";
import { X, Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertType = "info" | "success" | "warning" | "error";
export type AlertVariant = "solid" | "subtle" | "outline";

export interface AlertAction {
  label: string;
  onClick: () => void;
}

export interface AlertProps {
  type?: AlertType;
  variant?: AlertVariant;
  title?: string;
  children?: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  actions?: AlertAction[];
  icon?: ReactNode | false;
  className?: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const typeConfig: Record<
  AlertType,
  {
    icon: ReactNode;
    solid: string;
    subtle: string;
    outline: string;
    actionClass: string;
  }
> = {
  info: {
    icon: <Info className="w-5 h-5" />,
    solid: "bg-blue-600 text-white border-blue-600",
    subtle: "bg-blue-500/10 text-blue-300 border border-blue-500/20",
    outline: "bg-transparent text-blue-400 border border-blue-500",
    actionClass: "text-blue-400 hover:text-blue-300",
  },
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    solid: "bg-emerald-600 text-white border-emerald-600",
    subtle: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
    outline: "bg-transparent text-emerald-400 border border-emerald-500",
    actionClass: "text-emerald-400 hover:text-emerald-300",
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    solid: "bg-amber-500 text-black border-amber-500",
    subtle: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
    outline: "bg-transparent text-amber-400 border border-amber-500",
    actionClass: "text-amber-400 hover:text-amber-300",
  },
  error: {
    icon: <XCircle className="w-5 h-5" />,
    solid: "bg-red-600 text-white border-red-600",
    subtle: "bg-red-500/10 text-red-300 border border-red-500/20",
    outline: "bg-transparent text-red-400 border border-red-500",
    actionClass: "text-red-400 hover:text-red-300",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Alert({
  type = "info",
  variant = "subtle",
  title,
  children,
  closable = false,
  onClose,
  actions,
  icon,
  className = "",
}: AlertProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const cfg = typeConfig[type];
  const variantClass = cfg[variant];

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  const showIcon = icon !== false;
  const resolvedIcon = icon || cfg.icon;

  return (
    <div
      role="alert"
      className={[
        "flex items-start gap-3 p-4 rounded-xl",
        variantClass,
        className,
      ].join(" ")}
    >
      {showIcon && (
        <span className="shrink-0 mt-0.5 opacity-90">{resolvedIcon}</span>
      )}

      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-sm leading-tight mb-1">{title}</p>
        )}
        {children && (
          <div className="text-sm opacity-90 leading-relaxed">{children}</div>
        )}

        {actions && actions.length > 0 && (
          <div className="flex gap-3 mt-3">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`text-xs font-semibold underline underline-offset-2 transition-colors ${cfg.actionClass}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {closable && (
        <button
          onClick={handleClose}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity p-0.5 rounded"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
