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
import { Bookmark, Loader2, Send } from "lucide-react";
import { useTranscriptContext } from "@/contexts/TranscriptContext";
import { useNavigate } from "react-router-dom";
import { useVideoContext } from "@/contexts/VideoContext";
import { useAuth } from "@/contexts/AuthContext";
import Markdown from "markdown-to-jsx";

const SearchPage = () => {
  const navigate = useNavigate();
  const [displayArray, setDisplayArray] = useState([]); //[{videoSourceId, videoTitle, videoSourceType, , score, youtubeThumbnail, text: [{text, referenceTimeRange}]]
  const { resetTranscript, setLoadingTranscript } = useTranscriptContext();
  const { setYoutubeId, setSourceId, setSourceType, setSourceTitle } =
    useVideoContext();
  const { userId } = useAuth();
  const [savedVideos, setSavedVideos] = useState([]); // [{videoSourceId, videoTitle, videoSourceType, , score, youtubeThumbnail, text: [{text, referenceTimeRange}]]
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

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
    setLoading(true);
    const result = await EmbeddingsService.vectorSearch({ query: queryText });
    turnIntoDisplayArray(result);
    if (result.length === 0) {
      setAnswer("No relevant content found in saved videos.");
      setLoading(false);
      return;
    }
    const answer = await EmbeddingsService.answerQuestions({
      userInput: queryText,
      userId,
      referenceVideosArray: result,
    });

    setAnswer(answer);
    setLoading(false);
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
    <div className="flex h-full p-10 bg-gray-50">
      <div className="h-full container flex flex-col overflow-auto">
        <Card className="rounded-xl ">
          <CardHeader>
            <CardTitle>Search content from saved videos</CardTitle>
            <CardDescription>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger className="text-lg font-semibold text-gray-500 underline cursor-pointer hover:text-indigo-600">
                    How does it work?
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <ul className="text-left  space-y-1">
                      <li>1. Go to any video.</li>
                      <li className="flex items-center">
                        2. Click on the bookmark icon <Bookmark /> to save the
                        video's transcript.
                      </li>
                      <li>3. Navigate to the Search page.</li>
                      <li>
                        4. Enter your question or keyword in the search bar.
                      </li>
                      <li>
                        5. The AI will provide information from the saved video.
                      </li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardDescription>

            <form onSubmit={handleVectorSearch} className="pt-1 w-full">
              <div className="flex gap-x-2 pt-4">
                <Input
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Search content from saved video"
                  className="w-full relative bottom-0 border-1 border-indigo-600 hover:border-indigo-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
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
          </CardHeader>

          <CardContent className="overflow-auto py-4 ">
            {loading && (
              <>
                <Loader2 className=" animate-spin text-indigo-600 w-12 h-12" />
                <p className="text-indigo-600">Loading...</p>
              </>
            )}
            
            {answer !== "" && <Markdown 
              className="prose max-w-full h-full p-2 px-4 text-start leading-5">{answer}</Markdown>}
          </CardContent>
        </Card>

        {displayArray.length !== 0 && (
          <CardTitle className="pt-8 px-4 text-indigo-500">
            <p>Reference videos with the most relevant content:</p>
          </CardTitle>
        )}
        {displayArray.map((video, index) => (
          <Card
            key={index}
            onClick={() => {
              openVideoHistory(video);
            }}
            className="outline outline-0 hover:outline-1 hover:outline-indigo-600 cursor-pointer m-1"
          >
            <CardHeader>
              <CardTitle>{video.videoTitle}</CardTitle>
              <CardDescription>{video.videoSourceType}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-x-4">
              <img
                className="h-28 w-auto aspect-auto"
                src={video.youtubeThumbnail}
                alt={video.videoSourceTitle}
              />
              <ul>
                {video.text.map((text, index) => (
                  <li key={index} className="flex flex-col">
                    <p className=" text-blue-600">{text.referenceTimeRange}</p>
                    <p className=" line-clamp-4">{text.text}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="hidden w-1/2 rounded-xl md:flex flex-col overflow-auto">
        <CardHeader>
          <CardTitle>Saved Videos</CardTitle>
          <CardDescription>
            Click on the button below to view your saved videos.
          </CardDescription>
          <Button
            variant="outline"
            onClick={async () => {
              const collection =
                await EmbeddingsService.getEmbeddingCollectionAndVideos({
                  userId,
                });
              console.log(collection.videos);
              setSavedVideos(collection.videos);
            }}
          >
            Show "Default" Collection
          </Button>
        </CardHeader>

        <CardContent className=" space-y-1">
          {savedVideos.length > 0 &&
            savedVideos.map((video, index) => (
              <div
                key={index}
                className="flex gap-x-2 rounded-md border  border-gray-200 p-2 items-center"
              >
                {video && video.videoThumbnail && (
                  <img
                    className="h-28 w-auto aspect-auto"
                    src={video.videoThumbnail}
                    alt={video.sourceTitle}
                  />
                )}
                <div>
                  <p>{video.sourceTitle}</p>
                  <p className=" text-gray-400">{video.sourceType}</p>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchPage;
