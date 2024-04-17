import React, { useEffect, useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import YoutubeBar from "../summarizerComponents/YoutubeBar";
import SummaryField from "../SummaryField";
import TranscriptField from "../TranscriptField";
import VideoField from "../summarizerComponents/YTVideoField";
import { useVideoContext } from "@/contexts/VideoContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import {Loader2} from 'lucide-react'

const GeneralSummary = () => {
  const videoRef = useRef(null);
  const { youtubeId } = useVideoContext();
  const { currentUser} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/console");
    }
  }, [currentUser]);

  if (!youtubeId) {
    return (
      <div className=" h-2/4 flex flex-col justify-center mx-auto max-w-3xl w-full">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">Summarize Youtube Video</h1>
          <p className="text-lg text-gray-500">Input yourtube link to get started</p>
        </div>
        <div className=""><YoutubeBar /></div>
      </div>
    );
  }

  return (
    <div className=" flex flex-col h-40 flex-1">
      <YoutubeBar />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="flex flex-col flex-1">
          <div className="">
            <VideoField videoRef={videoRef} youtubeId={youtubeId} />
          </div>
          <div className=" h-40 flex-1 hidden md:block overscroll-scroll">
            <TranscriptField
              youtubeId={youtubeId}
              videoRef={videoRef}
              displayMode="youtube"
            />
          </div>
          <div className="md:hidden h-40 flex-1">
            <SummaryField videoRef={videoRef} />
          </div>
        </ResizablePanel>
        <ResizableHandle className="w-1 bg-indigo-100 hidden md:flex" />
        <ResizablePanel className="hidden sticky shrink-0 md:block w-full md:w-1/2  h-1/2  md:h-full bg-gray-50">
          <SummaryField videoRef={videoRef} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default GeneralSummary;
