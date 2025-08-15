"use client";

import { RoomResultDTO } from "@/domain/dto/RoomResultDTO";

interface RoomCardProps {
  room: RoomResultDTO;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
      <h2 className="text-lg font-semibold">{room.roomTypeName}</h2>
      <p className="text-sm text-gray-600">{room.roomTypeDesc}</p>
      <p className="mt-2 text-sm">
        <strong>Max Occupancy:</strong> {room.roomTypeMaxOccupancy}
      </p>

      <div className="mt-2">
        <strong>Beds:</strong>
        <ul className="list-disc list-inside">
          {room.beds.map((bed, idx) => (
            <li key={idx}>
              {bed.bedName} × {bed.bedQty}
            </li>
          ))}
        </ul>
      </div>

      {room.amenities.length > 0 && (
        <div className="mt-2">
          <strong>Amenities:</strong> {room.amenities.map((a) => a.amenityName).join(", ")}
        </div>
      )}

      <div className="mt-2 text-sm">
        <strong>Smoking:</strong> {room.smokingAvailable ? "Yes" : "No"},{" "}
        <strong>Non-smoking:</strong> {room.nonsmokingAvailable ? "Yes" : "No"}
      </div>

      {room.views.length > 0 && (
        <div className="mt-2 text-sm">
          <strong>Views:</strong> {room.views.join(", ")}
        </div>
      )}

      <div className="mt-2 font-semibold text-black">
        Total Price: RM{room.totalPrice.toFixed(2)}
      </div>
    </div>
  );
}
