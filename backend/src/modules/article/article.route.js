import express from "express";
import * as controller from "./article.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", controller.getArticleController);

export default router;
