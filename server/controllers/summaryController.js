import {
  generateSummary,
  parseSRT,
  getTextWithinInterval,
  generateSummaryInSeries,
} from "../services/summaryServices.js";
import Summary from '../models/summaryModel.js'
import Video from "../models/videoModel.js";
import { checkUserCredit, deductCredits } from "../utils/creditUtils.js";


export const handleSummaryRequest = async (req, res) => {
  try {
    const { option, video, userId, language } = req.body;
    const { creditAmount } = option;
    const { sourceId, sourceTitle, sourceType, author, videoDuration } = video;
    let videoThumbnail
    
    await checkUserCredit(userId, creditAmount);

    let existingVideo = await Video.findOne({ sourceId });

    if (!existingVideo) {

      if (sourceType === "youtube") {
        videoThumbnail = `https://img.youtube.com/vi/${sourceId}/0.jpg`
      }

      const newVideo = new Video({
        userId,
        sourceId,
        sourceTitle,
        sourceType,
        author,
        videoThumbnail,
        videoDuration,
      });
      existingVideo = await newVideo.save();
    }

    const summary = await generateSummary(req, res);

    const newSummary = new Summary({
      userId,
      sourceType,
      sourceTitle,
      language,
      videoId: existingVideo._id, // missing now
      summaryType: "Detail", // Example summary type
      summary,
    });

    await newSummary.save();

    // Update the lastUpdated field of the corresponding video
    await Video.findOneAndUpdate(
      { sourceId },
      { lastUpdated: new Date() },
      { new: true }
    );

    // Deduct credits after the summary task
    const remainingCredits = await deductCredits(userId, creditAmount);

    res.status(200).end();
  } catch (error) {
    res.status(500).json({ message: "Failed to generate summary", error: error.message });
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
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;

    // Count total number of videos for the specified userId
    const totalVideos = await Video.countDocuments({ userId: userId });

    // Find videos for the specified userId and sort them in descending order by the creation date
    const videos = await Video.find({ userId: userId })
                               .sort({ lastUpdated: -1 })
                               .skip(startIndex)
                               .limit(limit);

    const totalPages = Math.ceil(totalVideos / limit);

    res.status(200).json({ 
      success: true, 
      data: videos, 
      total: totalVideos,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
