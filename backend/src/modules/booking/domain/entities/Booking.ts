import { BookingResultDTO } from "../dto/BookingResultDTO";
import { BookingId } from "../value-objects/BookingId";
import { BookingPeriod } from "../value-objects/BookingPeriod";
import { BookingRoom } from "./BookingRoom";

export class Booking {
  private _bookingRooms: BookingRoom[] = [];

  private constructor(
    private _bookingSeq: number | null,
    private _bookingId: BookingId,
    private _guestSeq: number,
    private _bookingPeriod: BookingPeriod,
    private _remarks?: string
  ) {}

  static create(guestSeq: number, start: Date, end: Date, remarks?: string) {
    // Generate bookingId: YYMMDDHH24MISS
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const bookingId =
      pad(now.getFullYear() % 100) +
      pad(now.getMonth() + 1) +
      pad(now.getDate()) +
      pad(now.getHours()) +
      pad(now.getMinutes()) +
      pad(now.getSeconds());

    return new Booking(
      null,
      new BookingId(bookingId),
      guestSeq,
      new BookingPeriod(start, end),
      remarks
    );
  }

  addBookingRoom(
    roomTypeSeq: number,
    numAdults: number,
    numChildren?: number,
    roomViewSeq?: number,
    roomSmokingYn?: boolean
  ) {
    const bookingRoom = BookingRoom.create(
      roomTypeSeq,
      this._bookingPeriod,
      numAdults,
      numChildren,
      roomViewSeq,
      roomSmokingYn
    );
    this._bookingRooms.push(bookingRoom);
    return bookingRoom;
  }

  validate(): void {
    if (this._bookingRooms.length === 0) {
      throw new Error("Booking must have at least one room");
    }
  }

  toDTO(): BookingResultDTO {
    return {
      bookingSeq: this.bookingSeq!,
      bookingId: this.bookingId,
      start: this.bookingPeriod.start.toISOString(),
      end: this.bookingPeriod.end.toISOString(),
      remarks: this.remarks ?? "",
      status: "CONFIRMED",
      rooms: this.bookingRooms.map((r) => r.toDTO()),
    };
  }

  get bookingSeq() {
    return this._bookingSeq;
  }
  get guestSeq() {
    return this._guestSeq;
  }
  get bookingId() {
    return this._bookingId.value;
  }
  get bookingPeriod() {
    return this._bookingPeriod;
  }
  get remarks() {
    return this._remarks;
  }
  get bookingRooms() {
    return this._bookingRooms;
  }
}
