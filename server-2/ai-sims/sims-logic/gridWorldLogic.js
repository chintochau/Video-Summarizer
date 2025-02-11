import llmController from "../../controllers/llmController.js";
import { Agent } from "../ai-sims-models/agentModel.js";
import { Memory } from "../ai-sims-models/memoryModel.js";
import { World } from "../ai-sims-models/worldModel.js";
import { DEFAULT_WORLD_SIZE } from "../constants.js";
export async function getAgentObservation(agent) {
  const { location, name: agentName } = agent || {};
  const { x: agentX, y: agentY } = location;
  const observationRadius = 5; // 10x10 grid (5 in each direction)

  const worldObject = await World.findOne({});
  if (!worldObject) {
    throw new Error("World not found");
  }

  // Find all agents (no geo-indexing used)
  const agents = await Agent.find({});

  // Filter agents based on simple x, y range (x within ±5 and y within ±5)
  const agentsNearby = agents.filter((otherAgent) => {
    // Don't consider the agent itself (or you could exclude based on agent ID)
    if (otherAgent._id.toString() === agent._id.toString()) return false;

    const isWithinX =
      otherAgent.location.x >= agent.location.x - observationRadius &&
      otherAgent.location.x <= agent.location.x + observationRadius;

    const isWithinY =
      otherAgent.location.y >= agent.location.y - observationRadius &&
      otherAgent.location.y <= agent.location.y + observationRadius;

    return isWithinX && isWithinY;
  });

  const world = worldObject.grid;
  let observation = "";

  // Calculate bounds
  const minX = Math.max(0, agentX - observationRadius);
  const maxX = Math.min(world.length - 1, agentX + observationRadius);
  const minY = Math.max(0, agentY - observationRadius);
  const maxY = Math.min(world[0].length - 1, agentY + observationRadius);

  // Helper function to check line of sight using Bresenham's algorithm
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
      // Check if current cell (excluding target) is a wall
      if (x0 !== x1 || y0 !== y1) {
        const row = world[x0];
        if (!row) return false; // Out of bounds
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

  // Iterate through each cell in the observation area
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      // Check if cell is within world bounds
      if (x < 0 || x >= world.length || y < 0 || y >= world[x].length) {
        continue;
      }
      const cell = world[x][y];
      let description = `[${x},${y}: `;

      // Check line of sight
      if (!isVisible(x, y)) {
        continue;
      }

      description += x === agentX && y === agentY ? `(You are here)` : "";

      if (cell.type === "wall") {
        description += `Wall${
          cell.buildingType ? `(${cell.buildingType})` : ""
        }`;
      } else {
        description += cell.buildingType
          ? `${cell.type} (${cell.buildingType})`
          : cell.type !== "grass"
          ? cell.type
          : "";
        if (cell.object) {
          description += JSON.stringify(cell.object);
        }
      }
      observation += description + "], ";
    }
    observation += "\n";
  }

  // Include agents nearby in the observation
  if (agentsNearby.length > 0) {
    observation += "\nNearby People:\n";
    agentsNearby
      .filter((otherAgent) => otherAgent.name !== agentName)
      .forEach(({ name, location }) => {
        observation += `- ${name} at (${location.x}, ${location.y})\n`;
      });
  }

  return observation;
}
