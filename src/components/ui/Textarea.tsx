"use client";

import {
  forwardRef,
  TextareaHTMLAttributes,
  useId,
  useEffect,
  useRef,
} from "react";
import { AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TextareaResize = "none" | "y" | "both";

export interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "prefix"
> {
  label?: string;
  hint?: string;
  error?: string;
  resize?: TextareaResize;
  autoResize?: boolean;
  showCount?: boolean;
  maxLength?: number;
  fullWidth?: boolean;
  required?: boolean;
}

const resizeClasses: Record<TextareaResize, string> = {
  none: "resize-none",
  y: "resize-y",
  both: "resize",
};

// ─── Component ────────────────────────────────────────────────────────────────

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      hint,
      error,
      resize = "none",
      autoResize = false,
      showCount = false,
      maxLength,
      fullWidth = false,
      required,
      value,
      onChange,
      disabled,
      rows = 4,
      className = "",
      ...props
    },
    ref,
  ) => {
    const id = useId();
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const resolvedRef =
      (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    const charCount = typeof value === "string" ? value.length : 0;

    useEffect(() => {
      if (!autoResize || !resolvedRef.current) return;
      const el = resolvedRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [value, autoResize, resolvedRef]);

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

        <div className="relative">
          <textarea
            ref={resolvedRef}
            id={id}
            rows={autoResize ? 1 : rows}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={[
              "w-full px-4 py-3 text-sm text-panel-12 placeholder-panel-11",
              "bg-transparent border border-panel-6 rounded-xl",
              "transition-all duration-200 outline-none",
              "focus:border-brand-9 focus:ring-1 focus:ring-brand-9/40",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                : "",
              showCount || maxLength ? "pb-8" : "",
              autoResize
                ? "resize-none overflow-hidden"
                : resizeClasses[resize],
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {/* Character count */}
          {(showCount || maxLength) && (
            <div className="absolute bottom-2 right-3 text-xs text-panel-11 select-none">
              {maxLength ? (
                <span className={charCount >= maxLength ? "text-red-500" : ""}>
                  {charCount}/{maxLength}
                </span>
              ) : (
                <span>{charCount}</span>
              )}
            </div>
          )}

          {error && (
            <AlertCircle className="absolute top-3 right-3 w-4 h-4 text-red-500 pointer-events-none" />
          )}
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

Textarea.displayName = "Textarea";
export default Textarea;
