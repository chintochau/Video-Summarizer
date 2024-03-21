import { createContext, useContext, useState } from "react";

export const VideoContext = createContext();

export const useVideoContext = () => useContext(VideoContext);

export const VideoProvider = ({ children }) => {
  const [videoDuration, setVideoDuration] = useState(0);
  const [sourceTitle, setSourceTitle] = useState("")
  const [sourceType, setSourceType] = useState("")
  const [sourceId, setSourceId] = useState("")

  const value = {
    videoDuration, setVideoDuration, setSourceTitle, setSourceType, setSourceId,
    video: {
      sourceTitle, sourceType, sourceId, videoDuration
    }
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};