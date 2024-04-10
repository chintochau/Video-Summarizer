import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranscriptContext } from "../../contexts/TranscriptContext";
import { formatFileSize, generateUUID } from "../Utils";
import Dropzone, { useDropzone } from "react-dropzone";
import HistoryPage from "../../pages/HistoryPage"
import { useVideoContext } from "../../contexts/VideoContext";
import { calculateVideoCredits } from "../../utils/creditUtils";
import TranscriptField from "../TranscriptField";
import SummaryField from "../SummaryField";
import SummaryService from "@/services/SummaryService";
import { useAuth } from "@/contexts/AuthContext";
import { useSummaryContext } from "@/contexts/SummaryContext";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable"

const UploadSummary = () => {
  // state management
  const [file, setFile] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [displayMode, setDisplayMode] = useState("empty")

  // use context
  const { setupTranscriptWithInputSRT, parentSrtText, parentTranscriptText, setLoadingTranscript } = useTranscriptContext();
  const { setSourceId, setSourceType, setSourceTitle, setVideoDuration, setVideoCredits, setCurrentPlayTime, video } = useVideoContext()
  const { setSummaries } = useSummaryContext()
  const { sourceId, sourceType } = video
  const { userId } = useAuth()
  //use Reference
  const uploadRef = useRef(null);

  //Dropzone
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { "audio/*": [], "video/*": [] },
      onDrop: (acceptedFiles) => {
        handleFileChange(acceptedFiles);
      },
    });

  const handleFileChange = (files) => {
    if (files[0]) {
      setFile(files[0]);
      let newSourceId = generateUUID()
      setSourceId(newSourceId)
      setSourceType("user-upload")
      setSourceTitle(files[0].name)
      if (files[0].type.startsWith("video/")) {
        const src = URL.createObjectURL(files[0]);
        setVideoSrc(src);
        setAudioSrc(null);
        setDisplayMode("video")
      }
      if (files[0].type.startsWith("audio/")) {
        const src = URL.createObjectURL(files[0]);
        setAudioSrc(src);
        setVideoSrc(null);
        setDisplayMode("audio")
      }
    }
  };

  // useEffect to set display mode based on sourceId and sourceType
  useEffect(() => {
    if (sourceId && sourceType === "user-upload" && !file) {
      setDisplayMode("transcript")
      SummaryService.getTranscriptAndSummaryForVideo(userId, sourceId).then(result => {
        if (result.success) {
          setSummaries((prev) => [...result.summaries, ...prev]);
          if (result && result.transcript) {
            setupTranscriptWithInputSRT(result.transcript)
          }
        }
        setLoadingTranscript(false)
      }).catch(error => {
        console.error(error)
        setLoadingTranscript(false)
      })
    }
  }, [sourceId, sourceType])


  const className = (...classes) => {
    return classes.filter(Boolean).join(' ')
  }

  const handleLoadedMetadata = () => {
    setVideoDuration(Math.ceil(uploadRef.current.duration));
    setVideoCredits(calculateVideoCredits(uploadRef.current.duration))
  }

  const updatePlayTime = () => {
    if (uploadRef.current) {
      setCurrentPlayTime(uploadRef.current.currentTime);
    }
  };

  // useEffect to add event listener for time update
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


  return (
    <div className="flex flex-col h-full">

      {/*Dropzone */}
      {!file && displayMode === "empty" &&
        <div className="flex flex-col md:flex-row w-full h-screen">

          <div {...getRootProps()} className={className(
            isFocused ? " border-[#2196f3] bg-blue-200" : "",
            isDragAccept ? "border-[#00e676] bg-green-200" : "",
            isDragReject ? "border-[#ff1744] bg-red-200" : "",
            " flex-col w-auto md:w-1/3 flex items-center transition-all duration-300 ease-in-out md:h-[calc(100vh-128px)] cursor-pointer mt-4 md:mx-4 md:mt-16 sticky top-0 h-14 md:top-16 border-2 m-1 rounded-lg bg-gray-50 px-4 shadow-lg")}>
            <input {...getInputProps()} />
            {file && file.name ? (
              <p className=" text-gray-950">
                Selected File: {file.name} - {formatFileSize(file.size)}
              </p>
            ) : (
              <p className=" m-auto text-gray-600 text-xl">Upload Audio/ Video here</p>
            )}
          </div>


          <div className="flex-1 flex-col mx-4 ">
            <div className="flex-1"><HistoryPage sourceType={"user-upload"} /></div>
          </div>

        </div>}


      <div className="h-screen flex flex-col">
        <Dropzone onDrop={handleFileChange}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className={className(
              isFocused ? " border-[#2196f3]" : "",
              isDragAccept ? "border-[#00e676]" : "",
              isDragReject ? "border-[#ff1744]" : "",
              `sticky top-0 md:relative z-40 flex h-14 shrink-0 items-center gap-x-4 border-2 m-1 rounded-lg border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 cursor-pointer`)}>
              <input {...getInputProps()} />
              {file && file.name ? (
                <p className=" text-gray-950 m-auto">
                  Selected File: {file.name} - {formatFileSize(file.size)}
                </p>
              ) : (
                <p className=" m-auto">Upload Audio/ Video here</p>
              )}
            </div>
          )}
        </Dropzone>
        <div className="h-3/6 flex-1 ">

          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel className="flex flex-col flex-1" >
              {displayMode === "video" && <video
                src={videoSrc}
                ref={uploadRef}
                controls
                className="w-full h-auto"
                onLoadedMetadata={handleLoadedMetadata}
              >
                抱歉，您的瀏覽器不支援內嵌視頻。
              </video>}
              {displayMode === "audio" && <audio
                src={audioSrc}
                ref={uploadRef}
                controls
                className="w-full"
                onLoadedMetadata={handleLoadedMetadata}
              >
                抱歉，您的瀏覽器不支援內嵌視頻。
              </audio>}

              <div className=' h-40 flex-1 hidden md:block overscroll-scroll'>
                <TranscriptField
                  videoRef={uploadRef}
                  uploadMode={true}
                  file={file}
                  displayMode="video"
                />
              </div>
              <div className='md:hidden h-[calc(100vh-30vh)]'>
                <SummaryField
                  videoRef={uploadRef}
                  parentTranscriptText={parentTranscriptText}
                  parentSrtText={parentSrtText}
                />
              </div>
            </ResizablePanel >
            <ResizableHandle className="w-1 bg-indigo-100 hidden md:flex" />
            <ResizablePanel className="hidden sticky top-20 shrink-0 md:block w-full md:w-1/2  h-1/2  md:h-full p-1 bg-gray-50">
              <SummaryField
                videoRef={uploadRef}
                parentTranscriptText={parentTranscriptText}
                parentSrtText={parentSrtText}
              />
            </ResizablePanel>

          </ResizablePanelGroup>
        </div>
      </div>

    </div>


  );
};

export default UploadSummary;
