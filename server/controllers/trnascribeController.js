import Video from "../models/videoModel.js";
import {
  checkGPUSlots,
  checkTranscriptionProgress,
  transcribeFile,
  transcribeLink,
  transcribeQueue,
} from "../services/transcribeServices.js";
import { getOrCreateVideoAndUpdateTranscript, getOrCreateVideoBySourceId } from "../services/videoServices.js";
import { v4 as uuidv4 } from "uuid";
import ytdl from "ytdl-core";
import tmp from "tmp";
import util from "util";
import { pipeline } from "stream";
import fs from "fs";

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
    console.log("video", video);
    if (!video) {
      throw new Error("Video not found");
    }
    res.json(video.originalTranscript);
  } catch (error) {
    console.error("fetch error", error);
    res.status(500).send("Error occurred during transcription");
  }
};

// processVideo function using queue
export const processVideo = async (req, res) => {
  const { userId, link, publicId, resourceType } = req.body;
  const video = JSON.parse(req.body.video);
  const transcribeOption = JSON.parse(req.body.transcribeOption);
  const { sourceTitle } = video;
  const writeData = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    console.log("Processing video", sourceTitle);
    transcribeQueue.push(async (cb) => {
      // Wait for a GPU slot to become available
      const availableGPU = await checkGPUSlots({ sourceTitle });
      // Set up SSE headers
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      let progress = 0;
      let transcript = "";
      const transcriptionId = uuidv4();
      const interval = setInterval(async () => {
        try {
          progress = await checkTranscriptionProgress(
            transcriptionId,
            availableGPU.full_ip
          );
          // Check the progress of the transcription
          if (progress === 100) {
            clearInterval(interval);
          } else {
            writeData({ progress });
          }
        } catch (error) {
          console.error("Error occurred during transcription:", error);
          writeData({ progress: -100 });
          clearInterval(interval);
        }
      }, 7000);

      // Start the transcription
      console.log("start transcribeLinkg: ", sourceTitle);
      transcript = await transcribeLink({
        link,
        transcriptionId,
        publicId,
        resourceType,
        gpuServerIP: availableGPU.full_ip,
      });
      await getOrCreateVideoBySourceId({
        video,
        userId,
        originalTranscript: transcript,
      });
      writeData({ transcript });

      res.end();
      res.on("close", () => {
        clearInterval(interval);
        res.end();
      });

      res.on("finish", () => {
        clearInterval(interval);
        res.end();
      });

      availableGPU.tasks--;
      cb();
    });
    console.log("Pushed to queue, task:", sourceTitle);
    console.log("Queue length:", transcribeQueue.length);
  } catch (error) {
    console.error("Error occurred during transcription:", error);
    console.log("Error occurred during transcription", video.sourceTitle);
    writeData({ errorMessage: "Error occurred during transcription" });
    res.end(); // Add this line to end the response when an error occurs
  }
};

const pipelineAsync = util.promisify(pipeline);

export const handleYoutubeTranscribeRequest = async (req, res) => {
  const { youtubeId, userId, video } = req.body;
  const {sourceTitle} = video;

  try {
    console.log("Processing youtube video", youtubeId);
    transcribeQueue.push(async (cb) => {
      const videoInfo = await ytdl.getInfo(youtubeId);

      // Check if the video has available audio streams
      const audioFormats = ytdl.filterFormats(videoInfo.formats, "audioonly");
      if (audioFormats.length === 0) {
        return res.status(400).send("Unable to obtain video audio.");
      }
      // Generate a temporary file path
      const tempFilePath = tmp.tmpNameSync({ postfix: ".mp3" });

      // Download the audio and save it to the temp file
      const audioStream = ytdl(youtubeId, { filter: "audioonly" });
      const fileStream = fs.createWriteStream(tempFilePath);
      await pipelineAsync(audioStream, fileStream);

      // Wait for a GPU slot to become available
      const availableGPU = await checkGPUSlots({ sourceTitle });
      // // Now the file is saved, you can process it
      const result = await transcribeFile({
        filePath: tempFilePath,
        gpuServerIP: availableGPU.full_ip,
      });
      // const result = await transcribeWithWhisperApi({
      //   filePath: tempFilePath,
      // });
      availableGPU.tasks--;

      await getOrCreateVideoAndUpdateTranscript({
        video,
        userId,
        originalTranscript: result,
      });
      // Clean up: Delete the temporary file if no longer needed
      fs.unlink(tempFilePath, (err) => {
        if (err) throw err;
      });
      res.json(result);
      cb();
    });
  } catch (error) {
    // 将错误消息发送回客户端
    console.error(error);
    res
      .status(500)
      .send("Error processing video audio. GPU server may be busy.");
  }
};
