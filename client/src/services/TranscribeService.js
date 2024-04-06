const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;

class TranscribeService {
    // Example method for transcribing audio
    static transcribeUserUploadFile = async (data) => {

        const { file, language, selectedModel, userId, video, videoCredits } = data;
        if (!file) {
            return null;
        }

        const audioTypes = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/m4a"];
        const videoTypes = ["video/mp4", "video/quicktime"];

        const formData = new FormData();
        formData.append("file", file);
        formData.append("selectedModel", selectedModel);
        formData.append("language", language);
        formData.append("userId", userId);
        formData.append("videoCredits", videoCredits);
        formData.append("video", JSON.stringify(video));


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

    static getVideoTranscript = async ({sourceId}) => {
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