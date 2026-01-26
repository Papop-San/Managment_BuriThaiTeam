"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TopProductTableItem } from "@/types/dashboard";

export interface PopularTableProps {
  topTable: TopProductTableItem[];
}

export type PopularInterface = {
  rank: number;
  productName: string;
  totalQuantity: number;
};



export function PopularTable({ topTable }: PopularTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

 
 const columns: ColumnDef<PopularInterface>[] = [
    {
      accessorKey: "rank",
      header: ({ column }) => (
        <div
          className="flex items-center space-x-2 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>rank</span>
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("rank")}</div>,
    },
    {
      accessorKey: "productName",
      header: ({ column }) => (
        <div
          className="flex items-center space-x-2 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>Product</span>
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("productName")}</div>,
    },
    {
      accessorKey: "totalQuantity",
      header: ({ column }) => (
        <div
          className="flex items-center space-x-2 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>Total Qty</span>
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("totalQuantity")}</div>,
    },
  ];



  const table = useReactTable({
    data: topTable ?? [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;

  const paginationRange = React.useMemo(() => {
    const totalPages = pageCount;
    const currentPage = pageIndex + 1;

    const delta = 2;
    const range: (number | "...")[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        if (l !== undefined) {
          if (i - l > 1) {
            range.push("...");
          }
        }
        range.push(i);
        l = i;
      }
    }
    return range;
  }, [pageCount, pageIndex]);

  return (
    <Card className="mt-10">
      <CardHeader className=" space-y-0 border-b  sm:flex-row">
        <div className="flex justify-between items-center">
          <CardTitle>Popular Products</CardTitle>
          <Input
            placeholder="Search product..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-64"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-20 py-2 text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-20 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center px-4 py-2"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* pagination */}
        <div className="flex items-center space-x-2 py-4">
          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!table.getCanPreviousPage()) return;
                    table.previousPage();
                  }}
                  className={
                    table.getCanPreviousPage()
                      ? ""
                      : "pointer-events-none opacity-50 cursor-not-allowed"
                  }
                />
              </PaginationItem>

              {paginationRange.map((page, idx) =>
                page === "..." ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={
                        page === table.getState().pagination.pageIndex + 1
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        table.setPageIndex(page - 1);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!table.getCanNextPage()) return;
                    table.nextPage();
                  }}
                  className={
                    table.getCanNextPage()
                      ? ""
                      : "pointer-events-none opacity-50 cursor-not-allowed"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
