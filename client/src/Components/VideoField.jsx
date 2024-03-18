import React, { useRef, useEffect, useState } from "react";

import YouTube from "react-youtube";

const VideoField = ({ fileName, youtubeId, videoRef }) => {
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
      />
    </div>
  );
};

export default VideoField;

/* <iframe
          ref={videoRef}
          title="YouTube Video"
          className="w-full aspect-video"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe> */
