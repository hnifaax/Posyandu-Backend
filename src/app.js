import express from "express";
import cors from "cors";
import participantsRoutes from "./routes/participantsRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Sistem Informasi Posyandu aktif.",
    endpoints: {
      participants: "/api/participants",
      health: "/health"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server berjalan." });
});

app.use("/api/participants", participantsRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
