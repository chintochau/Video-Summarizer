import React, { useEffect, useState } from "react";
import { calculateCredit } from "../utils/creditUtils.js";
import SummaryService from "../services/SummaryService";
import { languageList } from "../constants";
import { useAuth } from "../contexts/AuthContext";
import { useVideoContext } from "../contexts/VideoContext";
import HeadingsWithTabs from "../summary-field-conpoments/HeadingsWithTabs";
import SummaryTab from "../summary-field-conpoments/SummaryTab";
import { checkCredits } from "../utils/creditUtils";
import { useSummaryContext } from "@/contexts/SummaryContext.jsx";
import { useTranscriptContext } from "@/contexts/TranscriptContext.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageIcon } from "@heroicons/react/24/outline";
import { BoltIcon } from "@heroicons/react/24/solid";
import { Button } from "./ui/button.jsx";
import { useQuota } from "@/contexts/QuotaContext.jsx";

const SummaryField = ({ videoRef }) => {
  // use context
  const { summaries, setSummaries } = useSummaryContext();
  const { userId, setCredits, credits, currentUser } = useAuth();
  const { video } = useVideoContext();
  const { parentTranscriptText, parentSrtText } = useTranscriptContext();
  const { quota } = useQuota();

  // use state
  const [response, setResponse] = useState("");
  const [language, setLanguage] = useState("English");
  const [creditCount, setCreditCount] = useState(0);
  const [startSummary, setStartSummary] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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
          model: "claude3h",
        })
      );
    }
    return () => {};
  }, [parentTranscriptText]);

  const handleLanguageChange = (value) => {
    setLanguage(value);
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
          selectedModel: "claude3h",
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

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex justify-between px-3">
        <div className=" flex items-center gap-x-2">
          <LanguageIcon className="w-6 h-6 text-gray-600" />
          <Select onValueChange={handleLanguageChange} defaultValue="English">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languageList.map((item) => (
                <SelectItem key={item.code} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          {currentUser && userId ? (
            <Button
              className="h-8 text-sm text-indigo-600 flex items-center "
              variant="outline"
            >
              <BoltIcon className="w-4 h-6" />:{credits}
            </Button>
          ) : (
            <Button
              className="h-8 text-sm flex items-center cursor-default hover:bg-white"
              variant="outline"
            >
              <BoltIcon className="w-4 h-6 text-yellow-500" />: {quota}
            </Button>
          )}
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
