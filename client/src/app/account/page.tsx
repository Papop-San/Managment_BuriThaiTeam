"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Card, CardContent} from "@/components/ui/card";
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
import { StatusCell } from "./components/statusCell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientOnlyDate } from "@/app/components/ClientOnlyDate";

export type AccountInterface = {
  userId: number;
  fistName: string;
  lastName: string;
  userImg: string;
  create_date: Date;
  status_active: boolean;
};

export const accountMock: AccountInterface[] = [
  {
    userId: 1,
    fistName: "John",
    lastName: "Doe",
    userImg: "https://randomuser.me/api/portraits/men/32.jpg",
    create_date: new Date("2025-06-10T10:15:00"),
    status_active: true,
  },
  {
    userId: 2,
    fistName: "Jane",
    lastName: "Smith",
    userImg: "https://randomuser.me/api/portraits/women/45.jpg",
    create_date: new Date("2025-05-25T14:45:00"),
    status_active: false,
  },
];

export default function Account() {
  const router = useRouter();
  const [data, setData] = useState<AccountInterface[]>(accountMock);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<AccountInterface>[] = [
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
        <div
          className="text-center text-blue-600 cursor-pointer hover:underline"
          onClick={() => router.push(`/account/detail/${row.original.userId}`)}
        >
          {row.original.userId}
        </div>
      ),
      sortingFn: "alphanumeric",
    },
    {
      accessorFn: (row) => `${row.fistName} ${row.lastName}`, 
      id: "customerName", 
      size: 200,
      header: ({ column }) => (
        <div
          className="flex items-center justify-center space-x-1 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>ชื่อลูกค้า</span>
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center space-x-2 cursor-pointer">
          <Avatar className=" w-9 h-9 m-2">
            <AvatarImage
              src={row.original.userImg}
              alt={`${row.original.fistName} ${row.original.lastName}`}
            />
            <AvatarFallback>
              {row.original.fistName[0]}
              {row.original.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <span className="mx-3 text-base">{`${row.original.fistName} ${row.original.lastName}`}</span>
        </div>
      ),
      sortingFn: "alphanumeric",
    },

    {
      accessorKey: "create_date",
      size: 140,
      header: ({ column }) => (
        <div
          className="flex items-center justify-center sฟpace-x-1 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>Create Date</span>
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
      cell: ({ row }) => (
        <ClientOnlyDate date={new Date(row.getValue("create_date"))} />
      ),
    },
    {
      accessorKey: "status_active",
      header: "Status",
      cell: ({ row }) => (
        <StatusCell
          value={row.getValue("status_active")}
          onChange={(newValue) => {
            setData((prev) =>
              prev.map((item) =>
                item.userId === row.original.userId
                  ? { ...item, status_active: newValue }
                  : item
              )
            );
          }}
        />
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
            <p className="text-4xl font-semibold">Account Management</p>
          </div>

          <div className="flex justify-between items-center mb-4 mx-7">
            <Input
              placeholder="Search account..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-80"
            />
            <div className="flex flex-wrap items-center gap-5 md:flex-row">
              <Link href="/account/create">
                <Button className="cursor-pointer hover:text-black hover:bg-white border border-black">
                  Create
                </Button>
              </Link>
              <Button className="bg-white text-black border border-black cursor-pointer hover:text-white">
                Delete
              </Button>
            </div>
          </div>

          <CardContent>
            <div className="overflow-hidden rounded-md border w-full">
              <Table className="w-full">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} >
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
            <div className="flex items-center space-x-2 py-4 justify-end">              <Pagination className="flex justify-end">
            <PaginationContent className="w-full justify-end">
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
