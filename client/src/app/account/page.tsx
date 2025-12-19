"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoaderIcon } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
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
import DeleteButton from "@/components/deleteButton";
import { SidebarComponent } from "@/app/components/Sidebar";
import { StatusCell } from "./components/statusCell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientOnlyDate } from "@/app/components/ClientOnlyDate";
import {
  AccountResponse,
  AccountItem,
} from "@/types/accounts";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Account() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [accountData, setAccountData] = useState<AccountItem[]>([]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const formatThaiPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "").slice(0, 10); 
    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return digits;
    return [match[1], match[2], match[3]].filter(Boolean).join("-");
  };
  

  const columns: ColumnDef<AccountItem>[] = [
    {
      id: "select",
      size: 50,
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

    // USER ID
    {
      accessorKey: "user_id",
      size: 100,
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
          onClick={() => router.push(`/account/detail/${row.original.user_id}`)}
        >
          {row.original.user_id}
        </div>
      ),
    },

    // FULL NAME (avatar)
    {
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      id: "accountName",
      size: 250,
      header: ({ column }) => (
        <div
          className="flex items-center justify-center space-x-1 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>Account Name</span>
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center space-x-2 cursor-pointer">
          <Avatar className="w-9 h-9 m-3">
            <AvatarImage
              src={row.original.avatar}
              alt={`${row.original.first_name} ${row.original.last_name}`}
            />
            <AvatarFallback>
              {row.original.first_name?.[0] ?? ""}
              {row.original.last_name?.[0] ?? ""}
            </AvatarFallback>
          </Avatar>
          <span className="text-base">
            {row.original.first_name} {row.original.last_name}
          </span>
        </div>
      ),
    },

    // EMAIL
    {
      accessorKey: "email",
      size: 220,
      header: "Email",
      cell: ({ row }) => <div>{row.original.email}</div>,
    },

    // PHONE
    {
      accessorKey: "phone",
      size: 140,
      header: "Phone",
      cell: ({ row }) => {
        const phone = row.original.phone ?? "-";
        return <div>{formatThaiPhone(phone)}</div>;
      },
    },

    // CREATED DATE
    {
      accessorKey: "created_at",
      size: 180,
      header: "Create Date",
      cell: ({ row }) => (
        <ClientOnlyDate date={new Date(row.original.created_at)} />
      ),
    },

    // ACTIVE STATUS
    {
      accessorKey: "is_active",
      size: 140,
      header: "Status",
      cell: ({ row }) => (
        <StatusCell
          value={row.original.is_active}
          row={row.original}
        />
      ),
    }
    
  ];

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_URL}/users?page=${page}&limit=${limit}&search=${search}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data: AccountResponse = await res.json();

      if (!res.ok) {
        throw new Error("Fetch error");
      }

      setAccountData(data.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const table = useReactTable({
    data: accountData ?? [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 20 } },
    enableRowSelection: true,
  });
  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.user_id);

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
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="w-80"
            />
            <div className="flex flex-wrap items-center gap-5 md:flex-row">
              <Link href="/account/create">
                <Button className="cursor-pointer">Create</Button>
              </Link>
              <DeleteButton
                endpoint="users"
                ids={selectedIds}
                confirmMessage = "ต้องการลบรายชื่อนี้ไหม?"
                disabled={selectedIds.length === 0}
                onSuccess={async () => {
                  table.resetRowSelection(); 
                  await fetchData();         
                }}
              />
            </div>
          </div>

          <CardContent>
            {loading ? (
              <>
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <LoaderIcon className="h-10 w-10 animate-spin text-gray-500" />
                  <p className="text-gray-500 text-lg">Loading data...</p>
                </div>
              </>
            ) : error ? (
              <div className="text-center py-10 text-red-500 text-lg">
                {error}
              </div>
            ) : accountData.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-lg">
                No results found.
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-md border w-full">
                  <Table className="w-full">
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead
                              key={header.id}
                              className="text-center"
                              style={{ width: header.column.getSize() }}
                            >
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
                <div className="flex items-center space-x-2 py-4 justify-end">
                  <Pagination className="flex justify-end">
                    <PaginationContent className="w-full justify-end">
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (!table.getCanPreviousPage()) return;
                            table.previousPage();
                          }}
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
                                page ===
                                table.getState().pagination.pageIndex + 1
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
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarComponent>
  );
}
