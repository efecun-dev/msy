"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AccordionType = "single" | "multiple";
export type AccordionVariant = "default" | "bordered" | "flush";
export type AccordionIconPosition = "left" | "right";

export interface AccordionItem {
  key: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: AccordionType;
  variant?: AccordionVariant;
  iconPosition?: AccordionIconPosition;
  defaultOpen?: string | string[];
  className?: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const variantStyles: Record<
  AccordionVariant,
  { wrapper: string; item: string; trigger: string }
> = {
  default: {
    wrapper: "space-y-2",
    item: "rounded-xl border border-white/10 bg-white/5 overflow-hidden",
    trigger: "px-5 py-4",
  },
  bordered: {
    wrapper:
      "rounded-xl border border-white/15 overflow-hidden divide-y divide-white/10",
    item: "bg-white/3",
    trigger: "px-5 py-4",
  },
  flush: {
    wrapper: "divide-y divide-white/10",
    item: "",
    trigger: "py-4",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Accordion({
  items,
  type = "single",
  variant = "default",
  iconPosition = "right",
  defaultOpen,
  className = "",
}: AccordionProps) {
  const initOpen = defaultOpen
    ? Array.isArray(defaultOpen)
      ? defaultOpen
      : [defaultOpen]
    : [];

  const [openKeys, setOpenKeys] = useState<string[]>(initOpen);

  const toggle = (key: string) => {
    if (type === "single") {
      setOpenKeys((prev) => (prev.includes(key) ? [] : [key]));
    } else {
      setOpenKeys((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
      );
    }
  };

  const s = variantStyles[variant];

  return (
    <div className={`${s.wrapper} ${className}`}>
      {items.map((item) => {
        const isOpen = openKeys.includes(item.key);

        return (
          <div key={item.key} className={s.item}>
            {/* Trigger */}
            <button
              onClick={() => !item.disabled && toggle(item.key)}
              disabled={item.disabled}
              aria-expanded={isOpen}
              className={[
                "w-full flex items-center gap-3 text-left transition-colors duration-200",
                "hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500",
                s.trigger,
              ].join(" ")}
            >
              {/* Left icon position */}
              {iconPosition === "left" && (
                <ChevronDown
                  className={`w-4 h-4 text-blue-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              )}

              {/* Item icon */}
              {item.icon && (
                <span className="text-blue-400 shrink-0">{item.icon}</span>
              )}

              <span className="flex-1 font-semibold text-white text-sm">
                {item.title}
              </span>

              {/* Right icon position */}
              {iconPosition === "right" && (
                <ChevronDown
                  className={`w-4 h-4 text-blue-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* Content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-5 pb-4 pt-0 text-sm text-gray-400 leading-relaxed border-t border-white/5">
                <div className="pt-3">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
