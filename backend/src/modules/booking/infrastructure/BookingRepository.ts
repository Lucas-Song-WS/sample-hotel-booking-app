import { IBookingRepository } from "../repository/IBookingRepository";
import { Booking } from "../domain/entities/Booking";
import { config } from "../../../config";
import { BookingResultDTO } from "../domain/dto/BookingResultDTO";
import { BookingRoom } from "../domain/entities/BookingRoom";
import { RoomCharge } from "../domain/value-objects/RoomCharge";

const { pool } = config.db;

export class BookingRepository implements IBookingRepository {
  async save(booking: Booking): Promise<number> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const bookingResult = await pool.query(
        `INSERT INTO t_booking (booking_id, guest_seq, booking_period_start, booking_period_end, booking_status, created_by, updated_by)
         VALUES ($1, $2, $3, $4, 'CONFIRMED', 1, 1)
         RETURNING booking_seq`,
        [
          booking.bookingId,
          booking.guestSeq,
          booking.bookingPeriod.start,
          booking.bookingPeriod.end,
        ]
      );

      const bookingSeq = bookingResult.rows[0].booking_seq;
      await Promise.all(
        booking.bookingRooms.map(async (bookingRoom) => {
          const bookingRoomResult = await client.query(
            `INSERT INTO t_booking_room_map
             (booking_seq, room_seq, room_type_seq, num_guests_adults, num_guests_children, room_view_seq, room_smoking_yn, room_booking_period_start, room_booking_period_end, created_by, updated_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1, 1)
             RETURNING booking_room_map_seq`,
            [
              bookingSeq,
              bookingRoom.roomSeq,
              bookingRoom.roomTypeSeq,
              bookingRoom.numAdults,
              bookingRoom.numChildren,
              bookingRoom.roomViewSeq,
              bookingRoom.roomSmokingYn,
              bookingRoom.bookingPeriod.start,
              bookingRoom.bookingPeriod.end,
            ]
          );

          const bookingRoomMapSeq =
            bookingRoomResult.rows[0].booking_room_map_seq;
          await Promise.all(
            bookingRoom.roomCharges.map((charge) =>
              client.query(
                `INSERT INTO t_booking_room_charge_map
                 (booking_room_map_seq, charge_desc, charge_amount, created_by, updated_by)
                 VALUES ($1, $2, $3, 1, 1)`,
                [bookingRoomMapSeq, charge.chargeDesc, charge.chargeAmount]
              )
            )
          );
        })
      );

      await client.query("COMMIT");
      return bookingResult.rows[0].booking_seq;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async findAvailableRoom(bookingRoom: BookingRoom): Promise<number> {
    const roomResult = await pool.query(
      `SELECT room_seq
       FROM t_room WHERE active_flag = True 
          AND room_type_seq = $1 
          AND room_view_seq = $2 
          AND ($3::BOOLEAN IS NULL OR room_smoking_yn = $3::BOOLEAN)
          AND NOT EXISTS (
              SELECT 1
              FROM Get_Occupied_Rooms($4, $5) occ
              WHERE occ.room_seq = t_room.room_seq)
       ORDER BY room_seq ASC
       LIMIT 1`,
      [
        bookingRoom.roomTypeSeq,
        bookingRoom.roomViewSeq,
        bookingRoom.roomSmokingYn,
        bookingRoom.bookingPeriod.start,
        bookingRoom.bookingPeriod.end,
      ]
    );

    if (!roomResult.rows[0]) {
      throw new Error("No available room found");
    }
    return roomResult.rows[0].room_seq;
  }

  async calculateRoomCharge(bookingRoom: BookingRoom): Promise<number> {
    const { rows } = await pool.query(
      `SELECT Calc_Room_Total_Charge($1, $2, $3, $4, $5) AS charge_amount`,
      [
        bookingRoom.roomTypeSeq,
        bookingRoom.roomViewSeq,
        bookingRoom.roomSeq,
        bookingRoom.bookingPeriod.start,
        bookingRoom.bookingPeriod.end,
      ]
    );
    return Number(rows[0].charge_amount);
  }

  async getChildDiscount(numChildren: number): Promise<RoomCharge | null> {
    const baseChildDiscount = await pool.query(
      `SELECT charge_desc, charge_amount
       FROM t_charge 
       WHERE active_flag = TRUE AND charge_seq = 9`
    );

    if (baseChildDiscount.rows.length === 0) return null;
    return {
      chargeDesc: baseChildDiscount.rows[0].charge_desc,
      chargeAmount:
        numChildren * Number(baseChildDiscount.rows[0].charge_amount),
    };
  }

  async getAdditionalCharges(chargeSeqList: number[]): Promise<RoomCharge[]> {
    const { rows } = await pool.query(
      `SELECT charge_desc, charge_amount
       FROM t_charge 
       WHERE active_flag = TRUE AND charge_seq = ANY($1)`,
      [chargeSeqList]
    );

    return rows.map((row) => ({
      chargeDesc: row.charge_desc,
      chargeAmount: Number(row.charge_amount),
    }));
  }

  async findByGuest(guestSeq: number): Promise<BookingResultDTO[]> {
    const bookingsResult = await pool.query(
      `SELECT booking_seq, booking_id, booking_period_start, booking_period_end, booking_remarks, booking_status
       FROM t_booking
       WHERE active_flag = TRUE AND guest_seq = $1
       ORDER BY booking_period_start ASC`,
      [guestSeq]
    );

    const bookings: BookingResultDTO[] = [];

    for (const row of bookingsResult.rows) {
      const roomsResult = await pool.query(
        `SELECT booking_room_map_seq, room_type_seq, num_guests_adults, num_guests_children,
              room_view_seq, room_smoking_yn
         FROM t_booking_room_map
         WHERE active_flag = TRUE AND booking_seq = $1
         ORDER BY booking_room_map_seq ASC`,
        [row.booking_seq]
      );

      const rooms = await Promise.all(
        roomsResult.rows.map(async (r) => {
          const chargesResult = await pool.query(
            `SELECT charge_desc, charge_amount
             FROM t_booking_room_charge_map
             WHERE active_flag = TRUE AND booking_room_map_seq = $1
             ORDER BY booking_room_charge_map_seq ASC`,
            [r.booking_room_map_seq]
          );

          return {
            roomTypeSeq: r.room_type_seq,
            numAdults: r.num_guests_adults,
            numChildren: r.num_guests_children ?? 0,
            roomViewSeq: r.room_view_seq ?? null,
            roomSmokingYn: r.room_smoking_yn ?? false,
            charges: chargesResult.rows.map((c) => ({
              chargeDesc: c.charge_desc,
              chargeAmount: Number(c.charge_amount),
            })),
          };
        })
      );

      bookings.push({
        bookingSeq: row.booking_seq,
        bookingId: row.booking_id,
        start: row.booking_period_start.toISOString(),
        end: row.booking_period_end.toISOString(),
        remarks: row.remarks,
        status: row.booking_status,
        rooms,
      });
    }

    return bookings;
  }
}
