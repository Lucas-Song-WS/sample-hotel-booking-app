import { Request, Response } from "express";
import { BookingService } from "../application/BookingService";
import { BookingSaveDTO } from "../domain/dto/BookingSaveDTO";
import { BookingResultDTO } from "../domain/dto/BookingResultDTO";

type ErrorResponse = { error: string };

export class BookingController {
  constructor(private bookingService: BookingService) {}

  async create(req: Request<{}, {}, BookingSaveDTO>, res: Response<BookingResultDTO | ErrorResponse>) {
    try {
      const { guestSeq, start, end, rooms, remarks } = req.body;

      const booking = await this.bookingService.createBooking(
        guestSeq,
        new Date(start),
        new Date(end),
        rooms,
        remarks
      );

      res.json(booking);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getBookings(req: Request, res: Response<BookingResultDTO[] | ErrorResponse>) {
    const guestSeq = Number(req.params.guestSeq);
    if (isNaN(guestSeq))
      return res.status(400).json({ error: "Invalid guestSeq" });

    try {
      const bookings = await this.bookingService.getBookingsForGuest(guestSeq);
      res.json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  }
}
