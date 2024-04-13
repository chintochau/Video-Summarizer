import Video from "../models/videoModel.js";
import { checkGPUSlots, checkTranscriptionProgress, transcribeFile, transcribeLink, transcribeQueue } from "../services/transcribeServices.js";
import { getOrCreateVideoBySourceId } from "../services/videoServices.js";
import { v4 as uuidv4 } from 'uuid';

export const handleTranscribeRequest = async (req, res) => {
    const { userId } = req.body;
    const video = JSON.parse(req.body.video);
    const transcribeOption = JSON.parse(req.body.transcribeOption);
    try {
        const uploadedFile = req.file;
        const transcriptionResult = await transcribeFile({ file: uploadedFile });
        await getOrCreateVideoBySourceId({ video, userId, originalTranscript: transcriptionResult });
        res.json(transcriptionResult);
    } catch (error) {
        console.error("Error occurred during transcription:", error);
        res.status(500).send("Error occurred during transcription");
    }
}


export const fetchVideoTranscription = async (req, res) => {
    const { sourceId } = req.params;
    try {
        const video = await Video.findOne({ sourceId: sourceId }, { originalTranscript: 1 });
        console.log("video", video);
        if (!video) {
            throw new Error("Video not found");
        }
        res.json(video.originalTranscript)
    }
    catch (error) {
        console.error("fetch error", error);
        res.status(500).send("Error occurred during transcription");
    }
}

// processVideo function using queue
export const processVideo = async (req, res) => {
    const { userId, link,publicId, resourceType } = req.body;
    const video = JSON.parse(req.body.video);
    const transcribeOption = JSON.parse(req.body.transcribeOption);

    const writeData = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }

    try {
        transcribeQueue.push(async (cb) => {
            // Wait for a GPU slot to become available
            const availableGPU = await checkGPUSlots();
            availableGPU.tasks++;
            // Set up SSE headers
            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");

            let progress = 0;
            let transcript = "";

            const transcriptionId = uuidv4();

            const interval = setInterval(async () => {
                progress = await checkTranscriptionProgress(transcriptionId)
                // Check the progress of the transcription
                if (progress === 100) {
                    clearInterval(interval);
                } else {
                    writeData({ progress });
                }
            }, 7000);

            // Start the transcription
            transcript = await transcribeLink({ link, transcriptionId,publicId, resourceType })
            await getOrCreateVideoBySourceId({ video, userId, originalTranscript: transcript });

            writeData({ transcript });

            res.end();
            res.on("close", () => {
                clearInterval(interval);
                console.log("Transcription closed");
                res.end();
            });

            res.on("finish", () => {
                clearInterval(interval);
                console.log("Transcription finished");
                res.end();
            });

            availableGPU.tasks--;
            cb();
        });
    } catch (error) {
        console.error("Error occurred during transcription:", error);
        writeData({ errorMessage: "Error occurred during transcription" });
        res.end(); // Add this line to end the response when an error occurs
    }
}