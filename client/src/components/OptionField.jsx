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
import { Label } from "./ui/label";

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

  const SliderBar = () => {
    switch (id) {
      default:
        return null;
    }
  };

  const memberOnly = !currentUser && premimum;
  const buttonDisalbed = !parentSrtText || memberOnly;

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
            id,
            title,
            description,
            prompt: prompt,
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
  return (
    <div className="flex flex-col gap-y-4 mx-4 pb-8">
      <h3 className="pt-6 text-start font-display font-semibold text-2xl">
        Summary Options：
      </h3>
      <div className="flex flex-col items-end">
        <Label className="w-full">Custom prompt:</Label>
        <Textarea
          placeholder={`Write your own prompt here...
Example: Summarize the video content in a table format`}
          onChange={(e) => {
            console.log(e.target.value);
          }}
        />
        <Button className="w-auto mr-6 mt-2">Summarize</Button>
      </div>
      <div className="xl:grid xl:grid-cols-2 flex flex-col gap-y-4 xl:gap-4">
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
    </div>
  );
};

export default OptionField;
