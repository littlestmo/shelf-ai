"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import styles from "./data-table.module.css";

export type { ColumnDef } from "@tanstack/react-table";

export interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  pageSize?: number;
  emptyMessage?: string;
  manualPagination?: boolean;
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: (state: PaginationState) => void;
}

export function DataTable<T>({
  columns,
  data,
  pageSize = 10,
  emptyMessage = "No data found",
  manualPagination = false,
  pageCount,
  pagination: externalPagination,
  onPaginationChange,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const finalEmptyMessage =
    emptyMessage === "No data found"
      ? t("ui.dataTable.emptyMessage")
      : emptyMessage;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize,
    });

  const pagination = externalPagination || internalPagination;

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater;
      if (onPaginationChange) {
        onPaginationChange(next);
      } else {
        setInternalPagination(next);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(manualPagination ? { manualPagination: true, pageCount } : {}),
  });

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={`${styles.th} ${header.column.getCanSort() ? styles.thSortable : ""}`}
                    style={{
                      width: (
                        header.column.columnDef as unknown as Record<
                          string,
                          unknown
                        >
                      ).size
                        ? `${(header.column.columnDef as unknown as Record<string, unknown>).size}px`
                        : undefined,
                    }}
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : undefined
                    }
                  >
                    <span className={styles.thHeaderContent}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {header.column.getIsSorted() === "asc" && " ↑"}
                      {header.column.getIsSorted() === "desc" && " ↓"}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.emptyCell}>
                  {finalEmptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={styles.tr}
                  style={{
                    animation: `fadeIn 0.3s ease ${idx * 0.02}s both`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={styles.td}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!manualPagination && table.getPageCount() > 1 && (
        <div className={styles.paginationContainer}>
          <span className={styles.paginationText}>
            {t("ui.dataTable.pageOf")
              .replace(
                "{{current}}",
                String(table.getState().pagination.pageIndex + 1),
              )
              .replace("{{total}}", String(table.getPageCount()))}
          </span>
          <div className={styles.paginationActions}>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={`${styles.paginationButton} ${table.getCanPreviousPage() ? styles.paginationButtonEnabled : styles.paginationButtonDisabled}`}
            >
              {t("ui.dataTable.previous")}
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`${styles.paginationButton} ${table.getCanNextPage() ? styles.paginationButtonEnabled : styles.paginationButtonDisabled}`}
            >
              {t("ui.dataTable.next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
