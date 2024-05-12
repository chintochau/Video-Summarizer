import React, { useState } from "react";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon,
  PencilSquareIcon,
  TrashIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { useTranscriptContext } from "@/contexts/TranscriptContext";
import { useVideoContext } from "@/contexts/VideoContext";
import EmbeddingsService from "@/services/EmbeddingsService";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import {tify, sify} from 'chinese-conv'

export const ControlBar = (params) => {
  const {
    exportSRT,
    setIsEditMode,
    isEditMode,
    editableTranscript,
    viewMode,
    setViewMode,
  } = params;
  const { resetTranscript, parentSrtText,setEditableTranscript } = useTranscriptContext();
  const { video } = useVideoContext();
  const { userId } = useAuth();
  const [currentTab, setCurrentTab] = useState("Transcript");
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };
  const { toast } = useToast();

  const handleBookmarkVideo = () => {
    EmbeddingsService.saveEmbeddings({ video, parentSrtText, userId });
  };

  const tabs = [
    { name: "Transcript", label: "transcript" },
    { name: "Text", label: "text" },
  ];

  const chineseConvert = () => {
    const updatedTranscript = editableTranscript.map((entry, i) => {
      return {...entry,text: tify(entry.text)};
    });
    setEditableTranscript(updatedTranscript);
  };

  return (
    <div>
      <div className="bg-gray-50">
        <div className="border-b border-gray-200 flex justify-between ">
          <nav className="-mb-px flex space-x-2 pl-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => {
                  setCurrentTab(tab.name);
                  setViewMode(tab.label);
                }}
                className={classNames(
                  currentTab === tab.name
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "whitespace-nowrap border-b-2 py-1 px-1 text-md text-base cursor-pointer"
                )}
                aria-current={currentTab === tab.name ? "page" : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>

          <div className="content-center flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="h-6 w-6 hover:text-indigo-400 text-indigo-600 duration-200 transition-colors">
                  <BookmarkIcon
                    onClick={() => {
                      toast({
                        title: "Video Saved",
                        description: "Video is saved to your bookmarks, you can search the video content from search tab",
                      });
                      handleBookmarkVideo();
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Save the video , you can then search the video content from search tab
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className=" hover:text-indigo-400 text-indigo-600 duration-200 transition-colors">
                  <div className="flex" onClick={() => exportSRT(editableTranscript)}>
                    <ArrowDownTrayIcon className="w-6 h-6" />
                    <p>SRT</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Download the transcript in SRT format.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

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
              className="w-8 p-1  text-indigo-600  hover:text-indigo-400 "
            >
              <ClipboardDocumentIcon />
            </button>

            <button
              onClick={chineseConvert}
              className={`w-8 p-1  text-indigo-600 rounded-md hover:text-indigo-400  outline-indigo-600 `}
            >
              繁
            </button>


            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`w-8 p-1  text-indigo-600 rounded-md hover:text-indigo-400  outline-indigo-600 ${isEditMode ? " bg-indigo-500 text-white" : ""
                }`}
            >
              <PencilSquareIcon />
            </button>
            <button
              onClick={resetTranscript}
              className="w-8 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
