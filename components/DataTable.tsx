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
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-secondary/50 text-muted-foreground text-xs">
            {columns.map(col => (
              <th key={col.key} className="text-right p-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              style={rowHeight ? { height: rowHeight } : undefined}
              className={[
                "border-t",
                i % 2 === 1 ? "bg-secondary/20" : "",
                hoverable ? "hover:bg-secondary/20" : ""
              ].join(" ")}
            >
              {columns.map(col => (
                <td key={col.key} className="p-3">
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}