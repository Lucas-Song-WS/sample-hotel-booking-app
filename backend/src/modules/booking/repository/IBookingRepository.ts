import { Booking } from "../domain/entities/Booking";
import { BookingResultDTO } from "../domain/dto/BookingResultDTO";
import { BookingRoom } from "../domain/entities/BookingRoom";
import { RoomCharge } from "../domain/value-objects/RoomCharge";

export interface IBookingRepository {
  findAvailableRoom(bookingRoom: BookingRoom): Promise<number>;
  calculateRoomCharge(bookingRoom: BookingRoom): Promise<number>;
  getChildDiscount(numChildren: number): Promise<RoomCharge | null>;
  getAdditionalCharges(chargeSeqList: number[]): Promise<RoomCharge[]>;
  save(booking: Booking): Promise<number>;
  
  findByGuest(guestSeq: number): Promise<BookingResultDTO[]>;
}
