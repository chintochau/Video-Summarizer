import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranscriptContext } from "../../contexts/TranscriptContext";
import { formatFileSize, generateUUID } from "../Utils";
import Dropzone, { useDropzone } from "react-dropzone";
import HistoryPage from "../../pages/HistoryPage";
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
} from "../ui/resizable";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { CardDescription, CardTitle } from "../ui/card";

const UploadSummary = ({ Bar3Button }) => {
  // state management
  const [file, setFile] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [displayMode, setDisplayMode] = useState("empty");

  // use context
  const {
    setupTranscriptWithInputSRT,
    parentSrtText,
    parentTranscriptText,
    setLoadingTranscript,
    setUtterances,
    setSpeakers,
    setTranscriptId,
  } = useTranscriptContext();
  const {
    setSourceId,
    setSourceType,
    setSourceTitle,
    setVideoDuration,
    setVideoCredits,
    setCurrentPlayTime,
    video,
  } = useVideoContext();
  const { setSummaries, resetSummaries } = useSummaryContext();
  const { sourceId, sourceType } = video;
  const { userId } = useAuth();
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
      let newSourceId = generateUUID();
      setSourceId(newSourceId);
      setSourceType("user-upload");
      setSourceTitle(files[0].name);
      if (files[0].type.startsWith("video/")) {
        const src = URL.createObjectURL(files[0]);
        setVideoSrc(src);
        setAudioSrc(null);
        setDisplayMode("video");
        setLoadingTranscript(false);
      }
      if (files[0].type.startsWith("audio/")) {
        const src = URL.createObjectURL(files[0]);
        setAudioSrc(src);
        setVideoSrc(null);
        setDisplayMode("audio");
        setLoadingTranscript(false);
      }
    }
  };

  // useEffect to set display mode based on sourceId and sourceType
  useEffect(() => {
    if (sourceId && sourceType === "user-upload" && !file) {
      setDisplayMode("transcript");
      SummaryService.getTranscriptAndSummaryForVideo(userId, sourceId)
        .then((result) => {
          if (result.success) {
            resetSummaries();
            setSummaries((prev) => [...result.summaries, ...prev]);
            if (result && result.transcript) {
              setupTranscriptWithInputSRT(result.transcript);
            }
            const { video } = result;
            if (video) {
              setUtterances(video.utterances);
              setSpeakers(video.speakers);
              setTranscriptId(video._id);
            }
          }
          setLoadingTranscript(false);
        })
        .catch((error) => {
          console.error(error);
          setLoadingTranscript(false);
        });
    }
  }, [sourceId, sourceType]);

  const className = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  const handleLoadedMetadata = () => {
    setVideoDuration(Math.ceil(uploadRef.current.duration));
    setVideoCredits(calculateVideoCredits(uploadRef.current.duration));
  };

  const updatePlayTime = () => {
    if (uploadRef.current) {
      setCurrentPlayTime(uploadRef.current.currentTime);
    }
  };

  // useEffect to add event listener for time update
  useEffect(() => {
    const media = uploadRef.current; // Get the current media element
    if (media) {
      media.addEventListener("timeupdate", updatePlayTime);
      // Cleanup function to remove the event listener
      return () => {
        media.removeEventListener("timeupdate", updatePlayTime);
      };
    }
  }, [videoSrc, audioSrc]); // Dependencies array - re-run the effect when these sources change

  return (
    <div className="flex flex-col h-full">
      {/*Dropzone */}
      {!file && displayMode === "empty" && (
        <div className="flex flex-col lg:flex-row h-full">

          <div className=" w-full lg:w-2/5  bg-gray-950 lg:bg-transparent  py-1 pr-1 lg:px-4">

            <div className="w-full sticky top-0 flex">

            {Bar3Button && <Bar3Button />}
              <div className="w-full">
                <CardTitle className="text-secondary/70 pt-10 px-2 hidden lg:block">Step 1 of 3: Choose an audio or video file</CardTitle>
                <CardDescription className="text-gray-950 px-2 hidden lg:block">
                  We support most common audio and video formats. The maximum file size is 100 MB.
                </CardDescription>
  
                <dropbox
                  {...getRootProps()}
                  className={className(
                    " flex-col flex items-center transition-all duration-300 ease-in-out lg:w-full lg:aspect-square cursor-pointer  rounded-lg w-full lg:p-2 ",
                    isFocused ? " border-[#2196f3] bg-blue-200" : "bg-gray-100",
                    isDragAccept ? "border-[#00e676] bg-green-200" : "bg-gray-100",
                    isDragReject ? "border-[#ff1744] bg-red-200" : "bg-gray-100"
                  )}
                >
                  <div className="size-full border-dashed lg:border-2 flex items-center justify-center">
                    <input {...getInputProps()} />
                    {file && file.name ? (
                      <p className=" text-gray-950">
                        Selected File: {file.name} - {formatFileSize(file.size)}
                      </p>
                    ) : (
                      <div className=" text-gray-600 text-sm flex flex-col items-center text-center font-roboto h-9 justify-center ">
                        <ArrowUpTrayIcon className="w-12 h-12 mr-2 hidden lg:block" />
                        <p><span className="font-bold ">Choose a file</span> or drag it here</p>
                      </div>
                    )}
                  </div>
                </dropbox>
              </div>

            </div>

          </div>

          {/* <div className=" border my-4 mr-4" /> */}

          <div className="flex-1">
            <CardTitle className="text-secondary/70 pt-10 px-2 hidden lg:block">History</CardTitle>
            <CardDescription className="text-gray-950 px-2 hidden lg:block">
              View your past uploads and summaries
            </CardDescription>
            <HistoryPage sourceType={"user-upload"} />
          </div>
        </div>
      )}

      {displayMode !== "empty" && (
        <div className="h-screen flex flex-col">
          <div className=" flex w-full">
            {Bar3Button && <Bar3Button />}
            <Dropzone onDrop={handleFileChange}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className={className(
                    isFocused ? " border-[#2196f3]" : "",
                    isDragAccept ? "border-[#00e676]" : "",
                    isDragReject ? "border-[#ff1744]" : "",
                    `flex h-10 lg:h-14 sm:h-10 items-center gap-x-4 border-2 m-1 rounded-lg border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 cursor-pointer text-sm w-full`
                  )}
                >
                  <input {...getInputProps()} />
                  {file && file.name ? (
                    <p className=" text-gray-950 m-auto">
                      Selected File: {file.name} - {formatFileSize(file.size)}
                    </p>
                  ) : (
                    // 100 mb maximum file size for free plan
                    <p className=" m-auto">Upload Audio/ Video here (100 MB limitation for now)</p>
                  )}
                </div>
              )}
            </Dropzone>
          </div>
          <div className="h-3/6 flex-1 ">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel className="flex flex-col flex-1">
                {displayMode === "video" && (
                  <video
                    src={videoSrc}
                    ref={uploadRef}
                    controls
                    className="w-full h-auto"
                    onLoadedMetadata={handleLoadedMetadata}
                  >
                    抱歉，您的瀏覽器不支援內嵌視頻。
                  </video>
                )}
                {displayMode === "audio" && (
                  <audio
                    src={audioSrc}
                    ref={uploadRef}
                    controls
                    className="w-full"
                    onLoadedMetadata={handleLoadedMetadata}
                  >
                    抱歉，您的瀏覽器不支援內嵌視頻。
                  </audio>
                )}

                <div className=" h-40 flex-1 hidden md:block overscroll-scroll">
                  <TranscriptField
                    videoRef={uploadRef}
                    uploadMode={true}
                    file={file}
                    displayMode="video"
                  />
                </div>
                <div className="md:hidden h-[calc(100vh-30vh)]">
                  <SummaryField
                    videoRef={uploadRef}
                    parentTranscriptText={parentTranscriptText}
                    parentSrtText={parentSrtText}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle className="bg-indigo-100 hidden md:flex" />
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
      )}
    </div>
  );
};

export default UploadSummary;
