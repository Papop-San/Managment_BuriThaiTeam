"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { ChevronDown } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ClientOnlyDate } from "@/app/components/ClientOnlyDate";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type OrderInterface = {
  id: number;
  first_name: string;
  last_name: string;
  date: Date;
  paymentMethod: string;
  status_payment: "pending" | "processing" | "success" | "failed";
  delivery_status:
    | "pending"
    | "processing"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "returned";
};

export const ordersMock: OrderInterface[] = [
  {
    id: 1001,
    first_name: "Somchai",
    last_name: "Prasert",
    date: new Date("2025-08-01"),
    paymentMethod: "Credit Card",
    status_payment: "success",
    delivery_status: "delivered",
  },
  {
    id: 1002,
    first_name: "Suda",
    last_name: "Wongchai",
    date: new Date("2025-08-03"),
    paymentMethod: "Bank Transfer",
    status_payment: "pending",
    delivery_status: "pending",
  },
  {
    id: 1003,
    first_name: "Anan",
    last_name: "Kittipong",
    date: new Date("2025-08-04"),
    paymentMethod: "Cash on Delivery",
    status_payment: "processing",
    delivery_status: "out_for_delivery",
  },
  {
    id: 1004,
    first_name: "Kanya",
    last_name: "Srisuk",
    date: new Date("2025-08-05"),
    paymentMethod: "PromptPay",
    status_payment: "failed",
    delivery_status: "cancelled",
  },
  {
    id: 1005,
    first_name: "Pravit",
    last_name: "Chaiyasit",
    date: new Date("2025-08-06"),
    paymentMethod: "Credit Card",
    status_payment: "success",
    delivery_status: "returned",
  },
  {
    id: 1006,
    first_name: "Niran",
    last_name: "Somsak",
    date: new Date("2025-08-07"),
    paymentMethod: "Credit Card",
    status_payment: "processing",
    delivery_status: "shipped",
  },
  {
    id: 1007,
    first_name: "Mali",
    last_name: "Sukanya",
    date: new Date("2025-08-08"),
    paymentMethod: "Bank Transfer",
    status_payment: "success",
    delivery_status: "delivered",
  },
  {
    id: 1008,
    first_name: "Krit",
    last_name: "Jirawat",
    date: new Date("2025-08-09"),
    paymentMethod: "Cash on Delivery",
    status_payment: "pending",
    delivery_status: "pending",
  },
  {
    id: 1009,
    first_name: "Pimchanok",
    last_name: "Thongchai",
    date: new Date("2025-08-10"),
    paymentMethod: "PromptPay",
    status_payment: "failed",
    delivery_status: "cancelled",
  },
  {
    id: 1010,
    first_name: "Wichai",
    last_name: "Kanjana",
    date: new Date("2025-08-11"),
    paymentMethod: "Credit Card",
    status_payment: "success",
    delivery_status: "delivered",
  },
  {
    id: 1011,
    first_name: "Jintana",
    last_name: "Phromma",
    date: new Date("2025-08-12"),
    paymentMethod: "Bank Transfer",
    status_payment: "processing",
    delivery_status: "shipped",
  },
  {
    id: 1012,
    first_name: "Somyot",
    last_name: "Srisai",
    date: new Date("2025-08-13"),
    paymentMethod: "Cash on Delivery",
    status_payment: "pending",
    delivery_status: "out_for_delivery",
  },
  {
    id: 1013,
    first_name: "Chanida",
    last_name: "Thammasiri",
    date: new Date("2025-08-14"),
    paymentMethod: "PromptPay",
    status_payment: "success",
    delivery_status: "delivered",
  },
  {
    id: 1014,
    first_name: "Pongsak",
    last_name: "Boonyasit",
    date: new Date("2025-08-15"),
    paymentMethod: "Credit Card",
    status_payment: "failed",
    delivery_status: "cancelled",
  },
  {
    id: 1015,
    first_name: "Orathai",
    last_name: "Nipaporn",
    date: new Date("2025-08-16"),
    paymentMethod: "Bank Transfer",
    status_payment: "success",
    delivery_status: "returned",
  },
  {
    id: 1016,
    first_name: "Sakda",
    last_name: "Wichean",
    date: new Date("2025-08-17"),
    paymentMethod: "Cash on Delivery",
    status_payment: "processing",
    delivery_status: "processing",
  },
  {
    id: 1017,
    first_name: "Nattapong",
    last_name: "Saengdao",
    date: new Date("2025-08-18"),
    paymentMethod: "PromptPay",
    status_payment: "pending",
    delivery_status: "pending",
  },
  {
    id: 1018,
    first_name: "Wanida",
    last_name: "Limsuwan",
    date: new Date("2025-08-19"),
    paymentMethod: "Credit Card",
    status_payment: "success",
    delivery_status: "delivered",
  },
  {
    id: 1019,
    first_name: "Chaiyaporn",
    last_name: "Kanchana",
    date: new Date("2025-08-20"),
    paymentMethod: "Bank Transfer",
    status_payment: "failed",
    delivery_status: "cancelled",
  },
  {
    id: 1020,
    first_name: "Siriwan",
    last_name: "Phanupong",
    date: new Date("2025-08-21"),
    paymentMethod: "Cash on Delivery",
    status_payment: "success",
    delivery_status: "delivered",
  },
];


export const columns: ColumnDef<OrderInterface>[] = [
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
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false, // ช่องนี้ไม่ต้องเรียงลำดับได้
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Order ID</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>First Name</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("first_name")}</div>,
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Last Name</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("last_name")}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Order Date</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => {
      const date: Date = row.getValue("date");
      return <ClientOnlyDate date={date} />;
    },
  },
  {
    accessorKey: "status_payment",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Payment Status</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status_payment") as string;
      const colorMap: Record<string, string> = {
        pending: "bg-yellow-500 text-white",
        processing: "bg-blue-700 text-white",
        success: "bg-green-700 text-white",
        failed: "bg-red-700 text-white",
      };

      return (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
            colorMap[status] ?? "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "delivery_status",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Delivery Status</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("delivery_status") as string;
      const colorMap: Record<string, string> = {
        pending: "bg-yellow-500 text-white",
        processing: "bg-blue-900 text-white",
        shipped: "bg-indigo-700 text-white",
        out_for_delivery: "bg-purple-700 text-white",
        delivered: "bg-green-700 text-white",
        cancelled: "bg-red-700 text-white",
        returned: "bg-pink-700 text-white",
      };

      return (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
            colorMap[status] ?? "bg-gray-100 text-gray-800"
          }`}
        >
          {status.replace(/_/g, " ")}
        </span>
      );
    },
  },
];

export function OrderTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: ordersMock,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="w-full  py-7">
      <Card>
        <CardContent>
          {/* input */}
          <div className="flex items-center py-5">
            <Input
              placeholder="Filter First_name ..."
              value={
                (table.getColumn("first_name")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("first_name")
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* table to show  */}
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
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

          {/* pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
