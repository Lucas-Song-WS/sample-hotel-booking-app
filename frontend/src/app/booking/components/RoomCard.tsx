"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!bookingRoom.roomViewSeq && room.views.length > 0) {
      setBookingRoom((prev) => ({
        ...prev,
        roomViewSeq: room.views[0].viewSeq,
      }));
    }
  }, [room.views, bookingRoom.roomViewSeq]);

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
        className="border p-4 shadow hover:shadow-md cursor-pointer transition w-full grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] gap-6"
      >
        <div className="flex items-center">
          <Image
            src={`${room.roomTypeImageUrl}?w=320&h=320&fit=crop`}
            alt={`${room.roomTypeName} image`}
            width={160}
            height={160}
            className="object-cover w-40 h-40"
          />
        </div>

        <div className="flex flex-col justify-start">
          <h2 className="text-lg font-semibold">{room.roomTypeName}</h2>
          <p className="text-sm text-gray-600">{room.roomTypeDesc}</p>

          <div className="mt-2 text-sm space-y-1">
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
              <span className="font-medium">Views:</span>{" "}
              {room.views.map((v) => v.viewName).join(", ")}
            </p>
            <p>
              <span className="font-medium">Amenities:</span>{" "}
              {room.amenities.map((a) => a.amenityName).join(", ")}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-end col-span-full md:col-auto">
          <div>
            <div className="font-bold">Total Price:</div>
            <div className="bg-gray-200 px-4 py-2 w-full flex items-center justify-center">
              <p className="text-lg font-bold text-gray-800">
                RM{room.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
          <div className="p-4 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6">
            <div className="flex items-start">
              <Image
                src={`${room.roomTypeImageUrl}?w=480&h=480&fit=crop`}
                alt={`${room.roomTypeName} image`}
                width={240}
                height={240}
                className="object-cover w-60 h-60"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                {room.roomTypeName}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{room.roomTypeDesc}</p>

              <div className="grid gap-2 text-sm">
                <p>
                  <span className="font-medium">Max Occupancy:</span>{" "}
                  {room.roomTypeMaxOccupancy}
                </p>
                <p>
                  <span className="font-medium">Beds:</span>{" "}
                  {room.beds.map((b) => `${b.bedQty}× ${b.bedName}`).join(", ")}
                </p>
                <p>
                  <span className="font-medium">Amenities:</span>{" "}
                  {room.amenities.map((a) => a.amenityName).join(", ")}
                </p>
                <p>
                  <span className="font-medium">Smoking:</span>{" "}
                  {room.smokingAvailable ? "Yes" : "No"} |{" "}
                  <span className="font-medium">Non-Smoking:</span>{" "}
                  {room.nonsmokingAvailable ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div className="grid gap-4 text-sm">
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
                    className="w-full border border-gold/50 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold transition"
                  />
                </div>
                <div>
                  <label className="block font-medium">
                    Number of Children
                  </label>
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
                    className="w-full border border-gold/50 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold transition"
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
                    className="w-full border border-gold/50 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gold transition"
                  >
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
                  className="px-4 py-2 bg-gold text-black font-medium hover:bg-black hover:text-gold transition"
                >
                  Add to Booking
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
