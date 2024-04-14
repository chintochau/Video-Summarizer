// transcribeService.js
import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import Queue from "queue";
import {   getInstanceIPandStatus, getInstanceListWithAvailability, startInstance, stopInstance } from "./vastaiServices.js";

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
  
  return { queueLength, pendingTasks, isQueueStarted, isQueueStopped };
};

export const checkGPUSlots = async () => {
  const currentInstances = await getInstanceListWithAvailability();

  for (const gpu of currentInstances) {
    console.log(`Checking slots for ID: ${gpu.id}, Status: ${gpu.status}, Tasks: ${gpu.tasks}, Full IP: ${gpu.full_ip}`);

    // check if the instance is running and has less than 3 tasks, reserve the slot and return the instance
    if (gpu.status === "running" && gpu.tasks < 3 && gpu.full_ip) {
      // return the instance
      console.log(`Instance ${gpu.id} is running, has less than 3 tasks, ipavailable, reserved the slot`);
      gpu.tasks++;
      return gpu;
    }

    // check if the instance is starting, assume full_ip is not available yet, reserve the slot, wait for 15 seconds, and check the full ip, if available, return the instance, else try two more times, else try the next instance
    if (gpu.status === "starting" && gpu.tasks < 3) {
      console.log(`Instance ${gpu.id} is starting, waiting for 15 seconds`)
      gpu.tasks++;
      for (let i = 0; i < 3; i++) {
        // wait for 15 seconds
        await new Promise((resolve) => setTimeout(resolve, 15000));
        // check the status of the instance
        const { status, full_ip } = await getInstanceIPandStatus({ id: gpu.id });
        if (status === "running" && full_ip) {
          gpu.full_ip = full_ip;
          console.log(`Instance ${gpu.id} finished starting, is running, has IP address ${full_ip}`);
          return gpu;
        }
      }
      // if the instance is not running after 45 seconds, release the slot and try the next instance
      console.log(`Instance ${gpu.id} failed to start after 45 seconds, now release slot, and try next instance`);
      gpu.tasks--;
    }


    if (gpu.status === "inactive" && gpu.rentable) {
      console.log(`Starting instance ${gpu.id}`);
      // start the instance
      const response = await startInstance({ id: gpu.id });
      if (response.success) {
        // instance started successfully
        console.log(`Instance ${gpu.id} started successfully`);
        // reserve the slot, and wait for the instance to finish startup
        if (gpu.tasks > 3) {
          // if the instance has more than 3 tasks, skip the instance and try the next one
          break
        }
        gpu.tasks++;
        // wait for the instance to start
        for (let i = 0; i < 8; i++) {
          // wait for 10 seconds
          await new Promise((resolve) => setTimeout(resolve, 9000));
          // check the status of the instance
          const { status, full_ip } = await getInstanceIPandStatus({ id: gpu.id });
          // if the instance is running, return the instance
          if (status === "running" && full_ip) {
            gpu.full_ip = full_ip;
            console.log(`Instance ${gpu.id} finished starting, is running`);
            return gpu;
          }
        }
        // if the instance is not running after 90 seconds, release the slot and stop the instance
        console.log(`Instance ${gpu.id} failed to start, now release slot and stop instance`);
        gpu.tasks--;
        stopInstance({ id: gpu.id });
      } else {
        // instance failed to start, stop the instance and try the next one
        console.log(`Failed to start instance ${gpu.id}, may be occupied by another user, now stop instance to prevent unwanted scheduling`);
        stopInstance({ id: gpu.id });
      }
    }
  }
  // If no GPUs are available, wait for a while and check again
  console.log("No GPUs available, waiting for 30 seconds");
  await new Promise((resolve) => setTimeout(resolve, 30000));
  return checkGPUSlots();
}
