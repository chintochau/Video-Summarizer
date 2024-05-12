import React, { useContext, useEffect, useState } from "react";
import { summarizeOptions } from "./Prompts";
import { useVideoContext } from "../contexts/VideoContext";
import { formatDuration } from "./Utils";
import { useTranscriptContext } from "@/contexts/TranscriptContext";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Slider } from "./ui/slider";
import { useAuth } from "@/contexts/AuthContext";
import { BoltIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { cn } from "@/utils/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Textarea } from "./ui/textarea";
import { Info } from 'lucide-react';

const OptionCard = (params) => {
  const { option, handleClick, creditCount, variant } = params;
  const { premimum } = option;
  const { videoDuration } = useVideoContext();
  const { id, title, description, prompt, icon } = option;
  const [adjustableCreditCount, setAdjustableCreditCount] = useState(0);
  const [interval, setInterval] = useState(600);
  const { parentSrtText } = useTranscriptContext();
  const { currentUser } = useAuth();


  useEffect(() => {
    let factor;

    if (!currentUser) {
      setAdjustableCreditCount(1);
      return;
    }

    switch (id) {
      case 1:
        setAdjustableCreditCount((creditCount * 2).toFixed(1));
        break;
      case 6:
        factor = Math.max(1, 8 / (interval / 60)); // = 3 ~ 5
        setAdjustableCreditCount((creditCount * factor).toFixed(1));
        break;
      case 7:
        factor = Math.max(1, 1.3 * (videoDuration / interval));
        setAdjustableCreditCount((creditCount * factor).toFixed(1));
        break;
      default:
        setAdjustableCreditCount(creditCount);
    }
  }, [creditCount, interval]);

  const showModifiedDescription = () => {
    switch (id) {
      case 6:
        return `Video length: ${formatDuration(
          videoDuration
        )}\nBreakdown the video into ${Math.ceil(
          videoDuration / interval
        )} Parts\nof ${formatDuration(interval)} each `;
      case 7:
        return `Video length: ${formatDuration(
          videoDuration
        )}\nBreakdown the video into ${Math.ceil(
          videoDuration / interval
        )} Parts\nof ${formatDuration(interval)} each `;
      default:
        return description;
    }
  };


  const memberOnly = !currentUser && premimum;
  const buttonDisalbed = !parentSrtText || memberOnly;

  if (variant === "custom") {
    return (<div className="flex flex-col items-end">
      <Textarea
        placeholder={`Write your prompt here, for Example: \n 
${summarizeOptions.quickSummaryOptions[3].prompt}`}
        onChange={(e) => {
          console.log(e.target.value);
        }}
        className="h-40 placeholder:text-slate-400"
      />
      <Button className="w-auto mt-2">Summarize</Button>
    </div>)
  }


  return (
    <Card
      className={cn(
        "shadow-md text-left ",
        buttonDisalbed
          ? "bg-gray-100"
          : "hover:outline hover:outline-1 hover:outline-indigo-400 cursor-pointer"
      )}
      onClick={() => {
        if (!buttonDisalbed)
          handleClick({
            ...option,
            interval,
            creditAmount: adjustableCreditCount,
          });
      }}
    >
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="pt-1">{title}</CardTitle>
          {memberOnly ? (
            <HoverCard>
              <HoverCardTrigger>
                <LockClosedIcon className="w-4 h-6 text-gray-400" />{" "}
              </HoverCardTrigger>
              <HoverCardContent>
                Login to access Detail Summary
              </HoverCardContent>
            </HoverCard>
          ) : (
            <div className=" text-md flex items-center my-1">
              <BoltIcon
                className={cn(
                  "w-4 h-6 mr-1",
                  currentUser ? "text-indigo-500" : "text-yellow-400"
                )}
              />
              {parentSrtText ? adjustableCreditCount : "--"}
            </div>
          )}
        </div>
        <CardDescription className=" whitespace-pre-wrap">
          {showModifiedDescription()}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

const OptionField = ({ handleClick, creditCount, setInterval }) => {
  const { quickSummaryOptions, detailSummaryOptions } = summarizeOptions;
  return (
    <div className="flex flex-col gap-y-4 mx-4 pb-8 pt-4">
      {/* <CardTitle className="text-indigo-600/80">Custom prompt:</CardTitle>
      <OptionCard variant="custom" option={{ premimum: false }} /> */}
      <div className="flex items-center">
        <CardTitle className="text-indigo-600/80">Quick Summary</CardTitle>
        <HoverCard><HoverCardTrigger><Info className="w-5 h-5 ml-2 text-indigo-500 hover:text-indigo-400" /></HoverCardTrigger>
          <HoverCardContent className=" w-3/4 font-medium">
            Quick Summary work best for video length between <span className=" font-semibold">8 to 15 minutes</span>  long.
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="xl:grid xl:grid-cols-2 flex flex-col gap-y-4 xl:gap-4">
        {quickSummaryOptions.map((option, index) => {
          return (
            <OptionCard
              option={option}
              key={index}
              handleClick={handleClick}
              creditCount={creditCount}
              setInterval={setInterval}
            />
          );
        })}
      </div>
      <CardTitle className="text-indigo-600/80">Detail Summary</CardTitle>
      <div className=" bg-red-600/20 p-2 text-red-600 text-sm rounded-md">Detail summary is not working now, will be fixed soon</div>
      <div className="xl:grid xl:grid-cols-2 flex flex-col gap-y-4 xl:gap-4">
        {detailSummaryOptions.map((option, index) => {
          return (
            <OptionCard
              option={option}
              key={index}
              handleClick={handleClick}
              creditCount={creditCount}
              setInterval={setInterval}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OptionField;
