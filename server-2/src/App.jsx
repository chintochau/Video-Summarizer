import { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import YouTube from "react-youtube";
import Header from "./components/Header";

function App({ initialData }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [summaryData, setSummaryData] = useState(initialData);
  const [summaryDateInString, setSummaryDateInString] = useState("");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // set summary date in string, summaryData?.date: "2022-06-01T00:00:00.000Z"
    const date = new Date(summaryData?.createdAt);
    console.log();
    const dateString = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setSummaryDateInString(dateString);
  }, [summaryData?.createdAt]);

  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row items-start">
        <div
          className="w-full bg-white sticky top-0 lg:top-14 lg:w-1/2
        "
        >
          <div className="w-full mx-auto ">
            {isLoaded && (
              <YouTube
                videoId={summaryData?.sourceId}
                className="w-full h-full aspect-video lg:m-2"
                iframeClassName="w-full h-full"
              />
            )}
          </div>
        </div>

        <div className="px-4 lg:ml-2">
          <div className="flex justify-between items-center">
            <span className=" text-gray-400 font-semibold text-lg">
              Youtube Video Summary:
            </span>
            <p className="text-sm text-gray-400">
              Summary Date: {summaryDateInString}
            </p>
          </div>
          <h1 className="text-2xl font-bold max-w-3xl mx-auto ">
            {summaryData?.sourceTitle}
          </h1>

          <Markdown className="prose max-w-3xl mx-auto">
            {summaryData?.summary}
          </Markdown>
        </div>
      </div>

      <div className="text-sm text-gray-400 text-center py-10">
        This Summary is brought to you by{" "}
        <span className=" text-gray-700">Fusion AI</span>, a AI-powered video
        summarization tool for Youtube, Podcasts, Meetings, and more.
      </div>
    </>
  );
}

export default App;
