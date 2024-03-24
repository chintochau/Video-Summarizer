import React, { useMemo, useRef, useEffect } from "react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import DownloadIcon from "@mui/icons-material/Download";
import {
  baseStyle,
  focusedStyle,
  rejectStyle,
  acceptStyle,
} from "../pages/styles";
import VideoField from "./VideoField";
import { formatFileSize, getYoutubeAudio } from "./Utils";
import TranscriptField from "./TranscriptField";
import SummaryField from "./SummaryField";
import { useVideoContext } from "../contexts/VideoContext";

export default function Summarizer() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [hasYTResult, setHasUTResult] = useState(false);
  const [uploadMode, setUploadMode] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState(
    "https://www.youtube.com/watch?v=r5kukRMmZNI"
  );
  const [youtubeId, setYoutubeId] = useState("");
  const [parentTranscriptText, setParentTranscriptText] = useState("");
  const [parentSrtText, setParentSrtText] = useState("");
  const [videoSrc, setVideoSrc] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);

  const handleInputChange = (event) => {
    setYoutubeLink(event.target.value.trim());
  };

  const videoRef = useRef(null);
  const uploadRef = useRef(null);
  const { setVideoDuration } = useVideoContext();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Extract YouTube video ID from the input
    const youtubeIdFromLink = youtubeLink.match(
      /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    // Set YouTube link and ID states
    if (youtubeIdFromLink) {
      setYoutubeId(youtubeIdFromLink[1]);
      setHasUTResult(true);
    } else {
      setYoutubeId("");
    }
  };

  const handleFileChange = (files) => {
    if (files[0]) {
      setFile(files[0]);
      setFileName(files[0].name);
      setFileSize(files[0].size);
      setUploadMode(true);
      if (files[0].type.startsWith("video/")) {
        console.log(files[0]);
        const src = URL.createObjectURL(files[0]);
        setVideoSrc(src);
        setAudioSrc(null);
      }
      if (files[0].type.startsWith("audio/")) {
        console.log(files[0]);
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
  };

  return (
    <div>
      <div className="relative isolate px-6 lg:px-8 ">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

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
                  <div>
                    <button
                      className="px-3.5 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600  "
                      onClick={handleSubmit}
                      type="submit"
                    >
                      Generate Summary
                    </button>
                    <button
                      className=" text-indigo-600 hover:text-indigo-400 outline outline-2 rounded-md ml-1 px-3.5 py-2.5"
                      onClick={() => getYoutubeAudio({ youtubeLink })}
                    >
                      <DownloadIcon style={{ width: "20px", height: "20px" }} />
                      Audio
                    </button>
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
                        fileName={fileName}
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
              <video
                src={videoSrc}
                ref={uploadRef}
                controls
                className="mx-auto my-2 w-full max-w-7xl "
                onLoadedMetadata={handleLoadedMetadata}
              >
                抱歉，您的瀏覽器不支援內嵌視頻。
              </video>
            )}

            {audioSrc && (
              <audio
                src={audioSrc}
                ref={uploadRef}
                className="mx-auto my-2 w-full max-w-7xl"
                controls
                onLoadedMetadata={handleLoadedMetadata}
              >
                您的瀏覽器不支援 audio 元素。
              </audio>
            )}

            {uploadMode && (
              // Upload Mode shows
              <div className="max-w-screen-2xl mx-auto flex flex-wrap rounded-lg bg-gray-50 my-2">
                <div className="w-full lg:w-1/2 p-1">
                  <TranscriptField
                    videoRef={uploadRef}
                    uploadMode={true}
                    file={file}
                    setParentTranscriptText={setParentTranscriptText}
                    setParentSrtText={setParentSrtText}
                  />
                </div>
                <div className="w-full lg:w-1/2 p-1">
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
    </div>
  );
}
