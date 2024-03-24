import express from "express";
import {
  handleSummaryRequest,
  handleMeetingSummary,
  getAllVideosForUser,
  getAllSummariesForVideo,
} from "../controllers/summaryController.js";
const router = express.Router();

router.post("/get-summary", handleSummaryRequest);
router.post("/get-summary-meetings", handleMeetingSummary);
router.get("/user/:userId/videos", getAllVideosForUser);
router.get("/summaries/:userId/:sourceId", getAllSummariesForVideo);

export default router;
