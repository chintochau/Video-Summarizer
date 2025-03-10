import { FFmpeg } from "@ffmpeg/ffmpeg";
const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;
const ffmpeg = new FFmpeg({ log: true });
import { get_encoding } from "tiktoken";
import { v4 as uuidv4 } from 'uuid';

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


export const transcribeWithAI = async (data) => {
  if (!file) {
    return null;
  }

  const { file, language, selectedModel } = data;
  const audioTypes = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/m4a"];
  const videoTypes = ["video/mp4", "video/quicktime"];

  const formData = new FormData();
  formData.append("file", file);
  formData.append("selectedModel", selectedModel);
  formData.append("language", language);

  try {
    const response = await fetch(apiUrl + "/api/transcribe", {
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
export const transcribeYoutubeVideo = async (data) => {
  try {
    const response = await fetch(apiUrl + "/api/beta/transcribeYoutubeVideo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Server Error - Server is down or not responding");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Server Error - Server is down or not responding");
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
export const parseSRTToArray = (srt) => {
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
export const exportSRT = (editableTranscript,videoTitle) => {
  const srtContent = editableTranscript
    .map(
      ({ index, start, end, text }) => `${index}\n${start} --> ${end}\n${text}`
    )
    .join("\n\n");
  const blob = new Blob([srtContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = videoTitle + ".srt";
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



/**
 * Converts a duration in seconds into a formatted time string in hours, minutes, and seconds.
 *
 * @param {number} seconds - The duration in seconds to convert to time format.
 * @returns {string} - The formatted time string displaying hours, minutes, and seconds.
 */
export const formatDuration = (seconds) => {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = seconds % 60;

  let result = '';

  if (hours > 0) {
    result += hours + ' hour' + (hours > 1 ? 's' : '') + ' ';
  }

  if (minutes > 0) {
    result += minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ';
  }

  if (remainingSeconds > 0) {
    result += remainingSeconds + ' second' + (remainingSeconds > 1 ? 's' : '') + ' ';
  }

  return result.trim();
}

export const generateUUID = () => {
  return uuidv4();
}

export const cn = (...classes) => classes.filter(Boolean).join(' ')