import React, { useEffect, useState } from "react";
import {
  parseSRTToArray,
  exportSRT,
  transcribeWithAI,
  transcribeYoutubeVideo,
} from "./Utils";
import { useVideoContext } from "../contexts/VideoContext";
import { timeToSeconds } from "../utils/timeUtils";
import { useAuth } from "../contexts/AuthContext";
import { checkCredits } from "../utils/creditUtils";
import TranscribeService from "../services/TranscribeService";
import ControlBar from "./transcriptFieldComponents/ControlBar";
import { ChevronDoubleDownIcon, ChevronDoubleUpIcon, XCircleIcon } from '@heroicons/react/24/outline'
import GenerateOptions from "./transcriptFieldComponents/GenerateOptions";
import { useTranscriptContext } from "@/contexts/TranscriptContext";


// Field
const TranscriptField = (params) => {
  const { youtubeId, videoRef, file, displayMode } = params;
  const [viewMode, setViewMode] = useState("transcript"); // 新增狀態變量
  const [isEditMode, setIsEditMode] = useState(false)
  const { videoCredits, currentPlayTime, currentLine, setCurrentLine, video } = useVideoContext();
  const { parentTranscriptText,
    selectedTranscribeOption, transcriptAvailable, selectedTranscriptionLanguage,
    setupTranscriptWithInputSRT, resetTranscript,
    generatingTranscriptWithAI,
    setGeneratingTranscriptWithAI,
    loadingTranscript,
    editableTranscript,
    setEditableTranscript
  } = useTranscriptContext()
  const { credits, userId } = useAuth();

  useEffect(() => {
    setCurrentLine("")
  }, [])

  const generateTranscript = async () => {
    let result
    if (displayMode !== "youtube" && !file) {
      alert("please select a file");
    }
    try {
      checkCredits(credits, videoCredits);
      setGeneratingTranscriptWithAI(true);
      switch (displayMode) {
        case "youtube":
          result = await transcribeYoutubeVideo({
            youtubeId, userId, video,
            transcribeOption: selectedTranscribeOption
          });
          break;
        default: // file
          result = await TranscribeService.transcribeUserUploadFile({
            file,
            language: selectedTranscriptionLanguage,
            videoCredits,
            userId,
            video,
            transcribeOption: selectedTranscribeOption
          });
          break;
      }
      setupTranscriptWithInputSRT(result);
    } catch (error) {
      resetTranscript();
      alert(error.message);
    }
  }

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

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className={
      classNames(
        displayMode === "audio" ? " h-[calc(100vh-160px)]" : "",
        displayMode === "video" ? " h-[calc(100vh-69vw)] md:h-[calc(100vh-38.5vw)] lg:h-[calc(100vh-34.5vw)] 3xl:h-[calc(100vh-730px)]" : "",
        displayMode === "transcript" ? " h-[calc(100vh-80px)] " : "",
        "flex-col h-full flex"
      )
    }>
      <div className="text-center font-semibold border border-gray-50 mt-1 rounded-sm text-lg shadow-sm ">{currentLine}</div>

      {loadingTranscript ? (
        <div className="flex-col">
          <div className="mx-auto animate-spin rounded-full h-10 w-10 border-r-2 border-b-2 border-indigo-600" />{" "}
          <div>Fetching Transcript...</div>
        </div>
      ) :
        (
          <div className="h-40 flex-1">
            {generatingTranscriptWithAI ? (
              <div className="flex-col">
                <div className="mx-auto animate-spin rounded-full h-10 w-10 border-r-2 border-b-2 border-indigo-600" />{" "}
                <div>Generating Transcript...</div>
                <button>Cancel</button>
              </div>) : (<div className="flex-col h-full">
                {transcriptAvailable ? (
                  <div className="h-full flex flex-col">
                    <ControlBar
                      exportSRT={exportSRT}
                      setIsEditMode={setIsEditMode}
                      isEditMode={isEditMode}
                      setViewMode={setViewMode}
                      editableTranscript={editableTranscript}
                      viewMode={viewMode}
                    />
                    {/* 根據viewMode渲染不同的內容 */}
                    {/* Transcript Box */}

                    {viewMode === "transcript" ? (
                      <ul className="overflow-auto pb-8 bg-gray-50 h-full">
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
                              setCurrentLine={setCurrentLine}
                              onClick={handleTranscriptClick}
                              handleTranscriptChange={handleTranscriptChange}
                              mergeTranscriptToPrevious={mergeTranscriptToPrevious}
                              deleteTranscriptBox={deleteTranscriptBox}
                              mergeTranscriptToNext={mergeTranscriptToNext}
                            />
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="h-full p-1 overflow-hidden pb-4 ">
                        <textarea
                          className="w-full h-full px-2 border-none rounded-md resize-none bg-gray-50"
                          value={parentTranscriptText}
                          readOnly
                        ></textarea>
                      </div>
                    )}

                  </div>
                ) : (<GenerateOptions
                  loadSrtTranscript={setupTranscriptWithInputSRT}
                  generateTranscript={generateTranscript}
                />)
                }
              </div>)}
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
    <li
      className={`flex shadow-sm mx-2 rounded-md  ${isCurrent ? " bg-indigo-100" : " bg-gray-50"
        } hover:outline outline-1 outline-indigo-300 cursor-pointer`}
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
            className="block w-full resize-none border-0 border-b border-transparent p-0  text-gray-900  focus:border-indigo-600 focus:ring-0 sm:text-lg sm:leading-6 overflow-hidden"
            value={text}
            onChange={(e) => {
              handleTranscriptChange(index, e.target.value);
              adjustHeight(e);
            }}
          />
          <div className="w-10 text-center">
            {/**merge up */}
            {<button className={`text-gray-200  w-full ${index !== 0 && "hover:text-blue-500"}`} onClick={() => mergeTranscriptToPrevious(index)} disabled={index === 0}>
              <ChevronDoubleUpIcon className="w-6 h-6" />
            </button>}
            {/*merge down */}
            <button className=" text-gray-200 hover:text-blue-500 w-full" onClick={() => mergeTranscriptToNext(index)}>
              <ChevronDoubleDownIcon className="w-6 h-6" />
            </button>
          </div>
          <button onClick={() => deleteTranscriptBox(index)} className=" text-gray-400 hover:text-red-500">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
      }
    </li>
  );
};

export default TranscriptField;
