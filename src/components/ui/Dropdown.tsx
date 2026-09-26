"use client";

import { ReactNode, useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DropdownTrigger = "click" | "hover";
export type DropdownPlacement =
  | "bottom-start"
  | "bottom-end"
  | "bottom-center"
  | "top-start"
  | "top-end"
  | "top-center"
  | "left"
  | "right";

export interface DropdownItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  placement?: DropdownPlacement;
  triggerMode?: DropdownTrigger;
  className?: string;
  menuClassName?: string;
  minWidth?: number;
}

// ─── Placement Styles ─────────────────────────────────────────────────────────

const placementClasses: Record<DropdownPlacement, string> = {
  "bottom-start": "top-full left-0 mt-1.5",
  "bottom-end": "top-full right-0 mt-1.5",
  "bottom-center": "top-full left-1/2 -translate-x-1/2 mt-1.5",
  "top-start": "bottom-full left-0 mb-1.5",
  "top-end": "bottom-full right-0 mb-1.5",
  "top-center": "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
  left: "right-full top-0 mr-1.5",
  right: "left-full top-0 ml-1.5",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dropdown({
  trigger,
  items,
  placement = "bottom-start",
  triggerMode = "click",
  className = "",
  menuClassName = "",
  minWidth = 180,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hoverProps =
    triggerMode === "hover"
      ? {
          onMouseEnter: () => setOpen(true),
          onMouseLeave: () => setOpen(false),
        }
      : {};

  return (
    <div
      ref={ref}
      className={`relative inline-block ${className}`}
      {...hoverProps}
    >
      {/* Trigger */}
      <div
        onClick={() => triggerMode === "click" && setOpen((v) => !v)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Menu */}
      {open && (
        <div
          className={[
            "absolute z-50 rounded-xl border border-white/15 bg-[#0d1117] shadow-2xl shadow-black/60 py-1 overflow-hidden",
            placementClasses[placement],
            menuClassName,
          ].join(" ")}
          style={{ minWidth }}
        >
          {/* Top glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

          {items.map((item) => {
            if (item.separator) {
              return (
                <div key={item.key} className="h-px bg-white/10 my-1 mx-2" />
              );
            }

            return (
              <button
                key={item.key}
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.();
                    setOpen(false);
                  }
                }}
                className={[
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150",
                  "text-left focus:outline-none",
                  item.danger
                    ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    : "text-gray-300 hover:bg-white/8 hover:text-white",
                  item.disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer",
                ].join(" ")}
              >
                {item.icon && (
                  <span className="shrink-0 w-4 h-4 flex items-center justify-center text-gray-400">
                    {item.icon}
                  </span>
                )}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <kbd className="text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 font-mono">
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
