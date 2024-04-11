import React, { useMemo, useRef, useEffect } from "react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import {DocumentArrowDownIcon} from "@heroicons/react/24/outline"
import {
  baseStyle,
  focusedStyle,
  rejectStyle,
  acceptStyle,
} from "../pages/styles";
import VideoField from "./YTVideoField";
import { formatFileSize, generateUUID } from "./Utils";
import TranscriptField from "./TranscriptField";
import SummaryField from "./SummaryField";
import { useVideoContext } from "../contexts/VideoContext";
import { calculateVideoCredits } from "../utils/creditUtils";
import YoutubeService from "../services/YoutubeService";
import { Button } from "./ui/button";

export default function Summarizer() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [hasYTResult, setHasYTResult] = useState(false);
  const [uploadMode, setUploadMode] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState(
    "https://www.youtube.com/watch?v=Jsk6fHuIwy4"
  );
  const [parentTranscriptText, setParentTranscriptText] = useState("");
  const [parentSrtText, setParentSrtText] = useState("");
  const [videoSrc, setVideoSrc] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);

  const handleInputChange = (event) => {
    setYoutubeLink(event.target.value.trim());
  };

  const videoRef = useRef(null);
  const uploadRef = useRef(null);
  const { setVideoDuration, setCurrentPlayTime, setSourceId,setSourceType, setSourceTitle,setVideoCredits,youtubeId,setYoutubeId } = useVideoContext();

  useEffect(() => {
    if (youtubeId) {
      setHasYTResult(true)
    }
  

  }, [youtubeId])
  

  const handleSubmit = (event) => {
    event.preventDefault();
    // Extract YouTube video ID from the input
    const youtubeIdFromLink = youtubeLink.match(
      /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    // Set YouTube link and ID states
    if (youtubeIdFromLink) {
      setYoutubeId(youtubeIdFromLink[1]);
      setHasYTResult(true);
    } else {
      setYoutubeId("");
    }
  };


  const updatePlayTime = () => {
    if (uploadRef.current) {
      setCurrentPlayTime(uploadRef.current.currentTime);
    }
  };
  
  useEffect(() => {
    const media = uploadRef.current; // Get the current media element

    if (media) {
      media.addEventListener('timeupdate', updatePlayTime);

      // Cleanup function to remove the event listener
      return () => {
        media.removeEventListener('timeupdate', updatePlayTime);
      };
    }
  }, [videoSrc, audioSrc]); // Dependencies array - re-run the effect when these sources change


  const handleFileChange = (files) => {
    if (files[0]) {
      setFile(files[0]);
      setFileName(files[0].name);
      setFileSize(files[0].size);
      
      setSourceId(generateUUID())
      setSourceType("user-upload")
      setSourceTitle(files[0].name)

      setUploadMode(true);
      if (files[0].type.startsWith("video/")) {
        const src = URL.createObjectURL(files[0]);
        setVideoSrc(src);
        setAudioSrc(null);
      }
      if (files[0].type.startsWith("audio/")) {
        const src = URL.createObjectURL(files[0]);
        setAudioSrc(src);
        setVideoSrc(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
        console.log("released V:", videoSrc);
      }
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
        console.log("released A:", audioSrc);
      }
    };
  }, [videoSrc, audioSrc]);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { "audio/*": [], "video/*": [] },
      onDrop: (acceptedFiles) => {
        handleFileChange(acceptedFiles);
      },
    });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const handleLoadedMetadata = () => {
    // Access the video duration here

    setVideoDuration(Math.ceil(uploadRef.current.duration));
    setVideoCredits(calculateVideoCredits(uploadRef.current.duration))
  };

  return (
    <div className="">
      {/*Main structure*/}
      <div className="mx-auto pb-16 sm:pb-24 lg:pb-28 text-center flex flex-col">
        {uploadMode ? null : ( // upload Mode: hide all
          //Youtube Mode
          <div className="">
            {hasYTResult ? (
              <div className="mx-auto my-1 flex flex-wrap justify-between max-w-[1280px]">
                <input
                  placeholder="Youtube"
                  className=" flex-1 mr-1 py-2.5 indent-2 rounded-md outline-1"
                  value={youtubeLink}
                  onChange={handleInputChange}
                />
                <div className="flex items-center gap-x-1 mr-2">
                  <Button
                    className="h-full"
                    onClick={handleSubmit}
                    type="submit"
                  >
                    Generate Summary
                  </Button>
                  <Button
                  variant="outline"
                    className="h-full"
                    onClick={() => YoutubeService.getYoutubeAudio({ youtubeLink })}
                  >
                    <DocumentArrowDownIcon className="w-6 h-6"/>
                    <div>
                      Audio
                      </div>
                  </Button>
                </div>
              </div>
            ) : (
              <div
                id="title-field"
                className=" pt-16 sm:pt-24 lg:pt-28 mx-auto"
              >
                {/*title */}
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Video Summarizer
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Get YouTube transcript and use AI to summarize YouTube
                  videos in one click for free online.
                </p>
                <div className="mx-auto my-2 max-w-3xl flex justify-between ">
                  <input
                    placeholder="Youtube"
                    className=" flex-1 mr-1 py-2.5 indent-2 rounded-md outline-1"
                    value={youtubeLink}
                    onChange={handleInputChange}
                  />
                  <button
                    className="px-3.5 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
                    onClick={handleSubmit}
                    type="submit"
                  >
                    Start
                  </button>
                </div>
              </div>
            )}

            {/*Result */}

            {hasYTResult && (
              <div className="max-w-[1920px] mx-auto flex bg-gray-50 h-[calc(80vh)] flex-1 flex-col md:flex-row min-h-[800px] overflow-auto">
                <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col h-full p-1">
                  <div className="w-full">
                    <VideoField
                      videoRef={videoRef}
                      youtubeId={youtubeId}
                    />
                  </div>

                  <div className="w-full md:flex-1 h-60">
                    <TranscriptField
                      youtubeId={youtubeId}
                      videoRef={videoRef}
                      setParentTranscriptText={setParentTranscriptText}
                      setParentSrtText={setParentSrtText}
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-2/5 h-1/2  md:h-full p-1">
                  <SummaryField
                    videoRef={videoRef}
                    parentTranscriptText={parentTranscriptText}
                    parentSrtText={parentSrtText}
                  />
                </div>
              </div>
            )}

            <div className="text-lg">or</div>
          </div>
        )}

        {/*Dropzone*/}
        <div className="flex-col justify-center py-4">
          
          <div className="max-w-[600px] mx-auto cursor-pointer">
            <div {...getRootProps({ style })}>
              <input {...getInputProps()} />
              {fileName ? (
                <p className=" text-gray-950">
                  Selected File: {fileName} - {formatFileSize(fileSize)}
                </p>
              ) : (
                <p className="">Upload Audio/ Video here</p>
              )}
            </div>
          </div>

          {videoSrc && (
            <div className=" sticky top-14 z-10 bg-white">
            <video
              src={videoSrc}
              ref={uploadRef}
              controls
              className="mx-auto my-2 max-w-7xl sticky top-20 z-10 max-h-[35vh]"
              onLoadedMetadata={handleLoadedMetadata}
            >
              抱歉，您的瀏覽器不支援內嵌視頻。
            </video>
            </div>
          )}

          {audioSrc && (
            <div className=" sticky top-14 z-10 bg-gray-50 py-2 ">
              <audio
                src={audioSrc}
                ref={uploadRef}
                className="mx-auto my-2 w-full max-w-7xl "
                controls
                onLoadedMetadata={handleLoadedMetadata}
              >
                您的瀏覽器不支援 audio 元素。
              </audio>
            </div>
          )}

          {uploadMode && (
            // Upload Mode shows
            <div className={`max-w-screen-2xl mx-auto flex flex-wrap rounded-lg bg-gray-50 my-2 ${videoSrc ? "h-[50vh]":"h-[70vh]"}`}>
              <div className="w-full lg:w-1/2 p-1 h-full">
                <TranscriptField
                  videoRef={uploadRef}
                  uploadMode={true}
                  file={file}
                  setParentTranscriptText={setParentTranscriptText}
                  setParentSrtText={setParentSrtText}
                />
              </div>
              <div className="w-full lg:w-1/2 p-1 h-full">
                <SummaryField
                  videoRef={uploadRef}
                  parentTranscriptText={parentTranscriptText}
                  parentSrtText={parentSrtText}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
