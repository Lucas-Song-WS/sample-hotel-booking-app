import { config } from "../../../config";
import { CommonRoomTypeDTO } from "../domain/dto/CommonRoomTypeDTO";
import { ICommonRepository } from "./ICommonRepository";

const { pool } = config.db;

export class CommonRepository implements ICommonRepository {
  async getRoomTypes(): Promise<CommonRoomTypeDTO[]> {
    const { rows } = await pool.query(
      `SELECT room_type_seq, room_type_name
       FROM t_room_type
       WHERE active_flag = TRUE
       ORDER BY room_type_seq;`
    );

    return rows.map(row => ({
      roomTypeSeq: row.room_type_seq,
      roomTypeName: row.room_type_name,
    }));
  }
}
