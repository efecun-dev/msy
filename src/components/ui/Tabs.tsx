"use client";

import { ReactNode, useState, useId } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TabVariant = "line" | "pill" | "card";
export type TabSize = "sm" | "md" | "lg";
export type TabOrientation = "horizontal" | "vertical";

export interface TabItem {
  key: string;
  label: ReactNode;
  content?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultKey?: string;
  activeKey?: string;
  onChange?: (key: string) => void;
  variant?: TabVariant;
  size?: TabSize;
  orientation?: TabOrientation;
  className?: string;
  contentClassName?: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const variantStyles: Record<
  TabVariant,
  {
    list: string;
    tab: string;
    active: string;
    inactive: string;
  }
> = {
  line: {
    list: "border-b border-white/10 flex gap-0",
    tab: "px-4 py-2.5 border-b-2 -mb-px transition-colors duration-200 font-medium",
    active: "border-blue-500 text-blue-400",
    inactive:
      "border-transparent text-gray-400 hover:text-gray-200 hover:border-white/20",
  },
  pill: {
    list: "flex gap-1 bg-white/5 p-1 rounded-xl",
    tab: "px-4 py-2 rounded-lg transition-all duration-200 font-medium",
    active: "bg-blue-600 text-white shadow-lg shadow-blue-900/40",
    inactive: "text-gray-400 hover:text-gray-200 hover:bg-white/5",
  },
  card: {
    list: "flex gap-2",
    tab: "px-4 py-2.5 rounded-t-xl border border-b-0 transition-colors duration-200 font-medium",
    active: "bg-white/8 border-white/15 text-white",
    inactive:
      "bg-transparent border-transparent text-gray-400 hover:text-gray-200",
  },
};

const sizeClasses: Record<TabSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Tabs({
  items,
  defaultKey,
  activeKey: controlledKey,
  onChange,
  variant = "line",
  size = "md",
  orientation = "horizontal",
  className = "",
  contentClassName = "",
}: TabsProps) {
  const id = useId();
  const [internalKey, setInternalKey] = useState(defaultKey ?? items[0]?.key);
  const activeKey = controlledKey ?? internalKey;

  const handleChange = (key: string) => {
    setInternalKey(key);
    onChange?.(key);
  };

  const s = variantStyles[variant];
  const activeItem = items.find((it) => it.key === activeKey);

  if (orientation === "vertical") {
    return (
      <div className={`flex gap-4 ${className}`}>
        {/* Tab List */}
        <div className="flex flex-col gap-1 shrink-0 w-48">
          {items.map((item) => (
            <button
              key={item.key}
              id={`tab-${id}-${item.key}`}
              role="tab"
              aria-selected={activeKey === item.key}
              disabled={item.disabled}
              onClick={() => !item.disabled && handleChange(item.key)}
              className={[
                "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-left transition-all duration-200 font-medium disabled:opacity-40 disabled:cursor-not-allowed",
                sizeClasses[size],
                activeKey === item.key
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5",
              ].join(" ")}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
              {item.badge && <span>{item.badge}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={`flex-1 ${contentClassName}`}>
          {activeItem?.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Tab List */}
      <div role="tablist" className={`${s.list} overflow-x-auto`}>
        {items.map((item) => (
          <button
            key={item.key}
            id={`tab-${id}-${item.key}`}
            role="tab"
            aria-selected={activeKey === item.key}
            disabled={item.disabled}
            onClick={() => !item.disabled && handleChange(item.key)}
            className={[
              "inline-flex items-center gap-2 whitespace-nowrap shrink-0",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              s.tab,
              sizeClasses[size],
              activeKey === item.key ? s.active : s.inactive,
            ].join(" ")}
          >
            {item.icon && <span>{item.icon}</span>}
            {item.label}
            {item.badge && <span>{item.badge}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeItem?.content !== undefined && (
        <div
          role="tabpanel"
          aria-labelledby={`tab-${id}-${activeKey}`}
          className={`mt-5 ${contentClassName}`}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
}
