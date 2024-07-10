import { Footer } from "@/components";
import Header from "@/components/common/Header";
import VideoField from "@/components/summarizerComponents/YTVideoField";
import JsonSummaryField from "@/components/summary-field-conpoments/JsonSummaryField";
import {
  transformArticleWithClickableTimestamps,
  transformTimestampRangeFromArticleToSingleLink,
} from "@/components/summary-field-conpoments/SummaryTab";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { fusionaiLink, shareLink } from "@/constants";
import SummaryService from "@/services/SummaryService";
import { DocumentDuplicateIcon, ShareIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";
import Markdown from "markdown-to-jsx";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

const SharePage = () => {
  // State to store the extracted URL parameter
  const [summaryId, setSummaryId] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [sourceId, setSourceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoTitle, setVideoTitle] = useState("");
  const [summaryFormat, setSummaryFormat] = useState(null);

  const { toast } = useToast();
  const {id} = useParams();

  const videoRef = useRef(null);
  // Effect hook to run once when the component mounts
  useEffect(() => {
    // Function to extract URL parameters
    const getSummaryId = () => {
      const params = new URLSearchParams(window.location.search)
      const summaryParam = params.get("s") || id;
      setSummaryId(summaryParam);
      return summaryParam;
    };
    // Call the function
    const summaryId = getSummaryId();
    if (summaryId) {
      // Fetch the summary data
      SummaryService.getSummary({ summaryId }).then((response) => {
        setLoading(false);
        // Check if the summary data was fetched
        if (response && response.success) {
          // set the website title
          setVideoTitle(response.data.sourceTitle);
          setSummaryData(response.data);
          setSourceId(response.data.sourceId);
          setSummaryFormat(response.data.summaryFormat);
        } else {
          console.log("Failed to fetch summary data");
        }
      });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      document.title = "Fusion AI";
    };
  }, []);

  const linkOverride = {
    a: {
      component: ({ children, href, ...props }) => {
        if (href.startsWith("#timestamp")) {
          const timestamp = children[0].split(" - ")[0];
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

  // 點擊轉錄時跳轉視頻
  const handleTimestampClick = (time) => {
    console.log(time);
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

  if (loading) {
    return (
      <>
        <Header />
        <h1 className=" w-full flex items-center flex-col py-20">
          <Loader2 size="50" className=" animate-spin" />
          Loading...
        </h1>
      </>
    );
  }

  if (!loading && !summaryData) {
    return (
      <>
        <Helmet>
          <title>Easy Steps to Share Your Summaries | Fusion AI</title>
          <meta
            name="title"
            content="How to Share Video Summaries with Fusion AI | Easy Steps to Share Your Summaries"
          />
          <meta
            name="description"
            content="Learn how to share video summaries with Fusion AI. Follow simple steps to create and share concise summaries of your favorite videos."
          />
          <meta
            name="keywords"
            content="share video summaries, Fusion AI sharing instructions, how to share summaries, video summarization guide, share YouTube summaries"
          />
          <meta
            property="og:title"
            content="How to Share Video Summaries with Fusion AI | Easy Steps to Share Your Summaries"
          />
          <meta
            property="og:description"
            content="Learn how to share video summaries with Fusion AI. Follow simple steps to create and share concise summaries of your favorite videos."
          />
          <meta
            name="twitter:title"
            content="How to Share Video Summaries with Fusion AI | Easy Steps to Share Your Summaries"
          />
          <meta
            name="twitter:description"
            content="Learn how to share video summaries with Fusion AI. Follow simple steps to create and share concise summaries of your favorite videos."
          />
        </Helmet>
        <Header />
        <div className=" w-full flex flex-col py-20">
          <h1 className="text-2xl font-bold text-center">
            How to Share Video Summaries with Fusion AI
          </h1>
          <p className="mx-auto">
            To share video summaries with Fusion AI, follow these steps:
          </p>
          <ol className="list-decimal list-inside mx-auto space-y-2 py-4">
            <li>Login to Fusion AI: Access your account on Fusion AI.</li>
            <li>
              Go to Console Page: Navigate to the console page to start
              summarizing.
            </li>
            <li>
              Input YouTube Link: If you want to summarize a YouTube video,
              input the YouTube link in the text field.
            </li>
            <li>
              Generate Transcript: If the video transcript is not available, use
              our AI generation feature to create a transcript.
            </li>
            <li>
              Select Summarization Option: Once the transcript is ready, choose
              the summarization option that suits your needs.
            </li>
            <li>
              Click the Share Button: After the summary is done, click the
              sharebutton.
            </li>
            <li>
              Share the Link: Share the generated link with your friends,
              colleagues, or on social media.
            </li>
          </ol>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{videoTitle || "Video Summary"} | Fusion AI</title>
        <meta name="title" content={`${videoTitle} | Fusion AI`} />
        <meta
          name="description"
          content={`Summary of the video: ${videoTitle}`}
        />
        <meta name="og:title" content={`${videoTitle} | Fusion AI`} />
        <meta
          name="og:description"
          content={`Summary of the video: ${videoTitle}`}
        />
        <meta
          name="og:image"
          content={`https://img.youtube.com/vi/${sourceId}/0.jpg`}
        />
        <meta name="twitter:title" content={`${videoTitle} | Fusion AI`} />
        <meta
          name="twitter:description"
          content={`Summary of the video: ${videoTitle}`}
        />
        <meta
          name="twitter:image"
          content={`https://img.youtube.com/vi/${sourceId}/0.jpg`}
        />
        <link rel="canonical" href={`${shareLink}${summaryId}`} />
      </Helmet>
      <Header className="relative" />
      <div
        className="z-10 sticky top-0 left-0 w-full bg-white shadow-sm max-w-3xl mx-auto"
        id="videoDiv"
      >
        <VideoField
          shareMode={true}
          youtubeId={sourceId}
          videoRef={videoRef}
          className="max-w-2xl mx-auto shadow-md"
        />
      </div>
      <div className="px-6 md:px-0 max-w-3xl mx-auto py-4">
        <h1 className="text-2xl font-bold">
          <span className=" text-gray-400 font-semibold text-lg">
            Youtube Video Summary:{" "}
          </span>
          <br /> {videoTitle}
        </h1>
        <div className="w-full text-right py-2">
          <Button
            variant="ghost"
            className="p-2 text-primary hover:text-secondary"
            onClick={() => {
              // copy the current url to clipboard
              navigator.clipboard.writeText(window.location.href);
              toast({
                title: "Saved to clipboard",
                description: "The link has been copied to your clipboard.",
              });
            }}
          >
            <ShareIcon className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            className="p-2 text-primary hover:text-secondary"
            onClick={() => {
              //copy the summary to clipboard
              navigator.clipboard.writeText(summaryData.summary);
              toast({
                title: "Saved to clipboard",
                description: "The summary has been copied to your clipboard.",
              });
            }}

          >
            <DocumentDuplicateIcon className="w-6 h-6" />
          </Button>
        </div>
        {summaryFormat === "json" ? (
          <JsonSummaryField
            summary={summaryData.summary}
            handleTimestampClick={handleTimestampClick}
          />
        ) : (
          <Markdown className="prose max-w-full" options={{ overrides: linkOverride }}>
            {transformTimestampRangeFromArticleToSingleLink(
              summaryData.summary
            )}
          </Markdown>
        )}
        <div className="text-sm text-gray-400 text-center py-2">
          This Summary is brought to you by{" "}
          <a href={fusionaiLink} className=" text-blue-500">
            Fusion AI
          </a>
          , a AI-powered video summarization tool.
        </div>
      </div>
    </>
  );
};

export default SharePage;
