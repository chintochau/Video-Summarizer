import React, { memo, useEffect, useState } from "react";
import {
  parseSRTToArray,
  exportSRT,
  transcribeWithAI,
  transcribeYoutubeVideo,
} from "@/utils/utils";
import { useVideoContext } from "../contexts/VideoContext";
import { secondsToTime, secondsToTimeInMinutesAndSeconds, timeToSeconds } from "../utils/timeUtils";
import { useAuth } from "../contexts/AuthContext";
import { checkCredits } from "../utils/creditUtils";
import TranscribeService from "../services/TranscribeService";
import ControlBar from "./transcriptFieldComponents/ControlBar";
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import TranscriptOptions from "./transcriptFieldComponents/TranscriptOptions";
import { useTranscriptContext } from "@/contexts/TranscriptContext";
import { ScrollArea } from "./ui/scroll-area";
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
import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import SpeakersTab from "./transcriptFieldComponents/SpeakersTab";

// Field
const TranscriptField = (params) => {
  const { youtubeId, videoRef, file, displayMode, className } = params;
  const [viewMode, setViewMode] = useState("speakers");
  const [isEditMode, setIsEditMode] = useState(false);
  const { currentPlayTime, currentLine, setCurrentLine, video } =
    useVideoContext();
  const {
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
    setUtterances,
    setSpeakers,
    utterances,
    transcriptCredits,
  } = useTranscriptContext();
  const { videoDuration } = useVideoContext();
  const { credits, userId, setCredits } = useAuth();
  const [transcribeProgress, setTranscribeProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const { toast } = useToast();

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
      if (displayMode === "youtube") {
        generateTranscript({
          fileLink: null,
          publicId: null,
          resourceType: null,
        });
      } else {
        // display mode is file
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
      checkCredits(parseFloat(credits), parseFloat(transcriptCredits));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Insufficient Credits",
        description: "Please purchase more credits to continue.",
        action: (
          <Button
            variant="outline"
            altText="Get more Credits"
            onClick={() => {
              window.location.href = "/pricing";
            }}
          >
            Get more Credits
          </Button>
        ),
      });
      setGeneratingTranscriptWithAI(false);
      return;
    }

    try {
      setGeneratingTranscriptWithAI(true);

      // update progress bar when transcribing every 5 seconds
      const timeEstimated =
        selectedTranscribeOption.timeFactor.upper * 0.7 * videoDuration;

      console.log(timeEstimated);

      const interval = setInterval(() => {
        const progress = (3 / timeEstimated) * 100;
        if (transcribeProgress !== -100) {
          setTranscribeProgress((prev) => prev + progress);
        }
      }, 3000);

      switch (displayMode) {
        case "youtube":
          result = await transcribeYoutubeVideo({
            youtubeId,
            userId,
            video,
            transcribeOption: selectedTranscribeOption,
            language: selectedTranscriptionLanguage,
            videoCredits: transcriptCredits,
          });
          break;
        default: // file
          result = await TranscribeService.transcribeUserUploadFileWithLink({
            // user api/processVideo
            link: fileLink,
            publicId,
            resourceType,
            language: selectedTranscriptionLanguage,
            videoCredits: transcriptCredits,
            userId,
            video,
            transcribeOption: selectedTranscribeOption,
          });
          break;
      }

      clearInterval(interval);
      setupTranscriptWithInputSRT(result.originalTranscript);
      setUtterances(result.utterances || []);
      setSpeakers(result.speakers || []);
      setCredits((prev) => prev - parseFloat(transcriptCredits));
    } catch (error) {
      resetTranscript();
      console.error(error);
    }
  };

  // 點擊轉錄時跳轉視頻
  const handleTranscriptClick = (time) => {
    if (time.split(":").length === 2) {
      time = "00:" + time;
    }
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
    <div className={cn("flex-col h-full flex", className)}>
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
                  <div className=" bg-gray-50">
                    <div 
                    className="hover:bg-blue-200 text-center rounded-sm text-lg flex justify-between space-x-2 px-2">
                      <div className="mx-4 text-blue-500">{secondsToTimeInMinutesAndSeconds(currentPlayTime)}</div>
                      <div className="flex-1">{currentLine}</div>
                    </div>
                    <ControlBar
                      exportSRT={exportSRT}
                      setIsEditMode={setIsEditMode}
                      isEditMode={isEditMode}
                      setViewMode={setViewMode}
                      editableTranscript={editableTranscript}
                      viewMode={viewMode}
                    />
                  </div>
                  {/* 根據viewMode渲染不同的內容 */}
                  {/* Transcript Box */}

                  {utterances.length > 0 && viewMode !== "transcript" ? (
                    <SpeakersTab onClick={handleTranscriptClick} />
                  ) : (
                    <ScrollArea className=" h-full px-2">
                      {editableTranscript.map(({ start, end, text }, index) => {
                        return (
                          <TranscriptBox
                            key={index}
                            start={start}
                            end={end}
                            text={text}
                            index={index}
                            isCurrent={currentLine === text}
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
                  )}
                </div>
              ) : (
                <TranscriptOptions
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
const TranscriptBox = memo(({
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
      className={`flex mx-2 rounded-md  ${
        isCurrent ? " bg-indigo-100" : ""
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
});

export default TranscriptField;
