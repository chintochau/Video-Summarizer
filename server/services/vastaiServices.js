import { vastaiHeader } from "../config/vastaiConfig.js";

/**
 * @typedef {Object} Instance
 * @property {string} id
 * @property {string} machine_id
 * @property {number} gpu_util
 * @property {boolean} rentable
 * @property {string} actual_status
 * @property {string} intended_status
 * @property {string} full_ip
 * @property {string} status
 * @property {number} tasks
 */
export let instancesListWithAvailability = [];


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


export const getInstanceListWithAvailability = async () => {
    const instances = await createInstancesList();

    if (instancesListWithAvailability.length === 0) {
        instances.forEach(instance => {
            instance.tasks = 0
        })
        instancesListWithAvailability = instances
    } else {
        // update instance info, keep the tasks
        // if the instance is not in the list, add it
        // if the instance is in the list, update it
        // if the instance is not in the new list, remove it
        instancesListWithAvailability.forEach((instance, index) => {
            const new_instance = instances.find((new_instance) => new_instance.id === instance.id);
            if (new_instance) {
                instancesListWithAvailability[index] = new_instance;
            } else {
                instancesListWithAvailability.splice(index, 1);
            }
        });
        instances.forEach((new_instance) => {
            const instance = instancesListWithAvailability.find((instance) => instance.id === new_instance.id);
            if (!instance) {
                new_instance.tasks = 0
                instancesListWithAvailability.push(new_instance);
            }
        });
    }
    return instancesListWithAvailability;
}

export const createInstancesList = async () => {
    var instancesList = [];
    var requestOptions = {
        method: "GET",
        headers: vastaiHeader,
        redirect: "follow",
    };
    const data = await fetch("https://console.vast.ai/api/v0/instances", requestOptions)
    const response = await data.json();
    // check if the response is empty
    if (!response.instances) {
        return instancesList;
    }
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

export const startInstance = async ({ id }) => {
    var raw = JSON.stringify({ "state": "running" });
    var requestOptions = {
        method: 'PUT',
        headers: vastaiHeader,
        body: raw,
        redirect: 'follow'
    };
    return fetch(`https://console.vast.ai/api/v0/instances/${id}/`, requestOptions)
        .then(response => response.text())
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log('error', error);
            throw new Error('Failed to start instance');
        });
}

export const stopInstance = async ({ id }) => {
    var raw = JSON.stringify({ "state": "stopped" });
    var requestOptions = {
        method: 'PUT',
        headers: vastaiHeader,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`https://console.vast.ai/api/v0/instances/${id}/`, requestOptions);
        const result_1 = await response.text();
        return result_1;
    } catch (error) {
        console.log('error', error);
        throw new Error('Failed to stop instance');
    }
};