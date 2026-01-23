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
import { TopProductTableItem } from "@/types/dashboard";

export interface PopularTableProps {
   topTable: TopProductTableItem[]
}

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
  {
    id: 11,
    productName: "Google Pixel 8 Pro",
    categoryName: "Smartphone",
    quantity: 90,
    left_quantity: 50,
    status_product: "in_stock",
    date: new Date("2025-08-01"),
  },
  {
    id: 12,
    productName: "Bose QuietComfort Earbuds",
    categoryName: "Headphones",
    quantity: 70,
    left_quantity: 10,
    status_product: "low_stock",
    date: new Date("2025-08-03"),
  },
  {
    id: 13,
    productName: "Asus ROG Zephyrus G15",
    categoryName: "Laptop",
    quantity: 35,
    left_quantity: 0,
    status_product: "out_of_stock",
    date: new Date("2025-08-05"),
  },
  {
    id: 14,
    productName: "Fitbit Charge 6",
    categoryName: "Wearable",
    quantity: 60,
    left_quantity: 60,
    status_product: "in_stock",
    date: new Date("2025-08-06"),
  },
];
export const columns: ColumnDef<PopularInterface>[] = [

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

export function PopularTable({topTable}:PopularTableProps ) {
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
        pageSize: 10,
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
    <Card className="mt-10">
      <CardHeader className=" space-y-0 border-b  sm:flex-row">
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
        <div className="overflow-hidden rounded-md border">
          <Table>
          <TableHeader>
  {table.getHeaderGroups().map((headerGroup) => (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <TableHead
          key={header.id}
          className="px-20 py-2 text-left" // <-- padding เท่ากับ body
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
  {table.getRowModel().rows?.length ? (
    table.getRowModel().rows.map((row) => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className="px-20 py-2">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center px-4 py-2">
        No results.
      </TableCell>
    </TableRow>
  )}
</TableBody>
          </Table>
        </div>
        {/* pagination */}
        <div className="flex items-center space-x-2 py-4">
          <Pagination className="justify-end">
            <PaginationContent >
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
  );
}
