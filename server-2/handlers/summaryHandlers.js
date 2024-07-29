import Video from "../models/videoModel.js";
import Summary from "../models/summaryModel.js";
import {
  generateSummary,
  generateSummaryInJson,
  generateSummaryInSeries,
  generateSummarySocket,
} from "../services/summaryServices.js";
import { checkUserCredit, deductCredits } from "../utils/creditUtils.js";
import { getOrCreateVideoBySourceId } from "../services/videoServices.js";

const summaryHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected for summary");

    socket.on("summaryRequest", async (data) => {
      try {
        const { option, video, userId, language } = data;
        const { creditAmount, title, summaryFormat, type } = option;
        const { sourceId, sourceTitle, sourceType, author, videoDuration } =
          video;

        await checkUserCredit(userId, creditAmount);

        let existingVideo = await getOrCreateVideoBySourceId({ video, userId });

        let summary;

        
        summary = await generateSummarySocket(data, socket);

        const newSummary = new Summary({
          userId,
          sourceType,
          sourceTitle,
          language,
          videoId: existingVideo._id,
          summaryType: title,
          summary,
          sourceId,
          summaryFormat: summaryFormat || "markdown",
        });

        await newSummary.save();

        await Video.findOneAndUpdate(
          { sourceId },
          { lastUpdated: new Date() },
          { new: true }
        );

        await deductCredits(userId, creditAmount);

        socket.emit("summaryResponse", { success: true, summary: newSummary });
      } catch (error) {
        socket.emit("summaryResponse", {
          success: false,
          message: "Failed to generate summary",
          error: error.message,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected from summary");
    });
  });
};

export default summaryHandlers;
