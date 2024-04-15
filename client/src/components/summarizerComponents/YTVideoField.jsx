import React, { useRef, useEffect, useState, useContext } from "react";

import YouTube from "react-youtube";
import { useVideoContext } from "../../contexts/VideoContext";
import { calculateVideoCredits } from "../../utils/creditUtils";
import { useSummaryContext, defaultNewSummary } from "@/contexts/SummaryContext";
import { useAuth } from "@/contexts/AuthContext";
import SummaryService from "@/services/SummaryService";
import { useTranscriptContext } from "@/contexts/TranscriptContext";
import YoutubeService from "@/services/YoutubeService";

const VideoField = ({ youtubeId, videoRef }) => {
  const { setVideoDuration, setSourceTitle, setSourceType, setSourceId, setVideoCredits, setCurrentPlayTime,video } = useVideoContext();
  const {setSummaries} = useSummaryContext()
  const { resetTranscript,setLoadingTranscript,setupTranscriptWithInputSRT} = useTranscriptContext()
  const {userId,currentUser} = useAuth()
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
    // update current play time every 500ms when video is playing
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

  useEffect(() => {
    // fetch transcript and summaries for the video when the video source id changes



    const fetchTranscriptAndSummaries = async () => {
      setLoadingTranscript(true)
      try {
        const ytResult = await YoutubeService.getYoutubeTranscript({ youtubeId });
        setupTranscriptWithInputSRT(ytResult);
      } catch (error) {
        error.message && console.error(error.message);
      }

      try {
        if (!currentUser) {
          setLoadingTranscript(false)
          return
        }
        const result = await SummaryService.getTranscriptAndSummaryForVideo(
          userId,
          youtubeId
        );
        if (result.success) {
          setSummaries((prev) => [...result.summaries, defaultNewSummary]);
          if(result && result.transcript) {
            setupTranscriptWithInputSRT(result.transcript)
          }
        } 
      } catch (error) {
        setLoadingTranscript(false)
        console.error(error);
      }
    };
    fetchTranscriptAndSummaries();

    return () => {
      setSummaries([defaultNewSummary]);
      resetTranscript();
    }
  }, [userId, youtubeId]);

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
