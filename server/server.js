import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import "dotenv/config";
import OpenAI from "openai";
import fs from "fs";
import { setTimeout } from "timers";
import path from "path";
import ytdl from "ytdl-core";
import { jsonDemo, srtDdemo, youtubeDemoTranscript } from "./demovalue.js";
import { YoutubeTranscript } from "youtube-transcript";
import { AssemblyAI } from "assemblyai";
import ffmpeg from "fluent-ffmpeg";

const app = express();
const upload = multer({ dest: "uploads/" });
const port = process.env.PORT || 3000;
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});
const assembly = new AssemblyAI({
  apiKey: process.env["ASSEMBLY_CPI_KEY"],
});

// 中間件
app.use(bodyParser.json());

//PRIVATE transcribe Audio
async function transcribeWithWhisperApi(data) {
const {filePath, language, response_format} = data
  let transcription;

  // 模擬一段延遲時間
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 假設延遲時間為2秒

  // console.log("Whisper is not active, using dummy value");
  // switch (response_format) {
  //   case "jason":
  //     transcription = jsonDemo;
  //     break;
  //   default:
  //     transcription = srtDdemo;
  // }

  console.log("default set to srt");
  transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-1", // this is optional but helps the model
    language: language,
    response_format: "srt",
  });

  return transcription;
}

async function transcribeWithAssemblyAI(data) {
  const {filePath, language} = data
  const transcript = await assembly.transcripts.transcribe({
    audio: filePath,
    language_code: language,
  });

  console.log("response in full: ", );
  console.log(transcript.text);

  const srt = await assembly.transcripts.subtitles(transcript.id, "srt");

  return srt;
}

function YTconvertToPlainText(transcript) {
  let text = "";

  transcript.forEach((line) => {
    text += `${line.text} \n`;
  });

  return text.trim();
}

const srtToPlainText = (srtContent) => {
  // 将SRT内容分割成单个字幕条目
  const srtEntries = srtContent.split(/\r?\n\r?\n/);

  // 纯文本内容
  let plainTextContent = "";

  // 处理每个SRT字幕条目
  srtEntries.forEach((entry, index) => {
    // 分割字幕条目的文本部分
    const textLines = entry.split(/\r?\n/).slice(2); // 忽略时间码部分

    // 将文本部分添加到纯文本内容中，并在每个字幕之间添加换行符
    plainTextContent += textLines.join("\n") + "\n";
  });

  return plainTextContent.trim(); // 去除最后一个多余的换行符并返回
};

function YTconvertToSrt(transcript) {
  let srt = "";
  let index = 1;

  transcript.forEach((line, i) => {
    const startTime = formatTimeSrt(line.offset / 1000);
    const endTime = formatTimeSrt((line.offset + line.duration) / 1000);

    srt += `${index}\n${startTime} --> ${endTime}\n${line.text}\n\n`;
    index++;
  });

  return srt;
}

function YTconvertToVtt(transcript) {
  let vtt = "WEBVTT\n\n";

  transcript.forEach((line, index) => {
    const startTime = formatTimeVTT(line.offset / 1000);
    const endTime = formatTimeVTT((line.offset + line.duration) / 1000);

    vtt += `${index + 1}\n${startTime} --> ${endTime}\n${line.text}\n\n`;
  });

  return vtt;
}

function formatTimeSrt(seconds) {
  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  const ss = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 1000);

  return `${pad(hh)}:${pad(mm)}:${pad(ss)},${pad(ms, 3)}`;
}

function formatTimeVTT(seconds) {
  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  const ss = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 1000);

  return `${pad(hh)}:${pad(mm)}:${pad(ss)}.${pad(ms, 3)}`;
}

function pad(num, size = 2) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

// Function to extract audio from video
function extractAudioFromVideo(videoFilePath, outputAudioFilePath) {
  return new Promise((resolve, reject) => {
    console.log("only pass the first 5 mins of audio");
    ffmpeg(videoFilePath)
      .output(outputAudioFilePath)
      .audioCodec("pcm_s16le") // Setting audio codec to pcm_s16le for compatibility
      .setStartTime('00:00:00') // Start at the beginning, remove this line
      .duration(300) // Limit to 300 seconds (5 minutes), remove this line when not needed
      .on("end", () => resolve(outputAudioFilePath))
      .on("error", (err) => reject(err))
      .run();
  });
}

const videoExtensions = ['.mp4', '.mkv', '.webm', '.avi', '.mov'];


// 設置路由處理轉寫請求
app.post("/api/transcribeAudio", upload.single("file"), async (req, res) => {
  const { language, response_format, selectedModel } = req.body;
  console.log(req.body);
  const file = req.file;
  const model = selectedModel|| "assembly";
  let result;
  let filePath
  let originalFilePath


  if (!file) {
    return res.status(400).send("請上傳一個檔案");
  }

  try {
    originalFilePath = path.join("uploads/", file.originalname);
    fs.renameSync(file.path, originalFilePath);

    filePath = originalFilePath
    // Check if the file is a video, and extract audio if necessary

    console.log("Start: ",filePath);

    if (file.mimetype.startsWith("video") || videoExtensions.includes(path.extname(originalFilePath).toLowerCase())) {
      console.log("getting audio from video");
      const audioFilePath = originalFilePath.replace(
        path.extname(originalFilePath),
        ".wav"
      );
      await extractAudioFromVideo(originalFilePath, audioFilePath);
      filePath = audioFilePath;
    }

    switch (model) {
      case "assembly": //assembly ai
      console.log("Using Assembly");
        result = await transcribeWithAssemblyAI({filePath, language});
        break;
      default: //openai
      console.log("Using Whisper");
        result = await transcribeWithWhisperApi({
          filePath,
          language,
          response_format}
        );
    }

    res.json(result);
  } catch (error) {
    console.error("轉寫過程出錯:", error);
    res.status(500).send("轉寫過程中發生錯誤");
  } finally {
    // 完成轉寫後，刪除上傳的檔案
    if (filePath) {
      fs.unlinkSync(filePath);
    }
    if (filePath !== originalFilePath) {
      fs.unlinkSync(originalFilePath); // Delete extracted audio file if it's different from the original upload
    }
  }
});

//Download Youtube Audio
app.post("/api/downloadAudio", async (req, res) => {
  const { youtubeLink } = req.body;

  const videoInfo = await ytdl.getInfo(youtubeLink);

  // 檢查視頻是否有可用的音頻流
  const audioFormats = ytdl.filterFormats(videoInfo.formats, "audioonly");
  if (audioFormats.length === 0) {
    return res.status(400).send("無法獲取視頻的音頻");
  }

  // 設置響應標頭，指定檔案名稱並將音頻發送給客戶端
  res.set(
    "Content-Disposition",
    `attachment; filename="${videoInfo.title}.mp3"`
  );
  ytdl(youtubeLink, { format: "140" }).pipe(res);
});

//Transcribe Youtube with Free API
app.post("/api/transcribeYoutube", async (req, res) => {
  const { youtubeLink } = req.body;

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(youtubeLink);
    // console.log("change this line after testing ling 185 server.js");
    // const transcript = youtubeDemoTranscript

    const result = {
      srt: YTconvertToSrt(transcript),
      text: YTconvertToPlainText(transcript),
      vtt: YTconvertToVtt(transcript),
    };

    res.json(result);
  } catch (error) {
    // 将错误消息发送回客户端
    console.error(error);
    res.status(500).json("Transcript is disabled on this video");
  }
});

app.post("/api/stream-response", async (req, res) => {
  console.log(req.body);

  const { prompt, language } = req.body;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let outputLanguage;

  if (language === "auto") {
    outputLanguage = "second half part of the input language";
  } else {
    outputLanguage = language;
  }

  const response = openai.beta.chat.completions.stream({
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: "Summarize, answer must be given in the language of:" + outputLanguage,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
  });

  response.on("content", (delta, snapshot) => {
    process.stdout.write(delta);
    res.write(delta);
  });

  const chatCompletion = await response.finalChatCompletion();
  console.log(chatCompletion);
  res.end();
});

// 啟動服務器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
