import Markdown from "markdown-to-jsx";
import React, { useState } from "react";
import OptionField from "../components/OptionField";
import { ScrollArea } from "@/components/ui/scroll-area";


// Summary Tab
const SummaryTab = (data) => {
  const {
    videoRef,
    summaryObject,
    activeTab,
    response,
    startSummary,
    performSummarize,
    creditCount = { creditCount },
  } = data;
  const { summary } = summaryObject;

  const showText = () => {
    if (summary !== "") {
      return summary;
    }
    if (response !== "") {
      return response;
    }
  };


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

const linkOverride = {
  a: {
    component: ({ children, href, ...props }) => {
      if (href.startsWith("#timestamp")) {
        const timestamp = children[0];
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

const transformArticleWithClickableTimestamps = (articleContent) => {
  // Updated regex to match both hh:mm:ss and mm:ss formats
  const timestampRegex = /((\d{2}:)?\d{2}:\d{2})/g;

  return articleContent.replace(
    timestampRegex,
    (match) => `[${match}](#timestamp-${match})`
  );
};

  return (
    <ScrollArea className="overflow-y-auto">
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
              {transformArticleWithClickableTimestamps(showText())}
            </Markdown>
          )}
          <div className="h-20" />
        </div>
      )}
    </ScrollArea>
  );
};

export default SummaryTab;
