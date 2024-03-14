import React, { useEffect, useState } from "react";
import GeneralButton, { OutlinedButton } from "./GeneralButton";
import { askChatGPT, calculateCredit } from "./Utils";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import OptionField from "./OptionField";

const SummaryField = ({ parentTranscriptText, parentSrtText }) => {
  const [response, setResponse] = useState("");
  const [language, setLanguage] = useState("auto");
  const [transcriptAvailable, setTranscriptAvailable] = useState(false);
  const [interval, setInterval] = useState(300);
  const [creditCount, setCreditCount] = useState(0);

  useEffect(() => {
    if (parentTranscriptText) {
      setCreditCount(calculateCredit(parentTranscriptText));
    }

    return () => {};
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
    askChatGPT(
      {
        option,
        transcript: inputTranscript(option.id),
        language,
        interval,
      },
      (error, data) => {
        let receivedData;

        try {
          // Try to parse the received data as JSON
          receivedData = JSON.parse(data);
          // If parsing was successful, then data is a JSON object
          console.log("Received JSON object:", receivedData.timestamp);
          setResponse((prev) => prev + `\n${receivedData.timestamp}\n`);
        } catch (error) {
          // If parsing fails, data is treated as a simple string
          receivedData = data;
          setResponse((prev) => prev + receivedData);
        }
      }
    );
  };

  const handleMenuClick = () => {
    setMenuActive(!menuActive);
  };

  useEffect(() => {
    if (parentTranscriptText && parentTranscriptText !== "") {
      setTranscriptAvailable(true);
    } else {
      setTranscriptAvailable(false);
    }
  }, [parentTranscriptText]);

  return (
    <div className="h-[70vw] max-h-[60vh] relative">
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
        <div className="overflow-y-auto max-h-[calc(100%-50px)]">
          <OptionField
            handleClick={startSummary}
            creditCount={creditCount}
            setInterval={setInterval}
            interval={interval}
          />
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[calc(100%-50px)]">
          <Markdown
            className="prose h-full p-2 text-start leading-5"
            remarkPlugins={[remarkGfm]}
          >
            {response}
          </Markdown>
        </div>
      )}
    </div>
  );
};

export default SummaryField;
