import { ICommonRepository } from "../repository/ICommonRepository";
import { CommonRoomTypeDTO } from "../domain/dto/CommonRoomTypeDTO";

export class CommonService {
  constructor(private repo: ICommonRepository) {}

  async getRoomTypes(): Promise<CommonRoomTypeDTO[]> {
    return this.repo.getRoomTypes();
  }
}
