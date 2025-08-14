import express, { Application, Request, Response } from "express";
import cors from "cors";
import testDbRouter from "./routes/testDb";
import { BookingController } from "./modules/booking/interface/BookingController";
import { BookingService } from "./modules/booking/application/BookingService";
import { BookingRepository } from "./modules/booking/infrastructure/BookingRepository";
import bookingRouter from "./modules/booking/interface/router";

export const createApp = (): Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.use("/api/test_db", testDbRouter);

  app.use("/api/booking", bookingRouter);

  return app;
};
