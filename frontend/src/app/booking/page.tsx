"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import RoomSearchForm from "./components/RoomSearchForm";
import RoomCard from "./components/RoomCard";
import { RoomSearchDTO } from "@/domain/dto/RoomSearchDTO";
import { RoomResultDTO } from "@/domain/dto/RoomResultDTO";
import {
  selectedRoomsAtom,
  bookingPreviewAtom,
  roomSearchAtom,
} from "./context";
import { BookingRoomDTO } from "./domain/dto/BookingRoom";

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
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Failed to fetch rooms: ${res.status} ${res.statusText} - ${text}`
    );
  }
  return res.json() as Promise<RoomResultDTO[]>;
}

async function createBooking(
  selectedRooms: BookingRoomDTO[],
  start: Date,
  end: Date,
  remarks?: string
) {
  const body = {
    guestSeq: 1,
    start: start.toISOString(),
    end: end.toISOString(),
    remarks,
    rooms: selectedRooms.map((r) => ({
      roomTypeSeq: r.roomTypeSeq,
      numAdults: r.numAdults,
      numChildren: r.numChildren,
      roomViewSeq: r.roomViewSeq,
      roomSmokingYn: r.roomSmokingYn,
      additionalCharges: r.additionalCharges?.map((c) => ({
        chargeSeq: c.chargeSeq,
      })),
    })),
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Booking creation failed: ${res.status} ${res.statusText} - ${text}`
    );
  }

  return res.json();
}

export default function RoomSearchPage() {
  const [searchParams, setSearchParams] = useState<RoomSearchDTO | null>(null);
  const [selectedRooms] = useAtom(selectedRoomsAtom);
  const [bookingPreview] = useAtom(bookingPreviewAtom);
  const [roomSearch] = useAtom(roomSearchAtom);
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useQuery<RoomResultDTO[]>({
    queryKey: ["rooms", searchParams],
    queryFn: () => fetchRooms(searchParams!),
    enabled: false,
  });

  const bookingMutation = useMutation({
    mutationFn: () =>
      createBooking(selectedRooms, roomSearch.start, roomSearch.end),
    onSuccess: (data) => {
      console.log("Booking created:", data);
      router.push("/my-bookings");
    },
    onError: (err: any) => {
      console.error(err);
      alert(`Booking failed: ${err.message}`);
    },
  });

  const handleSearch = (dto: RoomSearchDTO) => {
    setSearchParams(dto);
    refetch();
  };

  const grandTotal = bookingPreview
    ? bookingPreview.rooms
        .flatMap((r) => r.charges)
        .reduce((sum, c) => sum + c.chargeAmount, 0)
        .toFixed(2)
    : "0.00";

  const isBookingLoading = bookingMutation.status === "pending";

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

        <div className="w-64 p-4 border rounded-lg shadow flex flex-col gap-4">
          <h3 className="font-semibold text-lg mb-2">Grand Total</h3>
          <p className="text-xl font-bold">${grandTotal}</p>

          <button
            onClick={() => bookingMutation.mutate()}
            disabled={selectedRooms.length === 0 || isBookingLoading}
            className="px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 transition rounded disabled:opacity-50"
          >
            {isBookingLoading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
