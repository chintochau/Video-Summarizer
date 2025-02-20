import mongoose from "mongoose";
import { updateAgentInformation } from "../ai-sims-controller/aiSimsController.js";
import { Agent } from "../ai-sims-models/agentModel.js";
import { Memory } from "../ai-sims-models/memoryModel.js";
import { World } from "../ai-sims-models/worldModel.js";
import { generateEmbedding, recallMemories } from "./memoryLogic.js";
import llmController from "../../controllers/llmController.js";
import { DEFAULT_CHAT_MODEL } from "../constants.js";
import { getObservationFromLLM } from "./progressionLogic.js";
import dayjs from "dayjs";
import { conversationalActions } from "./llmTools.js";

export async function getAgentObservationGrid(agent) {
  const { location, name: agentName } = agent || {};
  const { x: agentX, y: agentY } = location;
  const observationRadius = 5; // 10x10 grid (5 in each direction)

  const worldObject = await World.findOne({});
  if (!worldObject) {
    throw new Error("World not found");
  }

  const agents = await Agent.find({});

  // Filter agents within observation range
  const agentsNearby = agents.filter((otherAgent) => {
    if (otherAgent._id.toString() === agent._id.toString()) return false;

    return (
      otherAgent.location.x >= agentX - observationRadius &&
      otherAgent.location.x <= agentX + observationRadius &&
      otherAgent.location.y >= agentY - observationRadius &&
      otherAgent.location.y <= agentY + observationRadius
    );
  });

  const world = worldObject.grid;
  const minX = Math.max(0, agentX - observationRadius);
  const maxX = Math.min(world.length - 1, agentX + observationRadius);
  const minY = Math.max(0, agentY - observationRadius);
  const maxY = Math.min(world[0].length - 1, agentY + observationRadius);

  const isVisible = (targetX, targetY) => {
    let x0 = agentX;
    let y0 = agentY;
    const x1 = targetX;
    const y1 = targetY;
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      if (x0 !== x1 || y0 !== y1) {
        const row = world[x0];
        if (!row) return false;
        const cell = row[y0];
        if ((cell && cell.type === "wall") || cell.type === "tree") {
          return false;
        }
      }

      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
    return true;
  };

  const xCoords = [];
  for (let x = minX; x <= maxX; x++) xCoords.push(x);
  const header = `Here is the 2D grid map for ${agentName}, with x,y coordinates:\n // ${xCoords.join(
    ","
  )}`;

  const gridRows = [];
  const legendEntries = new Set();
  const agentPositions = new Set();

  agentsNearby.forEach(({ location: { x, y } }) => {
    agentPositions.add(`${x},${y}`);
  });

  let currentLocation = `${agentName} is currently at: `;

  for (let y = minY; y <= maxY; y++) {
    let rowStr = `${y}`.padStart(2) + " ";
    for (let x = minX; x <= maxX; x++) {
      let cellSymbol = " "; // Default to blank space for non-visible cells

      if (x === agentX && y === agentY) {
        cellSymbol = "X"; // Current agent position
        const cell = world[x][y];
        currentLocation += cell.building + ":" + cell.room + " ";
      } else if (isVisible(x, y)) {
        if (agentPositions.has(`${x},${y}`)) {
          cellSymbol = "A"; // Other agents
        } else {
          const cell = world[x][y];
          if (cell.object) {
            const symbol = cell.object.type[0].toLowerCase();
            legendEntries.add(`${symbol} - ${cell.object.type}`);
            cellSymbol = symbol;
          } else if (cell.type === "wall") {
            cellSymbol = "w";
          } else if (cell.type === "tree") {
            cellSymbol = "t";
          }
        }
      }

      rowStr += `[${cellSymbol}]`;
    }
    gridRows.push(rowStr);
  }

  let legend = "Legend:\n";
  legend += currentLocation + "\n";
  legend += `X - You (${agentName})\n`;
  legend += "A - Other Agents\n";
  legendEntries.forEach((entry) => (legend += `${entry}\n`));
  legend += "w - Wall\n";
  legend += "t - Tree\n";

  let observation = `${header}\n${gridRows.join("\n")}\n\n${legend}`;

  if (agentsNearby.length > 0) {
    observation += "\nNearby People:\n";
    agentsNearby
      .filter((otherAgent) => otherAgent.name !== agentName)
      .forEach(({ name, location, currentStatus }) => {
        observation += `- ${name} at (${location.x}, ${location.y}), ${currentStatus}\n`;
      });
  }

  return { observation, agentsNearby };
}



export const callTool = async (name, args, agentId, messages) => {
  const { x, y, status, agentName, text } = args;
  switch (name) {
    case "move_to":
      const movingPayload = {
        body: {
          location: { x, y },
        },
        params: { agentId },
      };
      const movingResponse = await updateAgentInformation(movingPayload);
      return movingResponse;
    case "talk_to":
      const conversationResponse = await engageConversation(
        { ...args, agentId },
        messages
      );
      return conversationResponse;
    case "self_reflect":
      const selfReflectionPayload = {
        body: {
          currentStatus: status,
        },
        params: { agentId },
      };
      const selfReflectResponse = await updateAgentInformation(
        selfReflectionPayload
      );
      return selfReflectResponse;
    case "change_agent_current_status":
      const statusPayload = {
        body: {
          currentStatus: status,
        },
        params: { agentId },
      };
      const statusResponse = await updateAgentInformation(statusPayload);
      return statusResponse;
    case "not_react_to_observation":
      return "Not react to observation, continue the current action/ plan.";
    default:
      return "action not implemented yet, you should pretend it is done successfully at this point for testing purposes.";
  }
};

export const engageConversation = async (args, messages) => {
  const { agentId, targetAgentName, text, tone } = args;
  const conversationHistory = [];

  // Initialize agents
  const targetAgent = await Agent.findOne({ name: targetAgentName });
  const originalAgent = await Agent.findOne({ agentId });
  if (!targetAgent || !originalAgent) {
    throw new Error("Agent not found");
  }

  let currentSpeaker = targetAgent.agentId;
  let isConversationActive = true;
  console.log(
    `[CONVERSATION] Starting conversation between ${originalAgent.name} and ${targetAgentName}`
  );
  // Initial message handling
  let currentMessage = {
    content: text,
    tone: tone,
    from: agentId,
    to: targetAgentName,
    timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  };
  conversationHistory.push(currentMessage);
  console.log(
    `[INITIAL] ${originalAgent.name} says: "${text}" (tone: ${tone})`
  );

  const { observation: targetAgentObservation } = await getObservationFromLLM(
    targetAgent
  );


  const targetAgentMemories = await recallMemories(
    targetAgent.agentId,
    `${originalAgent.name} said: "${text}" (tone: ${tone})`
  );
  const targetAgentMemoriesInArray = targetAgentMemories.map(
    (m) => m.content + "\n"
  );

  let originalAgentInitialMessages = [messages[0]]; // it is an array of llm message that have enough context for the conversation for the original agent, afterall the original agent has already said this
  let targetAgentInitialMessages = [
    {
      role: "user",
      content: `[Agent Context] 
      it is ${dayjs().format("YYYY-MM-DD HH:mm:ss")}
      ${targetAgentName}'s currentStatus: ${targetAgent.currentStatus}
      Observation:${targetAgentObservation}
      Summary of relevant context from ${targetAgentName}'s memory: ${targetAgentMemoriesInArray}
      ${originalAgent.name} said: "${text}" (tone: ${tone})
      Should ${targetAgentName} react to the observation, and if so, what would be an appropriate reaction? control the agent using the tools
      `,
    },
  ]; // it is an array needed to be contructed for the target agent to receive enough context


  console.log("Target agent initial messages", targetAgentInitialMessages);
  

  // Conversation loop
  let round = 0;
  while (isConversationActive) {
    console.log(`Round ${round}`);
    round += 1;
    // wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      // Determine current participants
      const [activeAgent, recipient] =
        currentSpeaker === agentId
          ? [originalAgent, targetAgent]
          : [targetAgent, originalAgent];

      // Prepare the payload for the LLM by combining initial context and formatted conversation history
      const formattedMessages = [
        // Start with the active agent's initial context (original or target)
        ...(currentSpeaker === agentId
          ? originalAgentInitialMessages
          : targetAgentInitialMessages),
        // Add conversation history after the initial message, formatted into roles
        ...conversationHistory
          .slice(1) // Skip initial message already handled in initial context
          .map((msg) => ({
            role: msg.from === activeAgent.name ? "assistant" : "user",
            content: msg.content,
          })),
      ];

      console.log("current active agent", activeAgent.name);
      console.log("recipient", recipient.name);
      console.log(
        "On Going Messages",
        formattedMessages.map((m) => `${m.role}: ${m.content}`)
      );

      // Get agent response with tool handling
      const response = await llmController.getChatCompletion({
        body: {
          messages: formattedMessages,
          selectedModel: DEFAULT_CHAT_MODEL,
          tools: conversationalActions,
        },
      });
      // Handle tool calls
      const toolCalls = response.tool_calls || [];
      if (toolCalls.length > 0) {
        for (const toolCall of toolCalls) {
          const toolName = toolCall.function.name;
          console.log(`[TOOL] ${activeAgent.name} called tool: ${toolName}`);

          if (toolName === "end_conversation") {
            console.log(`[END] ${activeAgent.name} ended conversation`);
            isConversationActive = false;
            break;
          }

          if (toolName === "reply") {
            const parsedArgs = JSON.parse(toolCall.function.arguments);
            currentMessage = {
              role: "user",
              content: `${activeAgent.name} said: "${parsedArgs.text}" (tone: ${parsedArgs.tone})`,
              // role: "tool",
              // tool_call_id: toolCall.id,
              // content: `${activeAgent.name} said: "${parsedArgs.text}" (tone: ${parsedArgs.tone})`,
            };

            targetAgentInitialMessages.push(currentMessage);
            originalAgentInitialMessages.push(currentMessage);
            conversationHistory.push({
              from: activeAgent.name,
              to: targetAgent.name,
              tone: parsedArgs.tone,
              content: parsedArgs.text,
              timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            });

            console.log(
              `[REPLY] ${activeAgent.name} says: "${parsedArgs.text}" (tone: ${parsedArgs.tone})`
            );
            currentSpeaker =
              currentSpeaker === agentId ? targetAgent.agentId : agentId;
          }
        }
      } else {
        console.warn(
          `[WARNING] No tools called by ${activeAgent.name}, ending conversation`
        );
        isConversationActive = false;
      }

      // Safety check to prevent infinite loops
      if (conversationHistory.length > 10) {
        console.warn("[SAFETY] Maximum conversation length reached");
        isConversationActive = false;
      }
    } catch (error) {
      console.error("[ERROR] Conversation error:", error);
      isConversationActive = false;
    }
  }

  console.log("[CONCLUSION] Final conversation history:", conversationHistory);
  return formatConversation(conversationHistory);
};

// Helper function to format final output
const formatConversation = (history) => {
  return history
    .map(
      (msg) =>
        `${msg.timestamp} [${msg.from} → ${msg.to}] (${msg.tone}): ${msg.content}`
    )
    .join("\n");
};
