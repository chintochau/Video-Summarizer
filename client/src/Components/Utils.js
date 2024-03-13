import { FFmpeg } from "@ffmpeg/ffmpeg";
const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;
const ffmpeg = new FFmpeg({ log: true });
import { get_encoding } from "tiktoken";

async function extractAudio(videoBlob) {
  // Write the video file to FFmpeg's virtual file system
  ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoBlob));

  // Run FFmpeg command to extract the audio to an output file
  await ffmpeg.run("-i", "input.mp4", "-vn", "-acodec", "copy", "output.aac");

  // Read the resulting audio file from FFmpeg's file system
  const audioData = ffmpeg.FS("readFile", "output.aac");

  // Convert the audio file to a Blob
  return new Blob([audioData.buffer], { type: "audio/aac" });
}

// Chat GPT related
/*
data = {
  option,
  language,
  transcript
}
*/

export const calculateCredit = (transcript, model) => {
  const encoding = get_encoding('cl100k_base')
  const tokens = encoding.encode(transcript)

  switch(model) {
    default:
      // GPT35 (input/1000*0.0005 + output/1000*0.0015)*1.5*100
      // return tokens.length // comment out to to return token length
      return ((tokens.length*0.0005+800*0.0015)*1.5/1000*100).toFixed(1)
  }
}


export const askChatGPT = async (data, completionHandler) => {
  const { option, language, transcript, interval } = data;
  const { prompt } = option;

  const apiRequest =
    option.id === 6 ? "/api/stream-response-series" : "/api/stream-response";

  try {
    const response = await fetch(apiUrl + apiRequest, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        option: option,
        transcript: transcript,
        language: language,
        interval: interval,
      }),
    });

    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      completionHandler(null, value);
    }
  } catch (error) {
    completionHandler(error, null);
  }
};

export const transcribeWithAI = async ({
  file,
  language = "",
  responseFormat,
  selectedModel,
}) => {
  if (!file) {
    return null;
  }

  console.log(selectedModel);

  const audioTypes = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/m4a"];
  const videoTypes = ["video/mp4", "video/quicktime"];

  const formData = new FormData();
  formData.append("file", file);
  formData.append("selectedModel", selectedModel);
  formData.append("language", language);

  try {
    const response = await fetch(apiUrl + "/api/transcribeAudio", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Server Error - callwhisperapi(1)-Utils.js");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("upload error", error);
  }
};

// Youtube related
export const getYoutubeTranscript = async ({ youtubeLink }) => {
  console.log(apiUrl);
  const data = { youtubeLink };
  try {
    const response = await fetch(apiUrl + "/api/transcribeYoutube", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return error.message;
  }
};

//Frontend Related

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

// 導出為SRT格式
export const exportSRT = (editableTranscript) => {
  const srtContent = editableTranscript
    .map(
      ({ index, start, end, text }) => `${index}\n${start} --> ${end}\n${text}`
    )
    .join("\n\n");
  const blob = new Blob([srtContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = "transcript.srt";
  link.href = url;
  link.click();
};

/// turn file size into KB, MB...
export const formatFileSize = (sizeInBytes) => {
  const units = ["bytes", "KB", "MB", "GB", "TB"];

  let index = 0;
  let fileSize = sizeInBytes;

  while (fileSize >= 1024 && index < units.length - 1) {
    fileSize /= 1024;
    index++;
  }

  return `${fileSize.toFixed(2)} ${units[index]}`;
};
