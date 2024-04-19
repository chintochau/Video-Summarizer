import express from "express";
import { handleTranscribeRequest,fetchVideoTranscription, processVideo,handleYoutubeTranscribeRequest } from "../controllers/trnascribeController.js";
import bodyParser from "body-parser";
const router = express.Router();

router.post("/transcribe",bodyParser.json({ limit: "10mb" }), handleTranscribeRequest);
router.get("/getTranscript/:sourceId", fetchVideoTranscription);
router.post("/processVideo",bodyParser.json({ limit: "10mb" }), processVideo);
router.post("/transcribeYoutubeVideo",bodyParser.json({ limit: "10mb" }), handleYoutubeTranscribeRequest);

export default router;
