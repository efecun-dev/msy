"use client";

import { forwardRef, InputHTMLAttributes, useId, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RadioSize = "sm" | "md" | "lg";
export type RadioGroupOrientation = "horizontal" | "vertical";

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  label?: ReactNode;
  description?: string;
  size?: RadioSize;
  cardVariant?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  orientation?: RadioGroupOrientation;
  size?: RadioSize;
  cardVariant?: boolean;
  label?: string;
  error?: string;
}

const sizeMap: Record<
  RadioSize,
  { circle: string; inner: string; label: string; desc: string }
> = {
  sm: {
    circle: "w-4 h-4",
    inner: "w-1.5 h-1.5",
    label: "text-sm",
    desc: "text-xs",
  },
  md: {
    circle: "w-5 h-5",
    inner: "w-2 h-2",
    label: "text-sm",
    desc: "text-xs",
  },
  lg: {
    circle: "w-6 h-6",
    inner: "w-2.5 h-2.5",
    label: "text-base",
    desc: "text-sm",
  },
};

// ─── Radio (single) ───────────────────────────────────────────────────────────

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      description,
      size = "md",
      cardVariant = false,
      checked,
      disabled,
      className = "",
      ...props
    },
    ref,
  ) => {
    const id = useId();
    const s = sizeMap[size];

    if (cardVariant) {
      return (
        <label
          htmlFor={id}
          className={[
            "relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150",
            checked
              ? "border-blue-500 bg-blue-500/10"
              : "border-white/15 bg-white/5 hover:border-white/30",
            disabled ? "opacity-50 cursor-not-allowed" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <input
            ref={ref}
            id={id}
            type="radio"
            checked={checked}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={`shrink-0 mt-0.5 ${s.circle} rounded-full border-2 flex items-center justify-center transition-all duration-150 ${checked ? "border-blue-500 bg-blue-500/10" : "border-white/25"}`}
          >
            {checked && (
              <div className={`${s.inner} rounded-full bg-blue-400`} />
            )}
          </div>
          <div>
            {label && (
              <div className={`${s.label} font-medium text-gray-200`}>
                {label}
              </div>
            )}
            {description && (
              <div className={`${s.desc} text-gray-500 mt-0.5`}>
                {description}
              </div>
            )}
          </div>
        </label>
      );
    }

    return (
      <label
        htmlFor={id}
        className={`inline-flex items-start gap-3 cursor-pointer group ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      >
        <input
          ref={ref}
          id={id}
          type="radio"
          checked={checked}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={`shrink-0 mt-px ${s.circle} rounded-full border-2 flex items-center justify-center transition-all duration-150 ${checked ? "border-blue-500 bg-blue-500/10" : "border-white/25 group-hover:border-blue-400/50"}`}
        >
          {checked && <div className={`${s.inner} rounded-full bg-blue-400`} />}
        </div>
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
      </label>
    );
  },
);

Radio.displayName = "Radio";

// ─── RadioGroup ───────────────────────────────────────────────────────────────

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  orientation = "vertical",
  size = "md",
  cardVariant = false,
  label,
  error,
}: RadioGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="text-sm font-medium text-gray-300 mb-1">{label}</div>
      )}
      <div
        className={`flex gap-3 ${orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col"}`}
      >
        {options.map((opt) => (
          <Radio
            key={opt.value}
            name={name}
            label={opt.label}
            description={opt.description}
            value={opt.value}
            checked={value === opt.value}
            disabled={opt.disabled}
            size={size}
            cardVariant={cardVariant}
            onChange={() => onChange?.(opt.value)}
          />
        ))}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export default Radio;
