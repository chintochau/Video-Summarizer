
import cors from "cors";
import aiSimsRoutes from "./routes.js";


export const aiSimsMain = (app) => {
  app.use("/sims", cors(), aiSimsRoutes);


  // **2. Implement 15-Minute Simulation Logic**
  // *   The `setInterval` function will run a simulation step every 15 minutes, updating the world and agents states.

  //   setInterval(updateSimulation, 3 * 1000);
};

