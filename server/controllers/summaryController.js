import {
  generateSummary,
  parseSRT,
  getTextWithinInterval,
  generateSummaryInSeries,
} from "../services/summaryServices.js";
import Summary from '../models/summaryModel.js'
import { checkUserCredit, deductCredits } from "../utils/creditUtils.js";

export const handleSummaryRequest = async (req, res) => {
  try {
    const { option, video, userId } = req.body
    const { creditAmount } = option
    const { sourceTitle, sourceType, sourceId } = video

    await checkUserCredit(userId, creditAmount)

    const summary = await generateSummary(req, res);

    const newSummary = new Summary({
      userId,
      sourceType,
      sourceTitle,
      sourceId,
      summary
    });

    await newSummary.save();

    // Deduct credits after the summary task
    const remainingCredits = await deductCredits(userId, creditAmount);

    // Send the remaining credits as a separate SSE event
    // res.write(`event: credits\n`);
    // res.write(`data: ${remainingCredits}\n\n`);

    res.status(200).end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to generate summary", error: error.message });
  }
};

export const handleMeetingSummary = async (req, res) => {
  const { option, transcript, interval, userId } = req.body;
  const { creditAmount } = option
  const parsedSRT = parseSRT(transcript);

  const textByInterval = getTextWithinInterval(parsedSRT, interval);

  try {
    await checkUserCredit(userId, creditAmount)
    generateSummaryInSeries(textByInterval, req, res);
    const remainingCredits = await deductCredits(userId, creditAmount);

    // Send the remaining credits as a separate SSE event
    // res.write(`event: credits\n`);
    // res.write(`data: ${remainingCredits}\n\n`);

    res.status(200).end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to generate summary", error: error.message });
  }
};

export const getAllSummariesForUser = async (req, res) => {
  try {

    const { userId } = req.params;

    const summaries = await Summary.find({ userId: userId });

    res.status(200).json({ success: true, data: summaries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
