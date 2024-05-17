import Markdown from "markdown-to-jsx";
import React, { useState } from "react";
import OptionField from "../OptionField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import {
  ClipboardDocumentIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "../ui/use-toast";
import SummaryService from "@/services/SummaryService";
import { useAuth } from "@/contexts/AuthContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { shareLink } from "@/constants";

export const transformArticleWithClickableTimestamps = (articleContent) => {
  // Updated regex to match hh:mm:ss and mm:ss and m:ss formats
  const timestampRegex =
    /(\d{1,2}:\d{1,2}:\d{1,2}|\d{1,2}:\d{1,2}|\d{1,2}:\d{1,2})/g;

  return articleContent.replace(
    timestampRegex,
    (match) => `[${match}](#timestamp-${match})`
  );
};

export const transformTimestampRangeFromArticleToSingleLink = (articleContent) => {
  const timestampRegex =
  /(\d{1,2}:\d{1,2}:\d{1,2} - \d{1,2}:\d{1,2}:\d{1,2} |\d{1,2}:\d{1,2} - \d{1,2}:\d{1,2} |\d{1,2}:\d{1,2} - \d{1,2}:\d{1,2} |\d{1,2}:\d{1,2}:\d{1,2}|\d{1,2}:\d{1,2}|\d{1,2}:\d{1,2})/g;

  return articleContent.replace(
    timestampRegex,
    (match) => `[${match}](#timestamp-${match})`
  );
};

// Summary Tab
const SummaryTab = (data) => {
  const {
    videoRef,
    summaryObject,
    activeTab,
    response,
    startSummary,
    performSummarize,
    removeSummary,
    creditCount = { creditCount },
  } = data;
  if (!summaryObject) {
    return null;
  }
  const { summary, sourceId, _id } = summaryObject;

  const showText = () => {
    if (summary !== "") {
      return summary;
    }
    if (response !== "") {
      return response;
    }
  };
  const { toast } = useToast();
  const { userId } = useAuth();

  // 點擊轉錄時跳轉視頻
  const handleTimestampClick = (time) => {
    let [hours, minutes, seconds] = time.split(":");
    let secondsTotal;

    if (time.split(":").length === 2) {
      secondsTotal = parseInt(hours) * 60 + parseFloat(minutes);
    } else if (time.split(":").length === 3) {
      secondsTotal =
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
    }

    if (videoRef && videoRef.current) {
      videoRef.current.currentTime = secondsTotal;
      if (videoRef.current.internalPlayer) {
        videoRef.current.internalPlayer.seekTo(secondsTotal);
      }
    }
  };

  const deleteSummary = async () => {
    if (userId) {
      const response = await SummaryService.deleteSummary({
        userId,
        summaryId: summaryObject._id,
      });
      if (response) {
        removeSummary(activeTab);
      }
    } else {
      removeSummary(activeTab);
    }
  };

  const copyLink = async (e) => {
    // select the text in the input field
    if (e.target.tagName === "INPUT") {
      e.target.select();
    }
    navigator.clipboard.writeText(shareLink + _id);
    toast({
      title: "Saved to clipboard",
      description: "The link has been copied to your clipboard.",
    });
  };

  const linkOverride = {
    a: {
      component: ({ children, href, ...props }) => {
        if (href.startsWith("#timestamp")) {
          const timestamp = children[0].split(" - ")[0];
          return (
            <a
              className={"text-blue-500 cursor-pointer"}
              onClick={() => handleTimestampClick(timestamp)}
            >
              {children}
            </a>
          );
        }
        return (
          <a href={href} {...props}>
            {children}
          </a>
        );
      },
    },
  };

  return (
    <ScrollArea className="overflow-y-auto px-2">
      {summary !== "" && (
        <>
          <div className="hidden md:block md:absolute top-0 right-0 ">
            <Button
              className="p-2"
              variant="transparent"
              onClick={() => {
                navigator.clipboard.writeText(showText());
                toast({
                  title: "Saved to clipboard",
                  description: "The summary has been copied to your clipboard.",
                });
              }}
            >
              <ClipboardDocumentIcon className="w-6 h-6" />
            </Button>

            {sourceId && (
              <Popover>
                <PopoverTrigger>
                  <Button variant="transparent" className="p-2" onClick={(e) => copyLink(e)}>
                    <ShareIcon className="w-6 h-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-y-2 mx-4 px-4 w-80">
                  <Label>Share summary link</Label>
                  <div className="flex items-center ">
                    <div
                      className=" bg-gray-100 rounded-md cursor-pointer p-2 mr-1"
                      onClick={(e) => copyLink(e)}
                    >
                      {shareLink + _id}
                    </div>
                    <Button
                      className="p-2"
                      variant="ghost"
                      onClick={(e) => copyLink(e)}
                    >
                      <ClipboardDocumentIcon className="w-6 h-6" />
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <Button
              variant="transparent"
              className="p-2 hover:text-red-500"
              onClick={deleteSummary}
            >
              <TrashIcon className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex justify-end md:hidden pt-1">
            <Button
              className="p-2 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              variant="ghost"
              onClick={() => {
                navigator.clipboard.writeText(showText());
                toast({
                  title: "Saved to clipboard",
                  description: "The summary has been copied to your clipboard.",
                });
              }}
            >
              <ClipboardDocumentIcon className="w-6 h-6" />
            </Button>

            {sourceId && (
              <Popover>
                <PopoverTrigger>
                  <Button variant="ghost" className="p-2" onClick={(e) => copyLink(e)}>
                    <ShareIcon className="w-6 h-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-y-2 w-96">
                  <Label>Share summary link</Label>
                  <div className="flex items-center">
                    <div
                      className=" bg-gray-100 rounded-md cursor-pointer p-2 mr-1"
                      onClick={(e) => copyLink(e)}
                    >
                      {shareLink + _id}
                    </div>
                    <Button
                      className="p-2"
                      variant="ghost"
                      onClick={(e) => copyLink(e)}
                    >
                      <ClipboardDocumentIcon className="w-6 h-6" />
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <Button
              variant="ghost"
              className="p-2 hover:text-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              onClick={deleteSummary}
            >
              <TrashIcon className="w-6 h-6" />
            </Button>
          </div>
        </>
      )}

      {summary === "" && response === "" && !startSummary ? (
        <div className="overflow-y-auto ">
          <OptionField
            handleClick={performSummarize}
            activeTab={activeTab}
            creditCount={creditCount}
          />
        </div>
      ) : (
        <div className="overflow-y-auto">
          {startSummary && summary === "" && response === "" ? (
            <div className="text-lg my-10">
              <div className="mx-auto animate-spin rounded-full h-10 w-10 border-r-2 border-b-2 border-indigo-600" />{" "}
              Loading Summary...
            </div>
          ) : (
            <Markdown
              className="prose max-w-full h-full p-2 px-4 text-start leading-5"
              options={{ overrides: linkOverride }}
            >
              {transformTimestampRangeFromArticleToSingleLink(showText())}
            </Markdown>
          )}
          <div className="h-20" />
        </div>
      )}
    </ScrollArea>
  );
};

export default SummaryTab;
