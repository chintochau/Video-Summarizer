


// Chat GPT related
export const askChatGPT = async (prompt,language, completionHandler) => {
  console.log(language);
  try {
    const response = await fetch("/api/stream-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, language }),
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


export const callWhisperAPI = async({file, language="", responseFormat}) => {
  if (!file ) {
    return null;
  }

  const audioTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a'];
  const videoTypes = ['video/mp4', 'video/quicktime'];
  console.log(file);


  if (file.type.startsWith('audio/')) {
    console.log("audio");

    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch ('/api/transcribeAudio', {
        method:'POST',
        body:formData,
      })

      if (!response.ok) {
        throw new Error('Server Error - callwhisperapi(1)-Utils.js')
      }


      const result = await response.json()
      console.log(result);

    } catch (error) {
      console.error("upload error", error);
    }

  } else  if (file.type.startsWith('video/')){
    console.log('video');
  } else {
    console.error("please upload a video or audio file");
    return null
  }



}


// Youtube related
export const getYoutubeTranscript = async ({ youtubeLink }) => {
  const data = { youtubeLink };
  try {
    const response = await fetch("/api/transcribeYoutube", {
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

// 將SRT轉換為可編輯文本與時間戳的函數
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
