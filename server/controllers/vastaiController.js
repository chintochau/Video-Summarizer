import { vastaiHeader } from "../config/vastaiConfig.js";
import { createInstancesList, startInstance, stopInstance } from "../services/vastaiServices.js";


export const listGPUInstances = async (req, res) => {
  res.json(await createInstancesList())
};


export const startFirstInstance = async (req, res) => {
  const list = await createInstancesList()
  const id = list[0].id
  startInstance({ id })
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      console.log('error', error);
      res.status(500).send('An error occurred');
    });
}

export const stopFirstInstance = async (req, res) => {
  const list = await createInstancesList()
  const id = list[0].id
  stopInstance({ id })
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      console.log('error', error);
      res.status(500).send('An error occurred');
    });
}