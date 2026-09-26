import { ReactNode } from "react";
import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  homeIcon?: boolean;
  maxItems?: number;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Breadcrumb({
  items,
  separator,
  homeIcon = false,
  maxItems,
  className = "",
}: BreadcrumbProps) {
  let visible = items;
  let collapsed = false;

  if (maxItems && items.length > maxItems) {
    const head = items.slice(0, 1);
    const tail = items.slice(-(maxItems - 1));
    visible = [...head, { label: "…" }, ...tail];
    collapsed = true;
  }

  const sep = separator ?? (
    <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
  );

  return (
    <nav aria-label="breadcrumb">
      <ol className={`flex items-center gap-1 flex-wrap ${className}`}>
        {homeIcon && (
          <>
            <li>
              <Link
                href="/"
                className="text-gray-500 hover:text-blue-400 transition-colors"
              >
                <Home className="w-4 h-4" />
              </Link>
            </li>
            {visible.length > 0 && (
              <li className="flex items-center" aria-hidden="true">
                {sep}
              </li>
            )}
          </>
        )}

        {visible.map((item, i) => {
          const isLast = i === visible.length - 1;

          return (
            <li key={i} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`text-sm ${
                    isLast
                      ? "text-white font-medium"
                      : "text-gray-500 cursor-default"
                  }`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="ml-1" aria-hidden="true">
                  {sep}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
