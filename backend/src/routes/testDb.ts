import { Router } from "express";
import { config } from "../config";

const { pool } = config.db;

const router = Router();

router.get("/", async (_req, res) => {
  const result = await pool.query("SELECT seq, val FROM test");
  res.json(result.rows);
});

router.get("/:seq", async (req, res) => {
  const seqValue = parseInt(req.params.seq, 10);
  const result = await pool.query("SELECT val FROM test WHERE seq = $1", [
    seqValue,
  ]);
  res.json(result.rows);
});

export default router;
