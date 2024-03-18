import React, { useEffect, useState } from "react";
import GeneralButton, { OutlinedButton } from "./GeneralButton";
import { askChatGPT, calculateCredit } from "./Utils";
import OptionField from "./OptionField";
import Markdown from 'markdown-to-jsx'

const SummaryField = ({ parentTranscriptText, parentSrtText,videoRef }) => {
  const [response, setResponse] = useState(`| Loading Summary...  | Item Name              | Description                                                                       | Timestamp | Price |
  |---------------------|------------------------|-----------------------------------------------------------------------------------|-----------|-------|
  | React Context API   | Explanation of how React Context API works and its benefits                      | 00:00:06  | N/A   |
  | User Subscription   | Mention of user subscription status and encouragement to subscribe                | 00:02:01  | N/A   |
  | Dashboard Component | Description and issues with the dashboard component structure                     | 00:02:25  | N/A   |
  | Context Creation    | Creation of a context file and setting up the context for user data sharing       | 00:04:10  | N/A   |
  | Provider Usage      | Implementation of the context provider and passing user data through context      | 00:06:51  | N/A   |
  | Sidebar Component   | Updating the sidebar component to consume user data from context using a custom hook | 00:08:00  | N/A   |
  | Custom Hook         | Creation of a custom hook to handle user context logic and ensure user data is always available | 00:11:36  | N/A   |
  | Conclusion          | Summary of the importance of understanding React Context API and encouraging subscription | 00:14:52  | N/A   |
  `);
  const [language, setLanguage] = useState("auto");
  const [transcriptAvailable, setTranscriptAvailable] = useState(false);
  const [interval, setInterval] = useState(300);
  const [creditCount, setCreditCount] = useState(0);

  useEffect(() => {
    if (parentTranscriptText) {
      setCreditCount(calculateCredit(parentTranscriptText));
    }

    return () => { };
  }, [parentTranscriptText]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const inputTranscript = (id) => {
    switch (id) {
      case 1:
        return parentSrtText;
      case 6:
        return parentSrtText;
      default:
        return parentTranscriptText;
    }
  };

  const startSummary = (option) => {
    setResponse("Loading Summary...\n\n");
    askChatGPT(
      {
        option,
        transcript: inputTranscript(option.id),
        language,
        interval,
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
          // Optionally, add any actions to be taken upon completion
          return; // Stop further processing
        }
        // Append the received data to the response
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

  // 點擊轉錄時跳轉視頻
  const handleTimestampClick = (time) => {
    let [hours, minutes, seconds] = time.split(":");
    let secondsTotal;

    if (time.split(":").length === 2) {
        secondsTotal = (parseInt(hours) * 60) + parseFloat(minutes);
    } else if (time.split(":").length === 3) {
        secondsTotal = (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseFloat(seconds);
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
            <a className={"text-blue-500 cursor-pointer"}
              onClick={() => handleTimestampClick(timestamp)}>
              {children}
            </a>
          );
        }
        return <a href={href} {...props}>{children}</a>;
      }
    }
  };

  const transformArticleWithClickableTimestamps = (articleContent) => {
    // Updated regex to match both hh:mm:ss and mm:ss formats
    const timestampRegex = /((\d{2}:)?\d{2}:\d{2})/g;
    
    return articleContent.replace(timestampRegex, (match) => `[${match}](#timestamp-${match})`);
  };

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
            <option value="auto">Auto</option>
            <option value="en">English</option>
            <option value="zh-TW">繁體中文</option>
            {/* Add more languages as needed */}
          </select>
        </div>
        <button
          onClick={() => {
            setResponse("");
          }}
          className="mr-4 outline-1 outline outline-indigo-600 text-indigo-600 rounded-md px-1.5 hover:text-indigo-400"
        >
          Reset
        </button>
      </div>
      {response === "" ? (
        <div className="overflow-y-auto ">
          <OptionField
            handleClick={startSummary}
            creditCount={creditCount}
            setInterval={setInterval}
            interval={interval}
          />
        </div>
      ) : (
        <div className="overflow-y-auto ">
          <Markdown
            className="prose h-full p-2 text-start leading-5"
            options={{ overrides: linkOverride }}
          >
            {transformArticleWithClickableTimestamps(response)}
          </Markdown>
        </div>
      )}
    </div>
  );
};

export default SummaryField;

