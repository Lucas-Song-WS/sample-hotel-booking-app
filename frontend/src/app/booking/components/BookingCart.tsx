"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { bookingPreviewAtom, selectedRoomsAtom } from "../context";
import { BookingResultDTO } from "@/domain/dto/BookingResultDTO";
import { RoomSearchDTO } from "@/domain/dto/RoomSearchDTO";
import { createBooking } from "../api";

interface BookingCartProps {
  search: RoomSearchDTO;
}

export default function BookingCart({ search }: BookingCartProps) {
  const [selectedRooms] = useAtom(selectedRoomsAtom);
  const [bookingPreview] = useAtom<BookingResultDTO | null>(bookingPreviewAtom);
  const router = useRouter();

  if (!bookingPreview) return null;

  const grandTotal = bookingPreview.rooms.reduce((sum, room) => {
    const roomTotal = room.charges.reduce(
      (rSum, c) => rSum + c.chargeAmount,
      0
    );
    return sum + roomTotal;
  }, 0);

  const handleConfirm = async () => {
    try {
      await createBooking(selectedRooms, search.start, search.end);
      router.push("/my-bookings");
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white border rounded shadow-lg w-64 z-50">
      <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
      <p className="mb-4">
        Total Rooms: {bookingPreview.rooms.length} <br />
        Grand Total: <span className="font-bold">${grandTotal.toFixed(2)}</span>
      </p>
      <button
        onClick={handleConfirm}
        className="w-full px-4 py-2 bg-gold text-black font-medium hover:bg-black hover:text-gold transition rounded"
      >
        Confirm Booking
      </button>
    </div>
  );
}
