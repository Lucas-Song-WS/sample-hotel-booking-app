import { Request, Response } from "express";
import { CommonService } from "../service/CommonService";
import { CommonRoomTypeDTO } from "../domain/dto/CommonRoomTypeDTO";

type ErrorResponse = { error: string };

export class CommonController {
  constructor(private service: CommonService) {}

  getRoomTypes = async (req: Request, res: Response<CommonRoomTypeDTO[] | ErrorResponse>) => {
    try {
      const roomTypes = await this.service.getRoomTypes();
      res.json(roomTypes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: (err as Error).message });
    }
  };
}
