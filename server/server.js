import express from "express";
import multer from "multer";
import "dotenv/config";
import path from "path";
import cors from "cors";
import summaryRoutes from "./routes/summaryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";
import transcribeRoutes from "./routes/transcribeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import youtubeRoutes from "./routes/youtubeRoutes.js";
import vastaiRoutes from "./routes/vastaiRoutes.js";
import embeddingsRoutes from "./routes/embeddingsRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";
import ttsRoutes from "./routes/ttsRoutes.js";
import { fileURLToPath } from "url";

const app = express();
const upload = multer({ dest: "uploads/" });
const port = process.env.PORT || 3000;
connectDB();

// middleware
app.use(cors());
app.use(upload.single("file"));

// Set the view engine to EJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Routes
app.use("/api", cors(), summaryRoutes); // to get summary
app.use("/users", cors(), userRoutes);
app.use("/api", cors(), transcribeRoutes);
app.use("/api", cors(), paymentRoutes);
app.use("/api", cors(), youtubeRoutes);
app.use("/api", cors(), embeddingsRoutes);
app.use("/api", cors(), ttsRoutes);
app.use("/", cors(), vastaiRoutes);
app.use("/", cors(), shareRoutes);


app.get("/", (req, res) => {
  res.redirect("https://fusionaivideo.io");
});

// 啟動服務器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
