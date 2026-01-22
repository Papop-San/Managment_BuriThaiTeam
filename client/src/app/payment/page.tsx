"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import CreatePaymentForm from "./components/CreatePaymentForm";
import { LoaderIcon } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { Button } from "@/components/ui/button";
import {
  PaymentResponse,
  PaymentItem,
  PaymentsData,
  CreatePaymentPayload,
} from "@/types/payment";
import UpdatePaymentForm from "./components/upadatePaymentForm";
import DeleteButton from "@/components/deleteButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Payment() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [paymentData, setPaymentsData] = useState<PaymentsData | null>(null);

  const [page, setPage] = useState(1);
  const limit = 20;

  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentItem | null>(null);

  /* ---------------- fetch data (server-side) ---------------- */
  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_URL}/promtpay?page=${page}&limit=${limit}&search=${search}`,
        { credentials: "include" }
      );
      const json: PaymentResponse = await res.json();
      setPaymentsData(json.data);
    } catch (err) {
      setError("Load data failed");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------------- columns ---------------- */
  const columns: ColumnDef<PaymentItem>[] = [
    {
      id: "select",
      size: 50,
      header: ({ table }) => (
        <div className="flex justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value: boolean) =>
              table.toggleAllPageRowsSelected(value)
            }
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          />
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: "User ID",
      cell: ({ row }) => (
        <span
          className="block text-center cursor-pointer text-blue-600 hover:underline"
          onClick={() => {
            setSelectedPayment(row.original);
            setOpenUpdate(true);
          }}
        >
          {row.original.id}
        </span>
      ),
    },
    {
      id: "name",
      header: "Name",
      accessorFn: (row) =>
        `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
      cell: ({ getValue }) => (
        <span className="block truncate text-center">
          {String(getValue() || "-")}
        </span>
      ),
    },
    {
      accessorKey: "payKey",
      header: "Data",
      cell: ({ row }) => (
        <span className="block truncate text-center">
          {row.original.payKey}
        </span>
      ),
    },
    {
      accessorKey: "payment_method",
      header: "Account Type",
      cell: ({ row }) => (
        <span className="block text-center">
          {row.original.payment_method}
        </span>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Active",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Switch checked={row.original.is_active} />
        </div>
      ),
    },
  ];

  /* ---------------- table  ---------------- */
  const table = useReactTable({
    data: paymentData?.data ?? [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  /* ---------------- pagination (from backend) ---------------- */
  const totalPages = paymentData
    ? Math.ceil(paymentData.total / paymentData.limit)
    : 0;

  const paginationRange = React.useMemo(() => {
    const range: (number | "...")[] = [];
    const delta = 2;
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        if (l && i - l > 1) range.push("...");
        range.push(i);
        l = i;
      }
    }
    return range;
  }, [page, totalPages]);

  /* ---------------- create ---------------- */
  const handleCreatePayment = async (payload: CreatePaymentPayload) => {
    try {
      const res = await fetch(`${API_URL}/promtpay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Create failed");
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  /* ====================== UI ====================== */
  return (
    <SidebarComponent>
      <div className="px-5">
        <Card>
          <div className="text-center mt-5">
            <p className="text-4xl font-semibold">Payment</p>
          </div>

          <CardHeader className="flex justify-between gap-4 md:flex-row">
            <Input
              placeholder="Search Data..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="w-80"
            />
            <div className="flex gap-5">
              <Button onClick={() => setOpenCreate(true)}>Create</Button>
              <DeleteButton
                endpoint="promtpay"
                ids={selectedIds}
                confirmMessage="ต้องการลบรายชื่อนี้ไหม?"
                disabled={selectedIds.length === 0}
                onSuccess={async () => {
                  table.resetRowSelection();
                  await fetchData();
                }}
              />
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center py-10">
                <LoaderIcon className="h-10 w-10 animate-spin" />
                <p>Loading data...</p>
              </div>
            ) :error? (
              <div className="text-center py-10 text-red-500 text-lg">
              {error}
            </div>
            ): (
              <>
                <div className="overflow-x-auto rounded-md border">
                  <Table className="table-fixed w-full">
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
                      {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
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

                <Pagination className="justify-end py-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) setPage(page - 1);
                        }}
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
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <CreatePaymentForm
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={handleCreatePayment}
      />

      <UpdatePaymentForm
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        paymentItem={selectedPayment}
      />
    </SidebarComponent>
  );
}
