import { openai } from "../config/summaryConfig.js";
import {
  generateTextEmbeddings,
  saveEmbeddings,
  searchForQuery,
  getEmbeddingCollection,
} from "../services/embeddingsServices.js";

export const createEmbeddings = async (req, res) => {
  try {
    const { video, parentSrtText, userId } = req.body;
    const embeddings = await generateTextEmbeddings(parentSrtText);
    console.log("Embeddings generated successfully", embeddings);
    await saveEmbeddings({ video, userId, embeddings });
    res.status(200).json(embeddings);
  } catch (error) {
    console.error("Error occurred during embeddings generation:", error);
    res
      .status(500)
      .json({ error: "Error occurred during embeddings generation" });
  }
};

export const vectorSearch = async (req, res) => {
  const { query } = req.body;
  // perform vector search using Embedding model, and mongoose aggregation
  try {
    const results = await searchForQuery(query);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error occurred during vector search:", error);
    res.status(500).json({ error: "Error occurred during vector search" });
  }
};

export const getEmbeddingCollectionAndVideos = async (req, res) => {
  const { userId } = req.params;
  try {
    const collection = await getEmbeddingCollection(userId);
    res.status(200).json(collection);
  } catch (error) {
    console.error("Error occurred while fetching embedding collection:", error);
    res
      .status(500)
      .json({ error: "Error occurred while fetching embedding collection" });
  }
};

export const answerQuestions = async (req, res) => {
  const { userInput, userId, referenceVideosArray } = req.body;
  // perform question answering using OpenAI API
  // turn the array of reference videos into a string, so it can be used in the prompt
  try {
      const referenceVideosArrayString = referenceVideosArray.reduce(
        (acc, video) => {
          return acc + video.videoTitle + ", ";
        },
        ""
      );
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are given a transcript from several videos, here are the transcripts provided ${referenceVideosArrayString} 
you must answer questions or provide related information related to the user input based on the information provided. If the information is not provided from the transcripts, 
tell the user you cannot answer the questions or provide information, and would suggest them to view the video for more information. 
Do not provide any information that is not in the transcripts. you should state the source of the information if possible. provide your response in a markdown"
                    `,
        },
        {
          role: "user",
          content: userInput,
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error occurred during question answering:", error);
    res.status(500).json({ error: "Error occurred during question answering" });
  }
};
