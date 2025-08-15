"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { Dialog } from "@/components/Dialog";
import { RoomResultDTO } from "@/domain/dto/RoomResultDTO";
import {
  bookingRoomAtom,
  selectedRoomsAtom,
  bookingPreviewAtom,
  roomSearchAtom,
} from "../context";
import { BookingRoomDTO } from "../domain/dto/BookingRoom";
import { BookingResultDTO } from "@/domain/dto/BookingResultDTO";

interface RoomCardProps {
  room: RoomResultDTO;
}

async function fetchBookingPreview(
  rooms: BookingRoomDTO[],
  start: Date,
  end: Date
) {
  const body = {
    guestSeq: 1,
    start: start.toISOString().substring(0, 10),
    end: end.toISOString().substring(0, 10),
    rooms: rooms.map((r) => ({
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

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/booking/preview`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Booking preview failed: ${res.status} ${res.statusText} - ${errorText}`
    );
  }
  return res.json() as Promise<BookingResultDTO>;
}

export default function RoomCard({ room }: RoomCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingRoom, setBookingRoom] = useAtom(bookingRoomAtom);
  const [, setSelectedRooms] = useAtom(selectedRoomsAtom);
  const [, setBookingPreview] = useAtom(bookingPreviewAtom);

  const [roomSearch] = useAtom(roomSearchAtom);

  const handleOpen = () => {
    setBookingRoom({
      roomTypeSeq: room.roomTypeSeq,
      numAdults: 1,
      numChildren: 0,
      roomViewSeq: undefined,
      roomSmokingYn: undefined,
      additionalCharges: [],
    });
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    setSelectedRooms((prev: BookingRoomDTO[]) => {
      const newRooms = [...prev, bookingRoom];

      fetchBookingPreview(newRooms, roomSearch.start, roomSearch.end)
        .then((preview) => setBookingPreview(preview))
        .catch(console.error);

      return newRooms;
    });

    setIsOpen(false);
  };

  return (
    <>
      <div
        onClick={handleOpen}
        className="border rounded-lg p-4 shadow hover:shadow-md cursor-pointer transition w-full"
      >
        <h2 className="text-lg font-semibold">{room.roomTypeName}</h2>
        <p className="text-sm text-gray-600">{room.roomTypeDesc}</p>
        <p className="mt-2 font-semibold">
          Total Price: ${room.totalPrice.toFixed(2)}
        </p>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <h3 className="text-lg font-semibold mb-2">Add Room</h3>

        <div className="grid gap-4">
          <div>
            <label className="block font-medium">Number of Adults</label>
            <input
              type="number"
              min={1}
              value={bookingRoom.numAdults}
              onChange={(e) =>
                setBookingRoom((prev) => ({
                  ...prev,
                  numAdults: Number(e.target.value),
                }))
              }
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-medium">Number of Children</label>
            <input
              type="number"
              min={0}
              value={bookingRoom.numChildren || 0}
              onChange={(e) =>
                setBookingRoom((prev) => ({
                  ...prev,
                  numChildren: Number(e.target.value),
                }))
              }
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-medium">View</label>
            <select
              value={bookingRoom.roomViewSeq ?? ""}
              onChange={(e) =>
                setBookingRoom((prev) => ({
                  ...prev,
                  roomViewSeq: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                }))
              }
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">Select a view</option>
              {room.views.map((view) => (
                <option key={view.viewSeq} value={view.viewSeq}>
                  {view.viewName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Smoking Option</label>
            <select
              value={
                bookingRoom.roomSmokingYn === undefined
                  ? ""
                  : bookingRoom.roomSmokingYn
                  ? "yes"
                  : "no"
              }
              onChange={(e) => {
                const val = e.target.value;
                setBookingRoom((prev) => ({
                  ...prev,
                  roomSmokingYn:
                    val === "yes" ? true : val === "no" ? false : undefined,
                }));
              }}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">Select</option>
              {room.smokingAvailable && <option value="yes">Smoking</option>}
              {room.nonsmokingAvailable && (
                <option value="no">Non-smoking</option>
              )}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-gold text-black font-medium hover:bg-black hover:text-gold transition rounded"
          >
            Confirm
          </button>
        </div>
      </Dialog>
    </>
  );
}
