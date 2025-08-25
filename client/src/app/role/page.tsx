"use client";

import * as React from "react";
import { useState } from "react";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";
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
import { RoleCell } from "./components/roleCell";

export type AccountInterface = {
  userId: number;
  fistName: string;
  lastName: string;
  email: string;
  role: "admin" | "client";
};

export const accountMock: AccountInterface[] = [
  {
    userId: 1,
    fistName: "John",
    lastName: "Doe",
    role: "admin",
    email: "john.doe@example.com",
  },
  {
    userId: 2,
    fistName: "Jane",
    lastName: "Smith",
    role: "admin",
    email: "jane.smith@example.com",
  },
  {
    userId: 3,
    fistName: "Alex",
    lastName: "Johnson",
    role: "client",
    email: "alex.johnson@example.com",
  },
  {
    userId: 4,
    fistName: "Emily",
    lastName: "Davis",
    role: "client",
    email: "emily.davis@example.com",
  },
];

export const columns: ColumnDef<AccountInterface>[] = [
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <div
        className="flex justify-center items-center space-x-2 cursor-pointer select-none text-base font-normal"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>User ID</span>
        <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center text-base font-normal w-full">
        {row.getValue("userId")}
      </div>
    ),
    sortingFn: "alphanumeric",
  },
  {
    id: "accountName",
    accessorFn: (row) => `${row.fistName} ${row.lastName}`,
    header: ({ column }) => (
      <div
        className="flex justify-center items-center space-x-2 cursor-pointer select-none text-base font-normal"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Account Name</span>
        <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-base font-normal text-center">
        {`${row.original.fistName} ${row.original.lastName}`}
      </div>
    ),
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <div
        className="flex justify-center items-center space-x-2 cursor-pointer select-none text-base font-normal"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Email</span>
        <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center text-base font-normal">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: () => (
      <div className="text-base font-normal text-center">Role</div>
    ),
    cell: ({ row }) => <RoleCell value={row.original.role} row={row.original} />,
  },
];


export default function Role() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: accountMock,
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
            <p className="text-4xl font-semibold">Role Management</p>
          </div>
          <CardHeader className="">
            <div className="">
              <Input
                placeholder="Search account..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-100"
              />
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
    </SidebarComponent>
  );
}
