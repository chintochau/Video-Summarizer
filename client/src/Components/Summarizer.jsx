import React, { useMemo, useRef, useEffect } from "react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  baseStyle,
  focusedStyle,
  rejectStyle,
  acceptStyle,
} from "../pages/styles";
import VideoField from "./VideoField";
import { formatFileSize } from "./Utils";
import TranscriptField from "./TranscriptField";
import SummaryField from "./SummaryField";
import GeneralButton from "./GeneralButton";

export default function Summarizer() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [hasResult, setHasResult] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState(
    "https://www.youtube.com/watch?v=0CGTrSHADh4"
  );
  const [youtubeId, setYoutubeId] = useState("");
  const [parentTranscriptText, setParentTranscriptText] = useState("");

  const handleInputChange = (event) => {
    setYoutubeLink(event.target.value.trim());
  };

  const videoRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Extract YouTube video ID from the input
    const youtubeIdFromLink = youtubeLink.match(
      /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    // Set YouTube link and ID states
    if (youtubeIdFromLink) {
      setYoutubeId(youtubeIdFromLink[1]);
      setHasResult(true);
    } else {
      setYoutubeId("");
    }
  };

  const handleFileChange = (files) => {
    if (files[0]) {
      setFile(files[0]);
      setFileName(files[0].name);
      setFileSize(files[0].size);
    }
  };

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

  return (
    <div className="">
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

        <div className="mx-auto pb-16 sm:pb-24 lg:pb-28 text-center">
          {hasResult ? (
            <div className="outline-red-400 mx-auto my-2 flex justify-between outline-dashed outline-2 p-2 rounded-md max-w-[800px]">
              <input
                placeholder="Youtube"
                className=" flex-1 mr-1 py-2.5 indent-2 rounded-md outline-1"
                value={youtubeLink}
                onChange={handleInputChange}
              />
              <button
                className="px-3.5 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600  "
                onClick={handleSubmit}
                type="submit"
              >
                Generate Summary
              </button>
            </div>
          ) : (
            <div id="title-field" className=" pt-16 sm:pt-24 lg:pt-28 mx-auto">
              {/*title */}
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Video Summarizer
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Get YouTube transcript and use AI to summarize YouTube videos in
                one click for free online.
              </p>
              <div className="mx-auto my-2 max-w-7xl flex justify-between outline-dashed outline-2 outline-red-400 p-2 rounded-md w-[800px]">
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

          {hasResult && (
            <div className="max-w-screen-2xl mx-auto flex flex-wrap outline-dashed outline-2 rounded-lg bg-gray-50">
              <VideoField
                fileName={fileName}
                videoRef={videoRef}
                youtubeId={youtubeId}
              />
              <div className="w-full lg:w-1/2 p-1">
                <TranscriptField
                  youtubeId={youtubeId}
                  videoRef={videoRef}
                  setParentTranscriptText={setParentTranscriptText}
                />
              </div>
              <div className="w-full lg:w-1/2 p-1">
                <SummaryField parentTranscriptText={parentTranscriptText} />
              </div>
            </div>
          )}

          <div className=" text-lg">or</div>

          {/*Dropzone*/}
          <div className="flex justify-center py-4">
            <div className="w-[600px]">
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
              <GeneralButton className="mt-2">Upload and Start</GeneralButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
