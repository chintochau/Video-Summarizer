import { Agent } from "./ai-sims-models/agent.js";
import { World } from "./ai-sims-models/world.js";
import aiSimsRoutes from "./ai-sims-routing/aiSimsRoutes.js";
import cors from "cors";

export const aiSimsMain = (app) => {
  app.use("/sims", cors(), aiSimsRoutes);

  // **2. Implement 15-Minute Simulation Logic**
  // *   The `setInterval` function will run a simulation step every 15 minutes, updating the world and agents states.


//   setInterval(updateSimulation, 3 * 1000);



};

const updateSimulation = async () => {
  try {
    let world = await World.findOne({});
    if (!world) {
      console.log("No world found");
      return;
    }
    const agents = await Agent.find({});
    //Example logic to update all the agents
    agents.forEach(async (agent) => {
      // Example: Simple random movement
      const dx = Math.floor(Math.random() * 3 ) ; 
      const dy = Math.floor(Math.random() * 3) ; 
      agent.location.x = Math.max(0, Math.min(20*32, agent.location.x + dx)); // keep agent within the 50x50 grid
      agent.location.y = Math.max(0, Math.min(20*32, agent.location.y + dy));
      agent.currentAction = "moving";
      await agent.save();
    });

    world.time += 15;
    await world.save();

    console.log("Simulation updated", world.time);
  } catch (error) {
    console.error("Error updating simulation", error);
  }
};
