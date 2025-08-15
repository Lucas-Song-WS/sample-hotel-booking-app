import { Request, Response } from "express";
import { CommonService } from "../service/CommonService";
import { SelectionDTO } from "../domain/dto/CommonDTO";

type ErrorResponse = { error: string };

export class CommonController {
  constructor(private service: CommonService) {}

  getRoomTypes = async (
    req: Request,
    res: Response<SelectionDTO[] | ErrorResponse>
  ) => {
    try {
      const roomTypes = await this.service.getRoomTypes();
      res.json(roomTypes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: (err as Error).message });
    }
  };

  getRoomBeds = async (
    req: Request,
    res: Response<SelectionDTO[] | ErrorResponse>
  ) => {
    try {
      const roomBeds = await this.service.getRoomBeds();
      res.json(roomBeds);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: (err as Error).message });
    }
  };

  getTags = async (req: Request, res: Response<SelectionDTO[] | ErrorResponse>) => {
    try {
      const tags = await this.service.getTags();
      res.json(tags);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: (err as Error).message });
    }
  };
}
