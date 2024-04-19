import { generateTextEmbeddings, saveEmbeddings } from "../services/embeddingsServices.js";

export const createEmbeddings = async (req, res) => {
    try {
        const { video, transcriptText,userId } = req.body;
        const embeddings = await generateTextEmbeddings(transcriptText);
        await saveEmbeddings({video, userId,embeddings});
        res.status(200).json(embeddings);
    } catch (error) {
        console.error("Error occurred during embeddings generation:", error);
        res.status(500).json({ error: "Error occurred during embeddings generation" });
    }
}
