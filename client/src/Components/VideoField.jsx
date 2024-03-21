import React, { useRef, useEffect, useState, useContext } from "react";

import YouTube from "react-youtube";
import { VideoContext } from "../contexts/VideoContext";

const VideoField = ({ fileName, youtubeId, videoRef }) => {
  const { setVideoDuration, setSourceTitle, setSourceType, setSourceId } = useContext(VideoContext);

  const opts = {
    height: "auto",
    width: "auto",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };
  return (
    <div className="w-full">
      <YouTube
        iframeClassName="w-full aspect-video"
        ref={videoRef}
        videoId={youtubeId}
        opts={opts}
        onReady={(e) => {
          setSourceType("youtube")
          setSourceId(youtubeId)
          setSourceTitle(e.target.videoTitle);
          setVideoDuration(e.target.getDuration());
        }}
      />
    </div>
  );
};

export default VideoField;
