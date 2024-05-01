import { openai } from "../config/summaryConfig.js";
import Video from "../models/videoModel.js"; // import mongoose model
import Embedding from "../models/embeddingModel.js"; // import mongoose model
import {
  CharacterTextSplitter,
  RecursiveCharacterTextSplitter,
} from "langchain/text_splitter";
import {
  formatGroupedSubtitle,
  formatGroupedSubtitleWithTimestamp,
  groupSubtitlesByInterval,
} from "../utils/transcripUtils.js";
import EmbeddingCollection from "../models/embeddingsCollectionModel.js";
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
    embeddings.push({
      timeRange: chunk.timeRange,
      embedding: response.data[0].embedding,
      text: chunk.text,
    });
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
      return newEmbedding._id; // Return the ID of the saved embedding
    });

    const savedEmbeddingIds = await Promise.all(embeddingPromises);

    const existingVideo = await Video.findOne({ sourceId: video.sourceId });
    if (!existingVideo) {
      const newVideo = new Video({
        sourceId: video.sourceId,
        sourceTitle: video.sourceTitle,
        sourceType: video.sourceType,
      });
      await newVideo.save();
    }

    const defaultEmbeddingCollection = await EmbeddingCollection.findOne({
      userId,
      name: "default",
    });
    if (!defaultEmbeddingCollection) {
      const newEmbeddingCollection = new EmbeddingCollection({
        userId,
        name: "default",
      });
      await newEmbeddingCollection.save();
    }

    const updatedEmbeddingCollection = await EmbeddingCollection.findOne({
      userId,
      name: "default",
    });
    updatedEmbeddingCollection.videos.push(existingVideo._id);
    updatedEmbeddingCollection.embeddings.push(...savedEmbeddingIds); // Use the saved embedding IDs
    await updatedEmbeddingCollection.save();
  } catch (error) {
    console.error("Error saving embeddings:", error);
  }
};

export const searchForQuery = async (query) => {
  const queryEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
    encoding_format: "float",
  });
const aggregation = [
    {
        $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding.data[0].embedding,
            numCandidates: 6,
            limit: 3,
        },
    },
    {
        $project: {
            _id: 0,
            videoSourceId: 1,
            videoTitle: 1,
            videoSourceType: 1,
            referenceTimeRange: 1,
            text: 1,
            score: {
                $meta: "vectorSearchScore",
            },
        },
    },
    {
        $match: {
            score: { $gt: 0.65 }
        }
    }
];

  const results = await Embedding.aggregate(aggregation);
  return results;
};

// remove embeddings, and the video from the user collection based on the video sourceId
export const removeEmbeddings = async ({ userId, videoSourceId }) => {
  try {
    const video = await Video.findOne({ sourceId: videoSourceId });
    const embeddings = await Embedding.find({ videoSourceId });
    const embeddingIds = embeddings.map((embedding) => embedding._id);
    const videoId = video._id;

    await Embedding.deleteMany({ _id: { $in: embeddingIds } });
    await Video.deleteOne({ _id: videoId });

    const userCollections = await EmbeddingCollection.find({ userId });
    const collectionIds = userCollections.map((collection) => collection._id);
    await EmbeddingCollection.updateMany(
      { _id: { $in: collectionIds } },
      { $pull: { videos: videoId, embeddings: { $in: embeddingIds } } }
    );
  } catch (error) {
    console.error("Error removing embeddings:", error);
  }
};

// return the default embedding collection for the user, populate only vieos, leave the embeddings, and implement paging
export const getEmbeddingCollection = async (userId, page = 1, limit = 10) => {
  try {
    const userCollection = await EmbeddingCollection.findOne({
      userId,
      name: "default",
    }).populate({
      path: "videos",
      options: { skip: (page - 1) * limit, limit },
    });
    return userCollection;
  } catch (error) {
    console.error("Error getting user collection:", error);
  }
};
