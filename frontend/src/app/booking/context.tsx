"use client";

import { atom } from "jotai";
import { RoomSearchDTO } from "@/domain/dto/RoomSearchDTO";
import { BookingRoomDTO } from "./domain/dto/BookingRoom";
import { BookingResultDTO } from "@/domain/dto/BookingResultDTO";

export const initialRoomSearch: RoomSearchDTO = {
  start: new Date(),
  end: new Date(),
  roomTypeSeq: undefined,
  roomBedSeqList: [],
  tagSeq: undefined,
  limit: 10,
  offset: 0,
};
export type RoomSearchAtomType = typeof initialRoomSearch;
export const roomSearchAtom = atom<RoomSearchAtomType>(initialRoomSearch);

export const initialBookingRoom: BookingRoomDTO = {
  roomTypeSeq: 0,
  numAdults: 0,
  numChildren: 0,
  roomViewSeq: 0,
  roomSmokingYn: false,
};
export type BookingRoomAtomType = typeof initialBookingRoom;
export const bookingRoomAtom = atom<BookingRoomAtomType>(initialBookingRoom);

export const selectedRoomsAtom = atom<BookingRoomDTO[]>([]);

export const bookingPreviewAtom = atom<BookingResultDTO | null>(null);
