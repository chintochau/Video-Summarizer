import { Agent } from "../ai-sims-models/agent.js";
import { World } from "../ai-sims-models/world.js";


export const showAiSimsStatus = async (req, res) => {
  try {
    const world = await World.findOne({});
    const agents = await Agent.find({});
    res.json({ world, agents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const initializeSimsWorld = async (req, res) => {
  try {
    // Initialize the world
    let world = await World.findOne({});
    if (!world) {
      world = new World();
      await world.save();
    }
    // Create some sample agents
    const agent1 = new Agent({
      name: "john",
      location: { x: 100, y: 100 },
      memory: {
        schedule: "Default schedule",
        personality: "Friendly",
        pastObservations: ["Initial observation"],
        reflections: [],
      },
      currentAction: "idle",
      goal: "Explore",
      state: "idle",
    });

    const agent2 = new Agent({
      name: "peter",
      location: { x: 200, y: 200 },
      memory: {
        schedule: "Default schedule",
        personality: "Shy",
        pastObservations: ["Initial observation"],
        reflections: [],
      },
      currentAction: "idle",
      goal: "Wander",
      state: "idle",
    });

    await agent1.save();
    await agent2.save();

    res.status(201).json({ message: "World and Agents initialized" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
