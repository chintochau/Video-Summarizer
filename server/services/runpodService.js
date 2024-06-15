import fetch from "node-fetch";
import { runpodRUNUrl, runpodHeader, runpodSTATUSUrl } from "../config/runpodConfig.js";

export const transcribeLinkWithRunPod = async (url,model) => {
  console.log("transcribeLinkWithRunPod", url);
  try {
    const response = await fetch(runpodRUNUrl, {
      method: "POST",
      headers: runpodHeader,
      body: JSON.stringify({
        input: {
          audio: url,
          model: model,
          transcription: "srt",
        },
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return result.id;
    } else {
      throw new Error("Failed to transcribe");
    }
  } catch (error) {
    console.error("Error occurred during transcription:", error);
    throw new Error("Error occurred during transcription");
  }

  //   const output = {
  //     id: "b7627d07-93cf-4a6d-a58f-7479091fe2e6-u1",
  //     status: "IN_QUEUE",
  //   };
  //   // wait 2 seconds to simulate the time it takes to start the transcription
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  //   return output;
};

export const checkTranscriptionStatusWithRunPod = async (transcriptionId) => {
  console.log(runpodSTATUSUrl + transcriptionId);
  try {
    const response = await fetch(runpodSTATUSUrl + transcriptionId, {
      method: "GET",
      headers: runpodHeader,
    });

    const data = await response.json();

    console.log("response", data);

    return data

    // if (response.ok) {
    //   console.log("response", response.ok, response.status);
    //   console.log(response);
    //   const status = response.status;
    //   switch (status) {
    //     case "IN_QUEUE":
    //     case "IN_PROGRESS":
    //       return { status: "IN_PROGRESS" };
    //     case "COMPLETED":
    //       return response;
    //     default:
    //       return { status: "FAILED" };
    //   }
    // } else {
    //   throw new Error("Failed to check transcription status");
    // }
  } catch (error) {
    console.error("Error occurred during transcription:", error);
    throw new Error("Error occurred during transcription");
  }
};
