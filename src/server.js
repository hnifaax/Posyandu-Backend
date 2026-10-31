import dotenv from "dotenv";
import app from "./app.js";
import pool from "./config/db.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("Berhasil terhubung ke PostgreSQL.");
    app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
  } catch (error) {
    console.error("Gagal terhubung ke PostgreSQL:", error.message);
    process.exit(1);
  }
}

startServer();
