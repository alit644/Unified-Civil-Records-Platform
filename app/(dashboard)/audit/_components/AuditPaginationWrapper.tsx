"use client";

import MPagination from "@/components/shared/MPagination";
import { useAuditFilters } from "@/hooks/use-audit-filters";

interface AuditPaginationWrapperProps {
  totalPages: number;
  currentPage: number;
}

export default function AuditPaginationWrapper({ totalPages, currentPage }: AuditPaginationWrapperProps) {
  const { setPage } = useAuditFilters();

  if (totalPages <= 1) return null;

  return (
    <MPagination
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={setPage}
    />
  );
}
