import React, { useRef, useEffect, useState, useContext } from "react";

import YouTube from "react-youtube";
import { useVideoContext } from "../contexts/VideoContext";
import { calculateVideoCredits } from "../utils/creditUtils";

const VideoField = ({ youtubeId, videoRef }) => {
  const { setVideoDuration, setSourceTitle, setSourceType, setSourceId, setVideoCredits, setCurrentPlayTime } = useVideoContext();

  const [playing, setPlaying] = useState(false)
  const opts = {
    height: "auto",
    width: "auto",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };


  useEffect(() => {
    
    const intervalId = setInterval(async () => {
      setCurrentPlayTime(await videoRef.current.internalPlayer.getCurrentTime());
    }, 500);

    if (!playing) {
      clearInterval(intervalId)
    }

    return () => {
      clearInterval(intervalId);
    }
  }, [playing])


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
          setVideoDuration(e.target.playerInfo.duration);
          setVideoCredits(calculateVideoCredits(e.target.playerInfo.duration))
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </div>
  );
};

export default VideoField;
