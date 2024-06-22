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
import ytdl from "ytdl-core";
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
      // stop GPU instance after 10 seconds when no tasks are running
      setTimeout(() => {
        stopIdleInstances();
      }, 10000);

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

// processYoutubeVideo function using queue
export const handleYoutubeTranscribeRequest = async (req, res) => {
  const { youtubeId, userId, video } = req.body;
  const { sourceTitle } = video;
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
      // stop GPU instance after 10 seconds when no tasks are running
      setTimeout(() => {
        stopIdleInstances();
      }, 10000);

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

// processYoutubeVideo function using S3 and runpod
export const handleYoutubeTranscribeRequestBeta = async (req, res) => {
  const { youtubeId, userId, video, transcribeOption } = req.body;
  const { sourceTitle } = video;
  let tempFilePath;
  try {
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
          language: "en_us",
        }
        );
        outputVideo = await getOrCreateVideoAndUpdateTranscript({
          video,
          userId,
          originalTranscript: result.srt,
          utterances: result.utterances,
        });
        break
      default:
        const id = await transcribeLinkWithRunPod(filePublicUrl, transcribeOption.value || "base");
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
  const { userId, link, publicId, resourceType } = req.body;
  const video = JSON.parse(req.body.video);
  const transcribeOption = JSON.parse(req.body.transcribeOption);
  const { sourceTitle } = video;

  console.log("Processing video Beta", sourceTitle);
  const writeData = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  try {
    let result;
    let outputVideo;
    let progress = 0
    switch (transcribeOption.value) {
      case "assembly":
        result = await transcribeWithAssemblyAI({
          fileLink: link,
          language: "en_us",
        });

        outputVideo = await getOrCreateVideoAndUpdateTranscript({
          video,
          userId,
          originalTranscript: result.srt,
          utterances: result.utterances,
        });

        break
      default:
        const id = await transcribeLinkWithRunPod(link, transcribeOption.value || "base");
        let currentStatus = "IN_PROGRESS";
        let data
        while (currentStatus !== "COMPLETED") {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          progress += 10;
          writeData({ progress });

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
    writeData({ outputVideo });
    res.end()

    res.on("close", () => {
      res.end();
    })

    res.on("finish", () => {
      res.end();
    })

  } catch {
    res.status(500).send("Error occurred during transcription");
  }

}