import { Router } from "express";
import {
  getAllParticipants,
  getParticipantById,
  createParticipant,
  updateParticipant,
  deleteParticipant
} from "../controllers/participantsController.js";

const router = Router();

router.get("/", getAllParticipants);
router.get("/:id", getParticipantById);
router.post("/", createParticipant);
router.put("/:id", updateParticipant);
router.delete("/:id", deleteParticipant);

export default router;
