import { RoomResultDTO } from "@/domain/dto/RoomResultDTO";
import { RoomSearchDTO } from "@/domain/dto/RoomSearchDTO";
import { BookingRoomDTO } from "./domain/dto/BookingRoom";
import { BookingResultDTO } from "@/domain/dto/BookingResultDTO";
import qs from "qs";
import { PagesDTO, PaginationDTO } from "@/domain/dto/CommonDTO";
import { fetchJson } from "@/lib/api";

export const fetchRooms = (dto: RoomSearchDTO, pgDto: PaginationDTO) => {
  const params = qs.stringify(
    { ...dto, ...pgDto },
    { skipNulls: true, arrayFormat: "comma" }
  );
  return fetchJson<RoomResultDTO[]>(`/rooms/search?${params}`);
};

export const fetchRoomsPages = (dto: RoomSearchDTO, pgDto: PaginationDTO) => {
  const params = qs.stringify(
    { ...dto, ...pgDto },
    { skipNulls: true, arrayFormat: "comma" }
  );
  return fetchJson<PagesDTO>(`/rooms/search/pages?${params}`);
};

const prepareBookingBody = (r: BookingRoomDTO) => ({
  roomTypeSeq: r.roomTypeSeq,
  numAdults: r.numAdults,
  numChildren: r.numChildren,
  roomViewSeq: r.roomViewSeq,
  roomSmokingYn: r.roomSmokingYn,
  additionalCharges: r.additionalCharges?.map((c) => ({
    chargeSeq: c.chargeSeq,
  })),
});

export const fetchBookingPreview = (
  rooms: BookingRoomDTO[],
  start: string,
  end: string
) => {
  const body = {
    guestSeq: 1,
    start,
    end,
    rooms: rooms.map(prepareBookingBody),
  };

  return fetchJson<BookingResultDTO>(
    `/booking/preview`,
    "Booking preview failed",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
};

export const createBooking = (
  selectedRooms: BookingRoomDTO[],
  start: string,
  end: string,
  remarks?: string
) => {
  const body = {
    guestSeq: 1,
    start,
    end,
    remarks,
    rooms: selectedRooms.map(prepareBookingBody),
  };

  return fetchJson<BookingResultDTO>(
    `/booking/create`,
    "Booking creation failed",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
};
