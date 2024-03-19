import express from "express";
import { handleSummaryRequest, handleMeetingSummary } from "../controllers/summaryController.js";
const router = express.Router();

router.post("/get-summary", handleSummaryRequest);
router.post("/get-summary-meetings", handleMeetingSummary);

export default router;
