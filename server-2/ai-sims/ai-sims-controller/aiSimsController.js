import { Agent } from "../ai-sims-models/agentModel.js";
import { World } from "../ai-sims-models/worldModel.js";
import {
  DEFAULT_CHAT_MODEL,
  DEFAULT_WORLD_SIZE,
  defaultAgents,
} from "../constants.js";
import llmController from "../../controllers/llmController.js";
import { getAgentObservation } from "../sims-logic/gridWorldLogic.js";
import { Memory } from "../ai-sims-models/memoryModel.js";
import { openai } from "../../config/summaryConfig.js";
import {
  generateTown,
  initializeAgentMomories,
} from "./initializeHelper.js";
import { progressAnAgent } from "../sims-logic/progressionLogic.js";

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

export const getDataForAgent = async (req, res) => {
  const { params } = req;
  const { agentId, data } = params;

  if (data === "progress") {
    try{
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

      const { x, y } = agent.location;

      const observations = await getAgentObservation(agent);
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
    // 1. Advance the simulation time

    // 2. Get all agents from database
    const agents = await Agent.find();

    // 3. Loop through each agent
    for (const agent of agents) {
      // 4. Observe the environment (within a 10 grid radius)
      const observations = getAgentObservation(agent
      );

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
      const { action, target, message } = llmResponse;

      // 7. Validate and execute the action
      if (action === "move") {
        await moveAgent(agent, target.x, target.y);
      } else if (action === "talk") {
        await handleTalkAction(agent, target.agentId, message);
      } else if (action === "interact") {
        await handleInteractAction(agent, target.objectId);
      } else {
        // Handle invalid actions
        console.log("invalid action received from LLM");
      }

      // 8. Update agent state in the database
      await agent.save();

      //9. update the world state
      updateWorldState();
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

export const updateAgentInformation = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { location } = req.body;
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }
    agent.location = location;
    await agent.save();
    res.status(200).json({ message: "Agent information updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};