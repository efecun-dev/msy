import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "warning";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 hover:bg-blue-500 text-white border border-blue-600 hover:border-blue-500 focus-visible:ring-blue-500 shadow-lg shadow-blue-900/30 hover:shadow-blue-700/40",
  secondary:
    "bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-white/30 focus-visible:ring-gray-400",
  outline:
    "bg-transparent hover:bg-blue-500/10 text-blue-400 border border-blue-500/50 hover:border-blue-400 focus-visible:ring-blue-500",
  ghost:
    "bg-transparent hover:bg-white/8 text-gray-300 hover:text-white border border-transparent focus-visible:ring-gray-400",
  danger:
    "bg-red-600 hover:bg-red-500 text-white border border-red-600 hover:border-red-500 focus-visible:ring-red-500 shadow-lg shadow-red-900/30",
  success:
    "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-600 hover:border-emerald-500 focus-visible:ring-emerald-500 shadow-lg shadow-emerald-900/30",
  warning:
    "bg-amber-500 hover:bg-amber-400 text-black border border-amber-500 hover:border-amber-400 focus-visible:ring-amber-500 shadow-lg shadow-amber-900/30",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1 text-xs rounded-md gap-1",
  sm: "px-3.5 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2",
  xl: "px-8 py-4 text-base rounded-2xl gap-2.5",
};

const iconSizeClasses: Record<ButtonSize, string> = {
  xs: "w-3 h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
  xl: "w-5 h-5",
};

// ─── Component ────────────────────────────────────────────────────────────────

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      className = "",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          "inline-flex items-center justify-center font-semibold",
          "transition-all duration-200 cursor-pointer select-none",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          "active:scale-[0.97]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {loading ? (
          <Loader2
            className={`${iconSizeClasses[size]} animate-spin shrink-0`}
          />
        ) : leftIcon ? (
          <span
            className={`${iconSizeClasses[size]} shrink-0 flex items-center justify-center`}
          >
            {leftIcon}
          </span>
        ) : null}

        {children && <span>{children}</span>}

        {!loading && rightIcon && (
          <span
            className={`${iconSizeClasses[size]} shrink-0 flex items-center justify-center`}
          >
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
