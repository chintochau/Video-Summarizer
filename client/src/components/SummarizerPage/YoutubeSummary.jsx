import { useRef } from "react";
import VideoField from "../summarizerComponents/YTVideoField";
import SummaryField from "../SummaryField";
import TranscriptField from "../TranscriptField";
import { useVideoContext } from "../../contexts/VideoContext";
import HistoryPage from "../../pages/HistoryPage";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import YoutubeBar from "../summarizerComponents/YoutubeBar";

const YoutubeSummary = ({ Bar3Button }) => {
  const videoRef = useRef(null);
  const { youtubeId } = useVideoContext();

  return (
    <div className="flex flex-col h-full">
      {/* YoutubeBar */}
      <YoutubeBar Bar3Button={Bar3Button} />
      {/* Main Content */}
      {youtubeId && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="flex-col flex-1 hidden md:flex">
            <VideoField videoRef={videoRef} youtubeId={youtubeId} />
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
          <ResizablePanel className="hidden sticky top-20 shrink-0 md:block w-full md:w-1/2  h-1/2  md:h-full p-1 bg-gray-50">
            <SummaryField videoRef={videoRef} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
      {!youtubeId && <HistoryPage sourceType="youtube" />}

      <div className="w-full md:hidden">
        <VideoField
          videoRef={videoRef}
          youtubeId={youtubeId}
          className="sticky top-0 z-10"
        />
        <SummaryField videoRef={videoRef} />
      </div>
    </div>
  );
};

export default YoutubeSummary;
