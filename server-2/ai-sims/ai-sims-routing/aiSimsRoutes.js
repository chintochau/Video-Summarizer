import express from "express";
import { getDataForAgent, initializeSimsWorld, resetAgentsLocation, showAiSimsStatus, updateAgentInformation, updateSimulation } from "../ai-sims-controller/aiSimsController.js";


// {bseUrl}/sims

const router = express.Router();
router.post("/init",express.json({ limit: "10mb" }),initializeSimsWorld);
router.get("/data",express.json({ limit: "10mb" }),showAiSimsStatus);
router.get("/data/world",express.json({ limit: "10mb" }),showAiSimsStatus);
router.get("/data/agents",express.json({ limit: "10mb" }),showAiSimsStatus);
router.get("/agent/:agentId/:data",express.json({ limit: "10mb" }),getDataForAgent);
router.get("/agent/resetAllLocations",express.json({ limit: "10mb" }),resetAgentsLocation);
router.post("/agent/:agentId/update",express.json({ limit: "10mb" }),updateAgentInformation);
router.get("/progress",express.json({ limit: "10mb" }),updateSimulation);


export default router;