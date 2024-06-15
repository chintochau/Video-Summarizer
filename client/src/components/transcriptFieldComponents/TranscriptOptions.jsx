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
import { CheckIcon } from "@heroicons/react/24/outline";
import {
  transcribeOptions,
  useTranscriptContext,
} from "@/contexts/TranscriptContext";
import TranscriptHistoryTable from "./TranscriptHistoryTable";
import { Label } from "@/components/ui/label";
import { Signal, SignalHigh, SignalMedium } from "lucide-react";

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
        return <Signal className="mx-auto text-blue-500" />;
      case 2:
        return <SignalHigh className="mx-auto text-cyan-500" />;
      case 1:
        return <SignalMedium className="mx-auto text-green-500" />;
    }
    return <Signal className="mx-auto" />;
  };

  const TransbeOptionTable = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Options</TableHead>
            <TableHead className="text-center">Estimate Time</TableHead>
            <TableHead className="text-center">Accuracy</TableHead>
            <TableHead className="text-center">Credits</TableHead>
            <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="cursor-pointer">
          {transcribeOptions.map((option, index) => (
            <TableRow
              key={option.value}
              className={classNames(
                index === selectedIndex ? " bg-zinc-200 hover:bg-zinc-100" : "",
                option.available ? "" : "opacity-50 cursor-not-allowed"
              )}
              onClick={() => {
                if (!option.available) return;
                setSelectedIndex(index);
                setSelectedTranscribeOption(option);
              }}
            >
              <TableCell className="pl-4 py-2 pr-1">{option.label}</TableCell>
              <TableCell className="p-2 text-center">
                {calculateTime(option.timeFactor)}
              </TableCell>
              <TableCell className="p-2 text-center ">
                <Accuracy accuracy={option.accuracy} />
              </TableCell>
              <TableCell className="p-2 text-center">
                {(videoCredits * option.creditFactor).toFixed(2)}
              </TableCell>
              <TableCell className="p-2 text-center">
                <CheckIcon
                  className={classNames(
                    index === selectedIndex ? "" : "hidden",
                    " text-indigo-900 size-4"
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
        <CardTitle className="text-indigo-400">
          Choose an option to generate transcript
        </CardTitle>

        <Card className="flex-colshadow-md">
          <CardHeader>
            <CardTitle>1. Generate Transcript with AI</CardTitle>
            <CardDescription>
              Utilize AI to generate video transcripts. You can either wait on
              the screen or return later after initiating the process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border ">
              <TransbeOptionTable options={transcribeOptions} />
            </div>
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
        <Card className="flex-col shadow-md">
          <CardHeader>
            <CardTitle>2. Browse from History</CardTitle>
            <CardDescription>
              Retrieve a previous transcription from the server.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TranscriptHistoryTable />
          </CardContent>
        </Card>
        <Card className="flex-col shadow-md">
          <CardHeader>
            <CardTitle>3. Upload Transcript</CardTitle>
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
        </Card>
      </div>
    </ScrollArea>
  );
};

export default TranscriptOptions;
