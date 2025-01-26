import express from "express";
import { initializeSimsWorld, showAiSimsStatus } from "../ai-sims-controller/aiSimsController.js";

const router = express.Router();
router.get("/data",express.json({ limit: "10mb" }),showAiSimsStatus);
router.post("/init",express.json({ limit: "10mb" }),initializeSimsWorld);

export default router;