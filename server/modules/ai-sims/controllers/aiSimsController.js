import { Agent } from "../models/agentModel.js";
import { World } from "../models/worldModel.js";
import {
  DEFAULT_CHAT_MODEL,
  DEFAULT_WORLD_SIZE,
  defaultAgents,
} from "../configs/worldConfig.js";
import  llmController  from "../../shared/controllers/llmController.js";
import {
  getAgentObservationGrid,

} from "../sims-logic/gameWorldLogic.js";
import { Memory } from "../models/memoryModel.js";
import { generateTown, initializeAgentMomories } from "./initializeHelper.js";
import { progressAnAgent } from "../sims-logic/progressionLogic.js";
import {
  deleteMemory,
  recallMemories,
  removeAllMemoriesForAgent,
} from "../sims-logic/memoryLogic.js";
import { openai } from "../../../config/summaryConfig.js";

export const moveObject = async (req, res) => {
  const { oldPosition, newPosition } = req.body;

  try {
    const world = await World.findOne({});

    // Validate grid boundaries
    if (
      !world?.grid?.[oldPosition.x]?.[oldPosition.y] ||
      !world?.grid?.[newPosition.x]?.[newPosition.y]
    ) {
      return res.status(400).json({ error: "Invalid grid positions" });
    }

    const objectToMove = world.grid[oldPosition.x][oldPosition.y].object;

    // Ensure there's an object to move
    if (!objectToMove) {
      return res
        .status(400)
        .json({ error: "No object to move at the old position" });
    }

    // Update the grid
    world.grid[oldPosition.x][oldPosition.y].object = null;
    world.grid[newPosition.x][newPosition.y].object = objectToMove;

    // Mark the grid as modified for Mongoose
    world.markModified("grid");

    // Save the updated world
    await world.save();

    const updatedWorld = await World.findOne({});
    res.json(updatedWorld);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const modifyMemory = async (req, res) => {
  const { memoryId } = req.params;
  const { newContent, type } = req.body;


  try {
    switch (type) {
      case "delete":
        await deleteMemory(memoryId);
        res.json("Memory deleted");
        break;
      case "edit":
        const updatedMemory = await Memory.findByIdAndUpdate(memoryId, { content: newContent });
        res.json(updatedMemory);
        break;
      default:
        break;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const showAiSimsStatus = async (req, res) => {
  // path: /data
  // path: /data/world
  // path: /data/agents

  if (req.path === "/data/world") {
    try {
      const world = await World.findOne({});
      res.json(world);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  if (req.path === "/data/agents") {
    try {
      const agents = await Agent.find({});
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  try {
    const world = await World.findOne({});
    const agents = await Agent.find({});
    res.json({
      world,
      agents,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrControlAgent = async (req, res) => {
  const { params } = req;
  const { agentId, data } = params;

  if (data === "removeAllMemories") {
    try {
      const memories = await removeAllMemoriesForAgent(agentId);
      res.json(memories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
    return;
  }

  if (data === "progress") {
    try {
      const response = await progressAnAgent(agentId);
      res.json(response);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  if (data === "memory") {
    try {
      // hide the field embedding
      const memories = await Memory.find({ relatedAgentId: agentId }).select(
        "-embedding"
      );
      res.json(memories);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  if (data === "observe") {
    try {
      const agent = await Agent.findById(agentId);
      if (!agent) {
        return [];
      }
      const observations = await getAgentObservationGrid(agent);
      res.json(observations);
    } catch (error) {
      console.error(error);
      return [];
    }
  }
};

export const initializeSimsWorld = async (req, res) => {
  try {
    // Initialize the world
    let world = await World.findOne({});
    world.grid = generateTown();
    await world.save();

    if (!world) {
      world = new World();
      world.grid = generateTown();
      await world.save();
    }

    return res.status(201).json({ message: "World initialized" });

    defaultAgents.forEach(async (defaultData) => {
      const newAgent = new Agent(defaultData);
      newAgent.agentId = newAgent._id;
      const savedAgent = await newAgent.save();
      const initialMemories = await initializeAgentMomories(
        savedAgent,
        defaultData.initialMemory
      );

      if (defaultData.schedule) {
        const defaultPlan = new Memory({
          content: defaultData.schedule,
          importance: 1,
          type: "plan",
          relatedAgentId: savedAgent.agentId,
        });

        await defaultPlan.save();
      }

      initialMemories.forEach(async (memory) => {
        const newMemory = new Memory(memory);
        const embedding = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: memory.content,
          encoding_format: "float",
        });

        newMemory.relatedAgentId = savedAgent.agentId;
        newMemory.type = "reflection";
        newMemory.embedding = embedding.data[0].embedding;
        await newMemory.save();
      });
    });

    res.status(201).json({ message: "World and Agents initialized" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: error.message });
  }
};

export const updateSimulation = async () => {
  try {
    //TODO: implement

    // 1. Advance the simulation time

    // 2. Get all agents from database
    const agents = await Agent.find();

    // 3. Loop through each agent
    for (const agent of agents) {
      // 4. Observe the environment (within a 10 grid radius)
      const observations = getAgentObservationGrid(agent);

      // 5. Prepare data for LLM prompt
      const llmInput = {
        agentState: agent,
        memory: await Memory.find({ relatedAgentId: agent.agentId }).sort({
          timestamp: -1,
        }),
        observations: observations,
        conversationHistory: agent.conversation_history,
      };

      // 6. Call the LLM API and get the json response
      const llmResponse = await llmController.getChatCompletion({
        body: {
          messages: [
            {
              role: "user",
              content: JSON.stringify(llmInput),
            },
          ],
          selectedModel: DEFAULT_CHAT_MODEL,
          response_format: {
            type: "json_object",
          },
        },
      });
    }

    // 10. Send updates to the frontend via websockets
    sendUpdatesToFrontend();
  } catch (error) {
    console.error("Error updating simulation", error);
  }
};

export const resetAgentsLocation = async (req, res) => {
  // find all agents, update their location
  try {
    const agents = await Agent.find({});
    for (const agent of agents) {
      agent.location = {
        x: Math.floor(Math.random() * DEFAULT_WORLD_SIZE),
        y: Math.floor(Math.random() * DEFAULT_WORLD_SIZE),
      };
      await agent.save();
    }
    res.status(200).json({ message: "Agents location reset" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Updates an agent's information.
 *
 * @param {Object} req - The HTTP request
 * @param {Object} res - The HTTP response
 *
 * @prop {string} agentId - The ID of the agent to update
 * @prop {Object} [location] - The new location of the agent
 * @prop {string} [currentStatus] - The new current action of the agent
 * @prop {string} [currentGoal] - The new current goal of the agent
 *
 * @returns {Promise<void>}
 */
export const updateAgentInformation = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { location, currentStatus, currentGoal } = req.body; // Add other fields as needed
    const agent = await Agent.findById(agentId);

    if (!agent) {
      if (!res) return "Agent not found";
      return res.status(404).json({ error: "Agent not found" });
    }

    // Update fields only if they are provided in the request
    if (location !== undefined && location !== null) {
      agent.location = location;
    }
    if (currentStatus !== undefined) {
      agent.currentStatus = currentStatus;
    }
    if (currentGoal !== undefined) {
      agent.currentGoal = currentGoal;
    }

    await agent.save();
    if (!res) {
      return `${agent.name} is now ${agent.currentStatus}`;
    }
    res.status(200).json({ message: "Agent information updated", agent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const askQuestion = async (req, res) => {
  const { agentId } = req.params;
  const { question } = req.body;

  try {
    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const memories = await recallMemories(agentId, question);
    if (!memories) {
      return res
        .status(404)
        .json({ error: "No memories found for the question" });
    }

    const payload = {
      body: {
        messages: [
          {
            role: "user",
            content: `You are ${agent.name},
            traits: ${agent.traits},
            location: ${agent.location},
            answer the question based on the memories provided below. use first person perspective when answering the question. here are the memories found for the question: ${question} \n ${JSON.stringify(
              memories
            )}`,
          },
        ],
        selectedModel: DEFAULT_CHAT_MODEL,
      },
    };

    const llmResponse = await llmController.getChatCompletion(payload);

    res.status(200).json({
      message: "Question answered",
      question,
      memories,
      llmResponse: llmResponse.content,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
