"use client";

import * as React from "react";
import { useState } from "react";
import { SidebarComponent } from "@/app/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  ColumnDef,
  flexRender,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type BannerInterface = {
  bannerId: number;
  url: string;
  is_active: boolean;
  order_banner: number;
};

export const bannerMock: BannerInterface[] = Array.from({ length: 100 }, (_, i) => ({
    bannerId: i + 1,
    url: `https://picsum.photos/1200/400?random=${i + 1}`,
    is_active: Math.random() < 0.8, // 80% chance เป็น true
    order_banner: i + 1,
  }));

export default function Banner() {
  const [data, setData] = useState<BannerInterface[]>(bannerMock);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<BannerInterface>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) =>
            table.toggleAllPageRowsSelected(value)
          }
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        />
      ),
    },
    {
      accessorKey: "bannerId",
      header: ({ column }) => (
        <div
          className="flex justify-start items-center space-x-2 cursor-pointer select-none text-base font-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>Banner ID</span>
          <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-left">{row.original.bannerId}</div>
      ),
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "url",
      header: ({ column }) => (
        <div className="flex justify-start items-center space-x-2 select-none text-base font-normal">
          <span>Banner</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-start">
          <img
            src={row.original.url}
            alt={`Banner ${row.original.bannerId}`}
            className="h-16 w-auto object-cover"
          />
        </div>
      ),
    },
    {
      accessorKey: "order_banner",
      header: ({ column }) => (
        <div
          className="flex justify-start items-center space-x-2 cursor-pointer select-none text-base font-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>ลำดับ Banner</span>
          <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-left">{row.original.order_banner}</div>
      ),
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => (
        <div className="flex justify-start items-center space-x-2 select-none text-base font-normal">
          <span>Active</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-left">
          <Switch
            checked={row.original.is_active}
            onCheckedChange={(checked: boolean) =>
              setData((prev) =>
                prev.map((item) =>
                  item.bannerId === row.original.bannerId
                    ? { ...item, is_active: checked }
                    : item
                )
              )
            }
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
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
        if (l !== undefined && i - l > 1) range.push("...");
        range.push(i);
        l = i;
      }
    }
    return range;
  }, [pageCount, pageIndex]);

  return (
    <SidebarComponent>
      <div className="px-5">
        <Card>
          <div className="text-center mt-5">
            <p className="text-4xl font-semibold">Banner Management</p>
          </div>

          <CardContent>
            <div className="overflow-hidden rounded-md border w-full">
              <Table className="w-full">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        let className = "px-2 py-2";
                        if (header.id === "select") className += " pl-20"; // layout เหมือนเดิม
                        return (
                          <TableHead key={header.id} className={className}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                          let className = "px-2 py-2";
                          if (cell.column.id === "select")
                            className += " pl-20";
                          return (
                            <TableCell key={cell.id} className={className}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          {/* Pagination */}
          <div className="py-4">
            <Pagination className="flex justify-end w-full">
              <PaginationContent className="flex space-x-2 pr-4">
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
        </Card>
      </div>
    </SidebarComponent>
  );
}
