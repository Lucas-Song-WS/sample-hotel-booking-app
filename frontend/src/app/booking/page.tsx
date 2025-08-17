"use client";

import { RoomSearchDTO } from "@/domain/dto/RoomSearchDTO";
import { useSearchState } from "@/lib/useSearchState";
import RoomResults from "./components/RoomResults";
import RoomSearchForm from "./components/RoomSearchForm";
import { initialRoomSearch } from "./context";
import BookingCart from "./components/BookingCart";

export default function Page() {
  const {
    preSearch,
    setPreSearch,
    search,
    pagination,
    setPagination,
    executeSearch,
    resetSearch,
  } = useSearchState<RoomSearchDTO>(initialRoomSearch, { pageSize: 3 });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <RoomSearchForm
        preSearch={preSearch}
        setPreSearch={setPreSearch}
        onSearch={executeSearch}
        onReset={resetSearch}
      />

      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4 w-full">
          <RoomResults
            search={search}
            pagination={pagination}
            setPagination={setPagination}
          />
        </div>

        <div className="lg:w-1/4 w-full lg:sticky lg:top-20 self-start">
          <BookingCart search={search} />
        </div>
      </div>
    </div>
  );
}
