"use client";

import { BookingResultDTO } from "@/domain/dto/BookingResultDTO";
import { useQuery } from "@tanstack/react-query";

async function fetchMyBookings(): Promise<BookingResultDTO[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/booking/my-bookings/1`
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Failed to fetch bookings: ${res.status} ${res.statusText} - ${text}`
    );
  }
  return res.json();
}

export default function MyBookingsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: fetchMyBookings,
  });

  if (isLoading) return <p>Loading bookings...</p>;
  if (isError)
    return (
      <p className="text-red-500">
        Error loading bookings:
        {error instanceof Error ? error.message : String(error)}
      </p>
    );

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>

      {data && data.length === 0 && <p>No bookings found.</p>}

      <div className="grid gap-4">
        {data?.map((booking) => (
          <div
            key={booking.bookingSeq}
            className="border p-4 shadow"
          >
            <h3 className="font-semibold text-lg mb-1">
              Booking ID: {booking.bookingId} ({booking.status})
            </h3>
            <p>
              {booking.start} - {booking.end}
            </p>
            <p className="italic">{booking.remarks}</p>

            <div className="mt-2 space-y-2">
              {booking.rooms.map((room, idx) => (
                <div key={idx} className="p-2 border">
                  <p>Room Type: {room.roomTypeName}</p>
                  <p>
                    Adults: {room.numAdults}, Children: {room.numChildren}
                  </p>
                  {room.roomViewSeq && <p>View: {room.roomViewName}</p>}
                  {room.roomSmokingYn !== undefined && (
                    <p>Smoking: {room.roomSmokingYn ? "Yes" : "No"}</p>
                  )}
                  <div className="mt-1">
                    <strong>Charges:</strong>
                    <ul className="list-disc ml-5">
                      {room.charges.map((c, i) => (
                        <li key={i}>
                          {c.chargeDesc}: RM{c.chargeAmount.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
