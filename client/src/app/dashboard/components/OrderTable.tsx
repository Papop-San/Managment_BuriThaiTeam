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
import { ChevronDown,  } from "lucide-react";
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
    id: 1001,  // แก้จาก "ORD-1001" เป็น 1001
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
    <div className="w-full">
      <div className="flex items-center py-5">
        <Input
          placeholder="Filter First_name ..."
          value={
            (table.getColumn("first_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("first_name")?.setFilterValue(event.target.value)
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
              .map((column) => {
                return (
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
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
    </div>
  );
}
