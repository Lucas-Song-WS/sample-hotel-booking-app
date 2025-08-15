import { IBookingRepository } from "./IBookingRepository";
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
        `INSERT INTO t_booking (booking_id, guest_seq, booking_period_start, booking_period_end, booking_remarks, booking_status, created_by, updated_by)
         VALUES ($1, $2, $3, $4, $5, 'CONFIRMED', 1, 1)
         RETURNING booking_seq`,
        [
          booking.bookingId,
          booking.guestSeq,
          booking.bookingPeriod.start,
          booking.bookingPeriod.end,
          booking.remarks,
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
    const result = await pool.query(
      `SELECT b.booking_seq, b.booking_id, b.booking_period_start, b.booking_period_end, b.booking_remarks, b.booking_status,
         brm.booking_room_map_seq, brm.room_type_seq, brm.num_guests_adults, brm.num_guests_children, brm.room_view_seq, brm.room_smoking_yn,
         brc.charge_desc, brc.charge_amount
       FROM t_booking b
       INNER JOIN t_booking_room_map brm ON brm.booking_seq = b.booking_seq
       INNER JOIN t_booking_room_charge_map brc ON brc.booking_room_map_seq = brm.booking_room_map_seq 
       WHERE b.active_flag = TRUE AND brm.active_flag = TRUE AND brc.active_flag = TRUE AND b.guest_seq = $1
       ORDER BY b.booking_period_start DESC, brm.booking_room_map_seq ASC, brc.booking_room_charge_map_seq ASC`,
      [guestSeq]
    );

    const bookingsMap = new Map<number, BookingResultDTO>();
    const roomsMap = new Map<
      number,
      Map<number, BookingResultDTO["rooms"][number]>
    >();

    for (const row of result.rows) {
      if (!bookingsMap.has(row.booking_seq)) {
        bookingsMap.set(row.booking_seq, {
          bookingSeq: row.booking_seq,
          bookingId: row.booking_id,
          start: row.booking_period_start.toISOString(),
          end: row.booking_period_end.toISOString(),
          remarks: row.booking_remarks,
          status: row.booking_status,
          rooms: [],
        });
        roomsMap.set(row.booking_seq, new Map());
      }

      const bookingRooms = roomsMap.get(row.booking_seq)!;

      if (
        row.booking_room_map_seq != null &&
        !bookingRooms.has(row.booking_room_map_seq)
      ) {
        bookingRooms.set(row.booking_room_map_seq, {
          roomTypeSeq: row.room_type_seq,
          numAdults: row.num_guests_adults,
          numChildren: row.num_guests_children ?? 0,
          roomViewSeq: row.room_view_seq ?? null,
          roomSmokingYn: row.room_smoking_yn ?? false,
          charges: [],
        });
      }

      if (row.booking_room_map_seq != null && row.charge_desc != null) {
        bookingRooms.get(row.booking_room_map_seq)!.charges.push({
          chargeDesc: row.charge_desc,
          chargeAmount: Number(row.charge_amount),
        });
      }
    }

    const bookings: BookingResultDTO[] = Array.from(bookingsMap.values()).map(
      (b) => {
        const bookingRooms = roomsMap.get(b.bookingSeq)!;
        return {
          ...b,
          rooms: Array.from(bookingRooms.values()),
        };
      }
    );

    return bookings;
  }
}
