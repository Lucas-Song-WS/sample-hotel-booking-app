import { PagesDTO, PaginationDTO } from "../../common/domain/dto/CommonDTO";
import { RoomResultDTO } from "../domain/dto/RoomResultDTO";
import { RoomSearchDTO } from "../domain/dto/RoomSearchDTO";

export interface IRoomRepository {
  searchRooms(search: RoomSearchDTO, pagination: PaginationDTO): Promise<RoomResultDTO[]>
  searchRoomsPages(search: RoomSearchDTO, pagination: PaginationDTO): Promise<PagesDTO>
}
