"use client";

import { forwardRef, SelectHTMLAttributes, useId, ReactNode } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectGroup {
  group: string;
  options: SelectOption[];
}

export type SelectSize = "sm" | "md" | "lg";

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size" | "prefix"
> {
  label?: string;
  hint?: string;
  error?: string;
  size?: SelectSize;
  options: (SelectOption | SelectGroup)[];
  placeholder?: string;
  prefix?: ReactNode;
  fullWidth?: boolean;
  required?: boolean;
}

const isGroup = (item: SelectOption | SelectGroup): item is SelectGroup =>
  "group" in item;

const sizeClasses: Record<SelectSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-4 py-3.5 text-base rounded-xl",
};

// ─── Component ────────────────────────────────────────────────────────────────

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      error,
      size = "md",
      options,
      placeholder,
      prefix,
      fullWidth = false,
      required,
      disabled,
      className = "",
      ...props
    },
    ref,
  ) => {
    const id = useId();

    return (
      <div className={`flex flex-col ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-panel-12 mb-1.5"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-panel-11 pointer-events-none z-10">
              {prefix}
            </div>
          )}

          <select
            ref={ref}
            id={id}
            disabled={disabled}
            className={[
              "w-full appearance-none text-panel-12",
              "bg-transparent border border-panel-6",
              "transition-all duration-200 outline-none",
              "focus:border-brand-9 focus:ring-1 focus:ring-brand-9/40",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                : "",
              sizeClasses[size],
              prefix ? "pl-9" : "",
              "pr-10",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}

            {options.map((item, i) =>
              isGroup(item) ? (
                <optgroup
                  key={i}
                  label={item.group}
                  className="bg-panel-1 font-semibold text-panel-11"
                >
                  {item.options.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled}
                      className="bg-panel-1 text-panel-12 font-normal"
                    >
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ) : (
                <option
                  key={(item as SelectOption).value}
                  value={(item as SelectOption).value}
                  disabled={(item as SelectOption).disabled}
                  className="bg-panel-1 text-panel-12"
                >
                  {(item as SelectOption).label}
                </option>
              ),
            )}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5">
            {error && <AlertCircle className="w-4 h-4 text-red-500" />}
            <ChevronDown className="w-4 h-4 text-panel-11" />
          </div>
        </div>

        {(hint || error) && (
          <p
            className={`mt-1.5 text-xs ${error ? "text-red-500" : "text-panel-11"}`}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
export default Select;
