import OpenAI from "openai";

class LlmService {
  constructor(openaiClient) {
    this.openai = openaiClient;
    this.model = "deepseek-chat"; // Default model
  }

  setModel(model) {
    this.model = model;
  }

  async getChatCompletion(messages) {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: "You are Jason Chau." },
          ...messages,
        ],
      });
      console.log("response", response);
      return response.choices[0].message.content;
    } catch (error) {
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
  'https://api.deepinfra.com/v1/openai',
  process.env["DEEPINFRA_API_KEY"],
  "meta-llama/Llama-3.3-70B-Instruct-Turbo"
);

export { deepseekService, openaiService, deepInfraService };
