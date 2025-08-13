import express from "express";
import cors from "cors";
import testDbRouter from "./routes/testDb";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/test_db", testDbRouter);

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
