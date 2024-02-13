import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import "dotenv/config";
import OpenAI from "openai";
import * as fs from "fs";
import { setTimeout } from "timers";
import path from "path";
import ytdl from "ytdl-core";
import { jsonDemo, srtDdemo } from "./demovalue.js";
import { YoutubeTranscript } from "youtube-transcript";

const app = express();
const upload = multer({ dest: "uploads/" });
const port = process.env.PORT || 3000;
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

// 中間件
app.use(bodyParser.json());


//PRIVATE transcribe Audio
async function transcribe(filePath, language, response_format) {
  let transcription;

  switch (response_format) {
    case "srt":
      transcription = srtDdemo;
      break;
    default:
      transcription = jsonDemo;
  }

  // const transcription = await openai.audio.transcriptions.create({
  //   file: fs.createReadStream(filePath),
  //   model: "whisper-1", // this is optional but helps the model
  //   language: language,
  //   response_format: response_format,
  // });

  return transcription;
}

// 設置路由處理轉寫請求
app.post("/api/transcribe", upload.single("file"), async (req, res) => {
  console.log(req.body);
  const { language, response_format } = req.body;
  const file = req.file;

  let filePath;
  if (!file) {
    return res.status(400).send("請上傳一個檔案");
  }

  try {
    filePath = path.join("uploads/", file.originalname);

    fs.renameSync(file.path, filePath);

    const result = await transcribe(filePath, language, response_format);

    res.json(result);

  } catch (error) {
    console.error("轉寫過程出錯:", error);
    res.status(500).send("轉寫過程中發生錯誤");
    
  } finally {
    // 完成轉寫後，刪除上傳的檔案

    if (filePath) {
      fs.unlinkSync(filePath);
    }
  }
});

//Download Youtube Audio
app.post("/api/downloadAudio", upload.single("file"), async (req, res) => {
  const { youtubeLink } = req.body;

  const videoInfo = await ytdl.getInfo(youtubeLink);

  // 檢查視頻是否有可用的音頻流
  const audioFormats = ytdl.filterFormats(videoInfo.formats, "audioonly");
  if (audioFormats.length === 0) {
    return res.status(400).send("無法獲取視頻的音頻");
  }

  console.log(videoInfo);

  // 設置響應標頭，指定檔案名稱並將音頻發送給客戶端
  res.set(
    "Content-Disposition",
    `attachment; filename="${videoInfo.title}.mp3"`
  );
  ytdl(youtubeLink, { format: "140" }).pipe(res);
});


async function convertToPlainText(transcript) {
  let text = "";

  transcript.forEach((line) => {
    text += `${line.text} `;
  });


  return text.trim();
}



//Transcribe Youtube
app.post("/api/transcribeYoutube", async (req, res) => {
  const { youtubeLink } = req.body;

  try {
    const result = await YoutubeTranscript.fetchTranscript(youtubeLink).then(convertToPlainText)
    
    console.log(result);
  
  
    res.json(result);
    
  } catch (error) {
    // 将错误消息发送回客户端
    res.status(500).json("Transcript is disabled on this video" );
  }
});

// 啟動服務器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
