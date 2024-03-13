import React, { useRef, useEffect, useState } from "react";
import { saveAs } from "file-saver";
import {
  getYoutubeTranscript,
  parseSRT,
  exportSRT,
  transcribeWithAI,
} from "./Utils";
import GeneralButton, { OutlinedButton } from "./GeneralButton";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

// Box
const TranscriptBox = ({
  start,
  text,
  onClick,
  index,
  handleTranscriptChange,
}) => {
  const adjustHeight = (e) => {
    e.target.style.height = "auto"; // 先重置高度，允許它縮小
    e.target.style.height = e.target.scrollHeight + "px"; // 然後設置為正確的高度
  };

  return (
    <div className="my-1 flex bg-white shadow-sm mx-2 rounded-sm">
      <div
        className="cursor-pointer underline p-2 pt-0 text-nowrap text-blue-600 hover:text-blue-800"
        onClick={() => onClick(start)}
      >
        {start.split(",")[0] + " :"}
      </div>
      <textarea
        className="w-full focus:outline-none p-1 pt-0 bg-none"
        style={{ overflowY: "hidden", resize: "none" }}
        value={text}
        onChange={(e) => {
          handleTranscriptChange(index, e.target.value);
          adjustHeight(e);
        }}
      ></textarea>
    </div>
  );
};

// Field
const TranscriptField = ({
  youtubeId,
  videoRef,
  setParentTranscriptText,
  uploadMode,
  file,
  setParentSrtText
}) => {
  const [editableTranscript, setEditableTranscript] = useState([]);
  const [viewMode, setViewMode] = useState("transcript"); // 新增狀態變量
  const [fetchingTranscript, setFetchingTranscript] = useState(true);
  const [transcriptAvailable, setTranscriptAvailable] = useState(true);
  const [videoValid, setVideoValid] = useState(false);
  const [generatingScriptWithAi, setGeneratingScriptWithAi] = useState(false);
  const [selectedModel, setSelectedModel] = useState("assembly");
  const [language, setLanguage] = useState("en");

  const resetTranscriptField = () => {
    if (uploadMode) {
      setTranscriptAvailable(false);
      setFetchingTranscript(true);
      setParentTranscriptText("")
    }
  };

  // Get transcript from AI
  const uploadAndTranscriptFile = async () => {
    if (!file) {
      alert("please select a file");
    }

    setGeneratingScriptWithAi(true);
    console.log(selectedModel);

    try {
      const result = await transcribeWithAI({ file, selectedModel, language });

      console.log(result);
      // parse SRT file to a formatted transcript
      const parsedTranscript = parseSRT(result);
      setParentSrtText(result)
      console.log(result);

      setEditableTranscript(parsedTranscript.map((entry) => ({ ...entry }))); // 深拷貝以獨立編輯
      setTranscriptAvailable(true);
      setFetchingTranscript(false);
      setGeneratingScriptWithAi(false);
      setParentTranscriptText(
        parsedTranscript
          .map(({ start, text }) => start.split(",")[0] + " " + text)
          .join("\n")
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Get transcript from YouTube
  const loadYoutubeTranscript = async () => {
    try {
      const result = await getYoutubeTranscript({ youtubeLink: youtubeId });

      const parsedTranscript = parseSRT(result.srt);
      setParentSrtText(result.srt)

      setEditableTranscript(parsedTranscript.map((entry) => ({ ...entry }))); // 深拷貝以獨立編輯
      setTranscriptAvailable(true);
      setFetchingTranscript(false);
      setParentTranscriptText(
        parsedTranscript
          .map(({ start, text }) => start.split(",")[0] + " " + text)
          .join("\n")
      );
    } catch (error) {
      setFetchingTranscript(false);
      setTranscriptAvailable(false);
      setParentTranscriptText("");
    }
  };

  // 切換到轉錄模式
  const handleTranscriptMode = () => {
    setViewMode("transcript");
  };

  // 切換到純文本模式
  const handleTextMode = () => {
    setViewMode("text");
  };

  // 點擊轉錄時跳轉視頻
  const handleTranscriptClick = (time) => {
    const [hours, minutes, seconds] = time.split(":");
    const secondsTotal =
      parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);

    if (videoRef && videoRef.current) {
      videoRef.current.currentTime = secondsTotal;
      if (videoRef.current.internalPlayer) {
        videoRef.current.internalPlayer.seekTo(secondsTotal);
      }
    }
  };

  // 編輯轉錄文本
  const handleTranscriptChange = (index, newText) => {
    const updatedTranscript = editableTranscript.map((entry, i) =>
      i === index ? { ...entry, text: newText } : entry
    );
    setEditableTranscript(updatedTranscript);
  };

  useEffect(() => {
    if (!uploadMode) {
      if (videoRef.current.props.videoId !== "") {
        setVideoValid(true);
        loadYoutubeTranscript();
      } else {
        setVideoValid(false);
        setParentTranscriptText("");
      }
    }
    return () => {
      if (!uploadMode) {
        setEditableTranscript([]);
        setFetchingTranscript(true);
      }
    };
  }, [youtubeId]);

  return (
    <div className="h-[70vw] max-h-[60vh] flex-col">
      {videoValid || uploadMode ? (
        fetchingTranscript ? (
          <div className="flex justify-center h-full items-center">
            {uploadMode ? (
              <div>
                {generatingScriptWithAi ? (
                  <div className="flex-col">
                    <div className="mx-auto animate-spin rounded-full h-10 w-10 border-r-2 border-b-2 border-indigo-600" />{" "}
                    <div>Generating Transcript...</div>
                    <GeneralButton
                      onClick={() => setGeneratingScriptWithAi(false)}
                    >
                      STOP
                    </GeneralButton>
                  </div>
                ) : (
                  <div className="flex-col">
                    <div>Generate Transcript with AI</div>
                    <div className="flex mx-auto  ">
                      <label
                        htmlFor="language-select"
                        className=" text-indigo-600 mr-1"
                      >
                        Language:
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        id="language-select"
                        className="bg-gray-50 border border-indigo-300 text-indigo-600 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block hover:text-indigo-400 "
                      >
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                        {/* Add more languages as needed */}
                      </select>
                    </div>
                    <div className="flex">
                      <label
                        htmlFor="language-select"
                        className=" text-indigo-600 mr-1"
                      >
                        Model:
                      </label>
                      <select
                        value={selectedModel}
                        onChange={(e) => {
                          setSelectedModel(e.target.value);
                        }}
                        id="language-select"
                        className="bg-gray-50 border border-indigo-300 text-indigo-600 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block hover:text-indigo-400 "
                      >
                        <option value="assembly">
                          Assenbly AI (Free for now)
                        </option>
                        <option value="openai">
                          Open AI (Better Performance)
                        </option>
                        {/* Add more languages as needed */}
                      </select>
                    </div>
                    <GeneralButton className="my-2" onClick={uploadAndTranscriptFile}>
                      Generate
                    </GeneralButton>
                    <div className=" w-72">a hour long video takes up to 5 mins to transcribe</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-col">
                <div className="mx-auto animate-spin rounded-full h-10 w-10 border-r-2 border-b-2 border-indigo-600" />{" "}
                <div>Fetching Transcript...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[70vw] max-h-[60vh] flex-col">
            {transcriptAvailable ? (
              <div className="h-full ">
                <div className=" flex pl-2 justify-between">
                  <div className=" flex items-end">
                    <button
                      onClick={handleTranscriptMode}
                      className={` px-2 py-1 rounded-t-md hover:text-indigo-400 ${
                        viewMode === "transcript"
                          ? " text-indigo-600 bg-white "
                          : " text-gray-600"
                      }`}
                    >
                      Transcript
                    </button>
                    <button
                      onClick={handleTextMode}
                      className={` px-2 py-1 rounded-t-md hover:text-indigo-400 ${
                        viewMode !== "transcript"
                          ? " text-indigo-600 bg-white "
                          : " text-gray-600"
                      }`}
                    >
                      Text
                    </button>
                  </div>

                  <div className="">
                    <button
                      onClick={() => exportSRT(editableTranscript)}
                      className="px-2 py-1 rounded-t-md text-indigo-600 text-sm hover:text-indigo-400"
                    >
                      <DownloadIcon /> SRT
                    </button>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          editableTranscript
                            .map(({ text, start }) =>
                              viewMode === "transcript"
                                ? start.split(",")[0] + " " + text
                                : text
                            )
                            .join("\n")
                        )
                      }
                      className="px-2 py-1 rounded-t-md text-indigo-600 text-sm hover:text-indigo-400"
                    >
                      <ContentCopyIcon />
                    </button>
                    <button
                      onClick={resetTranscriptField}
                      className="px-2 py-1 rounded-t-md text-gray-500 text-sm hover:text-indigo-400"
                    >
                      <RestartAltIcon />
                    </button>
                  </div>
                </div>
                {/* transcript box */}

                {/* 根據viewMode渲染不同的內容 */}
                {viewMode === "transcript" ? (
                  <div className="h-[calc(100%-50px)] overflow-y-auto max-h-[calc(100%-50px)]">
                    {editableTranscript.map(({ start, text }, index) => (
                      <TranscriptBox
                        key={index}
                        start={start}
                        text={text}
                        index={index}
                        onClick={handleTranscriptClick}
                        handleTranscriptChange={handleTranscriptChange}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-[calc(100%-50px)]">
                    <textarea
                      className="w-full h-full p-2 mx-2"
                      value={editableTranscript
                        .map(({ text }) => text)
                        .join("\n")}
                      readOnly
                    ></textarea>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center h-full items-center">
                <div>
                  Transcript Not Available
                  <div className=" mx-8">
                    (AI Transcript is currently not available for Youtube Video)
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="flex justify-center h-full items-center">
          Video is Not Valid
        </div>
      )}
    </div>
  );
};

export default TranscriptField;
