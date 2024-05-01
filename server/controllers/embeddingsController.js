import { openai } from "../config/summaryConfig.js";
import Embedding from "../models/embeddingModel.js";
import { generateTextEmbeddings, saveEmbeddings, searchForQuery,getEmbeddingCollection } from "../services/embeddingsServices.js";

export const createEmbeddings = async (req, res) => {
    try {
        const { video, parentSrtText, userId } = req.body;
        const embeddings = await generateTextEmbeddings(parentSrtText);
        console.log("Embeddings generated successfully", embeddings);
        await saveEmbeddings({ video, userId, embeddings });
        res.status(200).json(embeddings);
    } catch (error) {
        console.error("Error occurred during embeddings generation:", error);
        res.status(500).json({ error: "Error occurred during embeddings generation" });
    }
}


export const vectorSearch = async (req, res) => {
    const { query } = req.body;
    // perform vector search using Embedding model, and mongoose aggregation
    try {
        const results = await searchForQuery(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error occurred during vector search:", error);
        res.status(500).json({ error: "Error occurred during vector search" });
    }
}

export const getEmbeddingCollectionAndVideos = async (req, res) => {
    const { userId } = req.params;
    try {
        const collection = await getEmbeddingCollection(userId);
        res.status(200).json(collection);
    } catch (error) {
        console.error("Error occurred while fetching embedding collection:", error);
        res.status(500).json({ error: "Error occurred while fetching embedding collection" });
    }
}