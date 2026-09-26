import { HTMLAttributes } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SkeletonVariant = "text" | "rect" | "circle" | "card";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  lines?: number;
  width?: string | number;
  height?: string | number;
  animated?: boolean;
}

// ─── Base Skeleton ────────────────────────────────────────────────────────────

function SkeletonBase({
  width,
  height,
  className = "",
  animated = true,
  style,
  ...props
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
  animated?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={[
        "bg-white/8 rounded",
        animated ? "animate-pulse" : "",
        className,
      ].join(" ")}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Skeleton({
  variant = "rect",
  lines = 3,
  width,
  height,
  animated = true,
  className = "",
  ...props
}: SkeletonProps) {
  if (variant === "text") {
    return (
      <div className={`flex flex-col gap-2 ${className}`} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonBase
            key={i}
            height={14}
            width={i === lines - 1 ? "65%" : "100%"}
            animated={animated}
            className="rounded-full"
          />
        ))}
      </div>
    );
  }

  if (variant === "circle") {
    const dim = height || width || 48;
    return (
      <SkeletonBase
        width={dim}
        height={dim}
        animated={animated}
        className={`rounded-full ${className}`}
        {...props}
      />
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`rounded-2xl border border-white/10 overflow-hidden ${className}`}
        {...props}
      >
        <SkeletonBase
          height={160}
          animated={animated}
          className="rounded-none"
        />
        <div className="p-4 space-y-3">
          <SkeletonBase
            height={20}
            width="70%"
            animated={animated}
            className="rounded-full"
          />
          <SkeletonBase
            height={14}
            animated={animated}
            className="rounded-full"
          />
          <SkeletonBase
            height={14}
            animated={animated}
            className="rounded-full"
          />
          <SkeletonBase
            height={14}
            width="50%"
            animated={animated}
            className="rounded-full"
          />
          <div className="flex gap-3 pt-2">
            <SkeletonBase
              height={36}
              className="flex-1 rounded-xl"
              animated={animated}
            />
            <SkeletonBase
              height={36}
              width={80}
              className="rounded-xl"
              animated={animated}
            />
          </div>
        </div>
      </div>
    );
  }

  // rect (default)
  return (
    <SkeletonBase
      width={width}
      height={height ?? 40}
      animated={animated}
      className={`rounded-xl ${className}`}
      {...props}
    />
  );
}
