"use client";

import { atom } from "jotai";
import { RoomSearchDTO } from "@/domain/dto/RoomSearchDTO";

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