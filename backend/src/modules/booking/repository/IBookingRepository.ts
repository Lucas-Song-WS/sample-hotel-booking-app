import { Booking } from "../domain/entities/Booking";
import { BookingResultDTO } from "../domain/dto/BookingResultDTO";
import { BookingRoom } from "../domain/entities/BookingRoom";
import { RoomCharge } from "../domain/value-objects/RoomCharge";

export interface IBookingRepository {
  getChildDiscount(numChildren: number): Promise<RoomCharge | null>;
  calculateRoomCharge(bookingRoom: BookingRoom): Promise<number>;
  getAdditionalCharges(chargeSeqList: number[]): Promise<RoomCharge[]>;
  save(booking: Booking): Promise<void>;
  findAvailableRoom(bookingRoom: BookingRoom): Promise<number>;
  findByGuest(guestSeq: number): Promise<BookingResultDTO[]>;
}
