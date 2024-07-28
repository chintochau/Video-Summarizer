import { Button } from "@/components/ui/button";
import SummaryHandler from "@/handlers/SummaryHandler";
import React, { useEffect, useState } from "react";

// Usage
const data = {
  selectedModel: "gpt4om",
  option: {
    creditAmount: 1,
    title: "Example Summary",
    summaryFormat: "json",
    prompt: "Provide a summary of the video",
  },
  video: {
    sourceId: "abc123",
    sourceTitle: "Sample Video",
    sourceType: "youtube",
    author: "Author Name",
    videoDuration: 120,
  },
  userId: "65fdfcd6c93e352bfb21f440",
  language: "en",
  transcript: `1
00:00:00.000 --> 00:00:02.000
Hello, this is a sample transcript.

2
00:00:02.000 --> 00:00:04.000
This is another sample transcript.

3
00:00:04.000 --> 00:00:06.000
This is yet another sample transcript.
  `,
};

const TestingPage = () => {
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState("");
  const [summaryObject, setSummaryObject] = useState({});
  

  const requestSummary = async (data) => {
    SummaryHandler.requestSummary(data, (response) => {
      if (response.text) {
        setSummary((prev) => prev + response.text);
      } else if (response.summary) {
        setSummaryObject(response.summary);
      }
    });
  }

  return (
    <>
      <Button onClick={() => requestSummary(data)}>Testing</Button>
      <div className="text-2xl">Summary: {summary}</div><br/>
      <div className="text-2xl">Summary Object: {JSON.stringify(summaryObject)}</div>
    </>
  );
};

export default TestingPage;
