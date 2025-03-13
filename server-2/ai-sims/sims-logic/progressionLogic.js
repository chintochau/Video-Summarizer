import llmController from "../../controllers/llmController.js";
import { Agent } from "../ai-sims-models/agentModel.js";
import {
  getImportance,
  saveAsMemory,
  summarizeObservationAndGetImportance,
  recallMemories,
} from "./memoryLogic.js";
import { callTool, getAgentObservationGrid } from "./gameWorldLogic.js";
import { Memory } from "../ai-sims-models/memoryModel.js";
import dayjs from "dayjs";
import { DEFAULT_CHAT_MODEL, TOWN_LAYOUT } from "../worldConfig.js";
import { agentActions, movingActions } from "./llmTools.js";
import { World } from "../ai-sims-models/worldModel.js";

export const progressAnAgent = async (agentId) => {
  console.log("progressing an agent", agentId);

  /**
   * Progress an agent
   *
   * @param {string} agentId
   * @returns {Promise<void>}
   */
  // 1. Find the agent
  // 2. Find the agent's plan for today, otherwise come up with a plan based on previous (mostly from yesterday) plan and traits
  // 3. Obtain an observation of the environment, and add it to memories
  // 4. Ask if they should react to the observation, attached context from memories to help form decision
  // 5. create a memory of their reaction
  // 6. continue the plan
  // 7. Ask where should the agent go to execute the plan
  // 8. Execute the plan (go to the place specified), prefer to stay in the same place if they can
  // 9. Update the agent's location, current action and current goal

  // STEP 1: Find the agent
  const agent = await Agent.findById(agentId);
  if (!agent) {
    throw new Error("Agent not found");
  }

  // STEP 2: Find the agent's plan for today, otherwise come up with a plan based on previous (mostly from yesterday) plan and traits
  let todaysPlan = null;
  const startOfToday = dayjs().startOf("day").toDate();
  const endOfToday = dayjs().endOf("day").toDate();
  todaysPlan = await Memory.findOne(
    {
      type: "plan",
      relatedAgentId: agentId,
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    },
    { embedding: 0 }
  );

  if (!todaysPlan) {
    todaysPlan = await comeUpWithTodayPlan(agent);
    await saveAsMemory(agentId, todaysPlan, "plan");
  }

  // STEP 3: Obtain an observation of the environment, and add it to memories
  const { observation, importance } = await getObservationFromLLM(agent);

  // STEP 4: Ask if they should react to the observation, attached context from memories to help form decision
  const reaction = await reactToObservation(agent, observation);
  console.log(`${agent.name}'s reaction: ${reaction.content}`);

  // STEP 5: Create a memory of their reaction
  const memory = await saveAsMemory(
    agentId,
    `${observation}\n ${reaction.content}`,
    "observation",
    importance || 1
  );

  // STEP 6: continue the plan
  const place = findPlaceToGo(agent, todaysPlan);

  // STEP 7: Ask where should the agent go to execute the plan
  // STEP 8: Execute the plan (go to the place specified), prefer to stay in the same place if they can
  // STEP 9: Update the agent's location, current action and current goal
  return { reaction: reaction + "going to place: " + place };
};

const comeUpWithTodayPlan = async (agent) => {
  const recentReflextions = await Memory.find({
    relatedAgentId: agent.agentId,
    type: "reflection",
  })
    .sort({ recentAccessTimestamp: -1 })
    .limit(5);

  const recentPlans = await Memory.find({
    relatedAgentId: agent.agentId,
    type: "plan",
  })
    .sort({ recentAccessTimestamp: -1 })
    .limit(5);

  const description = `
  Name: ${agent.name}
  Traits: ${agent.traits}
  ${agent.initialMemory}
  ${recentReflextions.map((reflection) => reflection.content).join("\n")}
  ${recentPlans.map((plan) => plan.content).join("\n")}
  today is ${dayjs().format("dddd, DD/MM/YYYY")}, here is ${
    agent.name
  }'s plan for today in broad strokes:
  1. 
  `;

  const body = {
    messages: [
      {
        role: "user",
        content: description,
      },
    ],
    selectedModel: DEFAULT_CHAT_MODEL,
  };

  const broadPlan = await llmController.getChatCompletion({
    body: body,
  });

  // decomposes the plan to create finer-grained actions into a 15-minute schedule:

  const body2 = {
    messages: [
      {
        role: "user",
        content: `
        Name: ${agent.name}
        Traits: ${agent.traits}
        ${broadPlan.content}
       decomposes the plan to create finer-grained actions into a 15  to 30 mins schedule:
       1.
       2.`,
      },
    ],
    selectedModel: DEFAULT_CHAT_MODEL,
  };

  const fineGrainedPlan = await llmController.getChatCompletion({
    body: body2,
  });

  return `Plan for ${dayjs().format("dddd, DD/MM/YYYY")}: ${
    fineGrainedPlan.content
  }`;
};

export const getObservationFromLLM = async (agent) => {
  const { observation: observationGrid, agentsNearby } =
    await getAgentObservationGrid(agent);
  const memoryWithImportance = await summarizeObservationAndGetImportance(
    observationGrid
  );

  return {
    observation: memoryWithImportance.content,
    observationGrid,
    importance: memoryWithImportance.importance,
  };
};

const reactToObservation = async (agent, observation) => {
  //TODO: implement reaction to observation
  const { agentId } = agent;
  const relatedMemories = await recallMemories(agentId, observation, false);
  const relatedMemoriesInArray = relatedMemories.map(
    (m) => `${dayjs(m.createdAt).fromNow()} : ${m.content}`
  );

  let messages = [
    {
      role: "user",
      content: `[Agent’s Summary Description] 
      It is ${dayjs().format("YYYY-MM-DD HH:mm:ss")} 
      ------------
      Relevant context from ${agent.name}'s memory (happened already):
      ${relatedMemoriesInArray}
      
      ------------
      ${agent.name}'s currentStatus: ${agent.currentStatus} 
      Current Observation: ${observation}
      Traits: ${agent.traits}
       Should ${
         agent.name
       } react to the current observation, and if so, what would be an appropriate reaction? control the agent using the tools provided. 
       your response should be already summarized (e.g. Peter saw Eddy approaching, Said Hi to Eddy).`,
    },
  ];

  console.log(
    "reacting to observation:",
    messages.map((m) => m.content)
  );
  const payload = {
    body: {
      messages,
      selectedModel: DEFAULT_CHAT_MODEL,
      tools: agentActions,
    },
  };

  const response = await llmController.getChatCompletion(payload);
  messages.push(response);

  // execute the tool_calls to control the agent, based on the response

  if (response.tool_calls) {
    const toolResponses = await Promise.allSettled(
      response.tool_calls.map(async (tool_call) => {
        try {
          // Safely parse JSON arguments
          const args = JSON.parse(tool_call.function.arguments);
          const toolName = tool_call.function.name;

          // Call the tool function
          const toolResponse = await callTool(
            toolName,
            args,
            agentId,
            messages
          );

          // Return structured message for later use
          return {
            status: "success",
            message: {
              role: "tool",
              tool_call_id: tool_call.id,
              content: toolResponse,
            },
          };
        } catch (error) {
          console.error(
            `Error processing tool call (${tool_call.function.name}):`,
            error
          );

          return {
            status: "error",
            message: {
              role: "tool",
              tool_call_id: tool_call.id,
              content: `Error processing request: ${error.message}`,
            },
          };
        }
      })
    );

    // Extract successful responses and append them to messages
    const successfulMessages = toolResponses
      .filter(
        (result) =>
          result.status === "fulfilled" && result.value.status === "success"
      )
      .map((result) => result.value.message);
    messages.push(...successfulMessages);
  }

  const completion = await llmController.getChatCompletion({
    body: {
      messages,
      selectedModel: DEFAULT_CHAT_MODEL,
    },
  });
  return completion;
};

export const findPlaceToGo = async (agent) => {
  const { name, location, currentStatus } = agent || {};
  const { x, y } = location || {};
  const map = await World.findOne({});

  const mapGrid = map.grid;
  const currentPlace = mapGrid[y][x];

  const { building: currentBuilding, room: currentRoom } = currentPlace || {};

  const buildings = TOWN_LAYOUT.buildings.map((building) => ({
    name: building.name,
    rooms: building.rooms,
  }));

  const knownBuildings = buildings.map((building) => building.name);

  const currentBuildingLayout = buildings.find(
    (building) => building.name === currentBuilding
  );

  const prompt = `
  [Agent’s Summary Description] 
  ${name} is currently in ${currentRoom || "-"} at ${
    currentBuilding || "Outdoor area"
  } that has ${currentBuildingLayout?.rooms?.join(
    ", "
  )}. ${name} knows of the following areas: ${JSON.stringify(buildings)}. 
  * Prefer to stay in the current area if the activity can be done there. 
  
  ${name} is ${currentStatus}. Which area should ${name} go to? use tool`;

  const movingPayload = {
    body: {
      selectedModel: DEFAULT_CHAT_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      tools: movingActions,
    },
  };

  const response = await llmController.getChatCompletion(movingPayload);


  console.log(response);
  

  return "TODO"
};
