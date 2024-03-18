import { createContext, useContext, useEffect, useState } from "react";

const ModelContext = createContext()

export const useModels = () => useContext(ModelContext)

export const ModelProvider = ({ children }) => {
    const [usableModels, setUsableModels] = useState([{ name: "GPT 3.5", model: "gpt-3.5-turbo-0125" }])

    useEffect(() => {
        fetch(
            "https://raw.githubusercontent.com/chintochau/Video-Summarizer/main/server/services/transcribeServices/usableModels.json"
        )
            .then((response) => response.json())
            .then((data) => setUsableModels(data.usableModels))
            .catch((error) => console.error("Error fetching announcement:", error));

    }, [])

    const value = {
        usableModels
    }

    return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
}