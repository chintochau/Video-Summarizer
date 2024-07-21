import { vastaiHeader } from "../config/vastaiConfig.js";

/**
 * @typedef {Object} Instance
 * @property {string} id
 * @property {string} machine_id
 * @property {boolean} rentable
 * @property {string} actual_status
 * @property {string} intended_status
 * @property {string} full_ip
 * @property {string} status
 * @property {number} tasks
 */
let instancesListWithAvailability = [];


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

    if (instances.length === 0) {
        return instancesListWithAvailability;
    }
    
    if (instancesListWithAvailability.length === 0) {
        // initial load, add all instances, add tasks = 0
        instances.forEach(instance => {
            instance.tasks = 0
        })
        instancesListWithAvailability = instances
    } else {
        // update all instance info, keep the tasks
        // if the instance is not in the list, add it,add tasks = 0
        // if the instance is in the list, update it
        // if the instance is not in the new list, remove it

        // update all instance info, keep the tasks
        instancesListWithAvailability.forEach((instance) => {
            const newInfo = instances.find((newInstance) => newInstance.id === instance.id);
            if (newInfo) {
                instance.actual_status = newInfo.actual_status;
                instance.intended_status = newInfo.intended_status;
                instance.rentable = newInfo.rentable;
                instance.full_ip = newInfo.full_ip;
                instance.status = newInfo.status
            }
        });
        // if the instance is not in the list, add it,add tasks = 0
        instances.forEach((newInstance) => {
            const instance = instancesListWithAvailability.find((instance) => instance.id === newInstance.id);
            if (!instance) {
                newInstance.tasks = 0;
                instancesListWithAvailability.push(newInstance);
            }
        });
        // if the instance is not in the new list, remove it
        instancesListWithAvailability = instancesListWithAvailability.filter((instance) => {
            return instances.find((newInstance) => newInstance.id === instance.id);
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
            rentable,
            actual_status,
            intended_status,
        } = instance;

        let ports
        let full_ip;

        if (instance.ports) {
            ports = instance.ports["5000/tcp"][0].HostPort;
            full_ip = "http://" + instance.public_ipaddr + ":" + ports;
        }

        return {
            id,
            machine_id,
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


export const getInstanceIPandStatus = async ({ id }) => {
    var requestOptions = {
        method: "GET",
        headers: vastaiHeader,
        redirect: "follow",
    };
    const data = await fetch(`https://console.vast.ai/api/v0/instances/${id}`, requestOptions)
    const response = await data.json();
    const instance = response.instances;
    // check the instance staus with ID from response.instances
    let ports
    let full_ip;

    if (instance.ports) {
        ports = instance.ports["5000/tcp"][0].HostPort;
        full_ip = "http://" + instance.public_ipaddr + ":" + ports;
    }
    const status = getStatus(instance.actual_status, instance.intended_status);
    return { full_ip, status };
}


export const checkGPUInstanceAvailability = async ({ id }) => {
    var requestOptions = {
        method: "GET",
        headers: vastaiHeader,
        redirect: "follow",
    };
    const data = await fetch(`https://console.vast.ai/api/v0/instances/${id}`, requestOptions)
    const response = await data.json();
    return response;
}

export const startInstance = async ({ id }) => {
    var raw = JSON.stringify({ "state": "running" });
    var requestOptions = {
        method: 'PUT',
        headers: vastaiHeader,
        body: raw,
        redirect: 'follow'
    };
    return fetch(`https://console.vast.ai/api/v0/instances/${id}/`, requestOptions)
        .then(response => response.json())
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
        const result_1 = await response.json();
        return result_1;
    } catch (error) {
        console.log('error', error);
        throw new Error('Failed to stop instance');
    }
};