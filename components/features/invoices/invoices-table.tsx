"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InvoiceTableRow } from "@/src/types/ui";
import { formatMAD, formatDateFr } from "@/src/lib/formatters";
import { getStatusBadgeVariant } from "@/src/lib/status";
import { ArrowUpDown, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InvoicesTableProps {
  data: InvoiceTableRow[];
  onRowClick?: (invoice: InvoiceTableRow) => void;
}

export const columns: ColumnDef<InvoiceTableRow>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "N° Facture",
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "amountMAD",
    header: "Montant TTC",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountMAD"));
      return <div className="font-medium">{formatMAD(amount)}</div>;
    },
  },
  {
    accessorKey: "dueDate",
    header: "Échéance",
    cell: ({ row }) => formatDateFr(row.getValue("dueDate")),
  },
  {
    accessorKey: "age",
    header: "Retard (Jours)",
    cell: ({ row }) => {
      const age = parseInt(row.getValue("age"));
      return (
        <span className={age > 60 ? "text-destructive font-bold" : age > 0 ? "text-amber-600" : ""}>
          {age > 0 ? `+${age}` : "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as InvoiceTableRow["status"];
      return <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: "legalRisk",
    header: "Risque 69-21",
    cell: ({ row }) => {
      const isRisk = row.getValue("legalRisk") as boolean;
      if (!isRisk) return null;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="h-5 w-5 text-destructive" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Dépassement du délai légal (60 jours)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];

export function InvoicesTable({ data, onRowClick }: InvoicesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Rechercher..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        {/* We can add bulk actions here later */}
      </div>
      <div className="rounded-md border bg-card">
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
                  onClick={() => onRowClick && onRowClick(row.original)}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
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
                  Aucune facture trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
