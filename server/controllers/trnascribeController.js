import Video from "../models/videoModel.js";
import { checkGPUSlots,  transcribeFile, transcribeQueue } from "../services/transcribeServices.js";
import { getOrCreateVideoBySourceId } from "../services/videoServices.js";

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
        const video = await Video.findOne({ sourceId:sourceId },{originalTranscript:1});
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
export const processVideo = async (req, res, next) => {
    const { userId } = req.body;
    const video = JSON.parse(req.body.video);
    const transcribeOption = JSON.parse(req.body.transcribeOption);
    try {
        transcribeQueue.push(async (cb) => {
            const uploadedFile = req.file;

            // Wait for a GPU slot to become available
            const availableGPU = await checkGPUSlots();
            // Decrement the slots for the chosen GPU
            availableGPU.slots--;
            console.log(availableGPU);

            // Start the transcription
            const transcription = await transcribeFile({ file: uploadedFile, gpu: availableGPU });
            // await getOrCreateVideoBySourceId({ video, userId, originalTranscript: transcription });
            res.json(transcription);

            // Increment the slots for the chosen GPU
            availableGPU.slots++;

            // Signal that this task is done
            cb();
        });
    } catch (error) {
        console.error("Error occurred during transcription:", error);
        res.status(500).send("Error occurred during transcription");
    }
}