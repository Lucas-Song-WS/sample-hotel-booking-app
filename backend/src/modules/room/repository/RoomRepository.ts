import { config } from "../../../config";
import { RoomSearchDTO } from "../domain/dto/RoomSearchDTO";
import { RoomResultDTO } from "../domain/dto/RoomResultDTO";
import { IRoomRepository } from "./IRoomRepository";
import { PagesDTO, PaginationDTO } from "../../common/domain/dto/CommonDTO";

const { pool } = config.db;

export class RoomRepository implements IRoomRepository {
  async searchRooms(
    search: RoomSearchDTO,
    pagination: PaginationDTO
  ): Promise<RoomResultDTO[]> {
    const { rows } = await pool.query(
      `SELECT 
         rt.room_type_seq, rt.room_type_name, rt.room_type_desc, rt.room_type_max_occupancy,
         JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('bedName', rb.room_bed_name, 'bedQty', rtbm.room_type_bed_qty)) AS beds,
         JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('amenityName', ra.room_amenity_name)) AS amenities,
         BOOL_OR(r.room_smoking_yn) AS smoking_available, BOOL_OR(NOT r.room_smoking_yn) AS nonsmoking_available,
         JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('viewSeq', rv.room_view_seq, 'viewName', rv.room_view_name)) AS views,
         Calc_Room_Total_Charge(rt.room_type_seq, 0, 0, $1, $2) AS total_price
       FROM t_room r
       INNER JOIN t_room_type rt ON r.room_type_seq = rt.room_type_seq
       INNER JOIN t_room_type_bed_map rtbm ON rtbm.room_type_seq = rt.room_type_seq
       INNER JOIN t_room_bed rb ON rb.room_bed_seq = rtbm.room_bed_seq
       INNER JOIN t_room_view rv ON rv.room_view_seq = r.room_view_seq
       LEFT JOIN t_room_type_amenity_map rtam ON rtam.room_type_seq = rt.room_type_seq
       LEFT JOIN t_room_amenity ra ON ra.room_amenity_seq = rtam.room_amenity_seq
       WHERE r.active_flag = TRUE AND rt.active_flag = TRUE AND rtbm.active_flag = TRUE AND rb.active_flag = TRUE AND rv.active_flag = TRUE
         AND (rtam.room_type_amenity_map_seq IS NULL OR rtam.active_flag = TRUE) AND (ra.room_amenity_seq IS NULL OR ra.active_flag = TRUE)
         AND NOT EXISTS (
           SELECT 1 FROM Get_Occupied_Rooms($1, $2) occ 
           WHERE occ.room_seq = r.room_seq
         )
         AND ($3::int IS NULL OR rt.room_type_seq = $3)
         AND ($4::int[] IS NULL OR rb.room_bed_seq = ANY($4))
       GROUP BY rt.room_type_seq, rt.room_type_name, rt.room_type_desc
       ORDER BY rt.room_type_seq
       LIMIT $5 OFFSET $6;`,
      [
        search.start,
        search.end,
        search.roomTypeSeq,
        search.roomBedSeqList ? search.roomBedSeqList : null,
        pagination.pageSize,
        pagination.pageSize * (pagination.pageNumber - 1),
      ]
    );

    return rows.map((row) => ({
      roomTypeSeq: row.room_type_seq,
      roomTypeName: row.room_type_name,
      roomTypeDesc: row.room_type_desc,
      roomTypeMaxOccupancy: row.room_type_max_occupancy,
      beds: row.beds || [],
      amenities: row.amenities || [],
      smokingAvailable: row.smoking_available,
      nonsmokingAvailable: row.nonsmoking_available,
      views: row.views || [],
      totalPrice: Number(row.total_price),
    }));
  }

  async searchRoomsPages(
    search: RoomSearchDTO,
    pagination: PaginationDTO
  ): Promise<PagesDTO> {
    const { rows } = await pool.query(
      `SELECT COUNT(DISTINCT rt.room_type_seq) AS total_records
       FROM t_room r
       INNER JOIN t_room_type rt ON r.room_type_seq = rt.room_type_seq
       INNER JOIN t_room_type_bed_map rtbm ON rtbm.room_type_seq = rt.room_type_seq
       INNER JOIN t_room_bed rb ON rb.room_bed_seq = rtbm.room_bed_seq
       INNER JOIN t_room_view rv ON rv.room_view_seq = r.room_view_seq
       LEFT JOIN t_room_type_amenity_map rtam ON rtam.room_type_seq = rt.room_type_seq
       LEFT JOIN t_room_amenity ra ON ra.room_amenity_seq = rtam.room_amenity_seq
       WHERE r.active_flag = TRUE AND rt.active_flag = TRUE AND rtbm.active_flag = TRUE AND rb.active_flag = TRUE AND rv.active_flag = TRUE
         AND (rtam.room_type_amenity_map_seq IS NULL OR rtam.active_flag = TRUE) AND (ra.room_amenity_seq IS NULL OR ra.active_flag = TRUE)
         AND NOT EXISTS (
           SELECT 1 FROM Get_Occupied_Rooms($1, $2) occ 
           WHERE occ.room_seq = r.room_seq
         )
         AND ($3::int IS NULL OR rt.room_type_seq = $3)
         AND ($4::int[] IS NULL OR rb.room_bed_seq = ANY($4));`,
      [
        search.start,
        search.end,
        search.roomTypeSeq,
        search.roomBedSeqList ? search.roomBedSeqList : null,
      ]
    );

    return {
      totalRecords: rows[0].total_records,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(rows[0].total_records / pagination.pageSize),
    };
  }
}
