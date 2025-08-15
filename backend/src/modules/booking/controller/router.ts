import { Router } from "express";
import { BookingService } from "../service/BookingService";
import { BookingRepository } from "../repository/BookingRepository";
import { BookingController } from "./BookingController";

const bookingRepository = new BookingRepository();
const bookingService = new BookingService(bookingRepository);
const bookingController = new BookingController(bookingService);

const router = Router();
router.post("/create", (req, res) => bookingController.createBooking(req, res));
router.post("/preview", (req, res) =>
  bookingController.previewBooking(req, res)
);
router.get("/my-bookings/:guestSeq", (req, res) =>
  bookingController.getBookings(req, res)
);

export default router;
