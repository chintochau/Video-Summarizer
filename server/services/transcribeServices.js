// transcribeService.js
import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import Queue from "queue";
import { checkInstanceStatus, getInstanceIP, getInstanceListWithAvailability, startInstance, stopInstance } from "./vastaiServices.js";

export const transcribeQueue = new Queue({ autostart: true, concurrency: 9 });

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


export const transcribeLink = async ({ link, transcriptionId, publicId, resourceType, gpuServerIP }) => {
  console.log("Transcribing link", link, transcriptionId, publicId, resourceType, gpuServerIP);
  const formData = new FormData();
  formData.append("link", link);
  formData.append("transcriptionId", transcriptionId);
  formData.append("publicId", publicId);
  formData.append("resourceType", resourceType);

  try {
    const response = await fetch(gpuServerIP + "/transcribe_with_link", {
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

export const checkTranscriptionProgress = async (transcriptionId, gpuServerIP) => {
  const response = await fetch(gpuServerIP + `/check_transcription_progress?transcriptionId=${transcriptionId}`);
  if (response.ok) {
    const data = response.text();
    return data;
  } else {
    console.error("Failed to check transcription progress");
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
  const currentInstances = await getInstanceListWithAvailability();
  console.log("currentInstances, ", currentInstances);
  for (const gpu of currentInstances) {
    console.log(`Checking slots for ${gpu.id}`);
    if (gpu.status === "running"
      && gpu.tasks < 3 && gpu.full_ip) {
      return gpu;
    }
  }

  // is no running gpu available, start an inactive GPU, which is rentable
  // using await startInstance({ id});

  // check if the instance is running, if not, stop the instance and try the next one
  for (const gpu of currentInstances) {
    if (gpu.status === "inactive" && gpu.rentable) {
      console.log(`Starting instance ${gpu.id}`);
      // start the instance
      const response = await startInstance({ id: gpu.id });
      if (response.success) {
        // instance started successfully
        console.log(`Instance ${gpu.id} started successfully`);
        // reserve the slot, and wait for the instance to finish startup
        gpu.tasks++;

        // wait for the instance to start
        for (let i = 0; i < 8; i++) {
          // wait for 10 seconds
          await new Promise((resolve) => setTimeout(resolve, 10000));
          // check the status of the instance
          const status = await checkInstanceStatus({ id: gpu.id });
          // if the instance is running, return the instance
          if (status === "running") {
            console.log(`Instance ${gpu.id} is running`);
            if (gpu.full_ip) {
              // if the instance has an IP address, return the instance
              gpu.tasks--;
              return gpu;
            } else {
              // if the instance does not have an IP address, get the IP address
              getInstanceIP({ id: gpu.id })
                .then((ip) => {
                  gpu.full_ip = ip;
                  console.log(`Instance ${gpu.id} has IP address ${ip}`);
                  gpu.tasks--;
                  return gpu;
                })
                .catch((error) => {
                  console.error("Error occurred during transcription:", error);
                  stopInstance({ id: gpu.id });
                });
            }
          }
        }
        console.log(`Instance ${gpu.id} failed to start`);
        gpu.tasks--;
      } else {
        console.log(`Failed to start instance ${gpu.id}`);
        stopInstance({ id: gpu.id });
      }
    }
  }


  // If no GPUs are available, wait for a while and check again
  console.log("No GPUs available, waiting for 30 seconds");
  await new Promise((resolve) => setTimeout(resolve, 30000));
  return checkGPUSlots();
};
