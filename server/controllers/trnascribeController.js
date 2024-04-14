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
    const { userId, link, publicId, resourceType } = req.body;
    const video = JSON.parse(req.body.video);
    const transcribeOption = JSON.parse(req.body.transcribeOption);
    const {sourceTitle} = video;
    const writeData = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }

    try {
        console.log("Processing video", sourceTitle);
        transcribeQueue.push(async (cb) => {
            // Wait for a GPU slot to become available
            const availableGPU = await checkGPUSlots({sourceTitle});
            // Set up SSE headers
            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            let progress = 0;
            let transcript = "";
            const transcriptionId = uuidv4();
            const interval = setInterval(async () => {
                try {
                    progress = await checkTranscriptionProgress(transcriptionId, availableGPU.full_ip)
                    // Check the progress of the transcription
                    if (progress === 100) {
                        clearInterval(interval);
                    } else {
                        writeData({ progress });
                    }
                } catch (error) {
                    console.error("Error occurred during transcription:", error);
                    writeData({ progress: -100 });
                    clearInterval(interval);
                }
            }, 7000);

            // Start the transcription
            console.log("start transcribeLinkg: ",sourceTitle);
            transcript = await transcribeLink({ link, transcriptionId, publicId, resourceType, gpuServerIP: availableGPU.full_ip })
            await getOrCreateVideoBySourceId({ video, userId, originalTranscript: transcript });
            writeData({ transcript });

            res.end();
            res.on("close", () => {
                clearInterval(interval);
                res.end();
            });

            res.on("finish", () => {
                clearInterval(interval);
                res.end();
            });

            availableGPU.tasks--;
            cb();
        });
        console.log("Pushed to queue, task:", sourceTitle);
        console.log("Queue length:", transcribeQueue.length);
    } catch (error) {
        console.error("Error occurred during transcription:", error);
        console.log("Error occurred during transcription", video.sourceTitle);
        writeData({ errorMessage: "Error occurred during transcription" });
        res.end(); // Add this line to end the response when an error occurs
    }
}