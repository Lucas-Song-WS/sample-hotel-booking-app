import { Request, Response } from "express";
import { RoomService } from "../service/RoomService";
import { RoomSearchDTO } from "../domain/dto/RoomSearchDTO";
import { RoomResultDTO } from "../domain/dto/RoomResultDTO";
import { PagesDTO, PaginationDTO } from "../../common/domain/dto/CommonDTO";

type ErrorResponse = { error: string };

export class RoomController {
  constructor(private service: RoomService) {}

  searchRooms = async (
    req: Request,
    res: Response<RoomResultDTO[] | ErrorResponse>
  ) => {
    try {
      const {
        start,
        end,
        roomTypeSeq,
        roomBedSeqList,
        tagSeq,
        pageNumber,
        pageSize,
        sortField,
        sortDirection,
      } = req.query as unknown as Record<string, string>;

      const searchParams: RoomSearchDTO = {
        start: new Date(start),
        end: new Date(end),
        roomTypeSeq: roomTypeSeq ? Number(roomTypeSeq) : undefined,
        roomBedSeqList: roomBedSeqList
          ? roomBedSeqList.split(",").map(Number)
          : undefined,
        tagSeq: tagSeq ? Number(tagSeq) : undefined,
      };

      type ExternalSortField = "roomTypeName" | "roomTypeMaxOccupancy";
      const sortFieldMap: Record<ExternalSortField, string> = {
        roomTypeName: "rt.room_type_name",
        roomTypeMaxOccupancy: "rt.room_type_max_occupancy",
      };
      const tableSortField =
        sortFieldMap[sortField as ExternalSortField] ?? "rt.room_type_seq";

      const pagination: PaginationDTO = {
        pageNumber: pageNumber ? Number(pageNumber) : 1,
        pageSize: pageSize ? Number(pageSize) : 10,
        sortField: tableSortField,
        sortDirection: (sortDirection as "asc" | "desc") ?? "asc",
      };

      const searchResults = await this.service.searchRooms(
        searchParams,
        pagination
      );

      res.json(searchResults);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: (err as Error).message });
    }
  };

  searchRoomsPages = async (
    req: Request,
    res: Response<PagesDTO | ErrorResponse>
  ) => {
    try {
      const {
        start,
        end,
        roomTypeSeq,
        roomBedSeqList,
        tagSeq,
        pageNumber,
        pageSize,
        sortField,
        sortDirection,
      } = req.query as unknown as Record<string, string>;

      const searchParams: RoomSearchDTO = {
        start: new Date(start),
        end: new Date(end),
        roomTypeSeq: roomTypeSeq ? Number(roomTypeSeq) : undefined,
        roomBedSeqList: roomBedSeqList
          ? roomBedSeqList.split(",").map(Number)
          : undefined,
        tagSeq: tagSeq ? Number(tagSeq) : undefined,
      };

      const pagination: PaginationDTO = {
        pageNumber: pageNumber ? Number(pageNumber) : 1,
        pageSize: pageSize ? Number(pageSize) : 10,
        sortField,
        sortDirection: sortDirection as "asc" | "desc",
      };

      const searchResults = await this.service.searchRoomsPages(
        searchParams,
        pagination
      );

      res.json(searchResults);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: (err as Error).message });
    }
  };
}
