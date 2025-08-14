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
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarComponent } from "../components/Sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
// Interface Type
export type StockInterface = {
  ProductId: number;
  ProductName: string;
  category: string;
  totalQuantity: number;
  remainingQuantity: number;
  sales: number; 
  status: "InStock" | "LowStock" | "OutOfStock";
};
// Mockup date
export const stockItemsMockup: StockInterface[] = [
  { ProductId: 1, ProductName: "iPhone 15 Pro", category: "Smartphone", totalQuantity: 150, remainingQuantity: 75, sales: 75, status: "LowStock" },
  { ProductId: 2, ProductName: "MacBook Air M2", category: "Laptop", totalQuantity: 50, remainingQuantity: 50, sales: 0, status: "InStock" },
  { ProductId: 3, ProductName: "Samsung Galaxy S24", category: "Smartphone", totalQuantity: 100, remainingQuantity: 0, sales: 100, status: "OutOfStock" },
  { ProductId: 4, ProductName: "Sony WH-1000XM5", category: "Headphones", totalQuantity: 80, remainingQuantity: 20, sales: 60, status: "LowStock" },
  { ProductId: 5, ProductName: "iPad Pro 12.9", category: "Tablet", totalQuantity: 70, remainingQuantity: 35, sales: 35, status: "LowStock" },
  { ProductId: 6, ProductName: "Dell XPS 13", category: "Laptop", totalQuantity: 60, remainingQuantity: 60, sales: 0, status: "InStock" },
  { ProductId: 7, ProductName: "Google Pixel 8", category: "Smartphone", totalQuantity: 90, remainingQuantity: 10, sales: 80, status: "LowStock" },
  { ProductId: 8, ProductName: "Bose QuietComfort 45", category: "Headphones", totalQuantity: 50, remainingQuantity: 0, sales: 50, status: "OutOfStock" },
  { ProductId: 9, ProductName: "Apple Watch Series 9", category: "Wearable", totalQuantity: 120, remainingQuantity: 80, sales: 40, status: "InStock" },
  { ProductId: 10, ProductName: "Samsung Galaxy Tab S9", category: "Tablet", totalQuantity: 40, remainingQuantity: 20, sales: 20, status: "LowStock" },
  { ProductId: 11, ProductName: "Lenovo ThinkPad X1", category: "Laptop", totalQuantity: 55, remainingQuantity: 55, sales: 0, status: "InStock" },
  { ProductId: 12, ProductName: "Sony Xperia 1 V", category: "Smartphone", totalQuantity: 75, remainingQuantity: 0, sales: 75, status: "OutOfStock" },
  { ProductId: 13, ProductName: "JBL Flip 6", category: "Headphones", totalQuantity: 90, remainingQuantity: 45, sales: 45, status: "LowStock" },
  { ProductId: 14, ProductName: "iMac 24", category: "Desktop", totalQuantity: 30, remainingQuantity: 30, sales: 0, status: "InStock" },
  { ProductId: 15, ProductName: "Amazon Kindle Paperwhite", category: "E-Reader", totalQuantity: 100, remainingQuantity: 50, sales: 50, status: "LowStock" },
  { ProductId: 16, ProductName: "Microsoft Surface Pro 9", category: "Tablet", totalQuantity: 60, remainingQuantity: 0, sales: 60, status: "OutOfStock" },
  { ProductId: 17, ProductName: "HP Spectre x360", category: "Laptop", totalQuantity: 45, remainingQuantity: 45, sales: 0, status: "InStock" },
  { ProductId: 18, ProductName: "Samsung Galaxy Buds 3", category: "Headphones", totalQuantity: 70, remainingQuantity: 25, sales: 45, status: "LowStock" },
  { ProductId: 19, ProductName: "Oppo Find X6 Pro", category: "Smartphone", totalQuantity: 85, remainingQuantity: 0, sales: 85, status: "OutOfStock" },
  { ProductId: 20, ProductName: "Asus ROG Zephyrus", category: "Laptop", totalQuantity: 40, remainingQuantity: 40, sales: 0, status: "InStock" },
];

// Table Management
export const columns: ColumnDef<StockInterface>[] = [
  {
    id: "select",
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
    size: 50, // กำหนด width ของ column ให้พอดี
  },
  {
    accessorKey: "ProductId",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>ID</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("ProductId")}</div>,
  },
  {
    accessorKey: "ProductName",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Product</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("ProductName")}</div>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Category</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("category")}</div>,
  },
  {
    accessorKey: "totalQuantity",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Total Qty</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("totalQuantity")}</div>,
  },
  {
    accessorKey: "remainingQuantity",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Remain Qty</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("remainingQuantity")}</div>,
  },
  {
    accessorKey: "sales",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Sales</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("sales")}</div>,
  },
  {
    accessorKey: "status",
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
      const status = row.getValue("status") as string;
      const colorMap: Record<string, string> = {
        LowStock: "bg-yellow-500 text-white",
        InStock: "bg-green-700 text-white",
        OutOfStock: "bg-red-700 text-white",
      };

      return (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
            colorMap[status] ?? "bg-gray-100 text-gray-800"
          }`}
        >
          {status.replace(/([A-Z])/g, " $1").trim()}
        </span>
      );
    },
  },
];

export default function StockPage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: stockItemsMockup,
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
        pageSize: 20,
      },
    },
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
        if (l !== undefined) {
          if (i - l > 1) {
            range.push("...");
          }
        }
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
            <p className="text-4xl font-semibold">Stock Management</p>
          </div>


          <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <Input
                placeholder="Search product..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-100"
              />
            </div>
            <div className="flex flex-wrap items-center gap-5 md:flex-row">
              <Link href="/stock/create">
                <Button className="cursor-pointer hover:text-black hover:bg-white border border-black">
                  Create
                </Button>
              </Link>
              <Button className="bg-white text-black border border-black cursor-pointer hover:text-white">
                Delete
              </Button>
            </div>
          </div>
            <div className="overflow-hidden rounded-md border w-full">
              <Table className="w-full">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="text-center">
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
          </CardContent>
          <div className="flex items-center space-x-2 py-4">
            <Pagination className="justify-end">
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
        </Card>
      </div>
    </SidebarComponent>
  );
}
