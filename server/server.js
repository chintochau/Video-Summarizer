import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import "dotenv/config";
import OpenAI from "openai";
import * as fs from "fs";
import { setTimeout } from "timers";
import path from "path";

const app = express();
const upload = multer({ dest: "uploads/" });
const port = process.env.PORT || 3000;
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

// 中間件
app.use(bodyParser.json());

async function transcribe(filePath, language, response_format) {
  let transcription;

  switch (response_format) {
    case "srt":
      transcription = `1
00:00:00,000 --> 00:00:01,480
不知道大家是否也和我一样

2
00:00:01,480 --> 00:00:03,440
自从这个ChatGPT问世以后

3
00:00:03,440 --> 00:00:05,400
我基本上每天都离不开它了

4
00:00:05,400 --> 00:00:06,760
小到撰写邮件

5
00:00:06,760 --> 00:00:07,600
内容点子

6
00:00:07,600 --> 00:00:09,120
大到商业规划

7
00:00:09,120 --> 00:00:09,960
营销策划

8
00:00:09,960 --> 00:00:12,960
我基本上都要去咨询ChatGPT的意见

9
00:00:12,960 --> 00:00:14,840
而且几乎没有例外的

10
00:00:14,840 --> 00:00:17,719
每一次我都能够得到比较满意的回答

11
00:00:17,719 --> 00:00:21,120
而且总是能够获得一些新的启发或者点子

12
00:00:21,120 --> 00:00:23,400
所以当我知道这个ChatGPT4

13
00:00:23,400 --> 00:00:24,520
不仅可以上网

14
00:00:24,520 --> 00:00:27,160
而且还可以和第三方的一些软件

15
00:00:27,160 --> 00:00:28,760
进行相连接的时候

16
00:00:28,760 --> 00:00:31,639
我基本上是毫不犹豫的就立马下单

17
00:00:31,639 --> 00:00:33,400
升级了我的ChatGPT

18
00:00:33,400 --> 00:00:35,560
目前经过了几个周的测试

19
00:00:35,560 --> 00:00:37,639
我可以非常自信的告诉大家

20
00:00:37,639 --> 00:00:39,480
这个钱花的值

21
00:00:39,480 --> 00:00:41,400
今天我就给大家来介绍几款

22
00:00:41,400 --> 00:00:43,799
非常非常好用的ChatGPT插件

23
00:00:43,799 --> 00:00:46,680
能够让你的工作和生活更加的高效

24
00:00:46,680 --> 00:00:48,439
让你仿佛如有神助

25
00:00:48,439 --> 00:00:49,480
如虎添翼

26
00:00:52,040 --> 00:00:54,200
首先要给大家介绍的第一款插件


`;

      break;
    default:
      transcription = {
        text: "不知道大家是否也和我一样 自从这个ChatGPT问世以后 我基本上每天都离不开它了 小到撰写邮件 内容点子 大到商业规划 营销策划 我基本上都要去咨询ChatGPT的意见 而且几乎没有例外的 每一次我都能够得到比较满意的回答 而且总是能够获得一些新的启发或者点子 所以当我知道这个ChatGPT4 不仅可以上网 而且还可以和第三方的一些软件 进行相连接的时候 我基本上是毫不犹豫的就立马下单 升级了我的ChatGPT 目前经过了几个周的测试 我可以非常自信的告诉大家 这个钱花的值 今天我就给大家来介绍几款 非常非常好用的ChatGPT插件 能够让你的工作和生活更加的高效 让你仿佛如有神助 如虎添翼 首先要给大家介绍的第一款插件",
      };
  }

  // const transcription = await openai.audio.transcriptions.create({
  //   file: fs.createReadStream(filePath),
  //   model: "whisper-1", // this is optional but helps the model
  //   language: language,
  //   response_format: response_format,
  // });

  console.log(transcription);

  return transcription;

  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     // 模擬異步操作完成
  //     console.log(1000);
  //     resolve(`模擬轉寫結果：文件 ${file.originalname} 被轉寫為 ${language} 語言`);
  //   }, 1000); // 延遲1秒模擬異步操作
  // });
}

// 設置路由處理轉寫請求
app.post("/api/transcribe", upload.single("file"), async (req, res) => {
  console.log(req.body);
  const { language, response_format } = req.body;
  const file = req.file;

  let filePath;
  if (!file) {
    return res.status(400).send("請上傳一個檔案");
  }

  try {
    filePath = path.join("uploads/", file.originalname);
    fs.renameSync(file.path, filePath);
    const result = await transcribe(filePath, language, response_format);
    res.json(result);
  } catch (error) {
    console.error("轉寫過程出錯:", error);
    res.status(500).send("轉寫過程中發生錯誤");
  } finally {
    // 完成轉寫後，刪除上傳的檔案

    if (filePath) {
      fs.unlinkSync(filePath);
    }
  }
});

// 啟動服務器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
