import express from "express";
import { handleTranscribeRequest,fetchVideoTranscription } from "../controllers/trnascribeController.js";
import bodyParser from "body-parser";
const router = express.Router();

router.post("/transcribe",bodyParser.json({ limit: "10mb" }), handleTranscribeRequest);
router.get("/getTranscript/:sourceId", fetchVideoTranscription);

export default router;
