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

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [responseFormat, setResponseFormat] = useState("json");

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

  const exportSrt = () => {};

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

          {fileName && (
            <p>
              {" "}
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
