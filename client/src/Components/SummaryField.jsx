import React, { useEffect, useState } from "react";
import GeneralButton, { OutlinedButton } from "./GeneralButton";
import { askChatGPT } from "./Utils";
import Markdown from "react-markdown";

import remarkGfm from "remark-gfm";
import OptionField from "./OptionField";

const SummaryField = ({ parentTranscriptText }) => {
  const [response, setResponse] = useState("");
  const [language, setLanguage] = useState("auto");
  const [transcriptAvailable, setTranscriptAvailable] = useState(false);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const startSummary = (prompt) => {
    console.log(language);
    askChatGPT(prompt + parentTranscriptText,language , (error, data) => {
      console.log(data);
      setResponse((prev) => prev + data);
    });
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
          <OptionField handleClick={startSummary} />
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
