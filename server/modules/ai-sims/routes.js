import express from "express";
import {
  modifyMemory,
  getOrControlAgent,
  initializeSimsWorld,
  showAiSimsStatus,
  updateAgentInformation,
  updateSimulation,
  askQuestion,
  resetAgentsLocation,
  moveObject,
  
} from "./controllers/aiSimsController.js";

// {baseUrl}/sims

const router = express.Router();

// World
router.post("/init", express.json({ limit: "10mb" }), initializeSimsWorld);
router.get("/data", express.json({ limit: "10mb" }), showAiSimsStatus);
router.get("/data/world", express.json({ limit: "10mb" }), showAiSimsStatus);

// Agents
router.get(
  "/agent/:agentId/:data",
  express.json({ limit: "10mb" }),
  getOrControlAgent
);
router.post(
  "/agent/:agentId/update",
  express.json({ limit: "10mb" }),
  updateAgentInformation
);
router.post(
  "/agent/:agentId/question",
  express.json({ limit: "10mb" }),
  askQuestion
);
router.get(
  "/agent/resetAllLocations",
  express.json({ limit: "10mb" }),
  resetAgentsLocation
);

// Progress
router.get("/progress", express.json({ limit: "10mb" }), updateSimulation);

// Map
router.post("/map/object/move", express.json({ limit: "10mb" }), moveObject);

// Memory
router.post("/memory/:memoryId", express.json({ limit: "10mb" }), modifyMemory);

const aiSimsRoutes = router;
export default aiSimsRoutes;
