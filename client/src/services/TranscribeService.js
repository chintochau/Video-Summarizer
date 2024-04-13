import axios from "axios";

const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;

let controller = new AbortController();
let signal = controller.signal;

class TranscribeService {

    // Example method for transcribing audio
    static transcribeUserUploadFile = async (data) => {
        const { file, language, userId, video, videoCredits, transcribeOption } = data;
        if (!file) {
            return null;
        }

        const audioTypes = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/m4a"];
        const videoTypes = ["video/mp4", "video/quicktime"];

        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", language);
        formData.append("userId", userId);
        formData.append("videoCredits", videoCredits);
        formData.append("video", JSON.stringify(video));
        formData.append("transcribeOption", JSON.stringify(transcribeOption));


        try {
            const response = await fetch(apiUrl + "/api/transcribe", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Server Error - callwhisperapi(1)-Utils.js");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("upload error", error);
        }
    };

    static transcribeUserUploadFileWithLink = async (data, onProgress) => {
        const { link, language, userId, video, videoCredits, transcribeOption } = data;
        if (!link) {
            return null;
        }
        const formData = new FormData();
        formData.append("link", link);
        formData.append("language", language);
        formData.append("userId", userId);
        formData.append("videoCredits", videoCredits);
        formData.append("video", JSON.stringify(video));
        formData.append("transcribeOption", JSON.stringify(transcribeOption));
        try {
            const response = await fetch(apiUrl + "/api/processVideo", {
                method: "POST",
                body: formData,
                signal: signal
            });
            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                // response from server: data: {"progress":5}
                // or
                // response from server: data: {"transcript":"this is a transcript"}

                const chunk = value.split("data: ")[1]
                const data = JSON.parse(chunk)

                if (data.errorMessage) {
                    throw new Error(data.errorMessage)
                } else if (data.progress) {
                    onProgress(data.progress)
                } else if (data.transcript) {
                    return data.transcript
                }
            }
        } catch (error) {
            console.error("upload error", error);
            throw new Error(error.response?.data?.message || "Server Error ");
        }
    }

    static abortTranscription = () => {
        controller.abort();
        controller = new AbortController();
        signal = controller.signal;
    }

    static getVideoTranscript = async ({ sourceId }) => {
        try {
            const response = await fetch(apiUrl + `/api/getTranscript/${sourceId}`);
            if (!response.ok) {
                throw new Error("Server Error - callwhisperapi(2)-Utils.js");
            }
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("fetch error", error);
        }
    }
}

export default TranscribeService;