"use client";

import React, { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { SidebarComponent } from "../components/Sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { ClientOnlyDate } from "@/app/components/ClientOnlyDate";
import { Input } from "@/components/ui/input";
import {
  OrderResponse,
  OrdersData,
  OrderInterface,
  OrderDetails,
} from "@/types/order";
import { EditableStatusCellWrapper } from "./components/EditableStatusCellWrapper";
import { EditableTrackingWrapper } from "./components/EditTrackingCellWrapper";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrderManagement() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [tableOrders, setTableOrders] = useState<OrderInterface[]>([]);
  const [orderData, setOrderData] = useState<OrdersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/order-management`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data: OrderResponse = await res.json();
      const flatOrders: OrderInterface[] = data.data.orders.map(
        (order: OrderDetails) => ({
          sku: `ORD-${order.id_order}`,
          customerName: `${order.user.first_name} ${order.user.last_name}`,
          orderDate: order.created_at,
          quantity: order.order_items_count,
          totalAmount: order.dynamic_total_price,
          paymentStatus: order.status as OrderInterface["paymentStatus"],
          tracking_number: order.tracking_number ?? "-",
        })
      );
      setOrderData(data.data);
      setTableOrders(flatOrders);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Table columns
  const columns: ColumnDef<OrderInterface>[] = [
    {
      id: "select",
      size: 50,
      header: ({ table }) => (
        <div className="flex justify-center items-center">
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
        <div className="flex justify-center items-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "sku",
      size: 120,
      header: ({ column }) => (
        <div
          className="flex items-center justify-center space-x-1 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>SKU / รหัสสินค้า</span>
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("sku")}</div>,
    },
    {
      accessorKey: "customerName",
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
      cell: ({ row }) => <div>{row.getValue("customerName")}</div>,
    },
    {
      accessorKey: "orderDate",
      size: 140,
      header: "Order Date",
      cell: ({ row }) => (
        <ClientOnlyDate date={new Date(row.getValue("orderDate"))} />
      ),
    },
    {
      accessorKey: "quantity",
      size: 100,
      header: "จำนวนสินค้า",
      cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
    },
    {
      accessorKey: "totalAmount",
      size: 100,
      header: "ยอดรวม",
      cell: ({ row }) => <div>{row.getValue("totalAmount")}</div>,
    },
    {
      accessorKey: "paymentStatus",
      header: "สถานะการชำระเงิน",
      size: 120,
      cell: ({ row }) => (
        <EditableStatusCellWrapper
          row={row}
          onValueChange={(newStatus) => {
            setTableOrders((prev) =>
              prev.map((o) =>
                o.sku === row.original.sku
                  ? { ...o, paymentStatus: newStatus }
                  : o
              )
            );
          }}
        />
      ),
    },
    {
      accessorKey: "tracking_number",
      header: "รหัสการจัดส่ง",
      cell: ({ row }) => (
        <EditableTrackingWrapper
          row={row}
          onValueChange={(newVal) => {
            setTableOrders((prev) =>
              prev.map((o) =>
                o.sku === row.original.sku
                  ? { ...o, tracking_number: newVal }
                  : o
              )
            );
          }}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: tableOrders,
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

  // Dashboard cards
  const orderCards = orderData
    ? [
        {
          title: "คำสั่งซื้อทั้งหมด",
          value: orderData.totalOrders ?? 0,
          icon: "📦",
        },
        {
          title: "รอดำเนินการ",
          value: orderData.pendingOrdersCount ?? 0,
          icon: "⏳",
        },
        {
          title: "กำลังจัดส่ง",
          value: orderData.DeliveryCount ?? 0,
          icon: "🚚",
        },
        {
          title: "สำเร็จแล้ว",
          value: orderData.CompleateCount ?? 0,
          icon: "✅",
        },
      ]
    : [
        { title: "คำสั่งซื้อทั้งหมด", value: "-", icon: "📦" },
        { title: "รอดำเนินการ", value: "-", icon: "⏳" },
        { title: "กำลังจัดส่ง", value: "-", icon: "🚚" },
        { title: "สำเร็จแล้ว", value: "-", icon: "✅" },
      ];

  return (
    <SidebarComponent>
      <div className="px-5">
        <Card>
          <div className="text-center">
            <p className="text-4xl font-semibold">Order Management</p>
          </div>

          <div className="py-10 flex flex-row gap-6 justify-center flex-nowrap overflow-x-auto">
            {orderCards.map((card, i) => (
              <Card
                key={i}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-xs h-full max-h-full"
              >
                <CardHeader>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-row items-center gap-4 pb-2">
                      <p className="text-5xl">{card.icon}</p>
                      <CardTitle className="text-xl">{card.title}</CardTitle>
                    </div>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <Input
                placeholder="Search Customer..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-100"
              />
            </div>

            {loading ? (
              <div className="text-center py-10 text-gray-500 text-lg">
                Loading orders...
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500 text-lg">
                {error}
              </div>
            ) : tableOrders.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-lg">
                No orders found.
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
                            style={{ width: header.getSize() }}
                            className="text-center"
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
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            style={{ width: cell.column.getSize() }}
                            className="text-center"
                          >
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
            )}

            {/* Pagination */}
            {!loading && !error && tableOrders.length > 0 && (
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
                          !table.getCanPreviousPage()
                            ? "pointer-events-none opacity-50 cursor-not-allowed"
                            : ""
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
                          !table.getCanNextPage()
                            ? "pointer-events-none opacity-50 cursor-not-allowed"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarComponent>
  );
}
