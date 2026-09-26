import { HTMLAttributes } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarStatus = "online" | "offline" | "busy" | "away";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  square?: boolean;
  border?: boolean;
}

export interface AvatarGroupProps {
  avatars: AvatarProps[];
  max?: number;
  size?: AvatarSize;
  className?: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const sizeClasses: Record<
  AvatarSize,
  { container: string; text: string; status: string }
> = {
  xs: {
    container: "w-6 h-6",
    text: "text-[9px]",
    status: "w-1.5 h-1.5 border",
  },
  sm: { container: "w-8 h-8", text: "text-xs", status: "w-2 h-2 border" },
  md: {
    container: "w-10 h-10",
    text: "text-sm",
    status: "w-2.5 h-2.5 border-2",
  },
  lg: { container: "w-12 h-12", text: "text-base", status: "w-3 h-3 border-2" },
  xl: {
    container: "w-16 h-16",
    text: "text-xl",
    status: "w-3.5 h-3.5 border-2",
  },
  "2xl": {
    container: "w-20 h-20",
    text: "text-2xl",
    status: "w-4 h-4 border-2",
  },
};

const statusColors: Record<AvatarStatus, string> = {
  online: "bg-emerald-500",
  offline: "bg-gray-500",
  busy: "bg-red-500",
  away: "bg-amber-500",
};

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

export default function Avatar({
  src,
  alt = "",
  fallback,
  size = "md",
  status,
  square = false,
  border = false,
  className = "",
  ...props
}: AvatarProps) {
  const s = sizeClasses[size];
  const radius = square ? "rounded-lg" : "rounded-full";

  return (
    <div
      className={[
        "relative inline-flex shrink-0 items-center justify-center",
        s.container,
        radius,
        border
          ? "ring-2 ring-blue-500/40 ring-offset-2 ring-offset-[#0a0a0a]"
          : "",
        className,
      ].join(" ")}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${radius}`}
        />
      ) : (
        <div
          className={[
            "w-full h-full flex items-center justify-center font-bold",
            "bg-gradient-to-br from-blue-600 to-blue-800 text-white",
            radius,
            s.text,
          ].join(" ")}
        >
          {getInitials(fallback || alt)}
        </div>
      )}

      {/* Status dot */}
      {status && (
        <span
          className={[
            "absolute bottom-0 right-0 rounded-full border-[#0a0a0a]",
            s.status,
            statusColors[status],
          ].join(" ")}
        />
      )}
    </div>
  );
}

// ─── AvatarGroup ──────────────────────────────────────────────────────────────

export function AvatarGroup({
  avatars,
  max = 4,
  size = "md",
  className = "",
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;
  const s = sizeClasses[size];

  return (
    <div className={`flex items-center ${className}`} style={{ gap: 0 }}>
      {visible.map((av, i) => (
        <div
          key={i}
          className="-ml-2 first:ml-0 ring-2 ring-[#0a0a0a] rounded-full"
          style={{ zIndex: visible.length - i }}
        >
          <Avatar {...av} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={[
            "-ml-2 ring-2 ring-[#0a0a0a] rounded-full inline-flex items-center justify-center font-bold",
            "bg-white/10 border border-white/20 text-gray-300",
            s.container,
            s.text,
          ].join(" ")}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
