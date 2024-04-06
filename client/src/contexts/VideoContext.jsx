import { createContext, useContext, useState } from "react";

/**
 * Video context for managing video-related state and functions.
 * @typedef {Object} VideoContextType
 * @property {number} videoDuration - The duration of the video.
 * @property {Function} setVideoDuration - A function to set the video duration.
 * @property {Function} setSourceTitle - A function to set the source title.
 * @property {Function} setSourceType - A function to set the source type.
 * @property {Function} setSourceId - A function to set the source ID.
 * @property {Function} setVideoCredits - A function to set the video credits.
 * @property {string} youtubeId - The YouTube ID of the video.
 * @property {Function} setYoutubeId - A function to set the YouTube ID.
 * @property {Object} video - The video object containing source title, source type, source ID, and video duration.
 * @property {number} videoCredits - The credits for the video.
 * @property {number} currentPlayTime - The current play time of the video.
 * @property {Function} setCurrentPlayTime - A function to set the current play time.
 * @property {string} currentLine - The current line of the video.
 * @property {Function} setCurrentLine - A function to set the current line.
 */

const VideoContext = createContext();

export const useVideoContext = () => useContext(VideoContext);

/**
 * Video provider component for providing the video context to its children.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The children components.
 * @returns {JSX.Element} The video provider component.
 */
export const VideoProvider = ({ children }) => {
  const [videoDuration, setVideoDuration] = useState(0);
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [videoCredits, setVideoCredits] = useState(0);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [youtubeId, setYoutubeId] = useState("");
  const [currentLine, setCurrentLine] = useState("");

  const value = {
    videoDuration,
    setVideoDuration,
    setSourceTitle,
    setSourceType,
    setSourceId,
    setVideoCredits,
    youtubeId,
    setYoutubeId,
    video: {
      sourceTitle,
      sourceType,
      sourceId,
      videoDuration,
    },
    videoCredits,
    currentPlayTime,
    setCurrentPlayTime,
    currentLine,
    setCurrentLine,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};
