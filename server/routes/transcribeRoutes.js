import express from "express";
import { handleTranscribeRequest,fetchVideoTranscription, processVideo,handleYoutubeTranscribeRequest, handleYoutubeTranscribeRequestBeta } from "../controllers/trnascribeController.js";
import bodyParser from "body-parser";
const router = express.Router();

router.post("/transcribe",bodyParser.json({ limit: "10mb" }), handleTranscribeRequest);
router.get("/getTranscript/:sourceId", fetchVideoTranscription);
router.post("/processVideo",bodyParser.json({ limit: "10mb" }), processVideo);
router.post("/transcribeYoutubeVideo",bodyParser.json({ limit: "10mb" }), handleYoutubeTranscribeRequest);
router.post("/beta/transcribeYoutubeVideo",bodyParser.json({ limit: "10mb" }), handleYoutubeTranscribeRequestBeta);

export default router;
