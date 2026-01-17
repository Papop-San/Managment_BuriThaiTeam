"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { SidebarComponent } from "@/app/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { BannerSwitch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { OrderSelectCell } from "./components/OrderSelectCell";
import CreateBannerTab from "./components/CreateBannerTab";
import Image from "next/image";
import { LoaderIcon } from "lucide-react";
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
  PaginationLink,
} from "@/components/ui/pagination";
import {
  ColumnDef,
  flexRender,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { BannerPagination, BannerItem, BannerResponse } from "@/types/banner";
import DeleteButton from "@/components/deleteButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Banner() {
  const [bannerData, setBannerData] = useState<BannerPagination | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_URL}/banners/all?page=${page}&limit=${limit}`,
        { method: "GET", credentials: "include" }
      );
      const data: BannerResponse = await res.json();
      if (!res.ok) throw new Error(data.status || "Fetch error");
      setBannerData(data.data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateBannerStatus = async (bannerId: number, isActive: boolean) => {
    const res = await fetch(`${API_URL}/banners/${bannerId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: isActive }),
    });
    if (!res.ok) throw new Error("Update banner status failed");
  };

  const columns: ColumnDef<BannerItem>[] = [
    {
      id: "select",
      size: 56,
      header: ({ table }) => (
        <div className="flex justify-center pl-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value: boolean) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center pl-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          />
        </div>
      ),
    },
    {
      accessorKey: "banner_id",
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
        <div className="text-left">{row.original.banner_id}</div>
      ),
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "url_banner",
      header: () => <span>Banner</span>,
      cell: ({ row }) => (
        <Image
          src={row.original.url_banner}
          alt={`Banner ${row.original.banner_id}`}
          width={120}
          height={64}
          className="h-16 w-auto object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "order_banner",
      header: () => <span>ลำดับ Banner</span>,
      cell: ({ row }) => (
        <OrderSelectCell
          value={row.original.order_banner}
          maxOrder={bannerData?.data.length ?? 0}
          onSubmit={(newValue) =>
            setBannerData((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                data: prev.data.map((item) =>
                  item.banner_id === row.original.banner_id
                    ? { ...item, order_banner: newValue }
                    : item
                ),
              };
            })
          }
        />
      ),
    },
    {
      accessorKey: "is_active",
      header: () => <span>Active</span>,
      cell: ({ row }) => (
        <BannerSwitch
          checked={row.original.is_active}
          onCheckedChange={async (checked: boolean) => {
            setBannerData((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                data: prev.data.map((item) =>
                  item.banner_id === row.original.banner_id
                    ? { ...item, is_active: checked }
                    : item
                ),
              };
            });

            try {
              await updateBannerStatus(row.original.banner_id, checked);
            } catch {
              setBannerData((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  data: prev.data.map((item) =>
                    item.banner_id === row.original.banner_id
                      ? { ...item, is_active: !checked }
                      : item
                  ),
                };
              });
            }
          }}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: bannerData?.data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.banner_id);

  const totalPages = bannerData
    ? Math.ceil(bannerData.total / bannerData.limit)
    : 0;

  return (
    <SidebarComponent>
      <div className="px-5">
        <Card>
          <div className="text-center mt-5">
            <p className="text-4xl font-semibold">Banner Management</p>
          </div>

          <div className="flex justify-end items-center mb-4 mx-7">
            <div className="flex gap-5 md:flex-row">
              <Button
                className="cursor-pointer hover:text-black hover:bg-white border border-black"
                onClick={() => setOpenCreate(true)}
              >
                Create
              </Button>

              <DeleteButton
                endpoint="banners"
                ids={selectedIds}
                confirmMessage="ต้องการลบรายชื่อนี้ไหม?"
                disabled={selectedIds.length === 0}
                onSuccess={async () => {
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
            ) : (
              <div className="overflow-hidden rounded-md border w-full">
                <Table className="w-full">
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className={`px-2 py-2 ${
                              header.column.id === "select" ? "pl-4" : ""
                            }`}
                            style={{
                              width: header.column.getSize(),
                            }}
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
                            <TableCell
                              key={cell.id}
                              className={`px-2 py-2 ${
                                cell.column.id === "select" ? "pl-4" : ""
                              }`}
                            >
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
            )}
          </CardContent>

          {/* Pagination (ไม่แก้) */}
          <div className="py-4">
            <Pagination className="flex justify-end w-full">
              <PaginationContent className="flex space-x-2 pr-4">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    className={
                      page > 1
                        ? ""
                        : "pointer-events-none opacity-50 cursor-not-allowed"
                    }
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={page === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

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
                        : "pointer-events-none opacity-50 cursor-not-allowed"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Card>
      </div>

      <CreateBannerTab
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => fetchData()}
      />
    </SidebarComponent>
  );
}
