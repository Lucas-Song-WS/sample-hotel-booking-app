import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 4000,
    environment: process.env.NODE_ENV || "development",
  },
  db: {
    pool: new Pool({ connectionString: process.env.DATABASE_URL }),
  },
};

export default config;
