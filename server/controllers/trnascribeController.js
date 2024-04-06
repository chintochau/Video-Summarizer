import Video from "../models/videoModel.js";
import { transcribeFile } from "../services/transcribeServices.js";
import { getOrCreateVideoBySourceId } from "../services/videoServices.js";

export const handleTranscribeRequest = async (req, res) => {

    const { userId } = req.body;
    const video = JSON.parse(req.body.video);

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