"use client";

import * as React from "react";
import { useState } from "react";
import { BannerSwitch } from "@/components/ui/switch";
import CreatePaymentForm from "./components/CreatePaymentForm";

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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { SidebarComponent } from "@/app/components/Sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type PaymentInterface = {
  bannerId: number;
  name: string;
  data: string;
  account_type: string;
  is_active: boolean;
};

export const PaymentMock: PaymentInterface[] = [
  {
    bannerId: 1,
    name: "John Doe",
    data: "0123456789",
    account_type: "Promptpay",
    is_active: false,
  },
  {
    bannerId: 2,
    name: "Jane Smith",
    data: "0987654321",
    account_type: "Promptpay",
    is_active: true,
  },
];

export default function Payment() {
  const [data, setData] = useState<PaymentInterface[]>(PaymentMock);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const columns: ColumnDef<PaymentInterface>[] = [
    // ✅ Checkbox select
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

    // Banner ID
    {
      accessorKey: "bannerId",
      header: "Banner ID",
      cell: ({ row }) => <span>{row.original.bannerId}</span>,
      sortingFn: "alphanumeric",
    },

    // Name
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span>{row.original.name}</span>,
    },

    // Data
    {
      accessorKey: "data",
      header: "Data",
      cell: ({ row }) => <span>{row.original.data}</span>,
    },

    // Account Type
    {
      accessorKey: "account_type",
      header: "Account Type",
      cell: ({ row }) => <span>{row.original.account_type}</span>,
    },

    // Active
    {
      accessorKey: "is_active",
      header: ({ column }) => (
        <div className="flex justify-start items-center space-x-2 select-none text-base font-normal">
          <span>Active</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-left">
          <BannerSwitch
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
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 20 } },
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
            <p className="text-4xl font-semibold">Payment Account</p>
          </div>
          <CardHeader className="flex justify-between">
            <div className="">
              <Input
                placeholder="Search account..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-100"
              />
            </div>
            <div className="flex flex-wrap items-center gap-5 md:flex-row">
              <Button
                className="cursor-pointer hover:text-black hover:bg-white border border-black"
                onClick={() => setOpenCreate(true)}
              >
                Create
              </Button>

              <Button className="bg-white text-black border border-black cursor-pointer hover:text-white">
                Delete
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border w-full">
              <Table className="w-full">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="text-center">
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
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="text-center">
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
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center space-x-2 py-4 justify-center">
              <Pagination className="flex justify-end">
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
      </div>
      <CreatePaymentForm
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={(newItem) => {
          setData((prev) => [
            ...prev,
            {
              bannerId: prev.length + 1,
              ...newItem,
            },
          ]);
        }}
      />
    </SidebarComponent>
  );
}
