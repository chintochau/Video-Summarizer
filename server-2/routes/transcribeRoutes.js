import express from "express";
import { handleTranscribeRequest,fetchVideoTranscription, processVideo,handleYoutubeTranscribeRequest, handleYoutubeTranscribeRequestBeta, processVideoBeta, updateTranscriptSpeakers } from "../controllers/trnascribeController.js";
import bodyParser from "body-parser";
const router = express.Router();

router.post("/transcribe",bodyParser.json({ limit: "10mb" }), handleTranscribeRequest);
router.get("/getTranscript/:sourceId", fetchVideoTranscription);
router.post("/processVideo",bodyParser.json({ limit: "10mb" }), processVideo); // old route
router.post("/transcribeYoutubeVideo",bodyParser.json({ limit: "10mb" }), handleYoutubeTranscribeRequest); // old route

//beta routes
router.post("/beta/transcribeYoutubeVideo",bodyParser.json({ limit: "10mb" }), handleYoutubeTranscribeRequestBeta);
router.post("/beta/processVideo",bodyParser.json({ limit: "10mb" }), processVideoBeta);


// update
router.post("/updateTranscriptSpeakers",bodyParser.json({ limit: "10mb" }), updateTranscriptSpeakers);

export default router;
