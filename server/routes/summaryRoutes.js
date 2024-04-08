import express from "express";
import {
  handleSummaryRequest,
  handleMeetingSummary,
  getAllVideosForUser,
  getTranscriptAndSummariesForVideo,
} from "../controllers/summaryController.js";
const router = express.Router();
import bodyParser from "body-parser";

router.post("/get-summary",bodyParser.json({ limit: "10mb" }), handleSummaryRequest);
router.post("/get-summary-meetings",bodyParser.json({ limit: "10mb" }), handleMeetingSummary);
router.get("/summaries/:userId/:sourceId",bodyParser.json({ limit: "10mb" }), getTranscriptAndSummariesForVideo);

router.get("/user/:userId/videos",bodyParser.json({ limit: "10mb" }), getAllVideosForUser);

export default router;
