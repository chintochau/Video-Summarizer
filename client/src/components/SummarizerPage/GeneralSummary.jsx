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
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Helmet } from "react-helmet-async";
import { fusionaiLink } from "@/constants";
import { Link } from "react-router-dom";
import Header from "../common/Header";

const GeneralSummary = () => {
  const videoRef = useRef(null);
  const { youtubeId } = useVideoContext();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/console");
    }
  }, [currentUser]);

  if (!youtubeId) {
    return (
      <div className="h-screen">
        <Header />
        <Helmet>
          <title>
            Free YouTube Video Summarizer | Try Fusion AI's Summarizing Tool
          </title>
          <meta
            name="title"
            content="Free YouTube Video Summarizer | Try Fusion AI's Summarizing Tool"
          />
          <meta
            name="description"
            content="Use Fusion AI's free YouTube video summarizer to quickly get concise summaries. Try it now with a free quota and register for more features!"
          />
          <meta
            name="keywords"
            content="Free YouTube summarizer, video summarization tool, AI video summary, YouTube transcript, video transcription, Fusion AI"
          />
          <meta
            name="og:title"
            content="Free YouTube Video Summarizer | Try Fusion AI's Summarizing Tool"
          />
          <meta
            name="og:description"
            content="Use Fusion AI's free YouTube video summarizer to quickly get concise summaries. Try it now with a free quota and register for more features!"
          />
          <meta
            name="twitter:title"
            content="Free YouTube Video Summarizer | Try Fusion AI's Summarizing Tool"
          />
          <meta
            name="twitter:description"
            content="Use Fusion AI's free YouTube video summarizer to quickly get concise summaries. Try it now with a free quota and register for more features!"
          />
          <link rel="canonical" href={`${fusionaiLink}/summarizer`} />
        </Helmet>
        <div className="w-full px-2 pt-16 pb-20 md:py-40">
          <div className="flex flex-col justify-center mx-auto max-w-3xl w-full  ">
            <div className="flex flex-col items-center justify-center">
              <h1 className="w-full text-left md:text-center text-3xl font-extrabold leading-8 text-cyan-700/70 sm:text-4xl sm:leading-10 ">
                Free YouTube Video Summarizer
              </h1>
              <p className="w-full px-1 text-left md:text-center text-sm md:text-xl text-gray-800 font-roboto font-normal max-w-3xl mt-4 mx-auto">
                Quickly get concise summaries of a YouTube video.
              </p>
            </div>
            <div className=" my-4">
              <YoutubeBar className="outline outline-1 rounded-lg outline-cyan-700/70" />
            </div>
            <p className="w-full px-1  text-left text-sm md:text-lg text-gray-400 font-roboto font-normal max-w-3xl mx-auto">
              Simply input the video link, and let our advanced AI generate a
              precise summary for you. <br className="hidden" />
              Save time and get straight to the point with Fusion AI.
            </p>
            <p className="w-full px-1  text-left text-sm  text-gray-400 font-roboto font-normal max-w-3xl mx-auto py-2">
              * Current we support GPT-3.5, GPT-4o, Claude3 and Llama3 models.
            </p>
            <div className="text-right">
              <Separator className="mb-8 mt-16" />
              <p className="text-gray-400 text-sm md:text-lg px-1 pb-4 text-left">
                Want unlimited access and advanced features? Log in now to
                unlock the full potential of Fusion AI, including more
                summaries, cloud storage, and personalized video knowledge
                database.
              </p>

              <Button
                variant="link"
                onClick={() => navigate("/login")}
                className="mx-auto text-cyan-600"
              >
                Sign in now
                <ArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className=" flex flex-col h-40 flex-1 ">
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
    </div>
  );
};

export default GeneralSummary;
