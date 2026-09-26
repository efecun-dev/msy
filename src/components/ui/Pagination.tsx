"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaginationVariant = "default" | "outline" | "simple";

export interface PaginationProps {
  total: number;
  pageSize?: number;
  current: number;
  onChange: (page: number) => void;
  variant?: PaginationVariant;
  showTotal?: boolean;
  siblingCount?: number;
  className?: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function getPages(
  current: number,
  total: number,
  siblings: number,
): (number | "...")[] {
  const delta = siblings;
  const range: number[] = [];
  const rangeWithDots: (number | "...")[] = [];

  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  if (range[0] > 2) rangeWithDots.push(1, "...");
  else rangeWithDots.push(1);

  rangeWithDots.push(...range);

  if (range[range.length - 1] < total - 1) rangeWithDots.push("...", total);
  else if (total > 1) rangeWithDots.push(total);

  return rangeWithDots;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Pagination({
  total,
  pageSize = 10,
  current,
  onChange,
  variant = "default",
  showTotal = false,
  siblingCount = 1,
  className = "",
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const pages = getPages(current, totalPages, siblingCount);

  const btnBase =
    "inline-flex items-center justify-center min-w-[2rem] h-8 px-2 text-sm font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

  const activeClass =
    variant === "outline"
      ? "border-2 border-blue-500 text-blue-400 bg-transparent"
      : "bg-blue-600 text-white shadow-md shadow-blue-900/30";

  const inactiveClass =
    variant === "outline"
      ? "border border-white/15 text-gray-400 hover:border-blue-500/50 hover:text-blue-400"
      : "text-gray-400 hover:bg-white/8 hover:text-white";

  if (variant === "simple") {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <button
          onClick={() => current > 1 && onChange(current - 1)}
          disabled={current === 1}
          className={`${btnBase} ${inactiveClass} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="ml-1">Önceki</span>
        </button>
        <span className="text-sm text-gray-400">
          Sayfa <span className="text-white font-semibold">{current}</span> /{" "}
          {totalPages}
        </span>
        <button
          onClick={() => current < totalPages && onChange(current + 1)}
          disabled={current === totalPages}
          className={`${btnBase} ${inactiveClass} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <span className="mr-1">Sonraki</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {showTotal && (
        <span className="text-sm text-gray-500 mr-2">
          Toplam <span className="text-gray-300 font-medium">{total}</span>{" "}
          kayıt
        </span>
      )}

      {/* Prev */}
      <button
        onClick={() => current > 1 && onChange(current - 1)}
        disabled={current === 1}
        className={`${btnBase} ${inactiveClass} disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Önceki sayfa"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Pages */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dot-${i}`} className="text-gray-600 px-1 select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page as number)}
            aria-current={page === current ? "page" : undefined}
            className={[
              btnBase,
              page === current ? activeClass : inactiveClass,
            ].join(" ")}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => current < totalPages && onChange(current + 1)}
        disabled={current === totalPages}
        className={`${btnBase} ${inactiveClass} disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Sonraki sayfa"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
