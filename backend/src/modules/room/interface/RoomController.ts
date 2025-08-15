import { Request, Response } from "express";
import { RoomService } from "../application/RoomService";
import { RoomSearchDTO } from "../domain/dto/RoomSearchDTO";
import { RoomResultDTO } from "../domain/dto/RoomResultDTO";

type ErrorResponse = { error: string };

export class RoomController {
  constructor(private service: RoomService) {}

  searchRooms = async (
    req: Request,
    res: Response<RoomResultDTO[] | ErrorResponse>
  ) => {
    try {
      const { start, end, roomTypeSeq, roomBedSeqList, limit, offset, tagSeq } =
        req.query as unknown as Record<string, string>;

      const searchParams: RoomSearchDTO = {
        start: new Date(start),
        end: new Date(end),
        roomTypeSeq: roomTypeSeq ? Number(roomTypeSeq) : undefined,
        roomBedSeqList: roomBedSeqList
          ? roomBedSeqList.split(",").map(Number)
          : undefined,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        tagSeq: tagSeq ? Number(tagSeq) : undefined,
      };

      const searchResults = await this.service.searchRooms(searchParams);

      res.json(searchResults);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: (err as Error).message });
    }
  };
}
