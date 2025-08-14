export class BookingId {
  constructor(public readonly value: string) {
    if (!/^\d{12}$/.test(value)) {  // YYMMDDHHMISS
      throw new Error("Invalid bookingId format");
    }
  }
}