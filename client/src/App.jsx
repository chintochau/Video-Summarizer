import { useState, useCallback } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] = useState("zh");
  const [responseMessage, setResponseMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault(); // 防止瀏覽器默認處理拖放
  }, []);

  const handleDrop = useCallback((e) => {
    console.log(testing);
    e.preventDefault();
    handleFileChange(e); // 重用檔案處理邏輯
  }, []);

  const handleSubmit = async () => {
    if (!file) {
      alert("請選擇一個檔案");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

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
      setResponseMessage(result.message);
    } catch (error) {
      console.error("轉寫錯誤:", error);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          音頻轉寫工具
        </Typography>
        <Typography variant="body1">{responseMessage}</Typography>
        <Box sx={{ "& > :not(style)": { m: 1 } }}>
          <FormControl fullWidth>
            <InputLabel>語言選擇</InputLabel>
            <Select
              value={language}
              label="語言選擇"
              onChange={handleLanguageChange}
            >
              <MenuItem value="zh">中文</MenuItem>
              <MenuItem value="de">德語</MenuItem>
              <MenuItem value="en">英語</MenuItem>
              {/* 根據需要添加更多語言選項 */}
            </Select>
          </FormControl>
            <Button variant="contained" component="label">
              {fileName || "上傳檔案"}
              <input type="file" hidden onChange={handleFileChange} />
              {fileName && <p> 選擇的檔案: {fileName}</p>}
            </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            提交
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default App;
