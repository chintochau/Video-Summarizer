import {
  generateSummary,
  covertSRTtoStringFormat,
  parseSRT,
  getTextWithinInterval,
  generateSummaryInSeries,
} from "../services/summaryServices.js";

export const handleSummaryRequest = async (req, res) => {
  console.log(req.body);
  try {
    const summary = await generateSummary(req.body, res);
    res.status(200).end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to generate summary", error: error.message });
  }
};

export const handleMeetingSummary = async (req, res) => {
  const { transcript, interval } = req.body;

  const parsedSRT = parseSRT(transcript);

  const textByInterval = getTextWithinInterval(parsedSRT, interval);

  try {
    generateSummaryInSeries(textByInterval,req,res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to generate summary", error: error.message });
  }
};
