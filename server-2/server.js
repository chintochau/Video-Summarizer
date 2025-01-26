import fs from 'node:fs/promises'
import express from 'express'
import multer from "multer";
import "dotenv/config";
import cors from "cors";
import summaryRoutes from "./routes/summaryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";
import transcribeRoutes from "./routes/transcribeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import youtubeRoutes from "./routes/youtubeRoutes.js";
import vastaiRoutes from "./routes/vastaiRoutes.js";
import embeddingsRoutes from "./routes/embeddingsRoutes.js";
import ttsRoutes from "./routes/ttsRoutes.js";
import Summary from './models/summaryModel.js';
import summaryHandlers from './handlers/summaryHandlers.js';
import blogRoutes from "./routes/blogPostRoutes.js";
import llmRoutes from "./routes/llmRoutes.js";
import http from 'http';
import { Server as socketIo } from 'socket.io';
import { aiSimsMain } from './ai-sims/ai-sims-main.js';

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000
const base = process.env.BASE || '/'
connectDB();

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined

// Create http server
const app = express()
const upload = multer({ dest: "uploads/" });
const server = http.createServer(app)
const io = new socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// middleware
app.use(cors());
app.use(upload.single("file"));


//Routes
app.use("/api", cors(), summaryRoutes); // to get summary
app.use("/users", cors(), userRoutes);
app.use("/api", cors(), transcribeRoutes);
app.use("/api", cors(), paymentRoutes);
app.use("/api", cors(), youtubeRoutes);
app.use("/api", cors(), embeddingsRoutes);
app.use("/api", cors(), ttsRoutes);
app.use("/", cors(), vastaiRoutes);
app.use("/blog", cors(),blogRoutes );

app.use("/llm",cors(), llmRoutes)

// ai-sims
aiSimsMain(app);


//Sockets.io handlers
summaryHandlers(io);

// Add Vite or respective production middlewares
let vite

const setUpServer = async () => {
  if (!isProduction) {
    const { createServer } = await import('vite')
    vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
      base
    })
    app.use(vite.middlewares)
  } else {
    const compression = (await import('compression')).default
    const sirv = (await import('sirv')).default
    app.use(compression())
    app.use(base, sirv('./dist/client', { extensions: [] }))
  }
}

// setUpServer()


// Serve HTML
app.use('/share/:id', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')
    const id = req.params.id

    const summary = await Summary.findById(id).populate("videoId");

    if (!summary) {
      res.status(404).json({ success: false, error: "Summary not found" });
    }

    let template
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render({ summary }, ssrManifest);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')
      .replace(`<!--summary-data-->`, JSON.stringify(summary));

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

app.get("/", (req, res) => {
  // show simple welcome text
  res.send("Welcome to Fusion AI!")
});

// Start http server

server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})