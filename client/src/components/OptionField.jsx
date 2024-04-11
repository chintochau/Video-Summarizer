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

const OptionCard = ({ option, handleClick, creditCount }) => {
  const { videoDuration } = useVideoContext();
  const { id, title, description, prompt } = option;
  const [adjustableCreditCount, setAdjustableCreditCount] = useState(0);
  const [interval, setInterval] = useState(600);
  const { parentSrtText } = useTranscriptContext();

  useEffect(() => {
    let factor;
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
        break;
    }
  };

  return (
    <Card className="bg-white rounded shadow-md mb-4 text-left flex justify-between">
      <CardHeader className="p-4 w-full ">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{showModifiedDescription()}</CardDescription>
        {addSlider()}
      </CardHeader>
      <CardContent className=" flex-col items-start text-center p-4"></CardContent>
      <CardFooter className="flex-col justify-center">
        <Button
          disabled={!parentSrtText}
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
        <div className=" text-sm ">
          Credit: {parentSrtText ? adjustableCreditCount : "--"}
        </div>
      </CardFooter>
    </Card>
  );
};

const OptionField = ({ handleClick, creditCount, setInterval }) => {
  const { loadingTranscript } = useTranscriptContext();

  // if (loadingTranscript) {
  //   return <div className="flex-col pt-12">
  //     <Loader2 className="mx-auto size-16 opacity-20 animate-spin" />
  //     <div className="text-center text-lg">Fetching Transcript...</div>
  //   </div>
  // }

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
