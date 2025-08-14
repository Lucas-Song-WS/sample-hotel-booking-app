export class BookingPeriod {
  constructor(public readonly start: Date, public readonly end: Date) {
    if (start >= end) throw new Error("Start date must be before end date");
  }
}