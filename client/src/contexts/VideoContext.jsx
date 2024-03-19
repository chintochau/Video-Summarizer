import { createContext, useContext, useState } from "react";

export const VideoContext = createContext();

export const useVideoContext = () => useContext(VideoContext);


export const VideoProvider = ({ children }) => {
  const [videoDuration, setVideoDuration] = useState(0);

  const value = {
    videoDuration,
    setVideoDuration,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};
