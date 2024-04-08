import express from "express";
import { handleTranscribeRequest,fetchVideoTranscription, processVideo } from "../controllers/trnascribeController.js";
import bodyParser from "body-parser";
const router = express.Router();

router.post("/transcribe",bodyParser.json({ limit: "10mb" }), processVideo);
router.get("/getTranscript/:sourceId", fetchVideoTranscription);
router.post("/processVideo",bodyParser.json({ limit: "10mb" }), processVideo);

export default router;
