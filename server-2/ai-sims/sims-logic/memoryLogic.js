import { openai } from "../../config/summaryConfig.js";
import { Memory } from "../ai-sims-models/memoryModel.js";

export const saveAsMemory = async (agentId, text, type) => {
  const newMemory = new Memory({
    content: text,
    importance: 5,
    type: type || "observation",
    relatedAgentId: agentId,
    embedding: [],
  });
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  newMemory.relatedAgentId = agentId;
  newMemory.type = "observation";
  newMemory.embedding = embedding.data[0].embedding;
  await newMemory.save();
};
