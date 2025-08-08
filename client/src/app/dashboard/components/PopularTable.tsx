"use client";

import * as React from "react";
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
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type PopularInterface = {
  id: number;
  productName: string;
  categoryName: string;
  quantity: number;
  left_quantity: number;
  status_product: "in_stock" | "out_of_stock" | "low_stock";
  date: Date;
};

export const popularProductsMock: PopularInterface[] = [
    {
      id: 1,
      productName: "iPhone 15 Pro Max",
      categoryName: "Smartphone",
      quantity: 120,
      left_quantity: 80,
      status_product: "in_stock",
      date: new Date("2025-07-15"),
    },
    {
      id: 2,
      productName: "Samsung Galaxy S24 Ultra",
      categoryName: "Smartphone",
      quantity: 100,
      left_quantity: 5,
      status_product: "low_stock",
      date: new Date("2025-07-18"),
    },
    {
      id: 3,
      productName: "Sony WH-1000XM5",
      categoryName: "Headphones",
      quantity: 50,
      left_quantity: 0,
      status_product: "out_of_stock",
      date: new Date("2025-07-20"),
    },
    {
      id: 4,
      productName: "MacBook Air M3",
      categoryName: "Laptop",
      quantity: 75,
      left_quantity: 60,
      status_product: "in_stock",
      date: new Date("2025-07-22"),
    },
    {
      id: 5,
      productName: "Dell XPS 15",
      categoryName: "Laptop",
      quantity: 40,
      left_quantity: 3,
      status_product: "low_stock",
      date: new Date("2025-07-23"),
    },
    {
      id: 6,
      productName: "PlayStation 5",
      categoryName: "Gaming Console",
      quantity: 30,
      left_quantity: 0,
      status_product: "out_of_stock",
      date: new Date("2025-07-25"),
    },
    {
      id: 7,
      productName: "Nintendo Switch OLED",
      categoryName: "Gaming Console",
      quantity: 60,
      left_quantity: 45,
      status_product: "in_stock",
      date: new Date("2025-07-26"),
    },
    {
      id: 8,
      productName: "Apple Watch Series 9",
      categoryName: "Wearable",
      quantity: 90,
      left_quantity: 2,
      status_product: "low_stock",
      date: new Date("2025-07-27"),
    },
    {
      id: 9,
      productName: "Logitech MX Master 3S",
      categoryName: "Accessories",
      quantity: 150,
      left_quantity: 150,
      status_product: "in_stock",
      date: new Date("2025-07-28"),
    },
    {
      id: 10,
      productName: "Kindle Paperwhite",
      categoryName: "E-Reader",
      quantity: 35,
      left_quantity: 0,
      status_product: "out_of_stock",
      date: new Date("2025-07-29"),
    },
  ];
export const columns: ColumnDef<PopularInterface>[] = [
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>ID</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "productName",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Product</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("productName")}</div>,
  },
  {
    accessorKey: "categoryName",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Category</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("categoryName")}</div>,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Total Qty</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "status_product",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Status</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status_product") as string;
      const colorMap: Record<string, string> = {
        low_stock: "bg-yellow-500 text-white",
        in_stock: "bg-green-700 text-white",
        out_of_stock: "bg-red-700 text-white",
      };

      return (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
            colorMap[status] ?? "bg-gray-100 text-gray-800"
          }`}
        >
          {status.replace("_", " ")}
        </span>
      );
    },
  },
];

export function PopularTable() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");
  
    const table = useReactTable({
      data: popularProductsMock,
      columns,
      state: { sorting, globalFilter },
      onSortingChange: setSorting,
      onGlobalFilterChange: setGlobalFilter,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      initialState: {
        pagination: {
          pageSize: 10, // 👈 limit 10 ต่อหน้า
        },
      },
    });
  
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Popular Products</CardTitle>
            <Input
              placeholder="Search product..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
  
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex space-x-2">
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
    );
  }
  
