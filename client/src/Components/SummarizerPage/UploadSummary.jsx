import React, { useMemo, useRef, useState } from "react";
import { useTranscriptContext } from "../../contexts/TranscriptContext";
import { formatFileSize } from "../Utils";
import { useDropzone } from "react-dropzone";

const UploadSummary = () => {
  // state management
  const [file, setFile] = useState(null);

  // use context
  const {
    setParentSrtText,
    setParentTranscriptText,
    parentSrtText,
    parentTranscriptText,
  } = useTranscriptContext();

  //use Reference
  const videoRef = useRef(null);
  const uploadRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);

  //Dropzone
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { "audio/*": [], "video/*": [] },
      onDrop: (acceptedFiles) => {
        handleFileChange(acceptedFiles);
      },
    });


  const showInfo = (info) => {
    console.log(info);
    return "bg-red-400";
  };

  const className = (...classes) => {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <div>
      {/*Dropzone */}
      <div className="max-w-[600px] mx-auto cursor-pointer">
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {file && file.name ? (
            <p className=" text-gray-950">
              Selected File: {file.name} - {formatFileSize(file.size)}
            </p>
          ) : (
            <p className="">Upload Audio/ Video here</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadSummary;
