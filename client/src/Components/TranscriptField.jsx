import React, { useEffect, useState } from "react";
import {
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
import { useAuth } from "../contexts/AuthContext";
import { checkCredits } from "../utils/creditUtils";
import YoutubeService from "../services/YoutubeService";
import TranscribeService from "../services/TranscribeService";


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
  const [isEditMode, setIsEditMode] = useState(false)

  const { videoCredits, currentPlayTime, currentLine, setCurrentLine, video } = useVideoContext();
  const { credits, userId } = useAuth();

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
    try {
      checkCredits(credits, videoCredits);
      setGeneratingScriptWithAi(true);
      const result = await TranscribeService.transcribeUserUploadFile({
        file,
        language,
        selectedModel,
        videoCredits,
        userId,
        video,

      });
      // parse SRT file to a formatted transcript
      loadSrtTranscript(result);

    } catch (error) {
      console.error(error);
      setGeneratingScriptWithAi(false);
    }
  };

  // Get transcript from YouTube
  const loadYoutubeTranscript = async () => {
    try {
      const result = await YoutubeService.getYoutubeTranscript({ youtubeId });

      loadSrtTranscript(result);

    } catch (error) {

      setFetchingTranscript(false);
      setTranscriptAvailable(false);
      setParentTranscriptText("");

    }
  };

  // get transcript with upload from mongodb
  const loadUploadVideoTranscript = async () => {
    setFetchingTranscript(true);
    try {
      const srtTranscript = await TranscribeService.getVideoTranscript({ sourceId: video.sourceId });
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
      console.error(error.message);
    }
  }

  // generate transcript with AI
  const generateTranscriptWithAIForYoutube = async () => {
    setFetchingTranscript(true);
    try {
      checkCredits(credits, videoCredits);
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
      console.error(error.message);
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
    const updatedTranscript = editableTranscript.map((entry, i) => {

      if (i === index) { return { ...entry, text: newText } }
      else { return entry }
    }
    );
    setEditableTranscript(updatedTranscript);
  };


  // Merge transcript box
  const mergeTranscriptToPrevious = (index) => {
    const updatedTranscript = editableTranscript.map((entry, i) => {
      if (i === index - 1) {
        const nextEntry = editableTranscript[i + 1];
        const mergedText = `${entry.text} ${nextEntry.text}`;
        // merge the next entry to the index -1 entry
        return { ...nextEntry, text: mergedText, start: entry.start };
      } else {
        return entry;
      }
    })
      .filter((entry, i) => i !== index);
    setEditableTranscript(updatedTranscript);
  };

  // Merge transcript box
  const mergeTranscriptToNext = (index) => {
    const updatedTranscript = editableTranscript.map((entry, i) => {
      if (i === index + 1) {
        const nextEntry = editableTranscript[i - 1];
        const mergedText = `${nextEntry.text} ${entry.text}`;
        // merge the previous entry to the index +1 entry
        return { ...nextEntry, text: mergedText, end: entry.end };
      } else {
        return entry;
      }
    })
      .filter((entry, i) => i !== index);
    setEditableTranscript(updatedTranscript);
  };

  // delete transcript box

  const deleteTranscriptBox = (index) => {
    const updatedTranscript = editableTranscript.filter((entry, i) => i !== index);
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
    } else { loadUploadVideoTranscript() }
    return () => {
      if (!uploadMode) {
        setEditableTranscript([]);
        setFetchingTranscript(true);
      }
    };
  }, [youtubeId]);

  return (
    <div className="flex-col h-[calc(100vh-69vw)] md:h-[calc(100vh-38.5vw)] lg:h-[calc(100vh-34.5vw)] 3xl:h-[calc(100vh-730px)]">
      <div className="text-center">{currentLine}</div>
      {videoValid || uploadMode ?

        // youtube Mode
        (
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
                      <button
                        className="my-2 bg-indigo-600 hover:bg-indigo-400 px-3.5 py-2.5 rounded-md text-white disabled:bg-gray-400"
                        onClick={uploadAndTranscriptFile}
                      >
                        Generate (Credits: {videoCredits})
                      </button>
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
          )
            :
            // upload Mode
            (
              <div className="flex-col h-full pt-1 sticky top-0">
                {transcriptAvailable ? (
                  <div className="h-full flex flex-col">
                    <div className=" flex pl-2 justify-between">
                      <div className=" flex items-end">
                        <button
                          onClick={handleTranscriptMode}
                          className={` px-2 py-1 rounded-t-md hover:text-indigo-400 ${viewMode === "transcript"
                            ? " text-indigo-600 bg-white "
                            : " text-gray-600"
                            }`}
                        >
                          Transcript
                        </button>
                        <button
                          onClick={handleTextMode}
                          className={` px-2 py-1 rounded-t-md hover:text-indigo-400 ${viewMode !== "transcript"
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
                          onClick={() => setIsEditMode(!isEditMode)}
                          className={`px-2 py-1 rounded-md text-indigo-600 text-sm hover:text-indigo-400 outline outline-1 outline-indigo-600 ${isEditMode ? " bg-indigo-500 text-white" : ""}`}>
                          Edit
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
                          const isCurrent = currentPlayTime > startTime && currentPlayTime < endTime
                          if (isCurrent) {
                            setCurrentLine(text)
                          }
                          return (
                            <TranscriptBox
                              key={index}
                              start={start}
                              end={end}
                              text={text}
                              index={index}
                              isCurrent={isCurrent}
                              isEditMode={isEditMode}
                              onClick={handleTranscriptClick}
                              handleTranscriptChange={handleTranscriptChange}
                              mergeTranscriptToPrevious={mergeTranscriptToPrevious}
                              deleteTranscriptBox={deleteTranscriptBox}
                              mergeTranscriptToNext={mergeTranscriptToNext}
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
                          className="px-3.5 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-400 disabled:bg-gray-400"
                          onClick={generateTranscriptWithAIForYoutube}
                        >
                          Generate Transcript (Credits: {videoCredits} )<br />
                          Currently Unavailable due to service upgrade
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

// Box
const TranscriptBox = ({
  start,
  end,
  text,
  onClick,
  index,
  handleTranscriptChange,
  isCurrent,
  isEditMode, mergeTranscriptToPrevious, deleteTranscriptBox, mergeTranscriptToNext
}) => {
  const adjustHeight = (e) => {
    e.target.style.height = "auto"; // 先重置高度，允許它縮小
    e.target.style.height = e.target.scrollHeight + "px"; // 然後設置為正確的高度
  };


  return (
    <div
      className={`flex shadow-sm mx-2 rounded-sm  ${isCurrent ? " bg-indigo-100" : " bg-white"
        } hover:bg-indigo-50 cursor-pointer`}
      onClick={() => onClick(start)}
    >
      <div className="p-1 pt-0">
        <div
          className="cursor-pointer underline text-nowrap text-blue-600 hover:text-blue-800"
          onClick={() => onClick(start)}>
          {start.split(",")[0] + " :"}
        </div>
        {isEditMode &&
          <div className=" text-xs text-gray-400">{end.split(",")[0]}</div>}
      </div>

      {!isEditMode ?
        <div className={"text-left" + (isCurrent ? " font-semibold" : "")}>
          {text}
        </div> :
        <div className="flex w-full">
          <textarea
            className="w-full h-full focus:outline-none p-1 pt-0 bg-transparent"
            style={{ overflowY: "hidden", resize: "none" }}
            value={text}
            onChange={(e) => {
              handleTranscriptChange(index, e.target.value);
              adjustHeight(e);
            }}
          />
          <div className="w-10 text-center">
            {/**merge up */}
            {<button className={`text-gray-200  w-full ${index !== 0 && "hover:text-blue-500"}`} onClick={() => mergeTranscriptToPrevious(index)} disabled={index === 0}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
              </svg>
            </button>}
            {/*merge down */}
            <button className=" text-gray-200 hover:text-blue-500 w-full" onClick={() => mergeTranscriptToNext(index)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
              </svg>

            </button>
          </div>
          <button onClick={() => deleteTranscriptBox(index)} className=" text-gray-400 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>

          </button>
        </div>
      }

    </div>
  );
};

export default TranscriptField;
