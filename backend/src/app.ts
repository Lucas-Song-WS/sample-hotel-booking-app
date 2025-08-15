import express, { Application, Request, Response } from "express";
import cors from "cors";
import commonRouter from "./modules/common/controller/router";
import bookingRouter from "./modules/booking/controller/router";
import roomRouter from "./modules/room/controller/router";

export const createApp = (): Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.use("/api/common", commonRouter);
  app.use("/api/rooms", roomRouter);
  app.use("/api/booking", bookingRouter);

  return app;
};
