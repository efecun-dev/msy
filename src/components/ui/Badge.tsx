import { ReactNode } from "react";
import { X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "gray"
  | "cyan"
  | "orange";
export type BadgeVariant = "solid" | "subtle" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  children?: ReactNode;
  color?: BadgeColor;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  icon?: ReactNode;
  className?: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const colorMap: Record<BadgeColor, Record<BadgeVariant, string>> = {
  blue: {
    solid: "bg-blue-600 text-white",
    subtle: "bg-blue-500/15 text-blue-300 border border-blue-500/20",
    outline: "border border-blue-500 text-blue-400 bg-transparent",
  },
  green: {
    solid: "bg-emerald-600 text-white",
    subtle: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
    outline: "border border-emerald-500 text-emerald-400 bg-transparent",
  },
  red: {
    solid: "bg-red-600 text-white",
    subtle: "bg-red-500/15 text-red-300 border border-red-500/20",
    outline: "border border-red-500 text-red-400 bg-transparent",
  },
  yellow: {
    solid: "bg-amber-500 text-black",
    subtle: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
    outline: "border border-amber-500 text-amber-400 bg-transparent",
  },
  purple: {
    solid: "bg-purple-600 text-white",
    subtle: "bg-purple-500/15 text-purple-300 border border-purple-500/20",
    outline: "border border-purple-500 text-purple-400 bg-transparent",
  },
  gray: {
    solid: "bg-gray-600 text-white",
    subtle: "bg-white/10 text-gray-300 border border-white/15",
    outline: "border border-gray-500 text-gray-400 bg-transparent",
  },
  cyan: {
    solid: "bg-cyan-600 text-white",
    subtle: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20",
    outline: "border border-cyan-500 text-cyan-400 bg-transparent",
  },
  orange: {
    solid: "bg-orange-600 text-white",
    subtle: "bg-orange-500/15 text-orange-300 border border-orange-500/20",
    outline: "border border-orange-500 text-orange-400 bg-transparent",
  },
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5 rounded-md gap-1",
  md: "text-xs px-2.5 py-1 rounded-lg gap-1.5",
  lg: "text-sm px-3 py-1.5 rounded-xl gap-2",
};

const dotColors: Record<BadgeColor, string> = {
  blue: "bg-blue-400",
  green: "bg-emerald-400",
  red: "bg-red-400",
  yellow: "bg-amber-400",
  purple: "bg-purple-400",
  gray: "bg-gray-400",
  cyan: "bg-cyan-400",
  orange: "bg-orange-400",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Badge({
  children,
  color = "blue",
  variant = "subtle",
  size = "md",
  dot = false,
  removable = false,
  onRemove,
  icon,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center font-semibold select-none",
        colorMap[color][variant],
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[color]}`}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity shrink-0"
          aria-label="Kaldır"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
