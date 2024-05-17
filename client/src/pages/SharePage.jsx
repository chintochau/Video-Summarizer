import { Footer } from "@/components";
import Header from "@/components/common/Header";
import VideoField from "@/components/summarizerComponents/YTVideoField";
import { transformArticleWithClickableTimestamps } from "@/components/summary-field-conpoments/SummaryTab";
import SummaryService from "@/services/SummaryService";
import { Loader2 } from "lucide-react";
import Markdown from "markdown-to-jsx";
import React, { useEffect, useRef, useState } from "react";

const SharePage = () => {
  // State to store the extracted URL parameter
  const [summaryId, setSummaryId] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [sourceId, setSourceId] = useState(null);

  const videoRef = useRef(null);
  // Effect hook to run once when the component mounts
  useEffect(() => {
    // Function to extract URL parameters
    const getSummaryId = () => {
      const params = new URLSearchParams(window.location.search);
      const summaryParam = params.get("s");
      setSummaryId(summaryParam);
      return summaryParam;
    };
    // Call the function
    const summaryId = getSummaryId();
    if (summaryId) {
      // Fetch the summary data
      SummaryService.getSummary({ summaryId }).then((response) => {
        // Check if the summary data was fetched
        if (response.success) {
          console.log("Summary data fetched", response.data);
          setSummaryData(response.data);
          setSourceId(response.data.sourceId);
        } else {
          console.log("Failed to fetch summary data");
        }
      });
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
          const timestamp = children[0];
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

  if (!summaryData) {
    return (
      <>
        <Header/>
        <h1 className=" w-full flex items-center flex-col py-20">
          <Loader2 size="50" className=" animate-spin" />
          Loading...
        </h1>
      </>
    );
  }

  if (!sourceId) {
    return (
      <>
        <h1>Invalid URL</h1>
      </>
    );
  }

  return (
    <>
      <Header className="relative" />
      <div
        className="z-10 sticky top-0 left-0 w-full bg-white pb-2 shadow-sm max-w-3xl mx-auto"
        id="videoDiv"
      >
        <VideoField shareMode={true} youtubeId={sourceId} videoRef={videoRef} className="max-w-2xl mx-auto shadow-md"/>
      </div>
      <Markdown
        className="px-6 md:px-0 prose max-w-3xl mx-auto py-10"
        options={{ overrides: linkOverride }}
      >
        {transformArticleWithClickableTimestamps(summaryData.summary)}
      </Markdown>
    </>
  );
};

export default SharePage;
