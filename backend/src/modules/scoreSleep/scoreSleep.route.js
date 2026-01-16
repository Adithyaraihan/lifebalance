import express from "express";
import * as controller from "./scoreSleep.controller.js";
import { authMiddleware } from "../..//middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", controller.getDataSleepController);
router.post("/", controller.createDataSleepController);
router.get("/score/", controller.getScoreSleepController);

export default router;
