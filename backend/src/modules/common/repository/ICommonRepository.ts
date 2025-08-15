import { CommonRoomTypeDTO } from "../domain/dto/CommonRoomTypeDTO";

export interface ICommonRepository {
  getRoomTypes(): Promise<CommonRoomTypeDTO[]>;
}
