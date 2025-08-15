import { config } from "../../../config";
import { SelectionDTO } from "../domain/dto/CommonDTO";
import { ICommonRepository } from "./ICommonRepository";

const { pool } = config.db;

export class CommonRepository implements ICommonRepository {
  async getRoomTypes(): Promise<SelectionDTO[]> {
    const { rows } = await pool.query(
      `SELECT room_type_seq, room_type_name
       FROM t_room_type
       WHERE active_flag = TRUE
       ORDER BY room_type_seq;`
    );

    return rows.map((row) => ({
      seq: row.room_type_seq,
      name: row.room_type_name,
    }));
  }

  async getRoomBeds(): Promise<SelectionDTO[]> {
    const { rows } = await pool.query(
      `SELECT room_bed_seq, room_bed_name
       FROM t_room_bed
       WHERE active_flag = TRUE
       ORDER BY room_bed_seq;`
    );

    return rows.map((row) => ({
      seq: row.room_bed_seq,
      name: row.room_bed_name,
    }));
  }

  async getTags(): Promise<SelectionDTO[]> {
    const { rows } = await pool.query(
      `SELECT tag_seq, tag_name
       FROM t_tag
       WHERE active_flag = TRUE
       ORDER BY tag_seq;`
    );

    return rows.map((row) => ({
      seq: row.tag_seq,
      name: row.tag_name,
    }));
  }
}
