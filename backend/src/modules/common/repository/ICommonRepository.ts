import { SelectionDTO } from "../domain/dto/CommonDTO";

export interface ICommonRepository {
  getRoomTypes(): Promise<SelectionDTO[]>;
  getRoomBeds(): Promise<SelectionDTO[]>;
  getTags(): Promise<SelectionDTO[]>
}
