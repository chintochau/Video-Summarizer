import { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import YouTube from "react-youtube";
import Header from "./components/Header";

function App({ initialData }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [summaryData, setSummaryData] = useState(initialData);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Header />

      <div className="flex flex-col lg:flex-row items-start">
        <div className="w-full bg-white sticky top-0 lg:w-1/2
        ">
          <div className="w-full max-w-3xl mx-auto ">
            {isLoaded && (
              <YouTube
                videoId={summaryData?.sourceId}
                className="w-full h-full aspect-video"
                iframeClassName="w-full h-full"
              />
            )}
          </div>
        </div>
  
        <div className="px-4">
          <h1 className="text-2xl font-bold max-w-3xl mx-auto">
            <span className=" text-gray-400 font-semibold text-lg">
              Youtube Video Summary:{" "}
            </span>
            <br /> {summaryData?.sourceTitle}
          </h1>
  
          <Markdown className="prose max-w-3xl mx-auto">
            {summaryData?.summary}
          </Markdown>
        </div>
      </div>

      <div className="text-sm text-gray-400 text-center py-10">
        This Summary is brought to you by{" "}
        <span className=" text-gray-700">Fusion AI</span>, a AI-powered video
        summarization tool.
      </div>

    </>
  );
}

export default App;
