import { RoomResultDTO } from "../domain/dto/RoomResultDTO";
import { RoomSearchDTO } from "../domain/dto/RoomSearchDTO";

export interface IRoomRepository {
  searchRooms(search: RoomSearchDTO): Promise<RoomResultDTO[]>
}
