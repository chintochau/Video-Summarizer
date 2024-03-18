import { createContext, useContext, useEffect, useState } from "react";

const ModelContext = createContext()

export const useModels = () => useContext(ModelContext)

export const ModelProvider = ({ children }) => {
    const [usableModels, setUsableModels] = useState([])

    useEffect(() => {
        fetch(
            "https://raw.githubusercontent.com/chintochau/Fusion-AI-Announcement/main/announcement.json"
        )
            .then((response) => response.json())
            .then((data) => setUsableModels(data))
            .catch((error) => console.error("Error fetching announcement:", error));

    }, [])

    const value = {
        usableModels
    }
    return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
}