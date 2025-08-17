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
    <div className="p-6">
      <RoomSearchForm
        preSearch={preSearch}
        setPreSearch={setPreSearch}
        onSearch={executeSearch}
        onReset={resetSearch}
      />
      <RoomResults
        search={search}
        pagination={pagination}
        setPagination={setPagination}
      />
      <BookingCart search={search} />
    </div>
  );
}
