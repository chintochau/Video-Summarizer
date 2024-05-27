import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import chromeIcon from "../../assets/chrome-icon.png";
import { chromeStoreLink } from "@/constants";

const ChromeExtension = () => {
  // Placeholder for video URL or interactive demo link
  const demoVideoUrl = "https://www.youtube.com/embed/kFtOtY5Adf4";
  const openChromeExtension = () => {
    window.open(chromeStoreLink);
  };

  return (
    <div className="py-16  text-center bg-gradient-to-br from-cyan-800 to-indigo-900">
      <div className="mx-4 max-w-4xl md:mx-auto">
        <div className="text-white">
          <h2 className="text-3xl font-bold mb-4">Chrome Extension</h2>
          <p className="mb-8">
            This is a Chrome extension that can help you summarize a video
            lecture or a podcast. It uses AI to generate a summary of the video
            or audio content.
          </p>
        </div>
        <Button
          variant="outline"
          className="mb-10"
          onClick={openChromeExtension}
        >
          <img
            src={chromeIcon}
            alt="Chrome Extension Icon"
            className="w-6 h-6 mr-2"
          />
          Add to Chrome
        </Button>
        {/* Embedding a video for demonstration. Adjust the `src` attribute as needed. */}
        <div className="aspect-w-16 aspect-h-9 mb-8 mx-auto">
          <iframe
            src={demoVideoUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Demo Video"
            className="w-full aspect-video"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ChromeExtension;
