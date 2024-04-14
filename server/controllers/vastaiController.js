import { checkInstanceStatus, createInstancesList, getInstanceListWithAvailability, startInstance, stopInstance } from "../services/vastaiServices.js";

export const listGPUInstances = async (req, res) => {
  const instances = await getInstanceListWithAvailability();
  res.json(instances)
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


export const checkInstanceStatusWithId = async (req, res) => {
  const { id } = req.body;
  try {
      const response = await checkInstanceStatus({ id });
      res.json(response);
  } catch (error) {
      console.error("Error occurred during transcription:", error);
      res.status(500).send("Error occurred during transcription");
  }
}
