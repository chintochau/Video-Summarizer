export const runpodHeader = new Headers({
  accept: "application/json",
  "content-type": "application/json",
  Authorization: process.env.RUNPOD_API_KEY,
});

const runpodID = "kg759v6ob68pjl"

/*
RUN
https://api.runpod.ai/v2/kg759v6ob68pjl/run
STATUS
https://api.runpod.ai/v2/kg759v6ob68pjl/status/:id
CANCEL
https://api.runpod.ai/v2/kg759v6ob68pjl/cancel/:id
HEALTH
https://api.runpod.ai/v2/kg759v6ob68pjl/health
*/

export const runpodRUNUrl = `https://api.runpod.ai/v2/${runpodID}/run`
export const runpodSTATUSUrl = `https://api.runpod.ai/v2/${runpodID}/status/`
export const runpodCANCELUrl = `https://api.runpod.ai/v2/${runpodID}/cancel/`
export const runpodHEALTHUrl = `https://api.runpod.ai/v2/${runpodID}/health`