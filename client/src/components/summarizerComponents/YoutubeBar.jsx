import { useVideoContext } from "@/contexts/VideoContext";
import React, { useState } from "react";
import { getYoutubeIdFromLink } from "@/utils/youtubeUtils";
import { PlayCircleIcon } from "@heroicons/react/20/solid";
import { Button } from "../ui/button";
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import YoutubeService from "@/services/YoutubeService";
import { cn } from "@/utils/utils";
import { useTranscriptContext } from "@/contexts/TranscriptContext";

const YoutubeBar = ({Bar3Button, className}) => {
  const { setYoutubeId, youtubeId } = useVideoContext();
  const [youtubeLink, setYoutubeLink] = useState(youtubeId ? "https://www.youtube.com/watch?v=" + youtubeId : "");
  const {setTranscriptId} = useTranscriptContext();

  const submitYoutubeLink = (e) => {
    e.preventDefault();
    const id = getYoutubeIdFromLink(youtubeLink);
    if (id) {
      setYoutubeId(id);
    } else {
      setYoutubeId("");
    }
  };

  return (
    <div className={
      cn(
        "flex gap-x-1 px-1 py-1 ",
        Bar3Button ? "bg-gray-900" : "",
        className
      )
    }>
      {Bar3Button && <Bar3Button />}
      <div className="flex h-9 md:h-12 shrink-0 items-center gap-x-4 border-2 rounded-lg border-gray-200  pl-4 shadow-sm md:gap-x-6 md:pl-6 lg:pl-8 md:pr-1 flex-1 bg-gray-50">
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form
            className="relative flex flex-1 items-center"
            onSubmit={submitYoutubeLink}
          >
            <label htmlFor="youtube-bar" className="sr-only">
              youtube link
            </label>
            <PlayCircleIcon
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className=" block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 md:text-sm bg-gray-50"
              placeholder="Youtube link"
              type="search"
              autoComplete="off"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
            <Button type="submit" size="sm" className="hidden md:block">
              Submit
            </Button>
            {youtubeId && (
              <Button variant="outline" type="button" size="sm" className="ml-1 hidden md:flex"
                onClick={() => YoutubeService.getYoutubeAudio({ youtubeLink })}
              >
                <DocumentArrowDownIcon className="w-6 h-6 mr-1" />
                <span>Audio</span>
              </Button>
            )}
          </form>
        </div>
      </div>
      <div className="md:hidden items-center flex">
        <Button onClick={submitYoutubeLink} size="sm" variant='outline'>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default YoutubeBar;
