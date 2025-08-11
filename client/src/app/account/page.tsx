"use client";

import React from "react";
import { SidebarComponent } from "@/app/components/Sidebar";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { ClientOnlyDate } from "@/app/components/ClientOnlyDate";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export type AccountInterface = {
  userId: number;
  fistName: string;
  lastName: string;
  userImg: string;
  create_date: Date;
  last_login: Date;
  status_active: boolean;
};

export const accountMock: AccountInterface[] = [
  {
    userId: 1,
    fistName: "John",
    lastName: "Doe",
    userImg: "https://randomuser.me/api/portraits/men/32.jpg",
    create_date: new Date("2025-06-10T10:15:00"),
    last_login: new Date("2025-08-09T09:30:00"),
    status_active: true,
  },
  {
    userId: 2,
    fistName: "Jane",
    lastName: "Smith",
    userImg: "https://randomuser.me/api/portraits/women/45.jpg",
    create_date: new Date("2025-05-25T14:45:00"),
    last_login: new Date("2025-08-08T16:20:00"),
    status_active: false,
  },
  {
    userId: 3,
    fistName: "Alex",
    lastName: "Johnson",
    userImg: "https://randomuser.me/api/portraits/men/77.jpg",
    create_date: new Date("2025-07-01T08:10:00"),
    last_login: new Date("2025-08-10T11:50:00"),
    status_active: true,
  },
];

export const columns: ColumnDef<AccountInterface>[] = [
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
    accessorKey: "userId",
    header: ({ column }) => (
      <div
        className="flex items-center space-x-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Order ID</span>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("userId")}</div>,
  },

  {
    id: "accountName",
    header: "Account Name",
    cell: ({ row }) => {
      const imgSrc = row.original.userImg;
      const firstName = row.original.fistName;
      const lastName = row.original.lastName;

      return (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={imgSrc} alt={`${firstName} ${lastName}`} />
            <AvatarFallback>
              {firstName[0]}
              {lastName[0]}
            </AvatarFallback>
          </Avatar>
          <span>{`${firstName} ${lastName}`}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "create_date",
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
      const date: Date = row.getValue("create_date");
      return <ClientOnlyDate date={date} />;
    },
  },
  {
    accessorKey: "status_active",
    header: () => <div>Status</div>,
    cell: ({ row }) => {
      const value = row.getValue("status_active") as boolean;
      const color = value ? "bg-green-500" : "bg-red-500";
      const text = value ? "Active" : "Inactive";

      return (
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${color}`}></span>
          <span>{text}</span>
        </div>
      );
    },
  },
];

export default function AccountManagement() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchValue, setSearchValue] = React.useState("");

  const table = useReactTable({
    data: accountMock,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setSearchValue,
    globalFilterFn: (row, columnId, filterValue) => {
      // รวมชื่อและนามสกุล และกรองแบบ case-insensitive
      const fullName =
        `${row.original.fistName} ${row.original.lastName}`.toLowerCase();
      return fullName.includes(String(filterValue).toLowerCase());
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: searchValue,
    },
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
    <SidebarComponent>
      <div>
        <div className="text-center">
          <p className="text-4xl font-semibold ">Account Management</p>
        </div>
        <div className="flex flex-wrap items-center gap-5 md:flex-row justify-end mx-10 my-10">
          <Button className="cursor-pointer hover:text-black hover:bg-white border border-black">
            Crate
          </Button>
          <Button className="bg-white text-black border border-black cursor-pointer hover:text-white">
            Delete
          </Button>
        </div>
        <div className="overflow-hidden rounded-md border mx-auto">
          <Card>
            <CardContent>
              <div className="flex items-center py-5">
                <Input
                  placeholder="Search Account name"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full max-w-sm"
                />
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
                          key={row.original.userId}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarComponent>
  );
}
