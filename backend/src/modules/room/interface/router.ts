import { Router } from "express";
import { RoomRepository } from "../infrastructure/RoomRepository";
import { RoomService } from "../application/RoomService";
import { RoomController } from "./RoomController";

const roomRepository = new RoomRepository();
const roomService = new RoomService(roomRepository);
const roomController = new RoomController(roomService);

const router = Router();
router.get("/search", (req, res) => roomController.searchRooms(req, res));

export default router;
