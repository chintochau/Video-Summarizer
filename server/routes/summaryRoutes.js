import express from "express";
import {
  handleSummaryRequest,
  handleMeetingSummary,
  getAllVideosForUser,
  getAllSummariesForVideo,
} from "../controllers/summaryController.js";
const router = express.Router();
import bodyParser from "body-parser";

router.post("/get-summary",bodyParser.json({ limit: "10mb" }), handleSummaryRequest);
router.post("/get-summary-meetings",bodyParser.json({ limit: "10mb" }), handleMeetingSummary);
router.get("/user/:userId/videos",bodyParser.json({ limit: "10mb" }), getAllVideosForUser);
router.get("/summaries/:userId/:sourceId",bodyParser.json({ limit: "10mb" }), getAllSummariesForVideo);

export default router;
