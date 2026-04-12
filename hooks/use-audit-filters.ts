import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export function useAuditFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const filters = {
    page: searchParams.get("page") || "1",
    employeeId: searchParams.get("employeeId") || "all",
    action: searchParams.get("action") || "all",
    tableName: searchParams.get("tableName") || "all",
    search: searchParams.get("q") || "",
  };

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    const params = new URLSearchParams(searchParams);
    
    // Reset to page 1 on filter change unless specifically setting page
    if (!newFilters.page) params.set("page", "1");

    Object.entries(newFilters).forEach(([key, value]) => {
      const paramKey = key === "search" ? "q" : key;
      if (value && value !== "all") {
        params.set(paramKey, value);
      } else {
        params.delete(paramKey);
      }
    });

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }, [pathname, replace, searchParams]);

  const setPage = (page: number) => updateFilters({ page: page.toString() });
  const setEmployeeId = (id: string) => updateFilters({ employeeId: id });
  const setAction = (action: string) => updateFilters({ action });
  const setTableName = (tableName: string) => updateFilters({ tableName });
  const setSearch = useDebouncedCallback((q: string) => updateFilters({ search: q }), 400);

  return {
    filters,
    isPending,
    setPage,
    setEmployeeId,
    setAction,
    setTableName,
    setSearch,
  };
}
