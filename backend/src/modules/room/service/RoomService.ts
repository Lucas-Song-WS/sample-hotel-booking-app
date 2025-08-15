import { RoomSearchDTO } from "../domain/dto/RoomSearchDTO";
import { RoomResultDTO } from "../domain/dto/RoomResultDTO";
import { IRoomRepository } from "../repository/IRoomRepository";

export class RoomService {
  constructor(private roomRepo: IRoomRepository) {}

  async searchRooms(search: RoomSearchDTO): Promise<RoomResultDTO[]> {
    if (new Date(search.start) > new Date(search.end)) {
      throw new Error("Start date must be before end date");
    }
    return this.roomRepo.searchRooms(search);
  }
}
