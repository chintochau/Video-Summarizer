import { createContext, useContext, useEffect, useState } from "react";
import { getItem, setItem } from "@/services/LocalStorageService.js";
import { STORAGE_KEYS } from "@/utils/StorageKeys";
import { defaultModels } from "@/components/Prompts";

const ModelContext = createContext();

export const useModels = () => useContext(ModelContext);

export const ModelProvider = ({ children }) => {
  
  const [languageModel, setLanguageModel] = useState(defaultModels[1].id); 
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    // read prefereed language and llm from local storage
    getItem(STORAGE_KEYS.PREFERRED_LANGUAGE) && setLanguage(getItem(STORAGE_KEYS.PREFERRED_LANGUAGE));
    getItem(STORAGE_KEYS.PREFERRED_LLM) && setLanguageModel(getItem(STORAGE_KEYS.PREFERRED_LLM));
  });

  const setSelectedModel = (model) => {
    setLanguageModel(model);
    setItem(STORAGE_KEYS.PREFERRED_LLM, model);
  };

  const setSelectedLanguage = (lang) => {
    setLanguage(lang);
    setItem(STORAGE_KEYS.PREFERRED_LANGUAGE, lang);
  }



  const value = {
    selectedModel: languageModel,
    setSelectedModel,
    language,
    setLanguage:setSelectedLanguage,
    selectedModelDetails: defaultModels.find((model) => model.id === languageModel),
  };

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
};
