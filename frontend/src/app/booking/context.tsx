"use client";

import { atom } from "jotai";
import { RoomSearchDTO } from "@/domain/dto/RoomSearchDTO";
import { BookingRoomDTO } from "./domain/dto/BookingRoom";
import { BookingResultDTO } from "@/domain/dto/BookingResultDTO";

export const initialRoomSearch: RoomSearchDTO = {
  start: new Date().toISOString().substring(0, 10),
  end: new Date().toISOString().substring(0, 10),
  roomTypeSeq: undefined,
  roomBedSeqList: [],
  tagSeq: undefined,
};

export const initialBookingRoom: BookingRoomDTO = {
  roomTypeSeq: 0,
  numAdults: 0,
  numChildren: 0,
  roomViewSeq: 0,
  roomSmokingYn: false,
};

export const selectedRoomsAtom = atom<BookingRoomDTO[]>([]);
export const bookingPreviewAtom = atom<BookingResultDTO | null>(null);
