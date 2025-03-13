import express from "express";
import llmController from "../modules/shared/controllers/llmController.js";
const router = express.Router();

router.post("/chat",express.json({ limit: "10mb" }), llmController.getChatCompletion);


export default router;

