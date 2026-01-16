import express from "express";
import {
  getChatsController,
  askAIController,
  deleteChatsController,
} from "./aiChat.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);
router.get("/", getChatsController);
router.post("/ask", askAIController);
router.delete("/", deleteChatsController);

export default router;
