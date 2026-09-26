"use client";

import { useId } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SwitchSize = "sm" | "md" | "lg";
export type SwitchColor = "blue" | "green" | "purple" | "red";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  onLabel?: string;
  offLabel?: string;
  size?: SwitchSize;
  color?: SwitchColor;
  disabled?: boolean;
  className?: string;
}

const sizeMap: Record<
  SwitchSize,
  { track: string; thumb: string; translate: string }
> = {
  sm: {
    track: "w-8 h-4",
    thumb: "w-3 h-3 top-0.5 left-0.5",
    translate: "translate-x-4",
  },
  md: {
    track: "w-11 h-6",
    thumb: "w-5 h-5 top-0.5 left-0.5",
    translate: "translate-x-5",
  },
  lg: {
    track: "w-14 h-7",
    thumb: "w-6 h-6 top-0.5 left-0.5",
    translate: "translate-x-7",
  },
};

const colorMap: Record<SwitchColor, string> = {
  blue: "bg-blue-600",
  green: "bg-emerald-600",
  purple: "bg-purple-600",
  red: "bg-red-600",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Switch({
  checked,
  onChange,
  label,
  description,
  onLabel,
  offLabel,
  size = "md",
  color = "blue",
  disabled = false,
  className = "",
}: SwitchProps) {
  const id = useId();
  const s = sizeMap[size];

  return (
    <div
      className={`flex items-start gap-3 ${disabled ? "opacity-50" : ""} ${className}`}
    >
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={[
          "relative shrink-0 rounded-full transition-colors duration-200 cursor-pointer",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
          "disabled:cursor-not-allowed",
          s.track,
          checked ? colorMap[color] : "bg-white/15",
        ].join(" ")}
      >
        <span
          className={[
            "absolute rounded-full bg-white shadow-sm transition-transform duration-200",
            s.thumb,
            checked ? s.translate : "translate-x-0",
          ].join(" ")}
        />
      </button>

      {(label || description || onLabel || offLabel) && (
        <label
          htmlFor={id}
          className={`flex flex-col cursor-pointer ${disabled ? "cursor-not-allowed" : ""}`}
        >
          {label && (
            <span className="text-sm font-medium text-gray-200 leading-tight">
              {label}
            </span>
          )}
          {(onLabel || offLabel) && (
            <span className="text-xs text-blue-400 font-medium">
              {checked ? onLabel : offLabel}
            </span>
          )}
          {description && (
            <span className="text-xs text-gray-500 mt-0.5">{description}</span>
          )}
        </label>
      )}
    </div>
  );
}
