import { openai } from '../config/summaryConfig.js';
import Embeddings from '../models/embeddingsModel.js'; // import mongoose model

/**
 * Generates text embeddings using OpenAI API.
 * @param {string} video - The video object.
 * @param {string} transcriptText - The transcript text to generate embeddings from.
 * @returns {Promise<object>} - The generated embeddings.
 */
export const generateTextEmbeddings = async ( transcriptText) => {
    try {
        const embeddings = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: transcriptText,
            encoding_format: "float",
        });

        return embeddings.data[0].embedding;
    } catch (error) {
        console.error("Error generating embeddings", error);
        throw error;
    }
};


export const saveEmbeddings = async ({video,userId,embeddings}) => {
    try {
        const newEmbeddings = new Embeddings({
            videoSourceId: video.sourceId,
            userId: userId,
            embeddings: embeddings,
        });

        await newEmbeddings.save();
        console.log("Embeddings saved successfully");
        return newEmbeddings;
    } catch (error) {
        console.error("Error saving embeddings", error);
        throw error;
    }
}
