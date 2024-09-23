import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

import { cn, formatFileSize } from "../../utils/Utils";
import { ArrowUpTrayIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useCaptions } from "../../hooks/useCaptions";
import CaptionDisplay from "./CaptionDisplay";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
    handleFileChange
  } = useCaptions();

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
        className="h-1/2 aspect-video flex items-center justify-center"
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
              <audio controls src={audioSrc} className="w-2/3" />
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
            <video controls src={videoSrc} />
          </div>
        )}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="overflow-scroll">
        <div className="h-full overflow-auto">
          <CaptionDisplay data={{ masterCaptions, subCaptions, clearMasterCaptions }} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default CaptionPage;
