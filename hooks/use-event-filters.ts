import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";

export function useEventFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const activeType = searchParams.get("type") || "الكل";
  const activeStatus = searchParams.get("status") || "الكل";
  const initialSearch = searchParams.get("q") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  
  const [searchValue, setSearchValue] = useState(initialSearch);

  useEffect(() => {
    setSearchValue(initialSearch);
  }, [initialSearch]);
  useEffect(() => {
    if (searchValue === initialSearch) return;

    const timer = setTimeout(() => {
      updateUrl("q", searchValue, true);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const updateUrl = (key: string, value: string, resetPage = true) => {
    const params = new URLSearchParams(searchParams);
    
    if (value && value !== "الكل") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (resetPage) {
      params.delete("page");
    }
    
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const setType = (type: string) => updateUrl("type", type);
  const setStatus = (status: string) => updateUrl("status", status);
  const setPage = (page: number) => updateUrl("page", page.toString(), false);

  return {
    filters: {
      type: activeType,
      status: activeStatus,
      search: searchValue,
      page: currentPage,
    },
    isPending,
    setSearch: setSearchValue,
    setType,
    setStatus,
    setPage,
  };
}
