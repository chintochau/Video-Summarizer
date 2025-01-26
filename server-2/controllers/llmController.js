import {
  deepInfraService,
  deepseekService,
  openaiService,
} from "../services/llmService.js";

class LlmController {
  async getChatCompletion(req, res) {
    const { messages, selectedModel } = req.body;

    console.log(selectedModel);
    
    // Determine which service to use based on the selected model
    let service;
    switch (selectedModel) {
      case "deepseek-chat":
      case "deepseek-reasoner":
        service = deepseekService;
        break;
      case "gpt-3.5-turbo":
      case "gpt-4o-mini":
      case "gpt-4o":
        service = openaiService;
        break;
      case "meta-llama/Llama-3.3-70B-Instruct-Turbo":
        service = deepInfraService;
        break;
      default:
        return res.status(400).json({ error: "Unsupported model selected" });
    }

    // Set the model for the selected service
    service.setModel(selectedModel);

    try {
      const response = await service.getChatCompletion(messages);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new LlmController();
