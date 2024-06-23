import express from "express";
import {
  handleSummaryRequest,
  getAllVideosForUser,
  getTranscriptAndSummariesForVideo,
  handleSummaryRequestWithQuota,
  deleteSummary,
  deleteVideoAndSummaries,
  handleLongSummaryRequest,
  getSummaryById,
  deleteSummaries,
  getAllSummaries
} from "../controllers/summaryController.js";
const router = express.Router();
import bodyParser from "body-parser";

// generate summary
router.post("/get-summary",bodyParser.json({ limit: "10mb" }), handleSummaryRequest);
router.post("/get-long-summary",bodyParser.json({ limit: "10mb" }), handleLongSummaryRequest);

router.post("/summarize-with-quota",bodyParser.json({ limit: "10mb" }), handleSummaryRequestWithQuota);

// get summary
router.get("/summaries/:userId/:sourceId",bodyParser.json({ limit: "10mb" }), getTranscriptAndSummariesForVideo);
router.get("/summary/:summaryId",bodyParser.json({ limit: "10mb" }), getSummaryById);
router.get("/user/:userId/videos",bodyParser.json({ limit: "10mb" }), getAllVideosForUser);

// delete summary
router.post("/delete-summary",bodyParser.json({ limit: "10mb" }), deleteSummary);
router.post("/delete-video",bodyParser.json({ limit: "10mb" }), deleteVideoAndSummaries);

// batch delete
router.post("/delete-summaries",bodyParser.json({ limit: "10mb" }), deleteSummaries);
router.get("/get-summaries",bodyParser.json({ limit: "10mb" }), getAllSummaries);

export default router;
