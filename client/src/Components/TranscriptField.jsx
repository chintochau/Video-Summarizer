import React, { useEffect, useState } from "react";
import {
  getYoutubeTranscript,
  parseSRT,
  exportSRT,
  transcribeWithAI,
  transcribeYoutubeVideo,
} from "./Utils";
import GeneralButton from "./GeneralButton";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useVideoContext } from "../contexts/VideoContext";
import { timeToSeconds } from "../utils/timeUtils";

// Box
const TranscriptBox = ({
  start,
  text,
  onClick,
  index,
  handleTranscriptChange,
  isCurrent,
}) => {
  const adjustHeight = (e) => {
    e.target.style.height = "auto"; // 先重置高度，允許它縮小
    e.target.style.height = e.target.scrollHeight + "px"; // 然後設置為正確的高度
  };

  return (
    <div
      className={`flex shadow-sm mx-2 rounded-sm  ${
        isCurrent ? " bg-indigo-100" : " bg-white"
      } hover:bg-indigo-50 cursor-pointer`}
      onClick={() => onClick(start)}
    >
      <div
        className="cursor-pointer underline p-2 pt-0 text-nowrap text-blue-600 hover:text-blue-800"
        onClick={() => onClick(start)}
      >
        {start.split(",")[0] + " :"}
      </div>
      <div className={"text-left" + (isCurrent ? " font-semibold" : "")}>{text}</div>

      {/* <textarea
        className="w-full focus:outline-none p-1 pt-0 bg-none"
        style={{ overflowY: "hidden", resize: "none" }}
        value={text}
        onChange={(e) => {
          handleTranscriptChange(index, e.target.value);
          adjustHeight(e);
        }}
      ></textarea> */}
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
  setParentSrtText,
}) => {
  const [editableTranscript, setEditableTranscript] = useState([]);
  const [viewMode, setViewMode] = useState("transcript"); // 新增狀態變量
  const [fetchingTranscript, setFetchingTranscript] = useState(true);
  const [transcriptAvailable, setTranscriptAvailable] = useState(true);
  const [videoValid, setVideoValid] = useState(false);
  const [generatingScriptWithAi, setGeneratingScriptWithAi] = useState(false);
  const [selectedModel, setSelectedModel] = useState("assembly");
  const [language, setLanguage] = useState("en");

  const { videoCredits, currentPlayTime } = useVideoContext();

  const resetTranscriptField = () => {
    if (uploadMode) {
      setTranscriptAvailable(false);
      setFetchingTranscript(true);
      setParentTranscriptText("");
    }
  };

  // load SRT transcript
  function loadSrtTranscript(srt) {
    setParentSrtText(srt);
    const parsedTranscript = parseSRT(srt);
    setEditableTranscript(parsedTranscript.map((entry) => ({ ...entry }))); // 深拷貝以獨立編輯
    setTranscriptAvailable(true);
    setFetchingTranscript(false);
    setGeneratingScriptWithAi(false);
    setParentTranscriptText(
      parsedTranscript
        .map(({ start, text }) => start.split(",")[0] + " " + text)
        .join("\n")
    );
  }

  // Get transcript from AI
  const uploadAndTranscriptFile = async () => {
    if (!file) {
      alert("please select a file");
    }

    setGeneratingScriptWithAi(true);
    console.log(selectedModel);

    try {
      const result = await transcribeWithAI({ file, selectedModel, language });
      // parse SRT file to a formatted transcript
      loadSrtTranscript(result);
    } catch (error) {
      console.error(error);
    }
  };

  // Get transcript from YouTube
  const loadYoutubeTranscript = async () => {
    try {
      const result = await getYoutubeTranscript({ youtubeLink: youtubeId });
      loadSrtTranscript(result.srt);
    } catch (error) {
      setFetchingTranscript(false);
      setTranscriptAvailable(false);
      setParentTranscriptText("");
    }
  };

  // generate transcript with AI
  const generateTranscriptWithAI = async () => {
    setFetchingTranscript(true);
    try {
      const srtTranscript = await transcribeYoutubeVideo({ youtubeId });
      if (!srtTranscript) {
        setFetchingTranscript(false);
        setTranscriptAvailable(false);
        setParentTranscriptText("");
      }

      loadSrtTranscript(srtTranscript);
    } catch (error) {
      setFetchingTranscript(false);
      setTranscriptAvailable(false);
      setParentTranscriptText("");
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);
  // get transcript with upload
  const getTranscriptWithUpload = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const srt = e.target.result;
      loadSrtTranscript(srt);
    };

    reader.readAsText(file);
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
    <div className="flex-col h-full">
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
                  <div className="flex-col ">
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
                    <GeneralButton
                      className="my-2"
                      onClick={uploadAndTranscriptFile}
                    >
                      Generate
                    </GeneralButton>
                    <div className=" w-72">
                      a hour long video takes up to 5 mins to transcribe
                    </div>
                    <div>OR</div>
                    <div>
                      <input
                        type="file"
                        onChange={(e) =>
                          getTranscriptWithUpload(e.target.files[0])
                        }
                      />
                      {selectedFile && (
                        <p>Selected File: {selectedFile.name}</p>
                      )}
                    </div>
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
          <div className="flex-col h-full pt-1">
            {transcriptAvailable ? (
              <div className="h-full flex flex-col">
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
                {/* 根據viewMode渲染不同的內容 */}
                {/* Transcript Box */}
                {viewMode === "transcript" ? (
                  <div className="overflow-auto">
                    {editableTranscript.map(({ start, end, text }, index) => {
                      const startTime = timeToSeconds(start.split(",")[0]);
                      const endTime = timeToSeconds(end.split(",")[0]);
                      const isCurrent =
                        currentPlayTime > startTime - 0.1 &&
                        currentPlayTime < endTime + 0.1;

                      return (
                        <TranscriptBox
                          key={index}
                          start={start}
                          text={text}
                          index={index}
                          isCurrent={isCurrent}
                          onClick={handleTranscriptClick}
                          handleTranscriptChange={handleTranscriptChange}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full pl-2 overflow-hidden">
                    <textarea
                      className="w-full h-full px-2"
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
                    <button
                      className="px-3.5 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-400 "
                      onClick={generateTranscriptWithAI}
                    >
                      Generate Transcript (Credits: {videoCredits} )
                    </button>
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
