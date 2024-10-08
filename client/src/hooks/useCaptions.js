import React, { useState, useEffect, useRef } from "react";
import { parseSRTToArray } from "@/utils/utils";

const rawSrt = `1
00:00:00,000 --> 00:00:07,000
早晨呀

2
00:00:24,000 --> 00:00:27,000
為何車子經常都這麼多水

3
00:00:27,000 --> 00:00:29,000
淡淡的尿味

4
00:00:29,000 --> 00:00:31,000
所以這些真的是尿？

5
00:00:31,000 --> 00:00:33,000
應該希望不是

6
00:00:57,000 --> 00:01:18,000
這次是100個移民的故事的開始

7
00:01:18,000 --> 00:01:20,000
你是我們第一位嘉賓阿田

8
00:01:20,000 --> 00:01:21,000
多謝你 歡迎你

9
00:01:21,000 --> 00:01:23,000
希望透過100個移民的故事
`;

export const useCaptions = (videoId) => {
  // state management
  const [file, setFile] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const uploadRef = useRef(null);
  const [masterCaptions, setMasterCaptions] = useState(parseSRTToArray(rawSrt));
  const [subCaptions, setSubCaptions] = useState([]);
  const [audioBlob, setAudioBlob] = useState(null);
  const [currentPlaytime, setCurrentPlaytime] = useState(0);

  const clearMasterCaptions = () => {
    setMasterCaptions([]);
    setSubCaptions([]);
  };

  const clearFile = () => {
    setFile(null);
    setVideoSrc(null);
    setAudioSrc(null);
  };

  const handleFileChange = (acceptedFiles) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      if (acceptedFiles[0].type.startsWith("video/")) {
        const src = URL.createObjectURL(acceptedFiles[0]);
        setVideoSrc(src);
        setAudioSrc(null);
      }
      if (acceptedFiles[0].type.startsWith("audio/")) {
        const src = URL.createObjectURL(acceptedFiles[0]);
        setAudioSrc(src);
        setVideoSrc(null);
      }
    }
  };

  useEffect(() => {
    if (file) {
      setAudioBlob(file);
    }
  }, [file]);

  useEffect(() => {
    // update current playtime every second, using ref
    const interval = setInterval(() => {
      setCurrentPlaytime(uploadRef.current.currentTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentPlaytime, uploadRef]);

  return {
    file,
    setFile,
    videoSrc,
    setVideoSrc,
    audioSrc,
    setAudioSrc,
    uploadRef,
    masterCaptions,
    setMasterCaptions,
    clearMasterCaptions,
    clearFile,
    subCaptions,
    setSubCaptions,
    handleFileChange,
    audioBlob,
    setCurrentPlaytime
  };
};
