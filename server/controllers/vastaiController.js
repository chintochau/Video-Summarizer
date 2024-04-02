import { vastaiHeader } from "../config/vastaiConfig.js";

var instancesList = [];

const getStatus = (actual, intended) => {
  if (actual === "exited" && intended === "running") {
    return "starting";
  } else if (actual === "running" && intended === "running") {
    return "running";
  } else if (actual === "running" && intended === "stopped") {
    return "stopping";
  } else if (actual === "exited" && intended === "stopped") {
    return "inactive";
  } else {
    return "Unknown status";
  }
};

const createInstancesList = (response) => {
  const instances = response.instances.map((instance) => {
    const {
      id,
      machine_id,
      gpu_util,
      rentable,
      actual_status,
      intended_status,
    } = instance;

    let ports = instance.ports;
    let full_ip;

    if (instance.ports) {
      ports = instance.ports["5000/tcp"][0].HostPort;
      full_ip = "http://" + instance.public_ipaddr + ":" + ports;
    }

    return {
      id,
      machine_id,
      gpu_util,
      rentable,
      actual_status,
      intended_status,
      full_ip,
      status: getStatus(actual_status, intended_status),
    };
  });
  instancesList = instances;
  return instances;
};

export const listGPUInstances = async (req, res) => {
  var requestOptions = {
    method: "GET",
    headers: vastaiHeader,
    redirect: "follow",
  };

  await fetch("https://console.vast.ai/api/v0/instances", requestOptions)
    .then(async (data) => {
      const response = await data.json();
      //   res.json(response);
      res.json(createInstancesList(response));
    })
    .catch((error) => console.log("error", error));
};

/*

starting:
actual: exited
intended running

running:
actual = running
intented = running


stopping:
actual = running
intended = stopped

inactive:
actual = exited
intended = stopped

*/
