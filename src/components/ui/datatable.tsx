"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronExpand,
} from "lucide-react";
import { Fragment, useState } from "react";

export type Column<T> = {
  key?: keyof T;
  title: string;
  render?: (
    value: T[keyof T] | undefined,
    row: T
  ) => React.ReactNode;
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;

  // Optional expandable row functionality
  expandable?: boolean;
  expandedRow?: (row: T) => React.ReactNode;
};

export default function Datatable<T>({
  data,
  columns,
  pagination,
  onPageChange,
  loading = false,
  emptyMessage = "No data found",

  // Defaults preserve existing behavior
  expandable = false,
  expandedRow,
}: DataTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(
    new Set()
  );

  const toggleRow = (rowIndex: number) => {
    setExpandedRows((current) => {
      const updated = new Set(current);

      if (updated.has(rowIndex)) {
        updated.delete(rowIndex);
      } else {
        updated.add(rowIndex);
      }

      return updated;
    });
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-white shadow-sm">

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">

          <thead className="bg-gray-50">
            <tr>

              {/* Expand column */}
              {expandable && (
                <th className="w-12 border-b px-4 py-3" />
              )}

              {columns.map((column, index) => (
                <th
                  key={
                    column.key
                      ? String(column.key)
                      : `column-${index}`
                  }
                  className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (expandable ? 1 : 0)
                  }
                  className="px-4 py-10 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (expandable ? 1 : 0)
                  }
                  className="px-4 py-10 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const isExpanded = expandedRows.has(rowIndex);

                return (
                
                  <Fragment key={`row-fragment-${rowIndex}`}>
                    <tr
                      key={`row-${rowIndex}`}
                      className={`border-b last:border-b-0 hover:bg-gray-50 ${
                        isExpanded ? "bg-gray-50" : ""
                      }`}
                    >

                      {/* Expand button */}
                      {expandable && (
                        <td className="w-12 border-b px-4 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              toggleRow(rowIndex)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-gray-200 cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronExpand className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      )}

                      {columns.map((column, columnIndex) => {
                        const value = column.key ? row[column.key] : undefined;

                          return (
                            <td
                              key={
                                column.key
                                  ? `${String(
                                      column.key
                                    )}-${rowIndex}`
                                  : `column-${columnIndex}-${rowIndex}`
                              }
                              className="px-4 py-3 text-sm text-gray-700"
                            >
                              {column.render
                                ? column.render(
                                    value,
                                    row
                                  )
                                : String(
                                    value ?? "-"
                                  )}
                            </td>
                          );
                        }
                      )}
                    </tr>

                    {/* Expanded row */}
                    {expandable &&
                      isExpanded &&
                      expandedRow && (
                        <tr key={`expanded-${rowIndex}`} className="border-b bg-gray-50">
                          <td
                            colSpan={
                              columns.length + 1
                            }
                            className="p-0"
                          >
                            {expandedRow(row)}
                          </td>
                        </tr>
                      )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 0 && (
        <div className="flex items-center justify-between border-t px-4 py-3">

          <div className="text-sm text-gray-500">
            Showing{" "}
            {(pagination.currentPage - 1) *
              pagination.pageSize +
              1}{" "}
            -{" "}
            {Math.min(
              pagination.currentPage *
                pagination.pageSize,
              pagination.totalItems
            )}{" "}
            of {pagination.totalItems}
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                onPageChange?.(
                  pagination.currentPage - 1
                )
              }
              disabled={
                pagination.currentPage === 1
              }
              className="flex h-9 w-9 items-center justify-center rounded-md border disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm font-medium">
              Page {pagination.currentPage} of{" "}
              {pagination.totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                onPageChange?.(
                  pagination.currentPage + 1
                )
              }
              disabled={
                pagination.currentPage ===
                pagination.totalPages
              }
              className="flex h-9 w-9 items-center justify-center rounded-md border disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

          </div>
        </div>
      )}
    </div>
  );
}