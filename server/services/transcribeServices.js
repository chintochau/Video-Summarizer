// transcribeService.js
import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import Queue from "queue";
import { instancesListWithAvailability } from "./vastaiServices.js";

export const transcribeQueue = new Queue({ autostart: true, concurrency: 2 });

export const transcribeFile = async ({ file, filePath }) => {
  const formData = new FormData();

  if (file) {
    formData.append("file", fs.createReadStream(file.path));
  } else if (filePath) {
    formData.append("file", fs.createReadStream(filePath));
  } else {
    throw new Error("No File Received");
  }

  try {
    const response = await fetch("http://localhost:5000/transcribe", {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    if (response.ok) {
      const text = await response.text();
      return text;
    } else {
      throw new Error("Failed to transcribe");
    }

  } catch (error) {
    console.error("Error occurred during transcription:", error);
    throw new Error("Error occurred during transcription");
  } finally {
    if (file) {
      cleanupFiles(file.path, file.path);
    }
  }
};

const tempServer = "http://79.116.40.166:29534"

export const transcribeLink = async ({ link,transcriptionId,publicId,resourceType,gpuServerIP=tempServer }) => {
  const formData = new FormData();
  formData.append("link", link);
  formData.append("transcriptionId", transcriptionId);
  formData.append("publicId", publicId);
  formData.append("resourceType", resourceType);

  try {
    const response = await fetch( gpuServerIP +"/transcribe_with_link", {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    if (response.ok) {
      const text = await response.text();
      return text;
    } else {
      throw new Error("Failed to transcribe");
    }
  } catch (error) {
    console.error("Error occurred during transcription:", error);
    throw new Error("Error occurred during transcription");
  }
};

export const checkTranscriptionProgress = async (transcriptionId, gpuServerIP = tempServer) => {
  const response = await fetch(gpuServerIP + `/check_transcription_progress?transcriptionId=${transcriptionId}`);
  if (response.ok) {
    const data = response.text();
    return data;
  } else {
    throw new Error("Failed to check transcription progress");
  }
};



const cleanupFiles = (filePath, originalFilePath) => {
  if (filePath) {
    fs.unlinkSync(filePath);
  }
  if (filePath !== originalFilePath) {
    fs.unlinkSync(originalFilePath);
  }
};


export const getQueueStatus = () => {
  // Get the length of the queue
  const queueLength = transcribeQueue.length;
  // Get the number of pending tasks
  const pendingTasks = transcribeQueue.pending;
  // Check if the queue is started
  const isQueueStarted = transcribeQueue.running;
  // Check if the queue is stopped
  const isQueueStopped = transcribeQueue.stopped;
  console.log(`Queue Length: ${queueLength}`);
  console.log(`Pending Tasks: ${pendingTasks}`);
  console.log(`Is Queue Started: ${isQueueStarted}`);
  console.log(`Is Queue Stopped: ${isQueueStopped}`);
};

export const checkGPUSlots = async () => {
  for (const gpu of instancesListWithAvailability) {
    console.log(`Checking slots for ${gpu.id}`);
    console.log(gpu);
    if (gpu.tasks < 3) {
      return gpu;
    }
  }
  // If no GPUs are available, wait for a while and check again
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return checkGPUSlots();
};
