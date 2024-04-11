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

const OptionCard = (params) => {
  const { option, handleClick, creditCount } = params;
  const { premimum } = option;
  const { videoDuration } = useVideoContext();
  const { id, title, description, prompt } = option;
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
        return (
          <div className=" whitespace-pre-wrap">
            {`Video length: ${formatDuration(
              videoDuration
            )}\nBreakdown the video into ${Math.ceil(
              videoDuration / interval
            )} Parts\nof ${formatDuration(interval)} each `}
          </div>
        );
      case 7:
        return (
          <div className=" whitespace-pre-wrap">
            {`Video length: ${formatDuration(
              videoDuration
            )}\nBreakdown the video into ${Math.ceil(
              videoDuration / interval
            )} Parts\nof ${formatDuration(interval)} each `}
          </div>
        );
      default:
        return description;
    }
  };

  const addSlider = () => {
    switch (id) {
      case 6:
        return (
          <input
            className="w-2/3 bg-indigo-400"
            type="range"
            step={60}
            min={-600}
            max={-180}
            value={-interval}
            onChange={(e) => setInterval(-e.target.value)}
          />
        );
      case 7:
        return (
          <input
            className="w-2/3 bg-indigo-400"
            type="range"
            step={300}
            min={-1200}
            max={-600}
            value={-interval}
            onChange={(e) => setInterval(-e.target.value)}
          />
        );

      default:
        return <Slider defaultValue={[33]} max={100} step={1} />;
    }
  };

  const memberOnly = !currentUser && premimum;

  return (
    <Card className="bg-white rounded shadow-md mb-4 text-left flex justify-between">
      <CardHeader className="p-4 w-full ">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{showModifiedDescription()}</CardDescription>
        {addSlider()}
      </CardHeader>
      <CardContent className=" flex-col items-start text-center p-4"></CardContent>
      <CardFooter className="flex-col justify-center py-2">
        <Button
          disabled={!parentSrtText || memberOnly}
          onClick={() =>
            handleClick({
              id,
              title,
              description,
              prompt: prompt,
              interval,
              creditAmount: adjustableCreditCount,
            })
          }
        >
          Summarize
        </Button>
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
          <div className=" text-sm flex items-center my-1">
            <BoltIcon
              className={cn(
                "w-4 h-6",
                currentUser ? "text-indigo-500" :"text-yellow-400"
              )}
            />
            {parentSrtText ? adjustableCreditCount : "--"}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

const OptionField = ({ handleClick, creditCount, setInterval }) => {
  return (
    <div className="flex flex-col mx-6 my-4">
      <div className="p-2 text-start ">Summary Options：</div>
      {summarizeOptions.map((option, index) => {
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
  );
};

export default OptionField;
