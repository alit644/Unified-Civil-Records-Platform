import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { StatePlaceholder } from "./shared/StatePlaceholder";
import { Users } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowHeight?: number;
  hoverable?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  rowHeight,
  hoverable = false,
}: DataTableProps<T>) {
  return (
    <div className="w-full relative overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
        <Table className="text-sm min-w-full border-separate border-spacing-0">
          <TableHeader>
            <TableRow className="bg-secondary/30 hover:bg-secondary/30">
              {columns.map((col, index) => (
                <TableHead 
                  key={col.key} 
                  className={cn(
                    "text-right p-4 font-bold text-muted-foreground whitespace-nowrap border-b border-border/50",
                    index === 0 && "sticky right-0 bg-secondary z-10 md:static md:bg-transparent"
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, i) => (
                <TableRow
                  key={i}
                  style={rowHeight ? { height: rowHeight } : undefined}
                  className={cn(
                    "group transition-colors",
                    hoverable && "hover:bg-muted/50"
                  )}
                >
                  {columns.map((col, index) => (
                    <TableCell 
                      key={col.key} 
                      className={cn(
                        "p-4 whitespace-nowrap border-b border-border/50",
                        index === 0 && "sticky right-0 bg-card group-hover:bg-muted/50 z-10 transition-colors md:static md:bg-transparent"
                      )}
                    >
                      {col.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-12 text-center text-muted-foreground">
                  <StatePlaceholder title="لا توجد بيانات" description="لا توجد بيانات متاحة لعرضها حالياً." icon={Users} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Visual indicator for overflow on the left in RTL */}
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-8 bg-gradient-to-r from-background/60 to-transparent md:hidden" />
    </div>
  );
}
