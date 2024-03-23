import { createContext, useContext, useState } from "react";

export const VideoContext = createContext();

export const useVideoContext = () => useContext(VideoContext);

export const VideoProvider = ({ children }) => {
  const [videoDuration, setVideoDuration] = useState(0);
  const [sourceTitle, setSourceTitle] = useState("")
  const [sourceType, setSourceType] = useState("")
  const [sourceId, setSourceId] = useState("")
  const [videoCredits, setVideoCredits] = useState(0)
  const [currentPlayTime, setCurrentPlayTime] = useState(0)

  const value = {
    videoDuration, 
    setVideoDuration, 
    setSourceTitle, 
    setSourceType, 
    setSourceId, 
    setVideoCredits,
    video: {
      sourceTitle, sourceType, sourceId, videoDuration
    }, 
    videoCredits,
    currentPlayTime,
    setCurrentPlayTime
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};