import { HTMLAttributes } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SpinnerVariant = "ring" | "dots" | "pulse" | "bars";
export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  color?: string;
  label?: string;
}

const sizeMap: Record<SpinnerSize, number> = {
  xs: 14,
  sm: 18,
  md: 24,
  lg: 36,
  xl: 48,
};

// ─── Ring ─────────────────────────────────────────────────────────────────────

function Ring({ size, color = "#3b82f6" }: { size: number; color?: string }) {
  const stroke = Math.max(2, size / 10);
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;

  return (
    <svg
      width={size}
      height={size}
      className="animate-spin"
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * 0.75}
      />
    </svg>
  );
}

// ─── Dots ─────────────────────────────────────────────────────────────────────

function Dots({ size }: { size: number }) {
  const dot = Math.max(4, size / 5);
  return (
    <div className="flex items-center gap-1" style={{ height: size }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-full bg-blue-500 animate-bounce"
          style={{
            width: dot,
            height: dot,
            animationDelay: `${i * 0.15}s`,
            animationDuration: "0.8s",
          }}
        />
      ))}
    </div>
  );
}

// ─── Pulse ────────────────────────────────────────────────────────────────────

function Pulse({ size }: { size: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />
      <div className="w-1/2 h-1/2 rounded-full bg-blue-500" />
    </div>
  );
}

// ─── Bars ─────────────────────────────────────────────────────────────────────

function Bars({ size }: { size: number }) {
  const barW = Math.max(3, size / 8);
  return (
    <div className="flex items-end gap-0.5" style={{ height: size }}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-blue-500 rounded-sm animate-pulse"
          style={{
            width: barW,
            height: size * (0.4 + i * 0.15),
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

export default function Spinner({
  variant = "ring",
  size = "md",
  color,
  label,
  className = "",
  ...props
}: SpinnerProps) {
  const dim = sizeMap[size];

  const spinnerEl = {
    ring: <Ring size={dim} color={color} />,
    dots: <Dots size={dim} />,
    pulse: <Pulse size={dim} />,
    bars: <Bars size={dim} />,
  }[variant];

  return (
    <div
      role="status"
      aria-label={label ?? "Yükleniyor"}
      className={`inline-flex flex-col items-center gap-2 ${className}`}
      {...props}
    >
      {spinnerEl}
      {label && (
        <span className="text-xs text-gray-400 animate-pulse">{label}</span>
      )}
    </div>
  );
}
