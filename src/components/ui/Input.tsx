"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useState,
  useId,
} from "react";
import { Eye, EyeOff, X, Search, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type InputVariant = "default" | "filled" | "underline";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix"
> {
  label?: string;
  hint?: string;
  error?: string;
  variant?: InputVariant;
  size?: InputSize;
  prefix?: ReactNode;
  suffix?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  fullWidth?: boolean;
  required?: boolean;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const sizeClasses: Record<
  InputSize,
  { input: string; icon: string; label: string }
> = {
  sm: {
    input: "px-3 py-1.5 text-sm rounded-lg",
    icon: "w-4 h-4",
    label: "text-xs mb-1",
  },
  md: {
    input: "px-4 py-2.5 text-sm rounded-xl",
    icon: "w-4 h-4",
    label: "text-sm mb-1.5",
  },
  lg: {
    input: "px-4 py-3.5 text-base rounded-xl",
    icon: "w-5 h-5",
    label: "text-sm mb-1.5",
  },
};

const variantBase: Record<InputVariant, string> = {
  default:
    "bg-transparent border border-panel-6 focus:border-brand-9 focus:ring-1 focus:ring-brand-9/40",
  filled:
    "bg-brand-2 border border-transparent focus:border-brand-9 focus:ring-1 focus:ring-brand-9/40",
  underline:
    "bg-transparent border-0 border-b border-panel-6 rounded-none focus:border-brand-9 focus:ring-0 px-0",
};

// ============================================================================
// Component
// ============================================================================

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      variant = "default",
      size = "md",
      prefix,
      suffix,
      clearable = false,
      onClear,
      fullWidth = false,
      required,
      type = "text",
      className = "",
      value,
      onChange,
      disabled,
      ...props
    },
    ref,
  ) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const isSearch = type === "search";

    const resolvedType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : type;

    const hasValue = value !== undefined && value !== "";
    const showClear = clearable && hasValue && !disabled;
    const hasSuffix = suffix || isPassword || showClear;
    const hasPrefix = prefix || isSearch;

    return (
      <div className={`flex flex-col ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={id}
            className={`font-medium text-panel-12 ${sizeClasses[size].label}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {/* Prefix */}
          {hasPrefix && (
            <div className="absolute left-3 flex items-center justify-center text-panel-11 pointer-events-none z-10">
              {isSearch ? (
                <Search className={sizeClasses[size].icon} />
              ) : (
                prefix
              )}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={resolvedType}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={[
              "w-full text-panel-12 placeholder-panel-11",
              "transition-all duration-200 outline-none",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              sizeClasses[size].input,
              variantBase[variant],
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                : "",
              hasPrefix ? "pl-9" : "",
              hasSuffix ? "pr-9" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {/* Suffix area */}
          <div className="absolute right-3 flex items-center gap-1.5 z-10">
            {showClear && (
              <button
                type="button"
                onClick={onClear}
                className="text-panel-11 hover:text-panel-12 transition-colors"
                tabIndex={-1}
              >
                <X className={sizeClasses[size].icon} />
              </button>
            )}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-panel-11 hover:text-panel-12 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className={sizeClasses[size].icon} />
                ) : (
                  <Eye className={sizeClasses[size].icon} />
                )}
              </button>
            )}
            {!showClear && !isPassword && suffix && (
              <span className="text-panel-11">{suffix}</span>
            )}
            {error && !isPassword && !showClear && (
              <AlertCircle
                className={`${sizeClasses[size].icon} text-red-500 shrink-0`}
              />
            )}
          </div>
        </div>

        {/* Hint / Error */}
        {(hint || error) && (
          <p
            className={`mt-1.5 text-xs ${
              error ? "text-red-500" : "text-panel-11"
            }`}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
