import { createContext, useContext, useState } from "react";

const VideoContext = createContext();

export const useVideoContext = () => useContext(VideoContext);

export const VideoProvider = ({ children }) => {
  const [videoDuration, setVideoDuration] = useState(0);
  const [sourceTitle, setSourceTitle] = useState("")
  const [sourceType, setSourceType] = useState("")
  const [sourceId, setSourceId] = useState("")
  const [videoCredits, setVideoCredits] = useState(0)
  const [currentPlayTime, setCurrentPlayTime] = useState(0)
  const [youtubeId, setYoutubeId] = useState("")
  const [currentLine, setCurrentLine] = useState("")

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
      sourceTitle, sourceType, sourceId, videoDuration
    }, 
    videoCredits,
    currentPlayTime,
    setCurrentPlayTime,currentLine, setCurrentLine
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};


// const VideoSchema = new mongoose.Schema({
//   userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//   },
//   sourceType: {
//       type: String,
//       enum: ['youtube', 'user-upload', 'audio', 'srt-file'],
//       required: true,
//   },
//   sourceId: {
//       type: String,
//       required: true,
//   },
//   sourceTitle: {
//       type: String,
//   },
//   author: {
//       type: String,
//   },
//   videoThumbnail: {
//       type: String,
//   },
//   videoDuration: {
//       type: Number,
//   },
//   originalTranscript: {
//       type: String,
//   },
//   lastUpdated: {
//       type: Date,
//       default: null, // Initialize as null or a default date value
//   },
//   // Other video fields as needed
// });
