import express, { Application, Request, Response } from "express";
import cors from "cors";
import testDbRouter from "./routes/testDb";
import bookingRouter from "./modules/booking/interface/router";
import roomRouter from "./modules/room/interface/router";

export const createApp = (): Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.use("/api/test_db", testDbRouter);

  app.use("/api/rooms", roomRouter);
  app.use("/api/booking", bookingRouter);

  return app;
};
