"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface MPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function MPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: MPaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div
      dir="rtl"
      className={cn(
        "bg-secondary/50 px-4 py-3 border-t  ",
        className
      )}
    >
      {/* <div className="flex items-center justify-between gap-3 sm:justify-start">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-primary/10 px-3 text-sm font-bold text-primary">
            {currentPage}
          </span>
          <div className="space-y-0.5 text-right">
            <p className="text-sm font-semibold text-foreground">الصفحة الحالية</p>
            <p className="text-xs text-muted-foreground">من أصل {totalPages} صفحات</p>
          </div>
        </div>
      </div> */}

      <Pagination className="mx-0 w-full justify-end sm:w-auto" dir="rtl">
        <PaginationContent className="flex-wrap justify-end gap-1.5">
          <PaginationItem>
            <button
              type="button"
              onClick={() => {
                if (canGoPrevious) {
                  onPageChange(currentPage - 1);
                }
              }}
              disabled={!canGoPrevious}
              aria-label="الصفحة السابقة"
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-all",
                canGoPrevious
                  ? "border-border bg-background text-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  : "cursor-not-allowed border-border/60 bg-muted/60 text-muted-foreground opacity-60"
              )}
            >
              <ChevronRight className="h-4 w-4" />
              <span>السابق</span>
            </button>
          </PaginationItem>

          {pages.map((page, idx) =>
            page === "..." ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis className="h-10 w-10 rounded-xl border border-dashed border-border/70 bg-background text-muted-foreground" />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page as number)}
                  isActive={currentPage === page}
                  aria-label={`الانتقال إلى الصفحة ${page}`}
                  className={cn(
                    "h-9 w-9 rounded-lg border text-sm font-semibold transition-all",
                    currentPage === page
                      ? "border-primary bg-primary! text-primary-foreground shadow-md shadow-primary/15"
                      : "border-border bg-background text-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <button
              type="button"
              onClick={() => {
                if (canGoNext) {
                  onPageChange(currentPage + 1);
                }
              }}
              disabled={!canGoNext}
              aria-label="الصفحة التالية"
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-all",
                canGoNext
                  ? "border-border bg-background text-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  : "cursor-not-allowed border-border/60 bg-muted/60 text-muted-foreground opacity-60"
              )}
            >
              <span>التالي</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
