"use client";

import { useState, ReactNode, useCallback } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortDirection = "asc" | "desc" | null;

export interface TableColumn<T> {
  key: keyof T | string;
  header: ReactNode;
  render?: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface TableProps<T extends { id?: string | number }> {
  columns: TableColumn<T>[];
  data: T[];
  selectable?: boolean;
  selectedKeys?: (string | number)[];
  onSelectionChange?: (keys: (string | number)[]) => void;
  onSort?: (key: string, direction: SortDirection) => void;
  loading?: boolean;
  emptyText?: string;
  emptyIcon?: ReactNode;
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  caption?: string;
  rowKey?: (row: T) => string | number;
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === "asc")
    return <ChevronUp className="w-3.5 h-3.5 text-blue-400" />;
  if (direction === "desc")
    return <ChevronDown className="w-3.5 h-3.5 text-blue-400" />;
  return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-600" />;
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-4 bg-white/10 rounded"
            style={{ width: `${60 + Math.random() * 30}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Table<T extends { id?: string | number }>({
  columns,
  data,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  onSort,
  loading = false,
  emptyText = "Gösterilecek veri yok",
  emptyIcon,
  striped = false,
  bordered = false,
  hoverable = true,
  compact = false,
  caption,
  rowKey,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  const getKey = useCallback(
    (row: T, i: number): string | number => {
      if (rowKey) return rowKey(row);
      return row.id ?? i;
    },
    [rowKey],
  );

  const handleSort = (key: string) => {
    let newDir: SortDirection = "asc";
    if (sortKey === key) {
      if (sortDir === "asc") newDir = "desc";
      else if (sortDir === "desc") {
        newDir = null;
        setSortKey(null);
        setSortDir(null);
        onSort?.(key, null);
        return;
      }
    }
    setSortKey(key);
    setSortDir(newDir);
    onSort?.(key, newDir);
  };

  const allSelected =
    data.length > 0 &&
    data.every((row, i) => selectedKeys.includes(getKey(row, i)));
  const someSelected =
    !allSelected &&
    data.some((row, i) => selectedKeys.includes(getKey(row, i)));

  const toggleAll = () => {
    if (allSelected) onSelectionChange?.([]);
    else onSelectionChange?.(data.map((row, i) => getKey(row, i)));
  };

  const toggleRow = (key: string | number) => {
    if (selectedKeys.includes(key))
      onSelectionChange?.(selectedKeys.filter((k) => k !== key));
    else onSelectionChange?.([...selectedKeys, key]);
  };

  const cellPad = compact ? "px-4 py-2" : "px-4 py-3.5";

  return (
    <div
      className={`w-full overflow-x-auto rounded-xl ${bordered ? "border border-white/10" : ""}`}
    >
      <table className="w-full text-sm text-left">
        {caption && (
          <caption className="text-xs text-gray-500 text-left px-4 py-2 caption-bottom">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            {selectable && (
              <th className={`${cellPad} w-10`}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                  className="accent-blue-600 w-4 h-4 cursor-pointer"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{ width: col.width }}
                className={[
                  cellPad,
                  "font-semibold text-gray-400 uppercase tracking-wider text-xs whitespace-nowrap",
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                      ? "text-right"
                      : "text-left",
                  col.sortable
                    ? "cursor-pointer select-none hover:text-white transition-colors"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => col.sortable && handleSort(String(col.key))}
              >
                <span className="inline-flex items-center gap-1.5">
                  {col.header}
                  {col.sortable && (
                    <SortIcon
                      direction={sortKey === String(col.key) ? sortDir : null}
                    />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow
                key={i}
                cols={columns.length + (selectable ? 1 : 0)}
              />
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="text-center py-16 text-gray-500"
              >
                <div className="flex flex-col items-center gap-3">
                  {emptyIcon || (
                    <svg
                      className="w-12 h-12 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  )}
                  <span className="text-sm">{emptyText}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const key = getKey(row, rowIndex);
              const isSelected = selectedKeys.includes(key);

              return (
                <tr
                  key={key}
                  className={[
                    "transition-colors duration-100",
                    striped && rowIndex % 2 === 1 ? "bg-white/[0.02]" : "",
                    hoverable ? "hover:bg-white/5" : "",
                    isSelected ? "bg-blue-500/10 hover:bg-blue-500/15" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {selectable && (
                    <td className={cellPad}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(key)}
                        className="accent-blue-600 w-4 h-4 cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={[
                        cellPad,
                        "text-gray-300",
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                            ? "text-right"
                            : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {col.render
                        ? col.render(row, rowIndex)
                        : String(
                            (row as Record<string, unknown>)[String(col.key)] ??
                              "",
                          )}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-4 text-gray-500 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor...
        </div>
      )}
    </div>
  );
}
