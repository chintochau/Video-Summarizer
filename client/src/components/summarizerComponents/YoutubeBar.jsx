import { useVideoContext } from "@/contexts/VideoContext";
import React, { useState } from "react";
import { getYoutubeIdFromLink } from "@/utils/youtubeUtils";
import { PlayCircleIcon } from "@heroicons/react/20/solid";
import { Button } from "../ui/button";
import {DocumentArrowDownIcon} from '@heroicons/react/24/outline'
import YoutubeService from "@/services/YoutubeService";

const YoutubeBar = () => {
  const { setYoutubeId, youtubeId } = useVideoContext();
  const [youtubeLink, setYoutubeLink] = useState(youtubeId ? "https://www.youtube.com/watch?v="+youtubeId:"");

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
    <div className="sticky top-0 z-10 flex h-8 sm:h-12 md:h-12 shrink-0 items-center gap-x-4 border-2 m-1 rounded-lg border-gray-200 bg-gray-50 pl-4 shadow-sm sm:gap-x-6 sm:pl-6 lg:pl-8 sm:pr-1">
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
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm bg-gray-50"
            placeholder="Youtube link"
            type="search"
            autoComplete="off"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            onFocus={(e) => e.target.select()}
          />
          <Button className="h-full sm:h-5/6 bg-indigo-600" type="submit">
            <span>Submit</span>
          </Button>
          {youtubeId && (
            <Button className="h-full sm:h-5/6 ml-1" variant="outline" type="button"
              onClick={() =>  YoutubeService.getYoutubeAudio({ youtubeLink })}
            >
                <DocumentArrowDownIcon className="w-6 h-6 mr-1"/>
              <span>Audio</span>
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default YoutubeBar;
