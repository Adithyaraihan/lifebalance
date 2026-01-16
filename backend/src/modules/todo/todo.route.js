import express from "express";
import * as controller from "./todo.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", controller.getTodosController);
router.post("/", controller.createTodoController);
router.put("/:id", controller.toggleTodoController);
router.delete("/:id/", controller.deleteTodoController);

export default router;
