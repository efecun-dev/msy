import { ReactNode } from "react";
import { X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TagColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "gray"
  | "cyan"
  | "orange";
export type TagSize = "sm" | "md" | "lg";
export type TagVariant = "solid" | "subtle" | "outline";

export interface TagProps {
  children?: ReactNode;
  color?: TagColor;
  size?: TagSize;
  variant?: TagVariant;
  icon?: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const colorMap: Record<TagColor, Record<TagVariant, string>> = {
  blue: {
    solid: "bg-blue-600 text-white",
    subtle: "bg-blue-500/15 text-blue-300 border border-blue-500/25",
    outline: "border border-blue-500 text-blue-400",
  },
  green: {
    solid: "bg-emerald-600 text-white",
    subtle: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25",
    outline: "border border-emerald-500 text-emerald-400",
  },
  red: {
    solid: "bg-red-600 text-white",
    subtle: "bg-red-500/15 text-red-300 border border-red-500/25",
    outline: "border border-red-500 text-red-400",
  },
  yellow: {
    solid: "bg-amber-500 text-black",
    subtle: "bg-amber-500/15 text-amber-300 border border-amber-500/25",
    outline: "border border-amber-500 text-amber-400",
  },
  purple: {
    solid: "bg-purple-600 text-white",
    subtle: "bg-purple-500/15 text-purple-300 border border-purple-500/25",
    outline: "border border-purple-500 text-purple-400",
  },
  gray: {
    solid: "bg-gray-600 text-white",
    subtle: "bg-white/10 text-gray-300 border border-white/15",
    outline: "border border-gray-500 text-gray-400",
  },
  cyan: {
    solid: "bg-cyan-600 text-white",
    subtle: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25",
    outline: "border border-cyan-500 text-cyan-400",
  },
  orange: {
    solid: "bg-orange-600 text-white",
    subtle: "bg-orange-500/15 text-orange-300 border border-orange-500/25",
    outline: "border border-orange-500 text-orange-400",
  },
};

const sizeClasses: Record<TagSize, string> = {
  sm: "text-[10px] px-2 py-0.5 rounded-md gap-1",
  md: "text-xs px-2.5 py-1 rounded-lg gap-1.5",
  lg: "text-sm px-3 py-1.5 rounded-xl gap-2",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Tag({
  children,
  color = "blue",
  size = "md",
  variant = "subtle",
  icon,
  closable = false,
  onClose,
  className = "",
}: TagProps) {
  return (
    <span
      className={[
        "inline-flex items-center font-medium",
        colorMap[color][variant],
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {closable && (
        <button
          onClick={onClose}
          className="shrink-0 ml-0.5 opacity-70 hover:opacity-100 transition-opacity rounded"
          aria-label="Kaldır"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
