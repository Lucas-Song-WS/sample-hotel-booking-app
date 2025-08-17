import { Booking } from "../domain/entities/Booking";
import { BookingResultDTO } from "../domain/dto/BookingResultDTO";
import { BookingRoom } from "../domain/entities/BookingRoom";
import { RoomCharge } from "../domain/value-objects/RoomCharge";
import { RoomInfo } from "../domain/value-objects/RoomInfo";

export interface IBookingRepository {
  findAvailableRoom(bookingRoom: BookingRoom): Promise<RoomInfo>;
  calculateRoomCharge(bookingRoom: BookingRoom): Promise<number>;
  getChildDiscount(numChildren: number): Promise<RoomCharge | null>;
  getAdditionalCharges(chargeSeqList: number[]): Promise<RoomCharge[]>;
  save(booking: Booking): Promise<number>;
  
  findByGuest(guestSeq: number): Promise<BookingResultDTO[]>;
}
