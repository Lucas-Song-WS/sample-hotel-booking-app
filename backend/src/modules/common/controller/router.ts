import { Router } from "express";
import { CommonRepository } from "../repository/CommonRepository";
import { CommonService } from "../service/CommonService";
import { CommonController } from "./CommonController";

const repo = new CommonRepository();
const service = new CommonService(repo);
const controller = new CommonController(service);

const router = Router();
router.get("/room-types", (req, res) => controller.getRoomTypes(req, res));

export default router;