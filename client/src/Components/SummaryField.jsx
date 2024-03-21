import React, { useEffect, useState } from "react";
import { calculateCredit } from "./Utils";
import OptionField from "./OptionField";
import Markdown from "markdown-to-jsx";
import { useModels } from "../contexts/ModelContext";
import SummaryService from "../services/SummaryService";
import { languageList } from "../constants";
import { useAuth } from "../contexts/AuthContext"
import { useVideoContext } from "../contexts/VideoContext";

const SummaryField = ({ parentTranscriptText, parentSrtText, videoRef }) => {
  const [response, setResponse] = useState("");
  const [language, setLanguage] = useState("English");
  const [transcriptAvailable, setTranscriptAvailable] = useState(false);
  const [creditCount, setCreditCount] = useState(0);
  const [selectedModel, setselectedModel] = useState("claude3h");
  const [startSummary, setStartSummary] = useState(false);

  const { userId,setCredits } = useAuth()
  const { video } = useVideoContext()

  useEffect(() => {
    if (parentTranscriptText) {
      setCreditCount(
        calculateCredit({
          transcript: parentTranscriptText,
          model: selectedModel,
        })
      );
    }

    return () => { };
  }, [parentTranscriptText, selectedModel]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const inputTranscript = (id) => {
    switch (id) {
      case 1:
      case 6:
      case 7:
        return parentSrtText;
      default:
        return parentTranscriptText;
    }
  };

  const performSummarize = (option) => {
    setStartSummary(true);
    const { interval } = option;
    SummaryService.summarizeWithAI(
      {
        option,
        transcript: inputTranscript(option.id),
        language,
        interval,
        selectedModel,
        userId, video
      },
      (error, data) => {
        if (error) {
          // Handle error
          console.error("An error occurred:", error);
          return;
        }
        // Check if the data signals completion
        if (data && data.completed) {
          console.log("Summary process completed.");
          setCredits((prev) => (prev - creditCount).toFixed(1))
          // Optionally, add any actions to be taken upon completion
          return; // Stop further processing
        }
        // Append the received data to the response
        setStartSummary(false);
        setResponse((prev) => prev + data);
      }
    );
  };



  useEffect(() => {
    if (parentTranscriptText && parentTranscriptText !== "") {
      setTranscriptAvailable(true);
    } else {
      setTranscriptAvailable(false);
    }
  }, [parentTranscriptText]);

  const handleModelChange = (e) => {
    setselectedModel(e.target.value);
  };

  // 點擊轉錄時跳轉視頻
  const handleTimestampClick = (time) => {
    let [hours, minutes, seconds] = time.split(":");
    let secondsTotal;

    if (time.split(":").length === 2) {
      secondsTotal = parseInt(hours) * 60 + parseFloat(minutes);
    } else if (time.split(":").length === 3) {
      secondsTotal =
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);
    }

    if (videoRef && videoRef.current) {
      videoRef.current.currentTime = secondsTotal;
      if (videoRef.current.internalPlayer) {
        videoRef.current.internalPlayer.seekTo(secondsTotal);
      }
    }
  };
  const linkOverride = {
    a: {
      component: ({ children, href, ...props }) => {
        if (href.startsWith("#timestamp")) {
          const timestamp = children[0];
          return (
            <a
              className={"text-blue-500 cursor-pointer"}
              onClick={() => handleTimestampClick(timestamp)}
            >
              {children}
            </a>
          );
        }
        return (
          <a href={href} {...props}>
            {children}
          </a>
        );
      },
    },
  };

  const transformArticleWithClickableTimestamps = (articleContent) => {
    // Updated regex to match both hh:mm:ss and mm:ss formats
    const timestampRegex = /((\d{2}:)?\d{2}:\d{2})/g;

    return articleContent.replace(
      timestampRegex,
      (match) => `[${match}](#timestamp-${match})`
    );
  };

  // get model list from github
  const { usableModels } = useModels();

  return (
    <div className="relative h-full flex flex-col">
      {transcriptAvailable ? null : (
        <div className="absolute w-full h-full bg-gray-50 opacity-70 rounded-md flex justify-center items-center">
          <div>Transcript Not Available</div>
        </div>
      )}
      <div className="flex justify-between">
        <div className="text-left flex">
          <label htmlFor="language-select" className=" text-indigo-600 mr-1">
            Language:
          </label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            className="bg-gray-50 border border-indigo-300 text-indigo-600 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block hover:text-indigo-400 "
          >
            {languageList.map((item) => (
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          {/* <select
            id="model-select"
            value={selectedModel}
            onChange={handleModelChange}
            className="bg-gray-50 border border-indigo-300 text-indigo-600 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block hover:text-indigo-400 "
          >
            {usableModels
              ? usableModels.map((item) => (
                  <option
                    key={item.name}
                    disabled={!item.available}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))
              : defaultModels.map((item) => (
                  <option key={item.name} value={item.id}>
                    {item.name}
                  </option>
                ))}
          </select> */}
        </div>

        <button
          onClick={() => {
            setResponse("");
            setStartSummary(false);
          }}
          className="mr-4 outline-1 outline outline-indigo-600 text-indigo-600 rounded-md px-1.5 hover:text-indigo-400"
        >
          Reset
        </button>
      </div>

      {response === "" && !startSummary ? (
        <div className="overflow-y-auto ">
          <OptionField
            handleClick={performSummarize}
            creditCount={creditCount}
            setInterval={setInterval}
            videoRef={videoRef}
          />
        </div>
      ) : (
        <div className="overflow-y-auto ">
          {startSummary && response === "" ? (
            <div className="text-lg my-10">
              <div className="mx-auto animate-spin rounded-full h-10 w-10 border-r-2 border-b-2 border-indigo-600" />{" "}
              Loading Summary...
            </div>
          ) : (
            <Markdown
              className="prose h-full p-2 text-start leading-5"
              options={{ overrides: linkOverride }}
            >
              {transformArticleWithClickableTimestamps(response)}
            </Markdown>
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryField;
