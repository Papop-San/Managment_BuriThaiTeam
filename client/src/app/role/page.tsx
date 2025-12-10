"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

import { SidebarComponent } from "@/app/components/Sidebar";
import { RoleCell } from "./components/roleCell";
import { RoleResponse, RoleDataPage, RoleItem } from "@/types/role";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const columns: ColumnDef<RoleItem>[] = [
  {
    accessorKey: "user_id",
    header: ({ column }) => (
      <div
        className="flex justify-center items-center space-x-2 cursor-pointer select-none text-base"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>User ID</span>
        <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center text-base w-full">
        {row.getValue("user_id")}
      </div>
    ),
  },

  {
    id: "accountName",
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    header: ({ column }) => (
      <div
        className="flex justify-center items-center space-x-2 cursor-pointer select-none text-base"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Account Name</span>
        <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-base text-center">
        {`${row.original.first_name} ${row.original.last_name}`}
      </div>
    ),
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <div
        className="flex justify-center items-center space-x-2 cursor-pointer select-none text-base"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Email</span>
        <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center text-base">{row.getValue("email")}</div>
    ),
  },

  {
    accessorKey: "role",
    header: () => <div className="text-base text-center">Role</div>,
    cell: ({ row }) => (
      <RoleCell value={row.original.role} row={row.original} />
    ),
  },
];

export default function Role() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const [roleData, setRoleData] = useState<RoleDataPage | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_URL}/role-management?page=${page}&limit=${limit}&search=${search}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data: RoleResponse = await res.json();

      if (!res.ok) {
        throw new Error("Fetch error");
      }

      setRoleData(data.data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const table = useReactTable({
    data: roleData?.data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: roleData ? Math.ceil(roleData.total / limit) : 1,
  });

  const totalPages = roleData ? Math.ceil(roleData.total / limit) : 1;

  const paginationRange = React.useMemo(() => {
    const delta = 2;
    const pages: (number | "...")[] = [];
    let last;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        if (last && i - last > 1) pages.push("...");
        pages.push(i);
        last = i;
      }
    }

    return pages;
  }, [page, totalPages]);

  return (
    <SidebarComponent>
      <div className="px-5">
        <Card>
          <div className="text-center mt-5">
            <p className="text-4xl font-semibold">Role Management</p>
          </div>

          {/* Search */}
          <CardHeader>
            <Input
              placeholder="Search account..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="w-80"
            />
          </CardHeader>

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
            ) : !roleData || roleData.data.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-lg">
                No results found.
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="overflow-hidden rounded-md border w-full">
                  <Table className="w-full">
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id} className="text-center">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>

                    <TableBody>
                      {table.getRowModel().rows.map((row) => (
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
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center py-4">
                  <Pagination className="flex justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) setPage(page - 1);
                          }}
                          className={
                            page > 1 ? "" : "opacity-50 cursor-not-allowed"
                          }
                        />
                      </PaginationItem>

                      {paginationRange.map((p, idx) =>
                        p === "..." ? (
                          <PaginationItem key={idx}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={p}>
                            <PaginationLink
                              href="#"
                              isActive={p === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(Number(p));
                              }}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages) setPage(page + 1);
                          }}
                          className={
                            page < totalPages
                              ? ""
                              : "opacity-50 cursor-not-allowed"
                          }
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
