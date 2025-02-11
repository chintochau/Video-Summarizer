import llmController from "../../controllers/llmController.js";
import { Agent } from "../ai-sims-models/agentModel.js";
import {  saveAsMemory } from "./memoryLogic.js";
import { getAgentObservation } from "./gridWorldLogic.js";

export const progressAnAgent = async (agentId) => {
  // update agent location
  // update agent current action
  // update agent current goal
  // update agent triats

  const agent = await Agent.findById(agentId);
  if (!agent) {
    throw new Error("Agent not found");
  }

  const observation = await getAgentObservation(agent);

  const response = await saveAsMemory(agentId, observation, "observation");
  console.log(response);
  
  return response;
};
