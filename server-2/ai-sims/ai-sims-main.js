import llmController from "../controllers/llmController.js";
import { Agent } from "./ai-sims-models/agentModel.js";
import { World } from "./ai-sims-models/worldModel.js";
import aiSimsRoutes from "./ai-sims-routing/aiSimsRoutes.js";
import cors from "cors";


export const aiSimsMain = (app) => {
  app.use("/sims", cors(), aiSimsRoutes);


  // **2. Implement 15-Minute Simulation Logic**
  // *   The `setInterval` function will run a simulation step every 15 minutes, updating the world and agents states.

  //   setInterval(updateSimulation, 3 * 1000);
};

