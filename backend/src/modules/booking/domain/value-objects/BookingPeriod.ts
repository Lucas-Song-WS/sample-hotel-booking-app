export class BookingPeriod {
  constructor(public readonly start: Date, public readonly end: Date) {
    if (start > end) throw new Error("End date cannot be before start date");
  }
}
