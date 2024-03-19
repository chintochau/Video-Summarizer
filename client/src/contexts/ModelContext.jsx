import { createContext, useContext, useEffect, useState } from "react";

const ModelContext = createContext();

export const useModels = () => useContext(ModelContext);

export const ModelProvider = ({ children }) => {
  const [usableModels, setUsableModels] = useState(null);
  const [selectedModel, setSelectedModel] = useState("claude3h");

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/chintochau/Video-Summarizer/main/server/services/transcribeServices/usableModels.json"
    )
      .then((response) => response.json())
      .then((data) => setUsableModels(data.usableModels))
      .catch((error) => console.error("Error fetching announcement:", error));
  }, []);

  const value = {
    usableModels,
    selectedModel,
    setSelectedModel
  };

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
};
