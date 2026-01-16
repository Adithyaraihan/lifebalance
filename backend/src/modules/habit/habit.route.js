import express from "express";
import {
  getHabitsController,
  createHabitController,
  updateHabitController,
  deleteHabitController,
  updateHabitStatusController,
} from "./habit.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getHabitsController);
router.post("/", createHabitController);
router.patch("/:id", updateHabitController);
router.delete("/:id", deleteHabitController);
router.patch("/:id/status", updateHabitStatusController);

export default router;
