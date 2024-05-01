import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import EmbeddingsService from "@/services/EmbeddingsService";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bookmark, Send } from "lucide-react";
import { useTranscriptContext } from "@/contexts/TranscriptContext";
import { useNavigate } from "react-router-dom";
import { useVideoContext } from "@/contexts/VideoContext";
import { useAuth } from "@/contexts/AuthContext";


const RAGPage = () => {
  const navigate = useNavigate();
  const [displayArray, setDisplayArray] = useState([]); //[{videoSourceId, videoTitle, videoSourceType, , score, youtubeThumbnail, text: [{text, referenceTimeRange}]]
  const { resetTranscript, setLoadingTranscript } = useTranscriptContext();
  const { setYoutubeId, setSourceId, setSourceType, setSourceTitle } =    useVideoContext();
  const {userId} = useAuth();
  const turnIntoDisplayArray = (resultArray) => {
    if (resultArray.length > 0) {
      const videos = [];
      for (const result of resultArray) {
        const {
          videoSourceId,
          videoTitle,
          videoSourceType,
          text,
          referenceTimeRange,
        } = result;
        console.log(result);
        // add to displayArray
        // if youtube, get thumbnail with https://img.youtube.com/vi/${sourceId}/0.jpg
        const youtubeThumbnail = `https://img.youtube.com/vi/${videoSourceId}/0.jpg`;
        const video = {
          videoSourceId,
          videoTitle,
          videoSourceType,
          youtubeThumbnail,
          text: [{ text, referenceTimeRange }],
        };
        videos.push(video);
      }
      setDisplayArray(videos);
    }
  };

  const [queryText, setQueryText] = useState("");

  const handleVectorSearch = async (e) => {
    e.preventDefault();
    const result = await EmbeddingsService.vectorSearch({ query: queryText });
    turnIntoDisplayArray(result);
  };

  const openVideoHistory = (video) => {
    resetTranscript();
    setLoadingTranscript(true);
    switch (video.videoSourceType) {
      case "user-upload":
        setSourceId(video.videoSourceId);
        setYoutubeId(null);
        setSourceTitle(video.videoSourceTitle);
        setSourceType("user-upload");
        navigate("/console/upload");
        break;
      case "youtube":
        setYoutubeId(video.videoSourceId);
        setSourceId(null);
        setSourceTitle(video.videoSourceTitle);
        setSourceType("youtube");
        navigate("/console/youtube");
        break;
      default:
        console.log("Error: videoSourceType not recognized");
        break;
    }
  };

  return (
    <Container>
      <form onSubmit={handleVectorSearch} className="pt-10">
        <div className="w-full text-center">
          <h2 className="text-2xl font-bold ">
            Search content from saved videos
          </h2>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger className="text-lg font-semibold text-gray-500 underline cursor-pointer hover:text-indigo-600">
                How does it work?
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <ul className="text-left  space-y-1">
                  <li>1. Go to any video.</li>
                  <li className="flex items-center">
                    2. Click on the bookmark icon <Bookmark /> to save the
                    video's transcript.
                  </li>
                  <li>3. Navigate to the Search page.</li>
                  <li>4. Enter your question or keyword in the search bar.</li>
                  <li>
                    5. The AI will provide information from the saved video.
                  </li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex  gap-x-2 border-b-2 pt-6 border-b-indigo-200 pb-4">
          <Input
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Search content from saved video"
            className="w-full relative bottom-0"
          />
          <Button
            type="submit"
            variant="outline"
            className="border-indigo-600 text-indigo-600 border-2 hover:text-indigo-400 hover:border-indigo-400"
          >
            <Send className="w-6" />
          </Button>
        </div>
      </form>

      <div className=" h-1/2 flex-1 overflow-auto pt-4 flex-col flex gap-y-4">
        {displayArray.map((video, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{video.videoTitle}</CardTitle>
              <CardDescription>{video.videoSourceType}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-x-4">
              <img
                className="h-40 w-auto aspect-auto"
                src={video.youtubeThumbnail}
                alt={video.videoSourceTitle}
              />
              <ul>
                {video.text.map((text, index) => (
                  <li key={index} className="flex flex-col">
                    <p className=" text-blue-600">{text.referenceTimeRange}</p>
                    <p className=" line-clamp-6">{text.text}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="border-indigo-600 text-indigo-600"
                onClick={() => {
                    openVideoHistory(video);
                }}
              >
                Watch Video
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Button onClick={async () => {
        const collection = await EmbeddingsService.getEmbeddingCollectionAndVideos({ userId });
        console.log(collection);
      }}>
        get collection
      </Button>
    </Container>
  );
};

export default RAGPage;
