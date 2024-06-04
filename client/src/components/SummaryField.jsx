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
import { useModels } from "@/contexts/ModelContext.jsx";
import { useToast } from "./ui/use-toast.js";
import { ToastAction } from "./ui/toast.jsx";
import { cn } from "@/lib/utils.js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { LinkToPricing } from "./common/RoutingLinks.jsx";
import { InfoIcon } from "lucide-react";

const SummaryField = ({ videoRef, className }) => {
  // use context
  const { summaries, setSummaries } = useSummaryContext();
  const { userId, setCredits, credits, currentUser } = useAuth();
  const { video } = useVideoContext();
  const { parentTranscriptText, parentSrtText } = useTranscriptContext();
  const { quota, setQuota } = useQuota();
  const { selectedModel, setSelectedModel, language, setLanguage } =
    useModels();

  // use state
  const [response, setResponse] = useState("");
  const [creditCount, setCreditCount] = useState(0);
  const [startSummary, setStartSummary] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const { toast } = useToast();

  const insertNewTab = (summaryText, title, summaryFormat) => {
    setSummaries((prev) => [
      {
        summary: summaryText,
        summaryType: title,
        summaryFormat: summaryFormat,
      },
      ...prev,
    ]);
  };

  const updateSummaryOfIndex = (indexToUpdate, field, value, summaryFormat) => {
    const updatedSummaries = summaries.map((item, index) => {
      // Update the summaryType of the specified item
      if (index === indexToUpdate) {
        return { ...item, [field]: value, summaryFormat: summaryFormat };
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
          model: selectedModel,
        })
      );
      setActiveTab(0);
    }
    return () => {};
  }, [parentTranscriptText]);

  const inputTranscript = (type) => {
    switch (type) {
      case "detail-summary":
        return parentSrtText;
      default:
        return parentTranscriptText;
    }
  };

  const removeSummary = (index) => {
    const updatedSummaries = summaries.filter((item, i) => i !== index);
    setSummaries(updatedSummaries);
  };

  const performSummarize = async (option) => {
    setStartSummary(true);
    const { interval, creditAmount, title, summaryFormat } = option;

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
            selectedModel: selectedModel,
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
              insertNewTab(finalOutput, title, summaryFormat);
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
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Insufficient Credits",
          description: "Please purchase more credits to continue.",
          action: (
            <Button
              variant="outline"
              altText="Get more Credits"
              onClick={() => {
                window.location.href = "/pricing";
              }}
            >
              Get more Credits
            </Button>
          ),
        });
        setStartSummary(false);
        return;
      }

      try {
        updateSummaryOfIndex(activeTab, "sourceType", title);
        await SummaryService.summarizeWithAI(
          {
            option,
            transcript: inputTranscript(option.type),
            language,
            interval,
            selectedModel: selectedModel,
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
              setResponse("");
              insertNewTab(finalOutput, title, summaryFormat);
              setCredits((prev) => (prev - creditAmount).toFixed(1));
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
    <div
      className={cn(
        "relative h-full flex flex-col dark:bg-zinc-800",
        className
      )}
    >
      <div className=" bg-gray-50">
        <div className="flex justify-between px-3 pt-1">
          <div className=" flex flex-1 items-center gap-x-1 flex-wrap">
            <LanguageIcon className="h-6 w-6 text-primary " />
            <div className="w-28">
              <Select onValueChange={setLanguage} value={language}>
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

            <AcademicCapIcon className="h-6 w-6 text-primary " />
            <div>
              <Select onValueChange={setSelectedModel} value={selectedModel}>
                <SelectTrigger className="h-7">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {defaultModels.map((item) => {
                    const modelAvailable = currentUser ? true : !item.premimum;
                    return (
                      <SelectItem
                        key={item.id}
                        value={item.id}
                        disabled={!modelAvailable}
                      >
                        {item.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                className="h-8 w-8 text-sm text-primary flex items-center p-1"
                variant="ghost"
                onClick={() => {
                  window.open("https://translate.google.com/");
                }}
              >
                <svg
                  className="fill-primary"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m20 5h-9.12l-.88-3h-6a2 2 0 0 0 -2 2v13a2 2 0 0 0 2 2h7l1 3h8a2 2 0 0 0 2-2v-13a2 2 0 0 0 -2-2m-12.83 9.59a4.09 4.09 0 0 1 -4.09-4.09 4.09 4.09 0 0 1 4.09-4.09c1.04 0 1.99.37 2.74 1.09l.09.04-1.25 1.18-.06-.05c-.29-.27-.78-.59-1.52-.59-1.31 0-2.38 1.09-2.38 2.42s1.07 2.42 2.38 2.42c1.37 0 1.96-.87 2.12-1.46h-2.21v-1.55h3.95l.01.09c.04.19.05.38.05.59 0 2.35-1.59 4-3.92 4m6.03-1.71c.33.62.74 1.18 1.19 1.7l-.54.53zm.77-.76h-.97l-.33-1.04h3.99s-.34 1.31-1.56 2.74c-.52-.62-.89-1.23-1.13-1.7m7.03 7.88a1 1 0 0 1 -1 1h-7l2-2-.81-2.77.92-.92 2.68 2.69.71-.73-2.69-2.68c.9-1.03 1.6-2.25 1.92-3.51h1.27v-1.04h-3.64v-1.04h-1.04v1.04h-1.96l-1.18-4.04h8.82a1 1 0 0 1 1 1z" />
                </svg>
              </Button>
            </div>
            {language !== "English" && (
              <Popover>
                <PopoverTrigger>
                  <InfoIcon className="h-5 w-5 text-primary/80 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="w-fit font-roboto">
                  AI functions best with English language. For other languages,
                  we recommend summarizing in English first, <br /> then
                  translating using tools like{" "}
                  <a
                    className="text-blue-500 cursor-pointer"
                    target="_blank"
                    href="https://translate.google.com/"
                  >
                    Google Translate
                  </a>{" "}
                  for best results.
                </PopoverContent>
              </Popover>
            )}
          </div>

          <div>
            {currentUser && userId ? (
              <LinkToPricing>
                <Button
                  className="h-8 text-sm text-primary flex items-center hover:text-primary/80 "
                  variant="outline"
                >
                  <BoltIcon className="w-4 h-6 text-indigo-600" />:{credits}
                </Button>
              </LinkToPricing>
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
      </div>
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
