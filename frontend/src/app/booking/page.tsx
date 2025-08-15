"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import RoomSearchForm from "./components/RoomSearchForm";
import { RoomSearchDTO } from "@/domain/dto/RoomSearchDTO";
import RoomCard from "./components/RoomCard";
import { RoomResultDTO } from "@/domain/dto/RoomResultDTO";

function serializeDates(dto: RoomSearchDTO) {
  const params = new URLSearchParams();
  params.append("start", dto.start.toISOString().substring(0, 10));
  params.append("end", dto.end.toISOString().substring(0, 10));

  if (dto.roomTypeSeq) params.append("roomTypeSeq", dto.roomTypeSeq.toString());
  if (dto.roomBedSeqList?.length)
    dto.roomBedSeqList.forEach((bed) =>
      params.append("roomBedSeqList", bed.toString())
    );
  if (dto.tagSeq) params.append("tagSeq", dto.tagSeq.toString());
  if (dto.limit) params.append("limit", dto.limit.toString());
  if (dto.offset) params.append("offset", dto.offset.toString());

  return params.toString();
}

async function fetchRooms(dto: RoomSearchDTO) {
  const query = serializeDates(dto);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rooms/search?${query}`
  );
  if (!res.ok) throw new Error("Failed to fetch rooms");
  return res.json();
}

export default function RoomSearchPage() {
  const [searchParams, setSearchParams] = useState<RoomSearchDTO | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<RoomResultDTO[]>({
    queryKey: ["rooms", searchParams],
    queryFn: () => fetchRooms(searchParams!),
    enabled: false,
  });

  useEffect(() => {
    if (searchParams) {
      refetch();
    }
  }, [searchParams, refetch]);

  const handleSearch = (dto: RoomSearchDTO) => {
    setSearchParams(dto);
  };

  return (
    <div className="p-6">
      <RoomSearchForm onSearch={handleSearch} />

      {isLoading && <p>Loading rooms...</p>}
      {isError && <p className="text-red-500">Error fetching rooms.</p>}

      <div className="flex gap-4">
        <div className="flex-1 space-y-4">
          {data && data.length === 0 && <p>No rooms found.</p>}
          {data &&
            data.map((room) => <RoomCard key={room.roomTypeSeq} room={room} />)}
        </div>

        <div className="w-64 p-4 border rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Grand Total</h3>
          <p className="text-xl font-bold">
            $
            {data
              ? data.reduce((sum, r) => sum + r.totalPrice, 0).toFixed(2)
              : "0.00"}
          </p>
        </div>
      </div>
    </div>
  );
}
