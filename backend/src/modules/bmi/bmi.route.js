import express from "express";
import * as controller from "./bmi.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", controller.getWeightHeightController);
router.post("/", controller.createWeightHeightController);
router.get("/BMI-Score", controller.getBMIController);

export default router;
