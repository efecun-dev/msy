import { HTMLAttributes } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProgressVariant = "bar" | "circular" | "steps";
export type ProgressSize = "xs" | "sm" | "md" | "lg";
export type ProgressColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "cyan";

export interface ProgressStep {
  label?: string;
  completed: boolean;
  active?: boolean;
}

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  color?: ProgressColor;
  animated?: boolean;
  striped?: boolean;
  showLabel?: boolean;
  label?: string;
  steps?: ProgressStep[];
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const colorMap: Record<ProgressColor, string> = {
  blue: "bg-blue-600",
  green: "bg-emerald-600",
  red: "bg-red-600",
  yellow: "bg-amber-500",
  purple: "bg-purple-600",
  cyan: "bg-cyan-600",
};

const trackColorMap: Record<ProgressColor, string> = {
  blue: "text-blue-400",
  green: "text-emerald-400",
  red: "text-red-400",
  yellow: "text-amber-400",
  purple: "text-purple-400",
  cyan: "text-cyan-400",
};

const barSizeMap: Record<ProgressSize, string> = {
  xs: "h-1",
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

// ─── Bar Progress ─────────────────────────────────────────────────────────────

function BarProgress({
  value,
  max = 100,
  size = "md",
  color = "blue",
  animated = false,
  striped = false,
  showLabel = false,
  label,
  className = "",
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-300">{label}</span>
          <span className="text-xs font-semibold text-gray-400">
            {Math.round(pct)}%
          </span>
        </div>
      )}
      <div
        className={`w-full rounded-full bg-white/10 overflow-hidden ${barSizeMap[size]}`}
      >
        <div
          className={[
            "h-full rounded-full transition-all duration-500 ease-out",
            colorMap[color],
            animated ? "animate-pulse" : "",
            striped
              ? "bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.1)_0px,rgba(255,255,255,0.1)_10px,transparent_10px,transparent_20px)]"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

// ─── Circular Progress ────────────────────────────────────────────────────────

function CircularProgress({
  value,
  max = 100,
  size = "md",
  color = "blue",
  showLabel = true,
  label,
  className = "",
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const sizes: Record<ProgressSize, number> = {
    xs: 40,
    sm: 56,
    md: 72,
    lg: 96,
  };
  const dim = sizes[size];
  const radius = (dim - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <svg width={dim} height={dim} className="-rotate-90">
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={6}
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${trackColorMap[color]} transition-all duration-500`}
          stroke="currentColor"
        />
      </svg>
      {showLabel && (
        <span
          className={`text-xs font-semibold ${trackColorMap[color]} -mt-${dim / 2}`}
        >
          {label ?? `${Math.round(pct)}%`}
        </span>
      )}
    </div>
  );
}

// ─── Steps Progress ───────────────────────────────────────────────────────────

function StepsProgress({
  steps = [],
  color = "blue",
  className = "",
}: ProgressProps) {
  return (
    <div className={`flex items-center gap-0 ${className}`}>
      {steps.map((step, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div
            className={[
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 transition-all duration-300",
              step.completed
                ? `${colorMap[color]} border-transparent text-white`
                : "",
              step.active && !step.completed
                ? `border-current ${trackColorMap[color]} bg-transparent`
                : "",
              !step.completed && !step.active
                ? "border-white/20 text-gray-500"
                : "",
            ].join(" ")}
          >
            {step.completed ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {step.label && (
            <span
              className={`text-xs ml-2 font-medium ${step.completed || step.active ? "text-gray-200" : "text-gray-500"}`}
            >
              {step.label}
            </span>
          )}
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-px mx-3 ${step.completed ? colorMap[color] : "bg-white/10"} transition-colors duration-300`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function Progress(props: ProgressProps) {
  if (props.variant === "circular") return <CircularProgress {...props} />;
  if (props.variant === "steps") return <StepsProgress {...props} />;
  return <BarProgress {...props} />;
}
