"use client";

import { forwardRef, InputHTMLAttributes, useId, ReactNode } from "react";
import { Check, Minus } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  label?: ReactNode;
  description?: string;
  size?: CheckboxSize;
  indeterminate?: boolean;
  error?: string;
}

const sizeMap: Record<
  CheckboxSize,
  { box: string; icon: string; label: string; desc: string }
> = {
  sm: {
    box: "w-4 h-4 rounded",
    icon: "w-2.5 h-2.5",
    label: "text-sm",
    desc: "text-xs",
  },
  md: {
    box: "w-5 h-5 rounded-md",
    icon: "w-3 h-3",
    label: "text-sm",
    desc: "text-xs",
  },
  lg: {
    box: "w-6 h-6 rounded-md",
    icon: "w-3.5 h-3.5",
    label: "text-base",
    desc: "text-sm",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      size = "md",
      indeterminate = false,
      error,
      checked,
      disabled,
      className = "",
      ...props
    },
    ref,
  ) => {
    const id = useId();
    const s = sizeMap[size];

    const isChecked = checked || indeterminate;

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label
          htmlFor={id}
          className={`inline-flex items-start gap-3 cursor-pointer group ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {/* Hidden native input */}
          <input
            ref={ref}
            id={id}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="sr-only"
            {...props}
          />

          {/* Visual checkbox */}
          <div
            className={[
              s.box,
              "shrink-0 border-2 flex items-center justify-center",
              "transition-all duration-150",
              isChecked
                ? "bg-blue-600 border-blue-600"
                : "bg-white/5 border-white/20 group-hover:border-blue-400/60",
              error ? "border-red-500" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {indeterminate ? (
              <Minus className={`${s.icon} text-white`} strokeWidth={3} />
            ) : checked ? (
              <Check className={`${s.icon} text-white`} strokeWidth={3} />
            ) : null}
          </div>

          {/* Label + Description */}
          {(label || description) && (
            <div className="pt-px">
              {label && (
                <div
                  className={`${s.label} font-medium text-gray-200 leading-tight`}
                >
                  {label}
                </div>
              )}
              {description && (
                <div className={`${s.desc} text-gray-500 mt-0.5`}>
                  {description}
                </div>
              )}
            </div>
          )}
        </label>

        {error && <p className="text-xs text-red-400 ml-8">{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
