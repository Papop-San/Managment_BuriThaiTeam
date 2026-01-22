"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { LoaderIcon, ArrowUpDown } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

/* ---------------- columns ---------------- */
export const columns: ColumnDef<RoleItem>[] = [
  {
    accessorKey: "user_id",
    header: ({ column }) => (
      <div
        className="flex justify-center items-center gap-2 cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>User ID</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("user_id")}</div>
    ),
  },
  {
    id: "accountName",
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    header: ({ column }) => (
      <div
        className="flex justify-center items-center gap-2 cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Account Name</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.first_name} {row.original.last_name}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <div
        className="flex justify-center items-center gap-2 cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Email</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: () => <div className="text-center">Role</div>,
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

  /* ---------------- fetch data (server-side) ---------------- */
  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_URL}/role-management?page=${page}&limit=${limit}&search=${search}`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error("Fetch failed");

      const json: RoleResponse = await res.json();
      setRoleData(json.data);
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

  /* ---------------- table (NO pagination here) ---------------- */
  const table = useReactTable({
    data: roleData?.data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  /* ---------------- pagination from backend ---------------- */
  const totalPages = roleData ? Math.ceil(roleData.total / roleData.limit) : 0;

  const paginationRange = React.useMemo(() => {
    const delta = 2;
    const pages: (number | "...")[] = [];
    let last: number | undefined;

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

  /* ====================== UI ====================== */
  return (
    <SidebarComponent>
      <div className="px-5">
        <Card>
          <div className="text-center mt-5">
            <p className="text-4xl font-semibold">Role Management</p>
          </div>

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
              <div className="flex flex-col items-center py-10 gap-3">
                <LoaderIcon className="h-10 w-10 animate-spin text-gray-500" />
                <p className="text-gray-500">Loading data...</p>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : (
              <>
                <div className="overflow-hidden rounded-md border w-full">
                  <Table className="w-full">
                    <TableHeader>
                      {table.getHeaderGroups().map((hg) => (
                        <TableRow key={hg.id}>
                          {hg.headers.map((header) => (
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
                      {table.getRowModel().rows.length > 0
                        ? table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                              {row.getVisibleCells().map((cell) => (
                                <TableCell
                                  key={cell.id}
                                  className="text-center"
                                >
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        : !loading && (
                            <TableRow>
                              <TableCell
                                colSpan={columns.length}
                                className="text-center py-10"
                              >
                                Not Found User
                              </TableCell>
                            </TableRow>
                          )}
                    </TableBody>
                  </Table>
                </div>

                <Pagination className="justify-end py-4">
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

                    {paginationRange.map((p, i) =>
                      p === "..." ? (
                        <PaginationItem key={i}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href="#"
                            isActive={p === page}
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(p);
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarComponent>
  );
}
