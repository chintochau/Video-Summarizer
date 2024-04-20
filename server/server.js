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
//running python code for testing
import { pythonRunner, } from "./utils/pythonRunner.js";
import { formatGroupedSubtitle, groupSubtitlesByInterval } from "./utils/transcripUtils.js";
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

//Routes
app.use("/api", cors(), summaryRoutes); // to get summary
app.use("/users", cors(), userRoutes);
app.use("/api", cors(), transcribeRoutes);
app.use("/api", cors(), paymentRoutes);
app.use("/api", cors(), youtubeRoutes);
app.use("/api", cors(), embeddingsRoutes);
app.use("/", cors(), vastaiRoutes);

//PRIVATE transcribe Audio
async function transcribeWithWhisperApi(data) {
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
    console.log(req.body);
    const file = req.file;
    const model = selectedModel || "assembly";
    let result;
    let filePath;
    let originalFilePath;

    if (!file) {
      return res.status(400).send("請上傳一個檔案");
    }

    try {
      originalFilePath = path.join("uploads/", file.originalname);
      fs.renameSync(file.path, originalFilePath);

      filePath = originalFilePath;
      // Check if the file is a video, and extract audio if necessary

      console.log("Start: ", filePath);

      if (
        file.mimetype.startsWith("video") ||
        videoExtensions.includes(path.extname(originalFilePath).toLowerCase())
      ) {
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


app.post(
  "/api/stream-response",
  cors(),
  bodyParser.json({ limit: "10mb" }),
  async (req, res) => {
    const { option, transcript, language, selectedModel } = req.body;
    const { prompt, id } = option;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let outputLanguage;

    if (language === "auto") {
      outputLanguage = "input language of the transcript";
    } else {
      outputLanguage = language;
    }

    switch (selectedModel) {
      case "gpt35":
        // openai
        const response = openai.beta.chat.completions.stream({
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "system",
              content:
                "read user input, answer in " +
                outputLanguage +
                ". and give your result in a markdown",
            },
            {
              role: "user",
              content: prompt + transcript,
            },
          ],
          stream: true,
          temperature: 0.4,
        });

        response.on("content", (delta, snapshot) => {
          process.stdout.write(delta); // = console.log without a linebreak at the end
          res.write(delta);
        });

        try {
          await response.finalChatCompletion();
        } catch (error) {
          console.log(error.message);
          res.write("exceed length");
        }
        break;
      default:
        // anthropic AI
        const stream = await anthropic.messages.create({
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content:
                "give your response in a makrdown, dont use a code interpreter and use the language" +
                language +
                "\n" +
                prompt +
                transcript,
            },
          ],
          model: "claude-3-haiku-20240307",
          stream: true,
        });

        for await (const messageStreamEvent of stream) {
          if (
            messageStreamEvent &&
            messageStreamEvent.delta &&
            messageStreamEvent.delta.text
          ) {
            res.write(messageStreamEvent.delta.text);
          } else {
            console.log(
              "The 'text' property is undefined or does not exist in the delta object."
            );
          }
        }
    }

    res.end();
  }
);

function parseTimestamp(timestamp) {
  // Converts a SRT timestamp to milliseconds.
  const parts = timestamp.split(":");
  const millis = parts[2].split(",")[1] || "0";
  return (
    Number(parts[0]) * 3600000 +
    Number(parts[1]) * 60000 +
    Number(parts[2].split(",")[0]) * 1000 +
    Number(millis)
  );
}

function secondsToMMSS(seconds) {
  // Converts seconds to mm:ss format.
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

app.post(
  "/api/stream-response-series",
  bodyParser.json({ limit: "10mb" }),
  cors(),
  async (req, res) => {
    // must input srt transcript, if not, will not produce desired result
    const { option, transcript, language, interval } = req.body;
    const { id, title, description, prompt } = option;

    // transcript is in srt format
    const formattedScript = formatGroupedSubtitle(
      groupSubtitlesByInterval(transcript, interval)
    );

    const splitter = new CharacterTextSplitter({
      separator: "----------",
    });

    const chunks = await splitter.createDocuments([formattedScript]);
    // res.end()
    // return
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Wrap the summary task in a function that returns a promise.
    const summarizePrompt = async (prompt) => {
      return new Promise((resolve, reject) => {
        const response = openai.beta.chat.completions.stream({
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "system",
              content:
                "Give your response in a markdown ,Summarize, answer must be given in the language of:" +
                outputLanguage,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          stream: true,
          temperature: 0.5,
        });

        response.on("content", (delta, snapshot) => {
          process.stdout.write(delta);
          res.write(delta); // This will write each response back to the client as it's received.
        });

        response
          .finalChatCompletion()
          .then((chatCompletion) => {
            console.log(chatCompletion);
            resolve(chatCompletion);
          })
          .catch(reject);
      });
    };

    let outputLanguage =
      language === "auto" ? "based on the transcript input language" : language;

    const summarizePromptsSeries = async () => {
      for (let i = 0; i < chunks.length; i++) {
        try {
          const summary = await summarizePrompt(prompt + chunks[i].pageContent);
          console.log(summary);
          res.write("\n");
        } catch (error) {
          console.error("An error occurred:", error);
          res.write("An error occurred: " + error.message);
        }
      }
    };

    await summarizePromptsSeries();

    res.end();
  }
);

app.post(
  "/api/stream-response-large-text",
  cors(),
  bodyParser.json({ limit: "10mb" }),
  async (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // must input srt transcript, if not, will not produce desired result
    const { option, transcript, language, interval } = req.body;
    const { id, title, description, prompt } = option;

    // transcript is in srt format
    const formattedScript = formatGroupedSubtitle(
      groupSubtitlesByInterval(transcript, 60)
    );

    // 1. break down large srt into chunks
    const splitter = new CharacterTextSplitter({
      separator: "----------",
      chunkSize: 500,
    });

    const chunks = await splitter.createDocuments([formattedScript]);

    let embeddingArray = [];

    // res.end();
    // return;

    // 2. get embeddings from openai
    const embeddingSeries = async () => {
      for (let i = 0; i < chunks.length; i++) {
        try {
          const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: chunks[i].pageContent,
            encoding_format: "float",
          });
          embeddingArray.push(embedding.data[0].embedding);
        } catch (error) { }
      }
    };

    await embeddingSeries();

    // // 3. wrtie response from chatgpt, fot later use
    // fs.writeFile("output.txt", JSON.stringify(embeddingArray), (err) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   console.log("Array data has been written to output.txt file");
    // });

    // // use dummy data for testing
    // const data = fs.readFileSync("output.txt", "utf8");
    // // Parse the data as JSON if it contains JSON formatted data
    // embeddingArray = JSON.parse(data);

    console.log(parseInt(chunks.length / 3));
    let ans = kmeans(embeddingArray, parseInt(chunks.length / 3));

    let paragraphs = [];
    chunks.map((chunk) => {
      paragraphs.push(chunk.pageContent);
    });

    const a = ans.clusters;

    console.log(a);

    // Function to determine if the current paragraph is similar to the previous ones based on the rules
    const isSimilar = (currentCluster, previousClusters) => {
      return previousClusters.some((cluster) => cluster === currentCluster);
    };

    let groupedParagraphs = [];
    let currentGroup = [];
    let lastTwoClusters = [];

    paragraphs.forEach((paragraph, index) => {
      const currentCluster = a[index];
      if (isSimilar(currentCluster, lastTwoClusters)) {
        currentGroup.push(paragraph);
      } else {
        // Before starting a new group, push the currentGroup (if it has paragraphs) to groupedParagraphs
        if (currentGroup.length > 0) groupedParagraphs.push(currentGroup);
        currentGroup = [paragraph];
      }
      // Update the lastTwoClusters
      lastTwoClusters.push(currentCluster);
      if (lastTwoClusters.length > 2) lastTwoClusters.shift();
    });

    // Add the final group if not yet added
    if (currentGroup.length > 0) {
      groupedParagraphs.push(currentGroup);
    }

    // Handle standalone paragraphs by merging them into the nearest group
    groupedParagraphs = groupedParagraphs.reduce(
      (acc, group, index, originalArray) => {
        if (group.length === 1) {
          if (index > 0) {
            // If not the first group, merge with the previous group
            acc[acc.length - 1] = acc[acc.length - 1].concat(group);
          } else if (originalArray.length > 1) {
            // If it's the first group but not the only group, merge with the next group
            originalArray[index + 1] = group.concat(originalArray[index + 1]);
          } else {
            // If it's a standalone paragraph with no groups before or after, keep it as is
            acc.push(group);
          }
        } else {
          acc.push(group);
        }
        return acc;
      },
      []
    );

    // paragraphs after initial grouping
    // console.log(groupedParagraphs);
    // res.end();
    // return;
    // Wrap the summary task in a function that returns a promise.
    const summarizePrompt = async (prompt, context) => {
      return new Promise((resolve, reject) => {
        const response = openai.beta.chat.completions.stream({
          model: "gpt-3.5-turbo-0125",
          messages: [
            {
              role: "system",
              content:
                "answer must be given in the language of:" + outputLanguage,
            },
            {
              role: "user",
              content: "Give an abstract of the video",
            },
            {
              role: "assistant",
              content: `${context}`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          stream: true,
          temperature: 0.3,
        });

        response.on("content", (delta, snapshot) => {
          process.stdout.write(delta);
          res.write(delta); // This will write each response back to the client as it's received.
        });

        response
          .finalChatCompletion()
          .then((chatCompletion) => {
            console.log(chatCompletion);
            resolve(chatCompletion);
          })
          .catch(reject);
      });
    };

    let outputLanguage =
      language === "auto" ? "based on the transcript input language" : language;

    const summarizePromptsSeries = async () => {
      let abstract = "";

      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
              role: "user",
              content: `
          you are given first few minutes of subtitle text of a video, based on the subtitle, give an abstract for the video. the abstract will be used as the context when the other part of the video being summarized. text as below : ${groupedParagraphs[0]}
          `,
            },
          ],
          model: "gpt-3.5-turbo-0125",
          temperature: 0.4,
        });
        abstract = completion.choices[0].message.content;

        res.write("\n");
      } catch (error) {
        console.error("An error occurred:", error);
        res.write("An error occurred: " + error.message);
      }

      for (let i = 0; i < groupedParagraphs.length; i++) {
        const startTimestamp = groupedParagraphs[i][0].split("-")[0];
        try {
          res.write(`\nPart ${i + 1} : ${startTimestamp}\n`);
          const summary = await summarizePrompt(
            `
        You are given the below text as part of a video, rewrite the key ideas into short paragraphs, bold the inportant informations. I would like to get the main ideas of the text easily.

        ***Template***
        #### [Tittle]
        [rewritten paragraph]
        ---------------------------------
        
        input script:
        ${groupedParagraphs[i]}`,
            abstract
          );
          res.write("\n");
        } catch (error) {
          console.error("An error occurred:", error);
          res.write("An error occurred: " + error.message);
        }
      }
    };

    await summarizePromptsSeries();

    res.write("\n---End---");
    res.end();
  }
);

app.get("/", (req, res) => {
  res.send("Running~");
});

// 啟動服務器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
