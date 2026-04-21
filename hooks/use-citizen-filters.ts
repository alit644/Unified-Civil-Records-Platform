import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { useDebounce } from "use-debounce";

export function useCitizenFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const activeGender = searchParams.get("gender") || "all";
  const activeStatus = searchParams.get("status") || "all";
  const initialSearch = searchParams.get("q") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [searchValue, setSearchValue] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(searchValue, 400);

  // مزامنة قيمة البحث عند تغيّر الـ URL (مثلاً عند الرجوع للصفحة)
  useEffect(() => {
    setSearchValue(initialSearch);
  }, [initialSearch]);

  // تحديث الـ URL عند تغيّر القيمة المؤجّلة
  useEffect(() => {
    if (debouncedSearch === initialSearch) return;
    updateUrl("q", debouncedSearch, true);
  }, [debouncedSearch]);
  

  const updateUrl = (key: string, value: string, resetPage = true) => {
    const params = new URLSearchParams(searchParams);

    if (value && value !== "all") {
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

  const setGender = (gender: string) => updateUrl("gender", gender);
  const setStatus = (status: string) => updateUrl("status", status);
  const setPage = (page: number) => updateUrl("page", page.toString(), false);

  return {
    filters: {
      gender: activeGender,
      status: activeStatus,
      search: searchValue,
      page: currentPage,
    },
    isPending,
    setSearch: setSearchValue,
    setGender,
    setStatus,
    setPage,
  };
}
