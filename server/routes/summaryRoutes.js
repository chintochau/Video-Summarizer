import express from "express";
import { handleSummaryRequest, handleMeetingSummary,getAllSummariesForUser } from "../controllers/summaryController.js";
const router = express.Router();

router.post("/get-summary", handleSummaryRequest);
router.post("/get-summary-meetings", handleMeetingSummary);
router.get('/user/:userId/summaries', getAllSummariesForUser);

export default router;
