import {transcribeFile} from "../services/transcribeServices.js";

export const handleTranscribeRequest = async (req, res) => {

    try {
        const uploadedFile = req.file;
        const transcriptionResult = await transcribeFile({file:uploadedFile});
        res.json(transcriptionResult);
    } catch (error) {
        console.error("Error occurred during transcription:", error);
        res.status(500).send("Error occurred during transcription");
    }
}
