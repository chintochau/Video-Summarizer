import YoutubeTranscriptService from "../services/youtubeTranscriptServer.js";
import { YoutubeTranscript } from "youtube-transcript";
import { YTconvertToSrt } from "../services/youtubeServices.js";
import ytdl from "ytdl-core";

export const getYoutubeTranscript = async (req, res) => {
  const { youtubeId } = req.params;
  try {
    const transcript =
      await YoutubeTranscriptService.YoutubeTranscript.fetchTranscript(
        youtubeId
      );
    res.json(YTconvertToSrt(transcript));
  } catch (error) {
    // 将错误消息发送回客户端
    console.error(error);
    res.status(500).json("Transcript is disabled on this video");
  }
};

export const getYoutubeAudio = async (req, res) => {
  const { youtubeLink } = req.body;
  try {
    const videoInfo = await ytdl.getInfo(youtubeLink);
    // 檢查視頻是否有可用的音頻流
    const audioFormats = ytdl.filterFormats(videoInfo.formats, "audioonly");
    if (audioFormats.length === 0) {
      return res.status(400).send("無法獲取視頻的音頻");
    }
    // 設置響應標頭，指定檔案名稱並將音頻發送給客戶端
    res.set(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(
        videoInfo.videoDetails.title
      ).replace(/%20/g, " ")}.mp3"`
    );
    ytdl(youtubeLink, { filter: "audioonly" }).pipe(res);
  } catch (error) {
    console.error(error.message);
  }
};
