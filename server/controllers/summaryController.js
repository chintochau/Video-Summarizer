import {
  generateSummary,
  parseSRT,
  getTextWithinInterval,
  generateSummaryInSeries,
  parseSRTAndGroupByInterval,
  generateSummaryInJson,
} from "../services/summaryServices.js";
import Summary from "../models/summaryModel.js";
import Video from "../models/videoModel.js";
import { checkUserCredit, deductCredits } from "../utils/creditUtils.js";
import { getOrCreateVideoBySourceId } from "../services/videoServices.js";
import { getYoutubeChapters } from "../services/youtubeServices.js";
import {secondsToTime} from "../utils/timeUtils.js"

export const handleSummaryRequest = async (req, res) => {
  try {
    const { option, video, userId, language } = req.body;
    const { creditAmount, title, summaryFormat } = option;
    const { sourceId, sourceTitle, sourceType, author, videoDuration } = video;

    await checkUserCredit(userId, creditAmount);

    let existingVideo = await getOrCreateVideoBySourceId({ video, userId });

    let summary;

    console.log("format", summaryFormat);

    if (summaryFormat && summaryFormat === "json") {
      summary = await generateSummaryInJson(req, res);
    } else {
      summary = await generateSummary(req, res);
    }

    const newSummary = new Summary({
      userId,
      sourceType,
      sourceTitle,
      language,
      videoId: existingVideo._id, // missing now
      summaryType: title, // Example summary type
      summary,
      sourceId,
      summaryFormat: summaryFormat || "markdown",
    });

    await newSummary.save();

    // Update the lastUpdated field of the corresponding video
    await Video.findOneAndUpdate(
      { sourceId },
      { lastUpdated: new Date() },
      { new: true }
    );

    // Deduct credits after the summary task
    await deductCredits(userId, creditAmount);

    res.status(200).end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to generate summary", error: error.message });
  }
};

export const handleLongSummaryRequest = async (req, res) => {
  try {
    const { option, transcript, interval, userId, video, language } = req.body;
    const { creditAmount, title } = option;
    const { sourceId, sourceTitle, sourceType, author, videoDuration } = video;
    const textByInterval = parseSRTAndGroupByInterval(transcript, interval);

    let chapters = null;
    if (sourceType === "youtube") {
      const chaptersArray = await getYoutubeChapters(sourceId);
      if (chaptersArray) {
        chapters = "";
        chaptersArray.forEach((chapter, index) => {
          chapters += `Timestamp: ${secondsToTime(chapter.start_time)} : Title:${chapter.title}\n`;
        });
        console.log("chapters", chapters);
      }
    }

    await checkUserCredit(userId, creditAmount);

    let existingVideo = await getOrCreateVideoBySourceId({ video, userId });

    const summary = await generateSummaryInSeries(textByInterval, req, res, chapters);

    const newSummary = new Summary({
      userId,
      sourceType,
      sourceTitle,
      language,
      videoId: existingVideo._id, // missing now
      summaryType: title, // Example summary type
      summary,
      sourceId,
    });

    await newSummary.save();

    // Update the lastUpdated field of the corresponding video
    await Video.findOneAndUpdate(
      { sourceId },
      { lastUpdated: new Date() },
      { new: true }
    );

    // Deduct credits after the summary task

    await deductCredits(userId, creditAmount);
    res.status(200).end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to generate summary", error: error.message });
  }
};


/**
 * Retrieves all videos for a specific user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const getAllVideosForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    let sourceType;

    switch (req.query.sourceType) {
      case "all":
        sourceType = { $exists: true };
        break;
      default:
        sourceType = req.query.sourceType;
        break;
    }

    // Count total number of videos for the specified userId
    const totalVideos = await Video.countDocuments({ userId: userId });

    // Find videos for the specified userId and sort them in descending order by the creation date
    const videos = await Video.find({ userId: userId, sourceType: sourceType })
      .sort({ lastUpdated: -1 })
      .skip(startIndex)
      .limit(limit);

    const totalPages = Math.ceil(totalVideos / limit);

    res.status(200).json({
      success: true,
      data: videos,
      total: totalVideos,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTranscriptAndSummariesForVideo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const sourceId = req.params.sourceId;

    // Find the video based on userId and sourceId
    const video = await Video.findOne({ userId, sourceId });

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    // Find summaries for the video
    const summaries = await Summary.find({ videoId: video._id });

    res.status(200).json({ success: true, data: summaries, video: video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
export const handleSummaryRequestWithQuota = async (req, res) => {
  try {
    const summary = await generateSummary(req, res);
    res.status(200).end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to generate summary", error: error.message });
  }
};
export const deleteSummary = async (req, res) => {
  try {
    const { userId, summaryId } = req.body;
    const summary = await Summary.findOneAndDelete({
      _id: summaryId,
      userId: userId,
    });
    if (!summary) {
      return res
        .status(404)
        .json({ success: false, message: "Summary not found" });
    }
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const deleteVideoAndSummaries = async (req, res) => {
  try {
    const { userId, sourceId } = req.body;
    const video = await Video.findOneAndDelete({ sourceId, userId });
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    const summaries = await Summary.deleteMany({ videoId: video._id });
    res.status(200).json({ success: true, data: { video, summaries } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSummaryById = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.summaryId);
    if (!summary) {
      return res
        .status(404)
        .json({ success: false, message: "Summary not found" });
    }
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


//batch
export const deleteSummaries = async (req, res) => {
  try {
    const date = new Date("2024-05-14T00:00:00.000Z");
    const summaries = await Summary.deleteMany({ createdAt: { $lt: date } });
    const videos = await Video.deleteMany({ lastUpdated: { $lt: date } });
    res.status(200).json({ success: true, data: { summaries, videos } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }

}

export const getAllSummaries = async (req, res) => {
  try {
    // get all summaries objects, only return the _id, exclude all other information, and in a raw text format, separated by line break
    const summaries = await Summary.find({}, { _id: 1 }).lean();
    const summaryIds = summaries.map((summary) => "https://fusionaivideo.io/share/"+summary._id).join("\n");
    res.status(200).send(summaryIds);

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
