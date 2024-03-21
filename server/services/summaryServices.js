import { openai, anthropic } from "../config/summaryConfig.js";

export const generateSummary = async (req, res) => {
  const { option, transcript, language, selectedModel, userId } = req.body
  const { prompt } = option;

  let fullResponseText = ""

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
      fullResponseText += messageStreamEvent.delta.text
      res.write(messageStreamEvent.delta.text);
    } else {
      console.log(
        "The 'text' property is undefined or does not exist in the delta object."
      );
    }
  }

  return fullResponseText;
};

export const generateSummaryInSeries = async (transcriptsArray, req, res) => {
  // input Array of transcripts separated by interval lenth, 10mins/ 20mins each part
  const { language, selectedModel } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Wrap the summary task in a function that returns a promise.
  const summarizePrompt = async (prompt) => {
    return new Promise(async (resolve, reject) => {
      switch (selectedModel) {
        default:
          // anthropic AI
          const stream = await anthropic.messages.create({
            max_tokens: 1024,
            messages: [
              {
                role: "user",
                content:
                  "give your response in a makrdown, dont use a code interpreter and use the language: " +
                  language +
                  "\n" +
                  prompt,
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
          resolve();
      }
    });
  };

  const summarizePromptsSeries = async () => {
    for (let i = 0; i < transcriptsArray.length; i++) {
      const prompt = `you are given the ${i + 1} of ${transcriptsArray.length
        } part of a meeting conversation, summarize this part in detail, list out all the action items.
      list the reference timestamp at the end of your summary point, and end of each action items
      `;
      try {
        const summary = await summarizePrompt(prompt + transcriptsArray[i]);
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
