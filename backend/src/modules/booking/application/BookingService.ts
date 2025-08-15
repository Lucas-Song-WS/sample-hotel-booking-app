import { IBookingRepository } from "../repository/IBookingRepository";
import { Booking } from "../domain/entities/Booking";
import { BookingResultDTO } from "../domain/dto/BookingResultDTO";
import { BookingRoom } from "../domain/entities/BookingRoom";
import { RoomCharge } from "../domain/value-objects/RoomCharge";

export class BookingService {
  constructor(private bookingRepo: IBookingRepository) {}

  async createBooking(
    guestSeq: number,
    start: Date,
    end: Date,
    rooms: {
      roomTypeSeq: number;
      numAdults: number;
      numChildren?: number;
      roomViewSeq?: number;
      roomSmokingYn?: boolean;
      additionalCharges?: {
        chargeSeq: number;
      }[];
    }[],
    remarks?: string
  ): Promise<BookingResultDTO> {
    const booking = Booking.create(guestSeq, start, end, remarks);

    await Promise.all(
      rooms.map(async (r) => {
        const bookingRoom = booking.addBookingRoom(
          r.roomTypeSeq,
          r.numAdults,
          r.numChildren,
          r.roomViewSeq,
          r.roomSmokingYn
        );

        const [roomSeq, roomCharge, childDiscount, additionalCharges] =
          await Promise.all([
            this.findAvailableRoom(bookingRoom),
            this.calculateRoomCharge(bookingRoom),
            r.numChildren
              ? this.getChildDiscount(r.numChildren)
              : Promise.resolve(null),
            r.additionalCharges
              ? this.getAdditionalCharges(
                  r.additionalCharges.map((c) => c.chargeSeq)
                )
              : Promise.resolve([]),
          ]);

        bookingRoom.assignRoom(roomSeq);
        bookingRoom.addCharge("Room", roomCharge);

        if (childDiscount) {
          bookingRoom.addRoomCharge(childDiscount);
        }

        bookingRoom.addChargeSet(additionalCharges);
      })
    );

    booking.validate();
    const bookingSeq = await this.bookingRepo.save(booking);
    booking.receiveBookingConfirmation(bookingSeq);

    return booking.toDTO();
  }

  async findAvailableRoom(bookingRoom: BookingRoom): Promise<number> {
    return this.bookingRepo.findAvailableRoom(bookingRoom);
  }

  async calculateRoomCharge(bookingRoom: BookingRoom): Promise<number> {
    return this.bookingRepo.calculateRoomCharge(bookingRoom);
  }

  async getChildDiscount(numChildren: number): Promise<RoomCharge | null> {
    return this.bookingRepo.getChildDiscount(numChildren);
  }

  async getAdditionalCharges(chargeSeqList: number[]): Promise<RoomCharge[]> {
    return this.bookingRepo.getAdditionalCharges(chargeSeqList);
  }

  async getBookingsForGuest(guestSeq: number): Promise<BookingResultDTO[]> {
    return this.bookingRepo.findByGuest(guestSeq);
  }
}
