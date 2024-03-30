import React, { useEffect, useState } from "react";
import {calculateCredit} from '../utils/creditUtils.js'
import SummaryService from "../services/SummaryService";
import { languageList } from "../constants";
import { useAuth } from "../contexts/AuthContext";
import { useVideoContext } from "../contexts/VideoContext";
import HeadingsWithTabs from "../summary-field-conpoments/HeadingsWithTabs";
import SummaryTab from "../summary-field-conpoments/SummaryTab";
import { checkCredits } from "../utils/creditUtils";

const SummaryField = ({ parentTranscriptText, parentSrtText, videoRef }) => {
  const newSummary = { summary: "", summaryType: "New Summary" };
  const [summaries, setSummaries] = useState([newSummary]);
  const [response, setResponse] = useState("");
  const [language, setLanguage] = useState("English");
  const [transcriptAvailable, setTranscriptAvailable] = useState(false);
  const [creditCount, setCreditCount] = useState(0);
  const [selectedModel, setselectedModel] = useState("claude3h");
  const [startSummary, setStartSummary] = useState(false);
  const { userId, setCredits, credits } = useAuth();
  const { video } = useVideoContext();

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const result = await SummaryService.fetchSummariesForVideo(
          userId,
          video.sourceId
        );
        if (result.success) {
          setSummaries((prev) => [...result.data, ...prev]);
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSummaries();
  }, [userId, video.sourceId]);

  const insertNewTab = (summaryText, title) => {
    setSummaries((prev) => [
      { summary: summaryText, summaryType: title },
      ...prev,
    ]);
  };

  const updateSummaryOfIndex = (indexToUpdate, field, value) => {
    const updatedSummaries = summaries.map((item, index) => {
      // Update the summaryType of the specified item
      if (index === indexToUpdate) {
        return { ...item, [field]: value };
      }
      return item; // Keep other items unchanged
    });
    setSummaries(updatedSummaries);
  };

  useEffect(() => {
    if (parentTranscriptText) {
      setCreditCount(
        calculateCredit({
          transcript: parentTranscriptText,
          model: selectedModel
        })
      );
    }
    return () => {};
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

  const performSummarize = async (option) => {
    setStartSummary(true);
    const { interval, creditAmount, title } = option;

    let finalOutput = "";
    try {
      checkCredits(credits, creditAmount);
      updateSummaryOfIndex(activeTab, "sourceType", title);
      await SummaryService.summarizeWithAI(
        {
          option,
          transcript: inputTranscript(option.id),
          language,
          interval,
          selectedModel,
          userId,
          video,
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
            setResponse("");
            insertNewTab(finalOutput, title);
            setCredits((prev) => (prev - creditCount).toFixed(1));
            setActiveTab(0);
            return; // Stop further processing
          }
          // Append the received data to the response
          setStartSummary(false);
          setResponse((prev) => prev + data);
          finalOutput += data;
        }
      );
    } catch (error) {
      console.error(error.message);
      setStartSummary(false);
    }
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
            className="p-1 bg-gray-50 border border-indigo-300 text-indigo-600 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block hover:text-indigo-400 "
          >
            {languageList.map((item) => (
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <HeadingsWithTabs
        startSummary={startSummary}
        summaries={summaries}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
      <SummaryTab
        videoRef={videoRef}
        activeTab={activeTab}
        summaryObject={summaries[activeTab]}
        updateSummaryOfIndex={updateSummaryOfIndex}
        insertNewTab={insertNewTab}
        response={response}
        startSummary={startSummary}
        performSummarize={performSummarize}
        creditCount={creditCount}
      />
    </div>
  );
};

export default SummaryField;
