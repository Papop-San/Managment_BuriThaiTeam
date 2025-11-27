"use client";

import React from "react";
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
import { EditableStatusCell } from "./components/statusCell";
import {EditTrackingCell} from "./components/trackingCell"
import { Input } from "@/components/ui/input";
export type OrderInterface = {
  sku: string;
  customerName: string;
  orderDate: string;
  quantity: number;
  totalAmount: number;
  paymentMethod: string;
  tracking_number: string;
  paymentStatus: "Paid" | "Pending" | "Failed";
};

export const orderItemMockup: OrderInterface[] = [
  {
    sku: "ORD-1001",
    customerName: "John Doe",
    orderDate: "2025-08-01",
    quantity: 2,
    totalAmount: 50,
    paymentMethod: "Credit Card",
    tracking_number: "TRK-202501001",
    paymentStatus: "Paid",
  },
  {
    sku: "ORD-1002",
    customerName: "Alice Smith",
    orderDate: "2025-08-02",
    quantity: 1,
    totalAmount: 120,
    paymentMethod: "PayPal",
    tracking_number: "TRK-202501002",
    paymentStatus: "Pending",
  },
  {
    sku: "ORD-1003",
    customerName: "Michael Johnson",
    orderDate: "2025-08-03",
    quantity: 1,
    totalAmount: 300,
    paymentMethod: "Bank Transfer",
    tracking_number: "TRK-202501003",
    paymentStatus: "Paid",
  },
  {
    sku: "ORD-1004",
    customerName: "Emma Wilson",
    orderDate: "2025-08-04",
    quantity: 3,
    totalAmount: 90,
    paymentMethod: "Cash on Delivery",
    tracking_number: "TRK-202501004",
    paymentStatus: "Failed",
  },
  {
    sku: "ORD-1005",
    customerName: "David Lee",
    orderDate: "2025-08-05",
    quantity: 1,
    totalAmount: 150,
    paymentMethod: "Credit Card",
    tracking_number: "TRK-202501005",
    paymentStatus: "Paid",
  },
];


export const columns: ColumnDef<OrderInterface>[] = [
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
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
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
    header: ({ column }) => (
      <div
        className="flex items-center justify-center space-x-1 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Order Date</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => (
      <ClientOnlyDate date={new Date(row.getValue("orderDate"))} />
    ),
  },
  {
    accessorKey: "quantity",
    size: 100,
    header: ({ column }) => (
      <div
        className="flex items-center justify-center space-x-1 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>จำนวนสินค้า</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "totalAmount",
    size: 100,
    header: ({ column }) => (
      <div
        className="flex items-center justify-center space-x-1 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>ยอดรวม</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("totalAmount")}</div>,
  },

  {
    accessorKey: "paymentStatus",
    header: "สถานะการชำระเงิน",
    size: 120,
    cell: ({ row }) => (
      <EditableStatusCell
        value={row.getValue("paymentStatus") as OrderInterface["paymentStatus"]}
        options={["Paid", "Pending", "Failed"]}
        colorMap={{
          Paid: "bg-green-500",
          Pending: "bg-yellow-500",
          Failed: "bg-red-500",
        }}
        onSave={(newValue) =>
          console.log("Payment updated:", newValue, "for", row.original.sku)
        }
      />
    ),
  },
  {
    accessorKey: "tracking_number",
    header: "รหัสการจัดส่ง",
    cell: ({ row }) => {
      const tracking = row.getValue("tracking_number") as string ?? "";
  
      return (
        <EditTrackingCell
          value={tracking}
          onSave={(newVal) => {
            console.log("Saved:", newVal);
          }}
        />
      );
    },
  }
  
];

export default function OrderManagement() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: orderItemMockup,
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
          <div className="text-center">
            <p className="text-4xl font-semibold">Order Management</p>
          </div>

          {/* Card for insert Counting */}
          <div className="flex flex-wrap justify-center gap-8 mt-4">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-xs"
              >
                <CardHeader className="flex flex-col items-center space-y-2">
                  <div className="text-4xl">🎯</div>
                  <CardTitle className="text-xl text-center">
                    Card Title
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>

          <CardContent>
          <div className="flex items-center justify-between mb-6">
              <div>
                <Input
                  placeholder="Search Customer..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="w-100"
                />
              </div>
              
            </div>
            <div className="overflow-hidden rounded-md border w-full">
              <Table className="w-full ">
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
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
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
