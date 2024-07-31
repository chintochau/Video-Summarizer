import Video from "../models/videoModel.js";
import {
  checkGPUSlots,
  checkTranscriptionProgress,
  stopIdleInstances,
  transcribeFile,
  transcribeLink,
  transcribeQueue,
} from "../services/transcribeServices.js";
import {
  getOrCreateVideoAndUpdateTranscript,
  getOrCreateVideoBySourceId,
} from "../services/videoServices.js";
import { v4 as uuidv4 } from "uuid";
import ytdl from "@distube/ytdl-core";
import tmp, { file } from "tmp";
import util from "util";
import { pipeline } from "stream";
import fs from "fs";
import {
  checkTranscriptionStatusWithRunPod,
  transcribeLinkWithRunPod,
} from "../services/runpodService.js";
import { uploadAudioToS3 } from "../services/amazonService.js";
import { transcribeWithAssemblyAI } from "../services/assemblyAiService.js";
import { checkUserCredit, deductCredits } from "../utils/creditUtils.js";

export const handleTranscribeRequest = async (req, res) => {
  const { userId } = req.body;
  const video = JSON.parse(req.body.video);
  const transcribeOption = JSON.parse(req.body.transcribeOption);
  try {
    const uploadedFile = req.file;
    const transcriptionResult = await transcribeFile({ file: uploadedFile });
    await getOrCreateVideoBySourceId({
      video,
      userId,
      originalTranscript: transcriptionResult,
    });
    res.json(transcriptionResult);
  } catch (error) {
    console.error("Error occurred during transcription:", error);
    res.status(500).send("Error occurred during transcription");
  }
};

export const fetchVideoTranscription = async (req, res) => {
  const { sourceId } = req.params;
  try {
    const video = await Video.findOne(
      { sourceId: sourceId },
      { originalTranscript: 1 }
    );
    if (!video) {
      throw new Error("Video not found");
    }
    res.json(video.originalTranscript);
  } catch (error) {
    console.error("fetch error", error);
    res.status(500).send("Error occurred during transcription");
  }
};


const pipelineAsync = util.promisify(pipeline);

// processYoutubeVideo function using S3 and runpod
export const handleYoutubeTranscribeRequestBeta = async (req, res) => {
  const { youtubeId, userId, video, transcribeOption, language, videoCredits } = req.body;
  const { sourceTitle } = video;
  let tempFilePath;
  try {
    await checkUserCredit(userId, videoCredits); 
    const videoInfo = await ytdl.getInfo(youtubeId);
    // Check if the video has available audio streams
    const audioFormats = ytdl.filterFormats(videoInfo.formats, "audioonly");
    if (audioFormats.length === 0) {
      return res.status(400).send("Unable to obtain video audio.");
    }
    // upload the audio to S3
    tempFilePath = tmp.tmpNameSync({ postfix: ".mp3" });
    const audioStream = ytdl(youtubeId, { filter: "audioonly" });
    const fileStream = fs.createWriteStream(tempFilePath);
    await pipelineAsync(audioStream, fileStream);

    const filePublicUrl = await uploadAudioToS3(tempFilePath, videoInfo);

    let result;
    let outputVideo;
    switch (transcribeOption.value) {
      case "assembly":
        result = await transcribeWithAssemblyAI({
          filePath: tempFilePath,
          language: language === "auto" ? "en_us" : language
        }
        );
        console.log(result);
        outputVideo = await getOrCreateVideoAndUpdateTranscript({
          video,
          userId,
          originalTranscript: result.srt,
          utterances: result.utterances,
          speakers: result.speakers,
        });
        console.log(outputVideo);
        break

      default:
        const id = await transcribeLinkWithRunPod(filePublicUrl, transcribeOption.value || "base",language === "auto" ? null : language);
        // const id = "a671ac14-4c07-4c09-a5c6-113c75b72b43-u1"
        // add id to array, and check status every 10 seconds
        let currentStatus = "IN_PROGRESS";
        let data
        while (currentStatus !== "COMPLETED") {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          data = await checkTranscriptionStatusWithRunPod(id);
          if (data.status === "FAILED") {
            throw new Error("Transcription failed");
          } else if (data.status === "COMPLETED") {
            currentStatus = "COMPLETED";
          }
        }

        result = data.output.transcription;
        outputVideo = await getOrCreateVideoAndUpdateTranscript({
          video,
          userId,
          originalTranscript: result,
        });
        break
    }

    await deductCredits(userId, videoCredits);
    res.json(outputVideo);

  } catch (error) {
    // 将错误消息发送回客户端
    console.error(error);
    res
      .status(500)
      .send("Error processing video audio. GPU server may be busy.");
  }

  // Clean up: Delete the temporary file if no longer needed
  // fs.unlink(tempFilePath, (err) => {
  //   if (err) throw err;
  // });
};


export const processVideoBeta = async (req, res) => {
  const { userId, link, publicId, resourceType, language,videoCredits } = req.body;
  const video = JSON.parse(req.body.video);
  const transcribeOption = JSON.parse(req.body.transcribeOption);
  const { sourceTitle } = video;
  const writeData = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  try {
    await checkUserCredit(userId, videoCredits);
    let result;
    let outputVideo;
    let progress = 0
    switch (transcribeOption.value) {
      case "assembly":
        result = await transcribeWithAssemblyAI({
          fileLink: link,
          language: language === "auto" ? "en_us" : language,
        });

        outputVideo = await getOrCreateVideoAndUpdateTranscript({
          video,
          userId,
          originalTranscript: result.srt,
          utterances: result.utterances,
          speakers: result.speakers,
        });

        break
      default:
        const id = await transcribeLinkWithRunPod(link, transcribeOption.value || "base", language === "auto" ? null : language);
        let currentStatus = "IN_PROGRESS";
        let data
        while (currentStatus !== "COMPLETED") {
          await new Promise((resolve) => setTimeout(resolve, 10000));

          data = await checkTranscriptionStatusWithRunPod(id);

          if (data.status === "FAILED") {
            throw new Error("Transcription failed");
          } else if (data.status === "COMPLETED") {
            currentStatus = "COMPLETED";
          }
        }
        result = data.output.transcription;
        outputVideo = await getOrCreateVideoAndUpdateTranscript({
          video,
          userId,
          originalTranscript: result,
        });
        break
    }
    await deductCredits(userId, videoCredits);
    res.json(outputVideo);

  } catch {
    res.status(500).send("Error occurred during transcription");
  }

}

// update transcript speakers
export const updateTranscriptSpeakers = async (req, res) => {
  const {transcriptId, speakers} = req.body;
  try {
    const speakersData = JSON.parse(speakers);
    const video = await Video.findOneAndUpdate(
      { _id: transcriptId },
      { speakers: speakersData },
      { new: true }
    );
    res.json(video);
  } catch (error) {
    console.error("fetch error", error);
    res.status(500).send("Error occurred during transcription");
  }
}