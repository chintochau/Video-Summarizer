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
import { Info } from "lucide-react";
import { useModels } from "@/contexts/ModelContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const OptionCard = (params) => {
  const { option, handleClick, creditCount, variant } = params;
  const { premimum } = option;
  const { videoDuration } = useVideoContext();
  const { id, title, description, prompt, icon, beta,type } = option;
  const [adjustableCreditCount, setAdjustableCreditCount] = useState(0);
  const [interval, setInterval] = useState(600);
  const { parentSrtText } = useTranscriptContext();
  const { currentUser } = useAuth();
  const { selectedModelDetails } = useModels();
  const [parts, setParts] = useState(3);



  useEffect(() => {
    if (videoDuration ) {
      // set interval to 10 minutes, if the last part is less than 3 minutes, reduce the interval by 30 seconds
      // until the last part is at more than 3 minutes
      // each part should be at least 8 mins
      let tempInterval = 600
      while (videoDuration % tempInterval < 240 && tempInterval > 480) {
        tempInterval = tempInterval - 30
      }
      setInterval(tempInterval);
      setParts(Math.ceil(videoDuration / tempInterval));
    }
  }, [videoDuration])

  useEffect(() => {
    let factor;

    if (!currentUser) {
      setAdjustableCreditCount(1);
      return;
    }

    switch (id) {
      case "long-summary":
        factor = (Math.max(1, 2.5 * parts) * selectedModelDetails.factor) / parts;
        setAdjustableCreditCount((creditCount * factor).toFixed(1));

        if (!videoDuration) {
          setAdjustableCreditCount(
            creditCount * selectedModelDetails.factor * 5
          );
        }
        break;
      default:
        if (creditCount !== 0) {
          setAdjustableCreditCount(creditCount * selectedModelDetails.factor);
        } else {
          setAdjustableCreditCount(1);
        }
    }
  }, [creditCount, interval, selectedModelDetails]);

  const showModifiedDescription = () => {
    switch (id) {
      case "meeting-summary":
        return `Video length: ${formatDuration(
          videoDuration
        )}\nBreakdown the video into ${Math.ceil(
          videoDuration / interval
        )} Parts\nof ${formatDuration(interval)} each `;
      case "long-summary":
        return `Video length: ${formatDuration(
          videoDuration
        )}\nBreakdown the video into ${Math.ceil(
          videoDuration / interval
        )} Parts\nof ${formatDuration(interval)} each: \n${description}`;
      default:
        return description;
    }
  };

  const memberOnly = !currentUser && premimum;
  const buttonDisalbed = !parentSrtText || memberOnly;

  if (variant === "custom") {
    return (
      <div className="flex flex-col items-end">
        <Textarea
          placeholder={`Write your prompt here, for Example: \n 
${summarizeOptions.quickSummaryOptions[3].prompt}`}
          onChange={(e) => {
            console.log(e.target.value);
          }}
          className="h-40 placeholder:text-slate-400"
        />
        <Button className="w-auto mt-2">Summarize</Button>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "shadow-md text-left ",
        buttonDisalbed
          ? "bg-gray-100"
          : "hover:outline hover:outline-1 hover:outline-primary cursor-pointer",
        premimum && "border-2 border-yellow-400"
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
          <CardTitle className={cn(buttonDisalbed ? "text-gray-400" : "")}>
            {title}
            {beta && (
              <span className="text-xs text-cyan-700/70 ml-2">Beta</span>
            )}
          </CardTitle>
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
                  currentUser ? "text-indigo-600" : "text-yellow-400"
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

const SummaryOptions = ({ handleClick, creditCount, setInterval }) => {
  const { quickSummaryOptions, detailSummaryOptions } = summarizeOptions;
  return (
    <div className="flex flex-col gap-y-4 mx-8 py-6">
      {/* <CardTitle className="text-primary/80">Custom prompt:</CardTitle>
      <OptionCard variant="custom" option={{ premimum: false }} /> */}
      <div className="flex items-center">
        <h3 className=" text-2xl font-semibold text-primary">Quick Summary</h3>
        <Popover>
          <PopoverTrigger>
            <Info className="w-5 h-5 ml-2 text-secondary hover:text-secondary/70" />
          </PopoverTrigger>
          <PopoverContent className="w-3/4 font-medium">
            Quick Summary work best for video length between{" "}
            <span className=" font-semibold text-primary">8 to 15 minutes</span>{" "}
            long.
          </PopoverContent>
        </Popover>
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
      <h3 className=" text-2xl font-semibold text-primary">
        Detail Summary for long video
      </h3>
      <div className="flex flex-col gap-y-4 xl:gap-4">
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
      <div className="w-full h-10" />
    </div>
  );
};

export default SummaryOptions;
