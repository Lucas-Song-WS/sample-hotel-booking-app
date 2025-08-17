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
    <div className="p-4 bg-white border rounded shadow-lg max-h-[80vh] overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Booking Dates</h3>
        <p>
          Start:{" "}
          <span className="font-medium">
            {bookingPreview.start.substring(0, 10)}
          </span>
          <br />
          End:{" "}
          <span className="font-medium">
            {bookingPreview.end.substring(0, 10)}
          </span>
        </p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Rooms</h3>
        <ul className="space-y-3 text-sm">
          {bookingPreview.rooms.map((room, idx) => {
            const roomTotal = room.charges.reduce(
              (rSum, c) => rSum + c.chargeAmount,
              0
            );
            return (
              <li key={idx} className="border p-2 rounded">
                <p>
                  <span className="font-medium">Room Type: </span>
                  {room.roomTypeName}
                </p>
                <p>
                  <span className="font-medium">Guests: </span>
                  {room.numAdults} adults, {room.numChildren} children
                </p>
                {room.roomViewSeq && (
                  <p>
                    <span className="font-medium">View: </span>
                    {room.roomViewName}
                  </p>
                )}
                {room.roomSmokingYn !== undefined && (
                  <p>
                    <span className="font-medium">Smoking: </span>
                    {room.roomSmokingYn ? "Yes" : "No"}
                  </p>
                )}

                <div className="mt-2">
                  <span className="font-medium">Charges:</span>
                  <ul className="mt-1 space-y-1">
                    {room.charges.map((c, cIdx) => (
                      <li key={cIdx} className="flex justify-between text-sm">
                        <span>{c.chargeDesc}</span>
                        <span className="font-medium">
                          RM{c.chargeAmount.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 flex justify-between font-semibold border-t pt-1">
                    <span>Room Total</span>
                    <span>RM{roomTotal.toFixed(2)}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 border-t pt-2">
        <p className="flex justify-between font-bold text-lg">
          <span>Grand Total</span>
          <span>RM{grandTotal.toFixed(2)}</span>
        </p>
        <button
          onClick={handleConfirm}
          className="mt-3 w-full px-4 py-2 bg-gold text-black font-medium hover:bg-black hover:text-gold transition rounded"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
