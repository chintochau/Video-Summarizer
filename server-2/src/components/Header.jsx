import React from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <nav className="w-full bg-gray-900 sticky top-0">
      <div className="px-2 md:container flex justify-between items-center">
        <div className="flex py-2 items-center gap-2">
          <img
            src="https://fusionaivideo.io/assets/logo-CGPrzN3y.png"
            className="h-10"
          />
          <a
            href="https://fusionaivideo.io"
            className="text-white p-1 text-2xl font-semibold"
          >
            {" "}
            Fusion AI Summary
          </a>
        </div>

        <div>
          <Button
            href="https://fusionaivideo.io/summarizer"
            onClick={() => {
              window.location.href = "https://fusionaivideo.io/summarizer";
            }}
          >
            Summarize
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
