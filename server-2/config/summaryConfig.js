import Anthropic from "@anthropic-ai/sdk";
import { AssemblyAI } from "assemblyai";
import OpenAI from "openai";


//openai
export const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
  });
//Anthropic - claude3
export const anthropic = new Anthropic();


export const assembly = new AssemblyAI({
  apiKey: process.env["ASSEMBLY_CPI_KEY"],
});

export const deepInfraHeaders = 
{
  // sse
  "Content-Type": "application/json",
  authorization: `Bearer ${process.env["DEEPINFRA_API_KEY"]}`,
};