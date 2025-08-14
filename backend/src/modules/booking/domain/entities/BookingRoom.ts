import { BookingPeriod } from "../value-objects/BookingPeriod";
import { RoomCharge } from "../value-objects/RoomCharge";

export class BookingRoom {
  private _roomSeq: number = 0;
  private _roomCharges: RoomCharge[] = [];

  private constructor(
    private _roomTypeSeq: number,
    private _bookingPeriod: BookingPeriod,
    private _numAdults: number,
    private _numChildren?: number,
    private _roomViewSeq?: number,
    private _roomSmokingYn?: boolean,
    private _remarks?: string
  ) {}

  static create(
    roomTypeSeq: number,
    bookingPeriod: BookingPeriod,
    numAdults: number,
    numChildren?: number,
    roomViewSeq?: number,
    roomSmokingYn?: boolean,
    remarks?: string
  ) {
    return new BookingRoom(
      roomTypeSeq,
      bookingPeriod,
      numAdults,
      numChildren,
      roomViewSeq,
      roomSmokingYn,
      remarks
    );
  }

  assignRoom(roomSeq: number) {
    if (!roomSeq) throw new Error("Must assign a room");
    this._roomSeq = roomSeq;
  }

  addCharge(chargeDesc: string, chargeAmount: number) {
    if (!chargeDesc) throw new Error("Must have a charge description");
    this._roomCharges.push({ chargeDesc, chargeAmount });
  }

  addRoomCharge(roomCharge: RoomCharge) {
    this.addCharge(roomCharge.chargeDesc, roomCharge.chargeAmount);
  }

  addChargeSet(roomCharges: RoomCharge[]) {
    for (const roomCharge of roomCharges)
      this.addCharge(roomCharge.chargeDesc, roomCharge.chargeAmount);
  }

  toDTO() {
    return {
      roomTypeSeq: this.roomTypeSeq,
      numAdults: this.numAdults,
      numChildren: this.numChildren ?? 0,
      roomViewSeq: this.roomViewSeq,
      roomSmokingYn: this.roomSmokingYn,
      charges: this.roomCharges.map((c) => ({
        chargeDesc: c.chargeDesc,
        chargeAmount: c.chargeAmount,
      })),
    };
  }

  get roomTypeSeq() {
    return this._roomTypeSeq;
  }
  get numAdults() {
    return this._numAdults;
  }
  get numChildren() {
    return this._numChildren;
  }
  get roomViewSeq() {
    return this._roomViewSeq;
  }
  get bookingPeriod() {
    return this._bookingPeriod;
  }
  get roomSmokingYn() {
    return this._roomSmokingYn;
  }
  get remarks() {
    return this._remarks;
  }
  get roomSeq() {
    return this._roomSeq;
  }
  get roomCharges() {
    return this._roomCharges;
  }
}
