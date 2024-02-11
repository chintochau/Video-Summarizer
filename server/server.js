import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import "dotenv/config";
import OpenAI from "openai";
import * as fs from "fs";
import { setTimeout } from "timers";
import path from "path";

const app = express();
const upload = multer({dest: 'uploads/'})
const port = process.env.PORT || 3000;
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

// 中間件
app.use(bodyParser.json());

async function transcribe(file, language) {
  // 在實際應用中，這裡可以是呼叫外部API或進行其他異步操作的地方

  // const transcription = await openai.audio.transcriptions.create({
  //   file: fs.createReadStream("testing.m4a"),
  //   model: "whisper-1", // this is optional but helps the model
  // });


  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模擬異步操作完成
      console.log(1000);
      resolve(`模擬轉寫結果：文件 ${file.originalname} 被轉寫為 ${language} 語言`);
    }, 1000); // 延遲1秒模擬異步操作
  });
}

// 設置路由處理轉寫請求
app.post('/api/transcribe', upload.single('file'), async (req, res) => {
  const { language } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send('請上傳一個檔案');
  }

  try {
    const result = await transcribe(file, language);
    res.json({ message: result });
  } catch (error) {
    console.error('轉寫過程出錯:', error);
    res.status(500).send('轉寫過程中發生錯誤');
  }
});


// 啟動服務器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});