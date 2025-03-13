import OpenAI from "openai";
import { DEFAULT_CHAT_MODEL } from "../ai-sims/worldConfig.js";

class LlmService {
  constructor(openaiClient) {
    this.openai = openaiClient;
    this.model = DEFAULT_CHAT_MODEL; // Default model
  }

  setModel(model) {
    this.model = model;
  }

  async getChatCompletion({ messages, response_format, tools }) {
    try {
      const requestPayload = {
        model: this.model,
        messages: messages,
      };

      if (response_format !== null) {
        requestPayload.response_format = response_format;
      }

      if (tools !== null) {
        requestPayload.tools = tools;
      }

      const response = await this.openai.chat.completions.create(
        requestPayload
      );
      const responseMessage = response.choices[0].message;

      if (responseMessage.tool_calls) {
        console.log(
          responseMessage.tool_calls.map((tool_call) => JSON.stringify(tool_call))
        );
      } else {
        console.log(responseMessage.content);
      }
      return responseMessage;
    } catch (error) {
      console.error(error);
      throw new Error(`Chat completion failed: ${error.message}`);
    }
  }
}

// Factory function to create LlmService instances
export function createLlmService(
  baseURL,
  apiKey,
  defaultModel = "deepseek-chat"
) {
  const openai = new OpenAI({
    baseURL,
    apiKey,
  });

  const llmService = new LlmService(openai);
  llmService.setModel(defaultModel);

  return llmService;
}

// Example usage
const deepseekService = createLlmService(
  "https://api.deepseek.com",
  process.env["DEEPSEEK_API_KEY"],
  "deepseek-chat"
);

const openaiService = createLlmService(
  null,
  process.env["OPENAI_API_KEY"],
  "gpt-4o-mini"
);

const deepInfraService = createLlmService(
  "https://api.deepinfra.com/v1/openai",
  process.env["DEEPINFRA_API_KEY"],
  "meta-llama/Llama-3.3-70B-Instruct-Turbo"
);

export { deepseekService, openaiService, deepInfraService };
