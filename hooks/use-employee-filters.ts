import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function useEmployeeFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return {
    currentPage,
    isPending,
    setPage,
  };
}
