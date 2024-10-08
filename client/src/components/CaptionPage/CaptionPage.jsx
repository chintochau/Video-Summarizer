import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

import { cn, formatFileSize } from "@/utils/utils";
import { ArrowUpTrayIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useCaptions } from "../../hooks/useCaptions";
import CaptionDisplay from "./CaptionDisplay";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { AudioVisualizer } from "react-audio-visualize";
import { secondsToTime } from "../../utils/timeUtils";

const CaptionPage = () => {
  const {
    file,
    setFile,
    videoSrc,
    setVideoSrc,
    audioSrc,
    setAudioSrc,
    uploadRef,
    masterCaptions,
    setMasterCaptions,
    subCaptions,
    setSubCaptions,
    clearFile,
    clearMasterCaptions,
    handleFileChange,
    audioBlob,
    setCurrentPlaytime,
  } = useCaptions();

  const [hoverPosition, setHoverPosition] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const containerRef = useRef(null);

  const handleMouseMove = (event) => {
    const rect = containerRef.current.getBoundingClientRect();
    const xPosition = event.clientX - rect.left; // Get mouse X position relative to the container
    setHoverPosition(xPosition);

    const percentage = (xPosition / rect.width) * 100;
    setPercentage(percentage);
  };

  const handleMouseLeave = () => {
    setHoverPosition(null); // Hide the bar when mouse leaves
  };

  const handleMouseClick = () => {
    if (uploadRef.current && uploadRef.current.duration) {
      uploadRef.current.currentTime =
        (uploadRef.current.duration * percentage) / 100;
      setCurrentPlaytime(uploadRef.current.currentTime);
    }
  };

  //Dropzone
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { "audio/*": [], "video/*": [] },
      onDrop: (acceptedFiles) => {
        handleFileChange(acceptedFiles);
      },
    });

  return (
    <ResizablePanelGroup
      className="h-screen flex flex-col"
      direction="vertical"
    >
      <ResizablePanel
        className="h-1/2 aspect-video flex items-center justify-center flex-col"
        defaultSize={30}
        minSize={10}
      >
        {!videoSrc && !audioSrc && (
          <div
            {...getRootProps()}
            className={cn(
              "h-full p-4 w-full",
              isFocused ? " border-[#2196f3] bg-blue-200" : "bg-gray-100",
              isDragAccept ? "border-[#00e676] bg-green-200" : "bg-gray-100",
              isDragReject ? "border-[#ff1744] bg-red-200" : "bg-gray-100"
            )}
          >
            <div className=" bg-gray-200 h-full flex flex-col items-center justify-center outline-dashed outline-4 outline-gray-300 rounded-md cursor-pointer">
              <input {...getInputProps()} />
              {file && file.name ? (
                <p className=" text-gray-950">
                  Selected File: {file.name} - {formatFileSize(file.size)}
                </p>
              ) : (
                <div className=" text-gray-600 text-sm flex flex-col items-center text-center font-roboto h-9 justify-center ">
                  <ArrowUpTrayIcon className="w-12 h-12 mr-2 hidden lg:block" />
                  <p>
                    <span className="font-bold ">Choose a file</span> or drag it
                    here
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        {audioSrc && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="flex justify-center items-center w-full">
              <audio
                controls
                src={audioSrc}
                className="w-2/3"
                ref={uploadRef}
              />

              <XCircleIcon
                className="size-8 ml-2 cursor-pointer text-gray-400 hover:text-red-500 duration-300 transition"
                onClick={clearFile}
              />
            </div>
            <p className="text-gray-950 text-center">{file && file.name}</p>
          </div>
        )}
        {videoSrc && (
          <div className="flex justify-center h-full">
            <video controls src={videoSrc} ref={uploadRef} />
          </div>
        )}
        {secondsToTime((percentage / 100) * uploadRef?.current?.duration)}/
        {secondsToTime(uploadRef?.current?.duration)}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-fit h-20"
          onClick={handleMouseClick}
        >
          {/* AudioVisualizer component */}
          <AudioVisualizer
            blob={audioBlob}
            width={uploadRef?.current?.clientWidth}
            height={70}
            barWidth={1}
            ref={uploadRef}
            currentTime={uploadRef?.current?.currentTime}
          />

          {/* Overlay for hover position */}
          {hoverPosition !== null && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: hoverPosition,
                width: "1px",
                height: "100%",
                backgroundColor: "red", // Vertical bar color
                pointerEvents: "none", // Prevent this div from blocking mouse events
              }}
            />
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="overflow-scroll">
        <div className="h-full overflow-auto">
          <CaptionDisplay
            data={{ masterCaptions, subCaptions, clearMasterCaptions }}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default CaptionPage;
