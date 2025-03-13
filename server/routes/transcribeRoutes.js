import express from "express";
import { handleTranscribeRequest,fetchVideoTranscription,  handleYoutubeTranscribeRequestBeta, processVideoBeta, updateTranscriptSpeakers } from "../controllers/trnascribeController.js";
import bodyParser from "body-parser";
const router = express.Router();

router.post("/transcribe",bodyParser.json({ limit: "10mb" }), handleTranscribeRequest);
router.get("/getTranscript/:sourceId", fetchVideoTranscription);

//beta routes
router.post("/beta/transcribeYoutubeVideo",bodyParser.json({ limit: "10mb" }), handleYoutubeTranscribeRequestBeta);
router.post("/beta/processVideo",bodyParser.json({ limit: "10mb" }), processVideoBeta);


// update
router.post("/updateTranscriptSpeakers",bodyParser.json({ limit: "10mb" }), updateTranscriptSpeakers);

export default router;
