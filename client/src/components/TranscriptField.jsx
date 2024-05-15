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
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import GenerateOptions from "./transcriptFieldComponents/GenerateOptions";
import { useTranscriptContext } from "@/contexts/TranscriptContext";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import UploadService from "@/services/UploadService";

// Field
const TranscriptField = (params) => {
  const { youtubeId, videoRef, file, displayMode } = params;
  const [viewMode, setViewMode] = useState("transcript"); // 新增狀態變量
  const [isEditMode, setIsEditMode] = useState(false);
  const { videoCredits, currentPlayTime, currentLine, setCurrentLine, video } =
    useVideoContext();
  const {
    parentTranscriptText,
    selectedTranscribeOption,
    transcriptAvailable,
    selectedTranscriptionLanguage,
    setupTranscriptWithInputSRT,
    resetTranscript,
    generatingTranscriptWithAI,
    setGeneratingTranscriptWithAI,
    loadingTranscript,
    editableTranscript,
    setEditableTranscript,
  } = useTranscriptContext();
  const { credits, userId } = useAuth();
  const [transcribeProgress, setTranscribeProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setCurrentLine("");
  }, []);

  const onTranscribeProgress = (progress) => {
    if (progress === -100) {
      setErrorMessage("Transcription failed, pleaser retry.");
    } else {
      setTranscribeProgress(progress);
    }
  };
  const onUploadProgress = (progress) => {
    setUploadProgress(progress);
  };

  const resetProgress = () => {
    setTranscribeProgress(0);
    setUploadProgress(0);
  };

  const abortTranscription = () => {
    setGeneratingTranscriptWithAI(false);
    resetProgress();
    TranscribeService.abortTranscription();
  };

  // upload to cloudinary, send link to transcribe
  const uploadToCloudAndTranscribe = async () => {
    resetProgress();
    setGeneratingTranscriptWithAI(true);
    try {
      // console.log("using fake link");
      if (displayMode === "youtube") {
        generateTranscript({fileLink:null, publicId:null, resourceType:null});
      } else {
        const uploadResult = await UploadService.uploadVideo(
          file,
          onUploadProgress
        );
        const data = {
          fileLink: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          resourceType: uploadResult.resource_type,
        };

        generateTranscript(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // transcribe video, youtube video, file upload or link
  const generateTranscript = async ({ fileLink, publicId, resourceType }) => {
    let result;

    if (displayMode !== "youtube" && !file && !fileLink) {
      alert("please select a file");
    }
    
    try {
      checkCredits(credits, videoCredits);
      setGeneratingTranscriptWithAI(true);
      switch (displayMode) {
        case "youtube":
          result = await transcribeYoutubeVideo({
            youtubeId,
            userId,
            video,
            transcribeOption: selectedTranscribeOption,
          });
          break;
        default: // file
          if (!fileLink) {
            result = await TranscribeService.transcribeUserUploadFile({
              file,
              language: selectedTranscriptionLanguage,
              videoCredits,
              userId,
              video,
              transcribeOption: selectedTranscribeOption,
            });
          } else {
            result = await TranscribeService.transcribeUserUploadFileWithLink(
              {
                // user api/processVideo
                link: fileLink,
                publicId,
                resourceType,
                language: selectedTranscriptionLanguage,
                videoCredits,
                userId,
                video,
                transcribeOption: selectedTranscribeOption,
              },
              onTranscribeProgress
            );
          }
          break;
      }
      setupTranscriptWithInputSRT(result);
    } catch (error) {
      resetTranscript();
      console.error(error);
    }
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
      if (i === index) {
        return { ...entry, text: newText };
      } else {
        return entry;
      }
    });
    setEditableTranscript(updatedTranscript);
  };

  // Merge transcript box
  const mergeTranscriptToPrevious = (index) => {
    const updatedTranscript = editableTranscript
      .map((entry, i) => {
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
    const updatedTranscript = editableTranscript
      .map((entry, i) => {
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
    const updatedTranscript = editableTranscript.filter(
      (entry, i) => i !== index
    );
    setEditableTranscript(updatedTranscript);
  };

  return (
    <div className="flex-col h-full flex">
      <div className="text-center font-semibold border border-gray-50 mt-1 rounded-sm text-lg shadow-sm ">
        {currentLine}
      </div>

      {loadingTranscript ? (
        <div className="flex-col pt-12">
          <Loader2 className="mx-auto size-16 opacity-20 animate-spin" />
          <div className="text-center text-lg">Fetching Transcript...</div>
        </div>
      ) : (
        <div className="h-full md:h-96 flex-1">
          {generatingTranscriptWithAI ? (
            <Card className="m-4">
              <CardHeader>
                <CardTitle>Generating Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <Loader2 className="mx-auto size-16 opacity-20 animate-spin" />
                {uploadProgress > 0 && (
                  <div>
                    <Label>Uploading to Cloud...</Label>
                    <Progress value={uploadProgress} />
                  </div>
                )}
                {uploadProgress === 100 && (
                  <div>
                    <Label>Connecting to server...</Label>
                  </div>
                )}
                {transcribeProgress > 0 && (
                  <div>
                    <Label>Transcribing...</Label>
                    <Progress value={transcribeProgress} />
                  </div>
                )}
                {errorMessage && (
                  <div className="text-red-500">{errorMessage}</div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={abortTranscription}>Cancel</Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex-col h-full">
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
                    <ScrollArea className="bg-gray-50 h-full">
                      {editableTranscript.map(({ start, end, text }, index) => {
                        const startTime = timeToSeconds(start.split(",")[0]);
                        const endTime = timeToSeconds(end.split(",")[0]);
                        const isCurrent =
                          currentPlayTime > startTime &&
                          currentPlayTime < endTime;
                        if (isCurrent) {
                          setCurrentLine(text);
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
                            mergeTranscriptToPrevious={
                              mergeTranscriptToPrevious
                            }
                            deleteTranscriptBox={deleteTranscriptBox}
                            mergeTranscriptToNext={mergeTranscriptToNext}
                          />
                        );
                      })}
                      <div className="h-12"></div>
                    </ScrollArea>
                  ) : (
                    <div className="md:h-full p-1">
                      <Textarea
                        className="w-full h-[80vh] md:h-full px-2 border-none resize-none bg-gray-50"
                        value={parentTranscriptText}
                        readOnly
                      ></Textarea>
                    </div>
                  )}
                </div>
              ) : (
                <GenerateOptions
                  loadSrtTranscript={setupTranscriptWithInputSRT}
                  generateTranscript={generateTranscript}
                  uploadToCloudAndTranscribe={uploadToCloudAndTranscribe}
                />
              )}
            </div>
          )}
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
  isEditMode,
  mergeTranscriptToPrevious,
  deleteTranscriptBox,
  mergeTranscriptToNext,
}) => {
  const adjustHeight = (e) => {
    e.target.style.height = "auto"; // 先重置高度，允許它縮小
    e.target.style.height = e.target.scrollHeight + "px"; // 然後設置為正確的高度
  };

  return (
    <div
      className={`flex shadow-sm mx-2 rounded-md  ${
        isCurrent ? " bg-indigo-100" : " bg-gray-50"
      } hover:outline outline-1 outline-indigo-300 cursor-pointer`}
      onClick={() => onClick(start)}
    >
      <div className="p-1 pt-0">
        <div
          className="mr-1 cursor-pointer underline text-nowrap text-blue-600 hover:text-blue-800"
          onClick={() => onClick(start)}
        >
          {start.split(",")[0]}
        </div>
        {isEditMode && (
          <div className=" text-xs text-gray-400">{end.split(",")[0]}</div>
        )}
      </div>

      {!isEditMode ? (
        <div className={"text-left" + (isCurrent ? " font-semibold" : "")}>
          {text}
        </div>
      ) : (
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
            {
              <button
                className={`text-gray-200  w-full ${
                  index !== 0 && "hover:text-blue-500"
                }`}
                onClick={() => mergeTranscriptToPrevious(index)}
                disabled={index === 0}
              >
                <ChevronDoubleUpIcon className="w-6 h-6" />
              </button>
            }
            {/*merge down */}
            <button
              className=" text-gray-200 hover:text-blue-500 w-full"
              onClick={() => mergeTranscriptToNext(index)}
            >
              <ChevronDoubleDownIcon className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={() => deleteTranscriptBox(index)}
            className=" text-gray-400 hover:text-red-500"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TranscriptField;
