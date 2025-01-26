import express from "express";
import bodyParser from "body-parser";
import { showAiSimsStatus } from "../ai-sims-controller/aiSimsController.js";

const router = express.Router();
router.get("/get-sims-status",bodyParser.json({ limit: "10mb" }),showAiSimsStatus);

export default router;