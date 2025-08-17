"use client";
import { useState } from "react";
import { Dialog } from "@/components/Dialog";
import { RoomResultDTO } from "@/domain/dto/RoomResultDTO";
import { BookingRoomDTO } from "../domain/dto/BookingRoom";
import { initialBookingRoom } from "../context";

interface RoomCardProps {
  room: RoomResultDTO;
  onAddRoom: (bookingRoom: BookingRoomDTO) => Promise<void>;
}

export default function RoomCard({ room, onAddRoom }: RoomCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getInitialBookingRoom = () => ({
    ...initialBookingRoom,
    roomTypeSeq: room.roomTypeSeq,
    numAdults: 1,
  });
  const [bookingRoom, setBookingRoom] = useState(getInitialBookingRoom());

  const handleOpen = () => {
    setBookingRoom(getInitialBookingRoom());
    setIsOpen(true);
  };

  const handleAddRoom = async () => {
    try {
      await onAddRoom(bookingRoom);
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to add room to booking:", err);
    }
  };

  return (
    <>
      <div
        onClick={handleOpen}
        className="border rounded-lg p-4 shadow hover:shadow-md cursor-pointer transition w-full"
      >
        <h2 className="text-lg font-semibold">{room.roomTypeName}</h2>
        <p className="text-sm text-gray-600">{room.roomTypeDesc}</p>

        <div className="mt-2 text-sm">
          <p>
            <span className="font-medium">Max Occupancy:</span>{" "}
            {room.roomTypeMaxOccupancy}
          </p>
          <p>
            <span className="font-medium">Smoking:</span>{" "}
            {room.smokingAvailable ? "Yes" : "No"} |{" "}
            <span className="font-medium">Non-Smoking:</span>{" "}
            {room.nonsmokingAvailable ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-medium">Beds:</span>{" "}
            {room.beds.map((b) => `${b.bedQty}× ${b.bedName}`).join(", ")}
          </p>
          <p>
            <span className="font-medium">Amenities:</span>{" "}
            {room.amenities.map((a) => a.amenityName).join(", ")}
          </p>
          <p className="mt-1 font-semibold">
            Total Price: RM{room.totalPrice.toFixed(2)}
          </p>
        </div>
      </div>

      {isOpen && (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
          <h3 className="text-lg font-semibold mb-2">{room.roomTypeName}</h3>
          <p className="text-sm text-gray-600 mb-4">{room.roomTypeDesc}</p>

          <div className="grid gap-4 mb-4 text-sm">
            <p>
              <span className="font-medium">Max Occupancy:</span>{" "}
              {room.roomTypeMaxOccupancy}
            </p>
            <p>
              <span className="font-medium">Smoking:</span>{" "}
              {room.smokingAvailable ? "Yes" : "No"} |{" "}
              <span className="font-medium">Non-Smoking:</span>{" "}
              {room.nonsmokingAvailable ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-medium">Beds:</span>{" "}
              {room.beds.map((b) => `${b.bedQty}× ${b.bedName}`).join(", ")}
            </p>
            <p>
              <span className="font-medium">Amenities:</span>{" "}
              {room.amenities.map((a) => a.amenityName).join(", ")}
            </p>
          </div>

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
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAddRoom}
              className="px-4 py-2 bg-gold text-black font-medium hover:bg-black hover:text-gold transition rounded"
            >
              Add to Booking
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
