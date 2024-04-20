import { openai } from '../config/summaryConfig.js';
import Embedding from '../models/embeddingModel.js'; // import mongoose model
import { CharacterTextSplitter, RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { formatGroupedSubtitle, formatGroupedSubtitleWithTimestamp, groupSubtitlesByInterval } from '../utils/transcripUtils.js';
const splitter = new CharacterTextSplitter({
    separator: "----------",
    chunkSize: 4000,
});

/**
 * Generates text embeddings using OpenAI API.
 * @param {string} video - The video object.
 * @param {string} parentSrtText - The transcript text to generate embeddings from.
 * @returns {Promise<object>} - The generated embeddings.
 * using OpenAI API.
 * const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
                encoding_format: "float",
            });
 */
export const generateTextEmbeddings = async (parentSrtText) => {
    // genertate chunks of embeddings for the transcript text
    const subtitlesByInterval = groupSubtitlesByInterval(parentSrtText, 180);
    const subtitleArray = formatGroupedSubtitleWithTimestamp(subtitlesByInterval);
    const embeddings = []; // [{startTime,embedding}]

    for (const chunk of subtitleArray) {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: chunk.text,
            encoding_format: "float",
        });
        embeddings.push({ timeRange: chunk.timeRange, embedding: response.data[0].embedding, text: chunk.text});
    }

    return embeddings;
};

export const saveEmbeddings = async ({ video, userId, embeddings }) => {
    try {
        const embeddingPromises = embeddings.map(async (embedding) => {
            const newEmbedding = new Embedding({
                videoSourceId: video.sourceId,
                videoTitle: video.sourceTitle,
                videoSourceType: video.sourceType,
                userId,
                embedding: embedding.embedding,
                referenceTimeRange: embedding.timeRange,
                text: embedding.text,
            });
            await newEmbedding.save();
        });

        await Promise.all(embeddingPromises);

        console.log("Embeddings saved successfully");
    } catch (error) {
        console.error("Error saving embeddings:", error);
    }
}
export const searchForQuery = async (query) => {
    const queryEmbedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query,
        encoding_format: "float",
    });

    const aggregation = [
        {
            '$vectorSearch': {
                'index': 'vector_index',
                'path': 'embedding',
                'queryVector': queryEmbedding.data[0].embedding,
                'numCandidates': 6,
                'limit': 3
            }
        },
        {
            '$group': {
                '_id': '$videoSourceId',
                'videoSourceId': { '$first': '$videoSourceId' },
                'videoTitle': { '$first': '$videoTitle' },
                'videoSourceType': { '$first': '$videoSourceType' },
                'referenceTimeRange': { '$first': '$referenceTimeRange' },
                'text': { '$first': '$text' },
                'score': { '$first': { '$meta': 'vectorSearchScore' } }
            }
        },
        {
            '$project': {
                '_id': 0,
                'videoSourceId': 1,
                'videoTitle': 1,
                'videoSourceType': 1,
                'referenceTimeRange': 1,
                'text': 1,
                'score': 1
            }
        }
    ];

    const results = await Embedding.aggregate(aggregation);
    console.log("Search results:", results);
    return results;
};

export const deleteEmbeddings = async () => {
    try {
        await Embedding.deleteMany({});
        console.log("Embeddings deleted successfully");
    } catch (error) {
        console.error("Error deleting embeddings:", error);
    }
};
