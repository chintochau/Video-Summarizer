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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const YoutubeSummary = ({ Bar3Button }) => {
  const videoRef = useRef(null);
  const { youtubeId } = useVideoContext();

  return (
    <div className="flex flex-col md:h-full">
      {/* YoutubeBar */}
      <YoutubeBar
        Bar3Button={Bar3Button}
        className="fixed z-10 top-0 w-full md:relative"
      />
      {/* Main Content */}
      {youtubeId && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="flex-col flex-1 flex">
            <VideoField
              videoRef={videoRef}
              youtubeId={youtubeId}
              className="fixed z-10 top-11 md:top-0 md:relative"
            />
            <div className="h-40 flex-1 hidden md:block overscroll-scroll">
              <TranscriptField
                youtubeId={youtubeId}
                videoRef={videoRef}
                displayMode="youtube"
              />
            </div>
            <div className="pt-[66vw] md:hidden h-40 flex-1 flex flex-col">
              <Tabs defaultValue="summary" >
                <TabsList className="w-full flex">                  
                  <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
                  <TabsTrigger value="transcript" className="flex-1">Transcript</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="my-0">
                  <SummaryField videoRef={videoRef} />
                </TabsContent>
                <TabsContent value="transcript" className="my-0">
                  <TranscriptField
                    youtubeId={youtubeId}
                    videoRef={videoRef}
                    displayMode="youtube"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
          <ResizableHandle className="w-1 bg-indigo-100 hidden md:flex" />
          <ResizablePanel className="hidden sticky top-20 shrink-0 md:block w-full md:w-1/2  h-1/2  md:h-full p-1 bg-gray-50">
            <SummaryField videoRef={videoRef} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
      {!youtubeId && (
        <HistoryPage
          sourceType="youtube"
          className="top-11 absolute sm:top-16"
        />
      )}
    </div>
  );
};

export default YoutubeSummary;
