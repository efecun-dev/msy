"use client";

import { ReactNode, useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type TooltipVariant = "dark" | "light" | "glass";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
  variant?: TooltipVariant;
  delay?: number;
  arrow?: boolean;
  className?: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const positionClasses: Record<
  TooltipPosition,
  { tooltip: string; arrow: string }
> = {
  top: {
    tooltip: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    arrow:
      "top-full left-1/2 -translate-x-1/2 border-t-current border-l-transparent border-r-transparent border-b-transparent border-4",
  },
  bottom: {
    tooltip: "top-full left-1/2 -translate-x-1/2 mt-2",
    arrow:
      "bottom-full left-1/2 -translate-x-1/2 border-b-current border-l-transparent border-r-transparent border-t-transparent border-4",
  },
  left: {
    tooltip: "right-full top-1/2 -translate-y-1/2 mr-2",
    arrow:
      "left-full top-1/2 -translate-y-1/2 border-l-current border-t-transparent border-b-transparent border-r-transparent border-4",
  },
  right: {
    tooltip: "left-full top-1/2 -translate-y-1/2 ml-2",
    arrow:
      "right-full top-1/2 -translate-y-1/2 border-r-current border-t-transparent border-b-transparent border-l-transparent border-4",
  },
};

const variantClasses: Record<TooltipVariant, string> = {
  dark: "bg-gray-900 border border-white/10 text-white",
  light: "bg-white text-gray-900 border border-gray-200",
  glass: "bg-black/60 backdrop-blur-md border border-white/15 text-white",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Tooltip({
  content,
  children,
  position = "top",
  variant = "dark",
  delay = 200,
  arrow = true,
  className = "",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const p = positionClasses[position];

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {visible && (
        <span
          role="tooltip"
          className={[
            "absolute z-50 whitespace-nowrap text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none",
            variantClasses[variant],
            p.tooltip,
          ].join(" ")}
        >
          {content}
          {arrow && <span className={`absolute w-0 h-0 ${p.arrow}`} />}
        </span>
      )}
    </span>
  );
}
