import {
  openai,
  anthropic,
  deepInfraHeaders,
} from "../config/summaryConfig.js";
import fetch from "node-fetch";

export const generateSummary = async (req, res) => {
  const { option, transcript, language, selectedModel, userId, video } =
    req.body;
  const { prompt } = option;
  const { sourceTitle } = video;

  let fullResponseText = "";
  const max_tokens = 1300;
  const system =
    "give your response in a makrdown, dont use a code interpreter and you must answer in the language: " +
    language;
  const messages = [
    {
      role: "user",
      content:
        `you are given a transcript of a video titles:${sourceTitle}` +
        prompt +
        "Video Transcript:" +
        transcript,
    },
  ];

  const data = {
    system,
    messages,
    fullResponseText,
    max_tokens,
    res,
    selectedModel,
  };

  switch (selectedModel) {
    case "gpt35":
    case "gpt4o":
      fullResponseText = await summarizeWithOpenAI(data);
      break;
    case "claude3h":
    case "claude35s":
      fullResponseText = await summarizeWithAnthropic(data);
      break;
    case "llama3":
      fullResponseText = await summarizeWithLlama3(data);
      break;
  }
  return fullResponseText;
};

export const generateSummaryInJson = async (req, res) => {
  const { option, transcript, language, selectedModel, userId, video } =
    req.body;
  const { prompt } = option;
  const { sourceTitle } = video;

  let fullResponseText = "";
  const max_tokens = 2000;
  const system = `your response must be in json format and only give the json response with the curly bracket, without extra words, because your response will be directly used in my function, any extra words will break the structure. So dont give extra words., and the language of the content should be ${language}`;
  const messages = [
    {
      role: "user",
      content: `you are given a transcript of a video titles:${sourceTitle} + 
Here is the instruction: ${prompt} 
Video Transcript: ${transcript}`,
    },
  ];
  const data = {
    system,
    messages,
    fullResponseText,
    max_tokens,
    res,
    selectedModel,
  };
  switch (selectedModel) {
    case "gpt35":
    case "gpt4o":
      fullResponseText = await summarizeWithOpenAI(data);
      break;
    case "claude3h":
      fullResponseText = await summarizeWithAnthropic(data);
      break;
    case "llama3":
      fullResponseText = await summarizeWithLlama3(data);
      break;
  }
  return fullResponseText;
};

export const generateSummaryInSeries = async (
  transcriptsArray,
  req,
  res,
  chapters
) => {
  // input Array of transcripts separated by interval lenth, 10mins/ 20mins each part
  const { language, selectedModel, video, transcript, option } = req.body;
  const { prompt } = option;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponseText = "";
  // Wrap the summary task in a function that returns a promise.
  const summarizePrompt = async (promptInput) => {
    // each prompt is a part of the video transcript
    return new Promise(async (resolve, reject) => {
      const messages = [
        {
          role: "user",
          content:
            "give your response in a makrdown, dont use a code interpreter, Your answer must be in the language " +
            language +
            "\n" +
            promptInput,
        },
      ];
      const max_tokens = 1300;

      let stream;
      switch (selectedModel) {
        case "gpt35":
          let model = "gpt-3.5-turbo";
        case "gpt4o":
          model = "gpt-4o";
          const openaiStream = openai.beta.chat.completions.stream({
            model,
            messages,
            stream: true,
            temperature: 0.4,
            max_tokens,
          });
          openaiStream.on("content", (delta, snapshot) => {
            fullResponseText += delta;
            if (res) {
              res.write(delta);
            }
          });
          try {
            await openaiStream.finalChatCompletion();
          } catch (error) {
            console.log(error.message);
            if (res) {
              res.write("exceed length");
            }
          }
          resolve();
          break;
        default:
          // anthropic AI
          stream = await anthropic.messages.create({
            max_tokens,
            messages,
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
              fullResponseText += messageStreamEvent.delta.text;
            }
          }
          resolve();
      }
    });
  };

  const data = {
    // context of the video
    system: "",
    messages: [
      {
        role: "user",
        content: `
        give your response in a markdown, don't use a code interpreter, and you must answer in the language: ${language}
        you are given the transcript of the beginning of a video titled: ${
          video.sourceTitle
        }, 
        below is the transcript: ${getFirstNMinutesOfTranscript(transcript)}
        You task is to provide a context of the video, the context will explain what the video is about, and what the viewer can expect to learn from the video. the context wll also be used for reference when reading other part of the video, to prevent loss of context.
        ### Video Abstract
        `,
      },
    ],
    fullResponseText,
    max_tokens: 1024,
    selectedModel,
  };

  let videoContext;

  switch (selectedModel) {
    case "gpt35":
    case "gpt4o":
      videoContext = await summarizeWithOpenAI(data);
      break;
    case "claude3h":
      videoContext = await summarizeWithAnthropic(data);
      break;
    case "llama3":
      videoContext = await summarizeWithLlama3(data);
      break;
  }

  res.write(videoContext + "\n");
  fullResponseText += videoContext + "\n";

  const summarizePromptsSeries = async () => {
    for (let i = 0; i < transcriptsArray.length; i++) {
      const additionalPrompt = `you are given the ${i + 1} of ${
        transcriptsArray.length
      } part of a video, 
      here is the brief context of the video:
      ${videoContext}
      here is the part of the video transcript you need to summarize:
      ${transcriptsArray[i]}
      ${prompt}
      ${
        i + 1 === transcriptsArray.length
          ? "Provide the conclusion of this video at the end, using format ### Conclusion"
          : ""
      }
        
      }
      `;
      try {
        res.write(
          "\n### Part " + (i + 1) + " of " + transcriptsArray.length + "\n"
        );
        fullResponseText +=
          "\n### Part " + (i + 1) + " of " + transcriptsArray.length + "\n";

        const summary = await summarizePrompt(additionalPrompt);
        res.write("\n");
        fullResponseText += "\n";
      } catch (error) {
        console.error("An error occurred:", error);
        res.write("An error occurred: " + error.message);
      }
    }
  };

  await summarizePromptsSeries();
  return fullResponseText;
};

export const covertSRTtoStringFormat = (inputSRT) => {
  let lines = inputSRT.split("\n");
  let output = "";

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^\d+$/)) {
      let timestamp = lines[i + 1];
      let content = lines[i + 2];
      output += `${timestamp}: ${content}\n`;
    }
  }

  return output;
};

/**
 * Returns an array of strings with text from the parsed SRT array within a specific time interval.
 *
 * @param {Array<Object>} parsedSRT An array of objects representing parsed SRT subtitles.
 * @param {number} intervalInSeconds The time interval in seconds for grouping the text.
 * @returns {Array<string>} An array of strings containing the text within the specified time intervals.
 */
export const getTextWithinInterval = (parsedSRT, intervalInSeconds) => {
  let groupedText = [];
  let currentText = "";
  let currentEnd = intervalInSeconds;

  parsedSRT.forEach((subtitle) => {
    const { start, text } = subtitle;
    const startSeconds = convertTimeToSeconds(start);

    if (startSeconds <= currentEnd) {
      currentText += start.split(",")[0] + " " + text + "\n";
    } else {
      groupedText.push(currentText.trim());
      currentText = start.split(",")[0] + " " + text + "\n";
      currentEnd += intervalInSeconds;
    }
  });
  groupedText.push(currentText.trim()); // Add the last remaining text

  return groupedText;
};

const convertTimeToSeconds = (time) => {
  const [hours, minutes, seconds] = time.split(":").map(parseFloat);
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * 將 SRT 字幕格式的字符串轉換為一個物件陣列，每個物件包含字幕的索引、開始時間、結束時間以及對應的文本。
 *
 * @param {string} srt 代表 SRT 字幕的原始字符串。
 * @returns {Array<Object>} 一個物件陣列，每個物件表示一段字幕，包含以下屬性：
 *                          - index: 字幕的序號。
 *                          - start: 字幕的開始時間。
 *                          - end: 字幕的結束時間。
 *                          - text: 字幕的文本內容。
 *
 * @example
 * const srtExample = "1\n00:00:01,000 --> 00:00:02,000\nHello World\n\n2\n00:00:03,000 --> 00:00:04,000\nThis is an example";
 * const parsed = parseSRT(srtExample);
 * console.log(parsed);
 * // 輸出:
 * // [
 * //   { index: "1", start: "00:00:01,000", end: "00:00:02,000", text: "Hello World" },
 * //   { index: "2", start: "00:00:03,000", end: "00:00:04,000", text: "This is an example" }
 * // ]
 */
export const parseSRT = (srt) => {
  return srt
    .split("\n\n")
    .map((part) => {
      const [index, time, ...textLines] = part.split("\n");
      // 檢查time是否定義，如果未定義或不包含預期的時間格式則跳過
      if (!time || !time.includes(" --> ")) {
        return null; // 返回null或其他合適的值以表示該部分不應被處理
      }
      const [start, end] = time.split(" --> ");
      return { index, start, end, text: textLines.join("\n") };
    })
    .filter((part) => part !== null); // 過濾掉所有null值，只保留有效的轉錄部分
};

/***
 * parse SRT and group by interval
 * input
 * srt:{
 * 1
 * 00:00:00,000 --> 00:00:01,000
 * Hello World
 *
 * 2
 * 00:00:01,000 --> 00:00:02,000
 * This is an example},
 * intervalInSeconds: 60
 *
 * output:
 * " 00:00:00 - 00:01:00 Hello World This is an example"
 *
 *
 */
export const parseSRTAndGroupByInterval = (
  srt,
  intervalInSeconds,
  startTimeInclusion = 10
) => {
  const parsedSRT = parseSRT(srt);
  let groupedText = [];
  let currentText = "";
  let currentEnd = intervalInSeconds;

  parsedSRT.forEach((subtitle, index) => {
    // only include start time for every x index
    if (index % startTimeInclusion === 0) {
      currentText += "\n" + subtitle.start.split(",")[0] + ": ";
    }
    const { start, text } = subtitle;
    const startSeconds = convertTimeToSeconds(start);

    if (startSeconds <= currentEnd) {
      currentText += text + " ";
    } else {
      groupedText.push(currentText.trim());
      currentText = start.split(",")[0] + "\n" + text + " ";
      currentEnd += intervalInSeconds;
    }
  });
  groupedText.push(currentText.trim()); // Add the last remaining text
  return groupedText;
};

const getFirstNMinutesOfTranscript = (transcript, n = 5) => {
  const parsedSRT = parseSRT(transcript);
  const intervalInSeconds = n * 60;
  let transcriptText = "";

  for (let i = 0; i < parsedSRT.length; i++) {
    // only include start time for every 10 index
    if (i % 10 === 0) {
      transcriptText += "\n" + parsedSRT[i].start.split(",")[0] + ": ";
    }

    const { start, text } = parsedSRT[i];
    const startSeconds = convertTimeToSeconds(start);

    if (startSeconds <= intervalInSeconds) {
      transcriptText += text + " ";
    } else {
      break;
    }
  }

  return transcriptText;
};

async function summarizeWithAnthropic({
  system,
  max_tokens,
  messages,
  fullResponseText,
  res,
  selectedModel,
}) {
  let model;
  switch (selectedModel) {
    case "claude3h":
      model = "claude-3-haiku-20240307";
      break;
    case "claude35s":
      model = "claude-3-5-sonnet-20240620";
      break;
    default:
      break;
  }

  const stream = await anthropic.messages.create({
    max_tokens,
    messages,
    model,
    system,
    stream: true,
  });
  for await (const messageStreamEvent of stream) {
    if (
      messageStreamEvent &&
      messageStreamEvent.delta &&
      messageStreamEvent.delta.text
    ) {
      fullResponseText += messageStreamEvent.delta.text;
      if (res) {
        res.write(messageStreamEvent.delta.text);
      }
    } else {
      console.log(
        "The 'text' property is undefined or does not exist in the delta object."
      );
    }
  }
  return fullResponseText;
}

async function summarizeWithOpenAI({
  system,
  messages,
  fullResponseText,
  max_tokens,
  res,
  selectedModel,
}) {
  let model;
  switch (selectedModel) {
    case "gpt35":
      model = "gpt-3.5-turbo";
      break;
    case "gpt4om":
      model = "gpt-4o-mini";
    case "gpt4o":
      model = "gpt-4o";
      break;
  }
  const stream = openai.beta.chat.completions.stream({
    model,
    messages: [{ role: "system", content: system }, ...messages],
    stream: true,
    temperature: 0.4,
    max_tokens,
  });
  stream.on("content", (delta, snapshot) => {
    fullResponseText += delta;
    if (res) {
      res.write(delta);
    }
  });
  try {
    await stream.finalChatCompletion();
  } catch (error) {
    console.log(error.message);
    if (res) {
      res.write("exceed length");
    }
  }
  return fullResponseText;
}

const summarizeWithLlama3 = async ({
  system,
  messages,
  fullResponseText,
  max_tokens,
  res,
}) => {
  try {
    const stream = await fetch(
      "https://api.deepinfra.com/v1/openai/chat/completions",
      {
        method: "POST",
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3-70B-Instruct",
          messages: [{ role: "system", content: system }, ...messages],
          max_tokens,
          stream: true,
        }),
        headers: deepInfraHeaders,
      }
    );

    await new Promise((resolve, reject) => {
      stream.body.on("data", (chunk) => {
        // data.choices[0].delta.content
        const data = chunk.toString().split("data:")[1];
        // try to parse the data
        if (data && data.trim() === "[DONE]") {
          return { stream, fullResponseText };
        } else if (!data) {
          return;
        }
        const parsedData = JSON.parse(data);
        const content = parsedData.choices[0].delta.content;
        fullResponseText += content;
        if (content) {
          if (res) {
            res.write(content);
          }
        }
      });
      stream.body.on("end", () => {
        resolve();
      });
    });
  } catch (error) {
    console.log(error.message);

    if (res) {
      res.write("exceed length");
    }
  }

  return fullResponseText;
};
