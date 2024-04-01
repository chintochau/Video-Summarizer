import express from "express";
import { handleTranscribeRequest } from "../controllers/trnascribeController.js";
import bodyParser from "body-parser";
const router = express.Router();

router.post("/transcribe",bodyParser.json({ limit: "10mb" }), handleTranscribeRequest);

export default router;
