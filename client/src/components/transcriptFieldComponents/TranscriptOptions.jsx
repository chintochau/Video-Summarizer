import React, { useEffect, useState } from "react";
import { useVideoContext } from "../../contexts/VideoContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { secondsToTimeInMinutesAndSeconds } from "@/utils/timeUtils";
import { CheckIcon, ClockIcon, CloudArrowUpIcon, SparklesIcon, UsersIcon } from "@heroicons/react/24/outline";
import {
  transcribeOptions,
  useTranscriptContext,
} from "@/contexts/TranscriptContext";
import TranscriptHistoryTable from "./TranscriptHistoryTable";
import { Label } from "@/components/ui/label";
import { Signal, SignalHigh, SignalMedium } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"



const classNames = (...classes) => classes.filter(Boolean).join(" ");

const TranscriptOptions = (params) => {

  const preselectedOptionIndex = 2

  const { uploadToCloudAndTranscribe } = params;
  const { setupTranscriptWithInputSRT } = useTranscriptContext();
  const { videoCredits, videoDuration } = useVideoContext();
  const [selectedIndex, setSelectedIndex] = useState(preselectedOptionIndex);
  const { currentUser } = useAuth();
  const { selectedTranscribeOption, setSelectedTranscribeOption } =
    useTranscriptContext();

  useEffect(() => {
    setSelectedTranscribeOption(transcribeOptions[preselectedOptionIndex]);
  }, []);

  const getTranscriptWithUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const srt = e.target.result;
      setupTranscriptWithInputSRT(srt);
    };
    reader.readAsText(file);
  };

  const calculateTime = (timeFactor) => {
    const lower = secondsToTimeInMinutesAndSeconds(
      videoDuration * timeFactor.lower
    );
    const upper = secondsToTimeInMinutesAndSeconds(
      videoDuration * timeFactor.upper
    );
    return `${lower} - ${upper}`;
  };

  const Accuracy = ({ accuracy }) => {
    switch (accuracy) {
      case 3:
        return <Signal className=" text-blue-500" />;
      case 2:
        return <SignalHigh className=" text-cyan-500" />;
      case 1:
        return <SignalMedium className=" text-green-500" />;
    }
    return <Signal className="" />;
  };

  const TransbeOptionTable = () => {
    return (
      <div className="space-y-4">
        <h3
          className="text-lg font-semibold text-primary "
        >
          Speaker Identification
        </h3>
        <div className="flex space-x-2 mb-4 ">
          <Checkbox id="identify-speaker" />
          <div className="grid gap-1.5 leading-none">
            <label for="identify-speaker" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            ><UsersIcon className="w-5 h-5  inline-block mr-1 text-primary/70" />
              Enable Speker Label</label>
            <p className="text-sm text-muted-foreground">
              Identify different speakers in the video, specifically useful for <span className="font-semibold text-primary/80">interviews, meetings, and panel discussions</span>.
            </p>
          </div>
        </div>


        <h3
          className="text-lg font-semibold text-primary pt-4 "
        >
          Speed and Accuracy
        </h3>
        <RadioGroup>
          {transcribeOptions.map((option, index) => (
            <div
              className="flex items-center gap-x-2 cursor-pointer "
              key={
                option.value
              }
              onClick={() => {
                if (!option.available) return;
                setSelectedIndex(index);
                setSelectedTranscribeOption(option);
              }
              }
            >
              <RadioGroupItem
                value={option.value}
                checked={index === selectedIndex}
                onChange={() => {
                  if (!option.available) return;
                  setSelectedIndex(index);
                  setSelectedTranscribeOption(option);
                }}
              >
                {option.label}
              </RadioGroupItem>
              <p
                className="text-sm text-gray-950 font-medium"
              >
                {option.label}
              </p>
            </div>
          ))}
        </RadioGroup>

        <div
          className="flex flex-col gap-y-1.5 p-2 bg-gray-100 rounded-md mt-2"
        >
          <p
            className="text-sm text-muted-foreground"
          >
            {selectedTranscribeOption?.information}
          </p>
          <p
            className="text-sm text-muted-foreground"
          >
            Estimated Time: {calculateTime(selectedTranscribeOption?.timeFactor)}
          </p>
          <p
            className="text-sm text-muted-foreground flex items-center gap-x-1.5"
          >
            Accuracy Level for English: <Accuracy accuracy={3} />
          </p>
          <p
            className="text-sm text-muted-foreground flex items-center gap-x-1.5"
          >
            Accuracy Level for other language: <Accuracy accuracy={selectedTranscribeOption?.accuracy} />
          </p>
          <p
            className="text-sm text-muted-foreground flex items-center gap-x-1.5 "
          >
            Credits: {(videoCredits * selectedTranscribeOption?.creditFactor).toFixed(2)}
          </p>
        </div>
      </div>
    );
  };

  const CreditsCost = () => {
    if (selectedTranscribeOption) {
      return (
        <div className="flex flex-col gap-y-1">
          <Label htmlFor="model" className="pt-2">
            Credits: {(videoCredits * selectedTranscribeOption.creditFactor).toFixed(2)}
          </Label>
        </div>
      );
    }
    return null;
  };

  if (!currentUser) {
    return (
      <Card className="m-4 shadow-md">
        <CardHeader>
          <CardTitle>Generate Transcript with AI</CardTitle>
          <CardDescription>
            Different options to generate transcript
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-2 bg-gray-100 rounded-md p-4 ">
            <p className="text-center">
              Youtube Transcript is not available for this Video, <br /> Login
              to genertae transcript with AI
            </p>
            <Button
              className="mx-auto"
              onClick={() => {
                window.location.href = "/login";
              }}
              variant="outline"
            >
              Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col py-6 px-1 md:px-2 lg:px-4 xl:p-10  gap-y-4">
        <CardTitle className="text-secondary/70 ">
          Step 2 of 3 : Generate Transcript
        </CardTitle>

        <Card className="flex-colshadow-md">
          <CardHeader>
            <CardTitle
              className="text-primary flex"
            >1. AI Transcript
              <SparklesIcon
                className="w-5 h-5 inline-block text-primary/70 ml-2"
              />
            </CardTitle>
            <CardDescription>
              Utilize AI to generate video transcripts. You can either wait on
              the screen or return later after initiating the process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransbeOptionTable options={transcribeOptions} />
          </CardContent>
          <CardFooter>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="model" className="pt-2">
                <CreditsCost />
              </Label>
              <Button
                className="mx-auto"
                onClick={uploadToCloudAndTranscribe}
                disabled={!selectedTranscribeOption}
              >
                Generate
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm font-medium leading-6">
            <span className="bg-white px-6 text-gray-900">Or</span>
          </div>
        </div>

        <div className="flex-col ">
          <CardHeader>
            <CardTitle
              className="text-primary flex">2. Choose from History <ClockIcon className="w-5 h-5 inline-block text-primary/70 ml-2" />
            </CardTitle>
            <CardDescription>
              Retrieve a previous transcription from the server.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TranscriptHistoryTable />
          </CardContent>
        </div>

        <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white px-6 text-gray-900">Or</span>
              </div>
            </div>

        <div className="flex-col ">
          <CardHeader>
            <CardTitle
              className="text-primary flex">3. Upload Transcript <CloudArrowUpIcon className="w-5 h-5 inline-block text-primary/70 ml-2" />

            </CardTitle>
            <CardDescription>
              Upload an SRT file from your computer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              className=" cursor-pointer"
              type="file"
              onChange={(e) => getTranscriptWithUpload(e.target.files[0])}
            />
          </CardContent>
        </div>
      </div>
    </ScrollArea>
  );
};

export default TranscriptOptions;
