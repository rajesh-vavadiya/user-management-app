'use client';

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchUsers } from "../../app/services/api";
import { Button } from "@/components/ui/button"; // ShadCN Button

export default function UserTable() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState(initialPage);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pageLimit, setPageLimit] = useState(5);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", page],
    queryFn: fetchUsers,
  });

  useEffect(() => {
    if (data && data.totalCount) {
      const totalPages = Math.ceil(data.totalCount / pageLimit);
      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [data, pageLimit, page]);

  useEffect(() => {
    router.push(`/users?page=${page}`, { shallow: true });
  }, [page, router]);

  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
  ];

  const table = useReactTable({
    data: data ? data.users : [],
    columns,
    state: { globalFilter, sorting },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    console.error(error);
    return <div>Error loading users: {error.message}</div>;
  }

  const totalPages = data ? Math.ceil(data.totalCount / pageLimit) : 0;

  return (
    <div className="p-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search..."
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full border-collapse bg-white border border-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`border border-gray-200 p-2 text-left text-sm font-semibold ${
                      header.column.getCanSort() ? "cursor-pointer" : ""
                    }`}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    {header.column.columnDef.header}
                    {header.column.getIsSorted()
                      ? header.column.getIsSorted() === "asc"
                        ? " ↑"
                        : " ↓"
                      : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Table Body */}
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-100 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border border-gray-200 p-2 text-sm">
                    {cell.getValue()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 text-sm"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 text-sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
