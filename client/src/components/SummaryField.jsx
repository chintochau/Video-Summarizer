import React, { useEffect, useState } from "react";
import { calculateCredit } from "../utils/creditUtils.js";
import SummaryService from "../services/SummaryService";
import { languageList } from "../constants";
import { useAuth } from "../contexts/AuthContext";
import { useVideoContext } from "../contexts/VideoContext";
import HeadingsWithTabs from "./summary-field-conpoments/HeadingsWithTabs.jsx";
import SummaryTab from "./summary-field-conpoments/SummaryTab.jsx";
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
import { LanguageIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { BoltIcon } from "@heroicons/react/24/solid";
import { Button } from "./ui/button.jsx";
import { useQuota } from "@/contexts/QuotaContext.jsx";
import QuotaService from "@/services/QuotaService.js";
import { defaultModels } from "./Prompts.js";
import { getItem, setItem } from "@/services/LocalStorageService.js";
import { STORAGE_KEYS } from "@/utils/StorageKeys.js";

const SummaryField = ({ videoRef }) => {
  // use context
  const { summaries, setSummaries } = useSummaryContext();
  const { userId, setCredits, credits, currentUser } = useAuth();
  const { video } = useVideoContext();
  const { parentTranscriptText, parentSrtText } = useTranscriptContext();
  const { quota, setQuota } = useQuota();

  // use state
  const [response, setResponse] = useState("");
  const [creditCount, setCreditCount] = useState(0);
  const [startSummary, setStartSummary] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [language, setLanguage] = useState("English");
  const [languageModel, setLanguageModel] = useState("claude3h");

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
    // Calculate the credit count, and set active tab to 0 when the parent transcript text changes
    if (parentTranscriptText) {
      setCreditCount(
        calculateCredit({
          transcript: parentTranscriptText,
          model: languageModel,
        })
      );
      setActiveTab(0);
    }
    return () => { };
  }, [parentTranscriptText]);

  const handleLanguageChange = (value) => {
    setLanguage(value);
    //save preferred language to local storage
    setItem(STORAGE_KEYS.PREFERRED_LANGUAGE, value);
  };
  const handleLanguageModelChange = (value) => {
    setLanguageModel(value);
    //save preferred llm to local storage
    setItem(STORAGE_KEYS.PREFERRED_LLM, value);
  };

  const inputTranscript = (type) => {
    switch (type) {
      case 'detail-summary':
        return parentSrtText;
      default:
        return parentTranscriptText;
    }
  };

  useEffect(() => {
    // read prefereed language and llm from local storage
    getItem(STORAGE_KEYS.PREFERRED_LANGUAGE) && setLanguage(getItem(STORAGE_KEYS.PREFERRED_LANGUAGE));
    getItem(STORAGE_KEYS.PREFERRED_LLM) && setLanguageModel(getItem(STORAGE_KEYS.PREFERRED_LLM));

  });

  const removeSummary = (index) => {
    const updatedSummaries = summaries.filter((item, i) => i !== index);
    setSummaries(updatedSummaries);
  };

  const performSummarize = async (option) => {
    setStartSummary(true);
    const { interval, creditAmount, title } = option;

    let finalOutput = "";

    if (!currentUser) {
      // use quota if user is not logged in
      try {
        QuotaService.checkQuota();
        QuotaService.decrementQuota(); // save to loca storage
        setQuota((prev) => prev - 1); // update context
        updateSummaryOfIndex(activeTab, "sourceType", title);
        await SummaryService.summarizeWithAIUsingQuota(
          {
            option,
            transcript: parentTranscriptText,
            selectedModel: languageModel,
            video,
            language,
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
              setActiveTab(0);
              return; // Stop further processing
            }
            // Append the received data to the response
            setStartSummary(false);
            setResponse((prev) => prev + data);
            finalOutput += data;
          }
        );
        return;
      } catch (error) {
        console.error(error);
        setStartSummary(false);
        return;
      }
    } else {
      // use credits if user is logged in
      if (userId === null) {
        // check if user is logged in
        console.error("User not logged in");
        return;
      }

      try {
        checkCredits(credits, creditAmount);
        updateSummaryOfIndex(activeTab, "sourceType", title);
        await SummaryService.summarizeWithAI(
          {
            option,
            transcript: inputTranscript(option.type),
            language,
            interval,
            selectedModel: languageModel,
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
    }
  };

  return (
    <div className="relative h-full flex flex-col dark:bg-zinc-800">
      <div className="flex justify-between px-3 pt-1">
        <div className=" flex flex-1 items-center gap-x-1 flex-wrap">
          <LanguageIcon className="h-6 w-6 text-indigo-600 " />
          <div className="w-28">
            <Select onValueChange={handleLanguageChange} value={language}>
              <SelectTrigger className=" h-7">
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
          <AcademicCapIcon className="h-6 w-6 text-indigo-600 " />
          <div>
            <Select onValueChange={handleLanguageModelChange} value={languageModel}>
              <SelectTrigger className="h-7">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {defaultModels.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="">
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

      {language !== "English" && (
        <div
          className="text-sm text-gray-500 px-3 py-1"
        >
          Note: AI functions best with English language. For other languages, we recommend summarizing in English first, then translating using tools like <a
            className="text-blue-500 cursor-pointer"
            target="_blank"
            href="https://translate.google.com/"
          >
            Google Translate</a> for best results.
        </div>
      )}

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
        removeSummary={removeSummary}
      />
    </div>
  );
};

export default SummaryField;
