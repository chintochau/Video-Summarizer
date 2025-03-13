import dayjs from "dayjs";
import { openai } from "../../config/summaryConfig.js";
import llmController from "../../controllers/llmController.js";
import { Agent } from "../ai-sims-models/agentModel.js";
import { Memory } from "../ai-sims-models/memoryModel.js";
import { DEFAULT_CHAT_MODEL, DEFAULT_CHEAP_MODEL } from "../worldConfig.js";
import mongoose from "mongoose";

/**
 * Recalls memories for a given agent based on a query string using vector search.
 * @param {string} agentId - The ID of the agent whose memories to search.
 * @param {string} query - The query string to search for.
 * @returns {Promise<Array>} - A promise that resolves to an array of matching memories.
 */
export async function recallMemories(agentId, query, includePlan = true) {
  // Convert the query string to an embedding vector
  const queryEmbedding = await generateEmbedding(query);

  // Perform the vector search
  const sourceMemories = await Memory.aggregate([
    {
      $vectorSearch: {
        index: "memories_index", // Replace with your actual index name
        path: "embedding",
        queryVector: queryEmbedding,
        limit: 10, // Number of results to return
        numCandidates: 100, // Number of candidates to consider
        filter: {
          relatedAgentId: new mongoose.Types.ObjectId(agentId), // Filter inside vector search
          type: { $in: includePlan ? ["observation", "plan", "reflection"] : ["observation", "reflection"] }, // Only consider observation, plan, and reflection types
        },
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        importance: 1,
        recentAccessTimestamp: 1,
        createdAt: 1,
        relevance: {
          $meta: "vectorSearchScore",
        },
      },
    },
    {
      $match: {
        relevance: { $gt: 0.6 },
      },
    },
  ]);

  const memories = scoreAndRankMemories(sourceMemories);
  // update recentAccessTimestamp for each memory


  const updatePromises = memories.map((memory) =>
    Memory.findByIdAndUpdate(memory._id, { recentAccessTimestamp: Date.now() })
  );
  await Promise.all(updatePromises);

  return memories;
}

function scoreAndRankMemories(memories) {
  const now = dayjs();
  const decayFactor = 0.995;

  return memories
    .map((memory) => {
      const hoursSinceAccess = now.diff(
        dayjs(memory.recentAccessTimestamp),
        "hour"
      );
      const recencyScore = Math.pow(decayFactor, hoursSinceAccess);
      const importanceScore = memory.importance / 10; // Already in range [1,10]
      const relevanceScore = memory.relevance; // [0,1]

      // Weighted sum (adjust weights as needed)
      const retrievalScore =
        recencyScore + importanceScore + relevanceScore;

      return { ...memory, retrievalScore };
    })
    .sort((a, b) => b.retrievalScore - a.retrievalScore) // Sort by descending score
    .sort((a, b) => b.createdAt - a.createdAt) // Sort by newest first
    .slice(0, 7); // Only return the first 7 results
}

export const saveAsMemory = async (agentId, text, type, importance = 5) => {
  const newMemory = new Memory({
    content: text,
    importance: importance,
    type: type || "observation",
    relatedAgentId: agentId,
    embedding: [],
  });

  newMemory.relatedAgentId = agentId;
  newMemory.embedding = await generateEmbedding(text);
  await newMemory.save();

  return newMemory;
};

export const getImportance = async (content) => {
  const body = {
    messages: [
      {
        role: "user",
        content: `You will be given a script describing an agent, or environmental observations. You will assess the importance on the scale of 1 to 10, where 1 is purely mundane
  (e.g., brushing teeth, making bed) and 10 is
  extremely poignant (e.g., a breakup, college
  acceptance). Rate the likely poignancy of that memory.`,
      },
      {
        role: "user",
        content:
          "You have the following memory: " +
          content +
          " Only return the number, nothing else. Your answer will be a number between 1 and 10.",
      },
    ],
    selectedModel: DEFAULT_CHEAP_MODEL,
  };

  // Timeout helper
  const timeout = (ms) =>
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Request timed out after 5 seconds")),
        ms
      )
    );

  try {
    const response = await Promise.race([
      llmController.getChatCompletion({ body }),
      timeout(5000),
    ]);
    return response.content;
  } catch (error) {
    console.error("Error fetching importance:", error.message);
    return 5;
  }
};

/**
 * Summarizes a given text and returns an object with the summary and importance.
 * The importance is on a scale of 1 to 10, where 1 is purely mundane and 10 is extremely poignant.
 * @param {string} text The text to summarize and rate.
 * @returns {Promise<{content: string, importance: number}>}
 */
export const summarizeThoughtsAndGetImportance = async (text) => {
  try {
    const response = await llmController.getChatCompletion({
      body: {
        messages: [
          {
            role: "user",
            content: `you will be given a thought/ a piece of conversation, you task is to summarize it pricesly. And you will access the importance on the scale of 1 to 10, where 1 is purely mundane (e.g., brushing teeth, making bed) and 10 is extremely poignant (e.g., a break up, college acceptance), rate the likely poignancy of that memory.`,
          },
          {
            role: "user",
            content: `the JSON format of a Single Memory is as follow 
      { 
      "content":String,
      "importance:Number,
      }
              , your response should be a single memory in JSON format. `,
          },
          {
            role: "user",
            content: "this is the information provided: " + text,
          },
        ],
        selectedModel: DEFAULT_CHAT_MODEL,
        response_format: {
          type: "json_object",
        },
      },
    });
    const parsedResponse = JSON.parse(response.content);
    return {
      content: parsedResponse.content,
      importance: parsedResponse.importance,
    };
  } catch (error) {
    console.error(error);
    return { content: "Error summarizing text", importance: 0 };
  }
};


export const summarizeObservationAndGetImportance = async (content) => {
  try {
    const response = await llmController.getChatCompletion({
      body: {
        messages: [
          {
            role: "user",
            content: `describe the environment around the character (e.g. Anson saw Peter Approaching, Anson saw Eddy leaving or Anson saw the oven buning). describe all the people you can see, and dont add any additional details or emotions which are not provided.
             dont add any additional details or emotions which are not provided. 
            And you will access the importance on the scale of 1 to 10, where 1 is purely mundane
            (e.g., brushing teeth, making bed) and 10 is
            extremely poignant (e.g., a break up, college
      acceptance), rate the likely poignancy of that memory.`,
          },
          {
            role: "user",
            content: `the JSON format of a Single Memory is as follow 
      { 
      "content":String,
      "importance:Number,
      }
              , your response should be a single memory in JSON format. `,
          },
          {
            role: "user",
            content: "this is the information provided: " + content,
          },
        ],
        selectedModel: DEFAULT_CHAT_MODEL,
        response_format: {
          type: "json_object",
        },
      },
    });
    const parsedResponse = JSON.parse(response.content);
    return parsedResponse;
  } catch (error) {
    console.error(error);
    return "Error summarizing text";
  }
};

export const deleteMemory = async (memoryId) => {
  try {
    await Memory.deleteOne({ _id: memoryId });
    return "Memory deleted";
  } catch (error) {
    console.error(error);
    return "Error deleting memory";
  }
};

export const removeAllMemoriesForAgent = async (agentId) => {
  try {
    await Memory.deleteMany({ relatedAgentId: agentId });
    return "All memories for agent " + agentId + " have been removed";
  } catch (error) {
    console.error(error);
  }
};

export const generateEmbedding = async (text) => {
  try {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });
    return embedding.data[0].embedding;
  } catch (error) {
    console.error(error);
    return null;
  }
};
