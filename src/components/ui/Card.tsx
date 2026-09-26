import { ReactNode, HTMLAttributes } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CardVariant = "default" | "bordered" | "elevated" | "glass";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  header?: ReactNode;
  footer?: ReactNode;
  cover?: ReactNode;
  hoverable?: boolean;
  glow?: boolean;
  children?: ReactNode;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const variantClasses: Record<CardVariant, string> = {
  default: "bg-white/5 border border-white/10",
  bordered: "bg-transparent border-2 border-white/15",
  elevated: "bg-[#0d1117] border border-white/10 shadow-xl shadow-black/40",
  glass: "bg-white/[0.04] backdrop-blur-md border border-white/10",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-4 border-b border-white/10 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-4 border-t border-white/10 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`font-bold text-white text-lg leading-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-gray-400 text-sm mt-1 leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

// ─── Card Component ───────────────────────────────────────────────────────────

export default function Card({
  variant = "default",
  padding = "md",
  header,
  footer,
  cover,
  hoverable = false,
  glow = false,
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "relative rounded-2xl overflow-hidden",
        variantClasses[variant],
        hoverable
          ? "transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-900/20 cursor-pointer"
          : "",
        glow ? "shadow-lg shadow-blue-900/20" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {/* Top accent line */}
      {glow && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      )}

      {cover && <div className="w-full">{cover}</div>}

      {header && (
        <div className="px-6 py-4 border-b border-white/10">{header}</div>
      )}

      {children && (
        <div
          className={
            !header && !footer && !cover
              ? paddingClasses[padding]
              : paddingClasses[padding]
          }
        >
          {children}
        </div>
      )}

      {footer && (
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02]">
          {footer}
        </div>
      )}
    </div>
  );
}
