import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import cors from "cors";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { kmeans } from "ml-kmeans";
import { pipeline } from "stream";
import util from "util";
import { openai, anthropic, assembly } from "./config/summaryConfig.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";
import transcribeRoutes from "./routes/transcribeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import youtubeRoutes from "./routes/youtubeRoutes.js";
import vastaiRoutes from "./routes/vastaiRoutes.js";
import embeddingsRoutes from "./routes/embeddingsRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";
import ttsRoutes from "./routes/ttsRoutes.js";
import { fileURLToPath } from "url";
//running python code for testing
import { pythonRunner } from "./utils/pythonRunner.js";
import {
  formatGroupedSubtitle,
  groupSubtitlesByInterval,
} from "./utils/transcripUtils.js";
const variableToPass = "";
pythonRunner("--version", [variableToPass])
  .then((output) => {
    console.log(output);
  })
  .catch((error) => {
    console.error(`Python script execution error: ${error}`);
  });
// end of python code

const app = express();
const pipelineAsync = util.promisify(pipeline);

const upload = multer({ dest: "uploads/" });
const port = process.env.PORT || 3000;
connectDB();

// 中間件
// app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors());
app.use(upload.single("file"));
// app.use(
//   bodyParser.raw({ inflate: true, limit: "100kb", type: "application/json" })
// );

// Set the view engine to EJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Routes
app.use("/api", cors(), summaryRoutes); // to get summary
app.use("/users", cors(), userRoutes);
app.use("/api", cors(), transcribeRoutes);
app.use("/api", cors(), paymentRoutes);
app.use("/api", cors(), youtubeRoutes);
app.use("/api", cors(), embeddingsRoutes);
app.use("/api", cors(), ttsRoutes);
app.use("/", cors(), vastaiRoutes);
app.use("/", cors(), shareRoutes);

//PRIVATE transcribe Audio
const transcribeWithWhisperApi = async (data) => {
  const { filePath, language, response_format } = data;
  let transcription;

  transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-1",
    response_format: "srt",
  });

  return transcription;
}

async function transcribeWithAssemblyAI(data) {
  const { filePath, language } = data;
  const transcript = await assembly.transcripts.transcribe({
    audio: filePath,
    language_code: language,
  });

  const srt = await assembly.transcripts.subtitles(transcript.id, "srt");

  return srt;
}

// Function to extract audio from video
function extractAudioFromVideo(videoFilePath, outputAudioFilePath) {
  return new Promise((resolve, reject) => {
    console.log("only pass the first 5 mins of audio");
    ffmpeg(videoFilePath)
      .output(outputAudioFilePath)
      .audioCodec("pcm_s16le") // Setting audio codec to pcm_s16le for compatibility
      .setStartTime("00:00:00") // Start at the beginning, remove this line
      .duration(300) // Limit to 300 seconds (5 minutes), remove this line when not needed
      .on("end", () => resolve(outputAudioFilePath))
      .on("error", (err) => reject(err))
      .run();
  });
}

const videoExtensions = [".mp4", ".mkv", ".webm", ".avi", ".mov"];

// 設置路由處理轉寫請求
app.post(
  "/api/transcribeAudio",
  cors(),
  bodyParser.json({ limit: "10mb" }),
  upload.single("file"),
  async (req, res) => {
    const { language, response_format, selectedModel } = req.body;
    const file = req.file;
    const model = selectedModel || "assembly";
    let result;
    let filePath;
    let originalFilePath;

    if (!file) {
      return res.status(400).send("please upload a file");
    }

    try {
      originalFilePath = path.join("uploads/", file.originalname);
      fs.renameSync(file.path, originalFilePath);

      filePath = originalFilePath;
      // Check if the file is a video, and extract audio if necessary

      if (
        file.mimetype.startsWith("video") ||
        videoExtensions.includes(path.extname(originalFilePath).toLowerCase())
      ) {
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
          result = await transcribeWithAssemblyAI({ filePath, language });
          break;
        default: //openai
          console.log("Using Whisper");
          result = await transcribeWithWhisperApi({
            filePath,
            language,
            response_format,
          });
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
  }
);

app.get("/", (req, res) => {
  // redirect to "https://fusionaivideo.io"
  res.redirect("https://fusionaivideo.io");
});

// 啟動服務器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
