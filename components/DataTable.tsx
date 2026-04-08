import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowHeight?: number
  hoverable?: boolean
}

export function DataTable<T>({
  columns, data, rowHeight, hoverable = false
}: DataTableProps<T>) {
  return (
    <Table className="w-full text-sm">
      <TableHeader>
        <TableRow className="bg-secondary/50 text-muted-foreground text-xs">
          {columns.map(col => (
            <TableHead key={col.key} className="text-right p-3 font-medium">
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow
            key={i}
            style={rowHeight ? { height: rowHeight } : undefined}
            className={hoverable ? "hover:bg-muted/50" : ""}
          >
            {columns.map(col => (
              <TableCell key={col.key} className="p-3">
                {col.render(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

