import { ICommonRepository } from "../repository/ICommonRepository";
import { SelectionDTO } from "../domain/dto/CommonDTO";

export class CommonService {
  constructor(private repo: ICommonRepository) {}

  async getRoomTypes(): Promise<SelectionDTO[]> {
    return this.repo.getRoomTypes();
  }

  async getRoomBeds(): Promise<SelectionDTO[]> {
    return this.repo.getRoomBeds();
  }

  async getTags(): Promise<SelectionDTO[]> {
    return this.repo.getTags();
  }
}
