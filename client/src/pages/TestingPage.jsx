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
  /**
   * createdAt
: 
"2024-07-27T02:45:57.264Z"
language
: 
"en"
sourceId
: 
"abc123"
sourceTitle
: 
"Sample Video"
summary
: 
"# Video Summary: Sample Video\n\nThe video titled \"Sample Video\" features a brief introduction where the speaker presents a series of sample transcripts. Throughout the video, the speaker emphasizes the repetitive nature of the content, stating, \"This is a sample transcript\" multiple times. The overall tone is straightforward and focused on demonstrating the format of a transcript."
summaryFormat
: 
"json"
summaryType
: 
"Example Summary"
userId
: 
"65fdfcd6c93e352bfb21f440"
videoId
: 
"66a456fde1a544f5ec06bab8"
__v
: 
0
_id
: 
"66a45f65333567bf9080652c"
   * 
   * 
   * 
   */

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
