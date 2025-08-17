"use client";

import { PaginationDTO } from "@/domain/dto/CommonDTO";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useEffect, useState } from "react";

export function useSearchState<T>(
  initialState: T,
  initialPagination?: Partial<PaginationDTO>,
  useUrlParams: boolean = true,
  allowBack: boolean = true
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [preSearch, setPreSearch] = useState<T>(initialState);
  const [search, setSearch] = useState<T>(initialState);
  const [pagination, setPagination] = useState<PaginationDTO>({
    pageNumber: 1,
    pageSize: 10,
    sortField: undefined,
    sortDirection: undefined,
    ...initialPagination,
  });

  useEffect(() => {
    if (!useUrlParams) return;

    const parsed = qs.parse(searchParams.toString());
    setPreSearch((prev) => ({ ...prev, ...parsed }));
    setPagination((prev) => ({ ...prev, ...parsed }));
  }, [searchParams]);

  function executeSearch() {
    setSearch({ ...preSearch });
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
    updateUrl(preSearch);
  }

  function setAndExecuteSearch(newState: Partial<T>) {
    setPreSearch((prev) => ({ ...prev, ...newState }));
    setSearch((prev) => ({ ...prev, ...newState }));
  }

  function resetSearch(): void {
    setSearch({ ...initialState });
    setPreSearch({ ...initialState });
    updateUrl(initialState);
  }

  function updateUrl(state: T) {
    if (!useUrlParams) return;

    const queryString = qs.stringify(state, {
      skipNulls: true,
      arrayFormat: "comma",
    });
    const query = new URL(pathname, window.location.origin);
    query.search = queryString ? `?${queryString}` : "";
    allowBack ? router.replace(query.href) : router.push(query.href);
  }

  return {
    preSearch,
    setPreSearch,
    search,
    setSearch,
    pagination,
    setPagination,
    executeSearch,
    setAndExecuteSearch,
    resetSearch,
  };
}
