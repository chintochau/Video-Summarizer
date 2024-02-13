import { useState, useCallback } from "react";
import Dropzone from "react-dropzone";
import {
  Container,
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import "./App.css";
import { baseStyle } from "./styles"; // 導入樣式
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import FileCopyIcon from "@mui/icons-material/FileCopy";

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [responseFormat, setResponseFormat] = useState("json");
  const [toggle, setToggle] = useState("upload");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [srtData, setSrtData] = useState("");

  const handleFileChange = (files) => {
    console.log(files);
    setFile(files[0]);
    setFileName(files[0].name);
    setFileSize(files[0].size);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleFormatChange = (event) => {
    setResponseFormat(event.target.value);
  };

  const handleToggleChange = (e) => {
    setToggle(e.target.value);
  };

  const handleYoutubeLinkChange = (e) => {
    setYoutubeLink(e.target.value);
  };

  const handleGetYoutubeTranscript = async () => {
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
      console.log(result);
      setResponseMessage(result.message);
    } catch (error) {
      console.error(error);
      setResponseMessage(error.message);
    }
  };

  const exportSrt = () => {
    // 創建 Blob 物件
    const blob = new Blob([srtData], { type: "text/plain" });

    // 創建下載 URL
    const url = URL.createObjectURL(blob);

    // 創建下載連結
    const a = document.createElement("a");
    a.href = url;
    a.download = "subtitle.srt"; // 下載檔案的名稱
    a.style.display = "none";

    // 將連結添加到文件中並點擊它
    document.body.appendChild(a);
    a.click();

    // 清理創建的 URL
    URL.revokeObjectURL(url);
  };

  const handleDownloadAudio = async () => {
    const formData = new FormData();

    formData.append("youtubeLink", youtubeLink);

    try {
      console.log("Start");
      const response = await fetch("/api/downloadAudio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("網路請求失敗");
      }

      // 獲取回應標頭中的檔案名稱
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      let filename = "audio.mp3"; // 預設檔案名稱

      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, "");
      }

      const audioBlob = await response.blob();

      const downloadLink = window.URL.createObjectURL(new Blob([audioBlob]));

      // 創建一個隱藏的下載鏈接並觸發點擊
      const link = document.createElement("a");
      link.href = downloadLink;
      link.setAttribute("download", filename); // 指定下載的檔案名稱
      document.body.appendChild(link);
      link.click();

      // 釋放 URL 物件
      window.URL.revokeObjectURL(downloadLink);
    } catch (error) {
      console.log("Error");
      console.error("Error:", error);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("請選擇一個檔案");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);
    formData.append("response_format", responseFormat);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("網路請求失敗");
      }

      const result = await response.json();
      console.log("轉寫結果:", result);
      switch (responseFormat) {
        case "srt":
          setResponseMessage(result);
          setSrtData(result);
          break;
        default:
          setResponseMessage(result.text);
      }
    } catch (error) {
      console.error("轉寫錯誤:", error);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Audio Transcriber
        </Typography>

        <Box sx={{ "& > :not(style)": { m: 1 } }}>
          <FormControl fullWidth>
            <InputLabel>模式選擇</InputLabel>
            <Select
              displayEmpty
              value={toggle}
              label="模式選擇"
              onChange={handleToggleChange}
            >
              <MenuItem value="upload">上傳</MenuItem>
              <MenuItem value="youtube">Youtube</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>語言選擇</InputLabel>
            <Select
              displayEmpty
              value={language}
              label="語言選擇"
              onChange={handleLanguageChange}
            >
              <MenuItem value="">自動</MenuItem>
              <MenuItem value="zh">🇨🇳 中文</MenuItem>
              <MenuItem value="en">🇬🇧 英語</MenuItem>
              {/* 根據需要添加更多語言選項 */}
            </Select>
          </FormControl>

          {toggle === "upload" ? (
            <Dropzone
              onDrop={(acceptedFiles) => handleFileChange(acceptedFiles)}
              maxFiles={1}
              multiple={false}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps({ style: baseStyle })}>
                    <input {...getInputProps()} />
                    <Typography>
                      Drag 'n' drop some files here, or click to select files
                    </Typography>
                  </div>
                </section>
              )}
            </Dropzone>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                fullWidth
                label="輸入 Youtube 連結"
                value={youtubeLink}
                onChange={handleYoutubeLinkChange}
                sx={{ flex: 3, mr: 1 }} // 設置按鈕寬度為 200px
              />
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleDownloadAudio}
                  sx={{ textTransform: "none", mr: 1 }} // 設置按鈕寬度為 200px
                >
                  Download Audio
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleGetYoutubeTranscript}
                  sx={{ textTransform: "none" }} // 設置按鈕寬度為 200px
                >
                  get transcript
                </Button>
              </Box>
            </Box>
          )}

          {fileName && (
            <p>
              已選擇的檔案: {fileName} - {fileSize}bytes
            </p>
          )}

          <FormControl fullWidth>
            <InputLabel>格式選擇</InputLabel>
            <Select
              displayEmpty
              value={responseFormat}
              label="格式選擇"
              onChange={handleFormatChange}
            >
              <MenuItem value="json">自動</MenuItem>
              <MenuItem value="text">text</MenuItem>
              <MenuItem value="srt">srt</MenuItem>
              <MenuItem value="vtt">vtt</MenuItem>
              {/* 根據需要添加更多語言選項 */}
            </Select>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            提交
          </Button>

          <Typography variant="h5" component="h2" gutterBottom>
            Result:
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="outlined"
              startIcon={<FileCopyIcon />}
              onClick={() => navigator.clipboard.writeText(responseMessage)}
              sx={{ mr: 1 }} // 添加右邊外邊距
            >
              複製
            </Button>
            {responseFormat === "srt" && (
              <Button
                disabled={srtData === ""}
                variant="outlined"
                startIcon={<CloudDownloadIcon />}
                onClick={exportSrt}
              >
                下載 SRT
              </Button>
            )}
          </Box>

          <TextField
            multiline
            fullWidth
            variant="outlined"
            rows={30} // 設置文本框的行數，可以根據需要調整
            value={responseMessage} // 將 SRT 內容傳遞給文本框的 value 屬性
            InputProps={{ readOnly: true }} // 設置文本框為只讀模式，以防止用戶編輯內容
          />
        </Box>
      </Container>
    </>
  );
}

export default App;
