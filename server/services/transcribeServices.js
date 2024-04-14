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

  for (const gpu of currentInstances) {
    console.log(`Checking slots for ID: ${gpu.id}, Status: ${gpu.status}, Tasks: ${gpu.tasks}, Full IP: ${gpu.full_ip}`);

    // check if the instance is running and has less than 3 tasks, reserve the slot and return the instance
    if (gpu.status === "running" && gpu.tasks < 3 && gpu.full_ip) {
      // return the instance
      console.log(`Instance ${gpu.id} is running, has less than 3 tasks, reserved the slot`);
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
        const status = await checkInstanceStatus({ id: gpu.id });
        // if the instance is running, return the instance
        if (status === "running") {
          if (gpu.full_ip) {
            // if the instance does not have an IP address, try getting ip for 3 times
            for (let i = 0; i < 3; i++) {
              console.log(`Instance ${gpu.id} started, but does not have IP address, try to get IP address ${i + 1}/3`);
              getInstanceIP({ id: gpu.id })
                .then((ip) => {
                  // if the instance has an IP address, return the instance
                  if (ip) {
                    gpu.full_ip = ip;
                    return gpu;
                  }
                })
                .catch((error) => {
                  // if the instance does not have an IP address, skip the instance and try the next one
                  console.error("Queue for starting instance, not able to get instance ip", error);
                });
              await new Promise((resolve) => setTimeout(resolve, 10000));
            }
          }
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
        gpu.tasks++;
        // wait for the instance to start
        for (let i = 0; i < 5; i++) {
          // wait for 10 seconds
          await new Promise((resolve) => setTimeout(resolve, 11000));
          // check the status of the instance
          const status = await checkInstanceStatus({ id: gpu.id });
          // if the instance is running, return the instance
          if (status === "running") {
            console.log(`Instance ${gpu.id} finished starting, is running`);
            if (gpu.full_ip) {
              // if the instance has an IP address, return the instance
              return gpu;
            } else {
              // if the instance does not have an IP address, try getting ip for 3 times
              for (let i = 0; i < 3; i++) {
                console.log(`Instance ${gpu.id} started, but does not have IP address, try to get IP address ${i + 1}/3`);
                getInstanceIP({ id: gpu.id })
                  .then((ip) => {
                    if (ip) {
                    gpu.full_ip = ip;
                    console.log(`Instance ${gpu.id} has IP address ${ip}`);
                    return gpu;
                    }
                  })
                  .catch((error) => {
                    console.error("Try to start instance, not able to get instance ip", error);
                  });
                await new Promise((resolve) => setTimeout(resolve, 10000));
              }
            }
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
