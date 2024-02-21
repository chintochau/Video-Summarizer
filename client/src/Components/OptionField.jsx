import React from "react";

const summarizeOptions = [
  {
    title: "Default",
    description: `Summary
Analogy
Notes
Bulletpoint
Keywords`,
    prompt: `Your output should use the following template:
### Summary
### Analogy
### Notes
- [Emoji] Bulletpoint
### Keywords
- Explanation

You have been tasked with creating a concise summary of a YouTube video using its transcription to supply college student notes to use himself. You are to act like an expert in the subject the transcription is written about.

Make a summary of the transcript. Use keywords from the transcript. Don't explain them. Keywords will be explained later.

Additionally make a short complex analogy to give context and/or analogy from day-to-day life from the transcript.

Create 10 bullet points (each with an appropriate emoji) that summarize the key points or important moments from the video's transcription.

In addition to the bullet points, extract the most important keywords and any complex words not known to the average reader aswell as any acronyms mentioned. For each keyword and complex word, provide an explanation and definition based on its occurrence in the transcription.

You are also a transcription AI and you have been provided with a text that may contain mentions of sponsorships or brand names. Your task write what you have been said to do while avoiding any mention of sponsorships or brand names.

Please ensure that the summary, bullet points, and explanations fit within the 330-word limit, while still offering a comprehensive and clear understanding of the video's content. Use the text above: {{Title}} {{Transcript}}.`,
  },
  {
    title: "Explantory",
    description: `Explore a topic from multiple perspectives and reach a conclusion.

Introduction
perspective 1
    - Supporting
    - Supporting
perspective 2
    - Supporting
    - Supporting
    ……
Conclusion
Q&A
`,prompt:`Your output should use the following template:
1. ### Introduction
2. ### Main Body
#### perspective - title
- 
- 
...
#### perspective - title
- 
- 
...
……
3. ### Conclusion
4. ### call to action from author
5. ### Q&A

You are given a script from the video, it can be any type of video. You task is to write an summarize article based on the video content, and use the above template.

When writing the summary, you must refer to the content from the provided video transcript. for every 2 mins of the video length, you must provide 1 perspective.

For part 1, state what the video is about and the background. Introduction must be clear, ignore all promotional contents

For the part 2, you must list out the main perspectives and the title of that from the author. according to the timpstamp,  for each perspective, you must give supporting information why the author suggest that perspective, the supporting info can be example, fact, etc. for each of the perspective, you must refer the timestamp in the video

For conclusion part, briefly summary the video

In Q&A section, give 5 questions with answers based on the video content, helping the read think and understand more about the video.
the video transcript is as follows`
  },
  {
    title: "Lecture",
    description: `Abstract
`,
  },
  {
    title: "Podcast",
    description: `Abstract
`,
  },
  {
    title: "Podcast",
    description: `Abstract
`,
  },
  {
    title: "Custom",
    description: `Abstract
`,
  },
];

const OptionCard = ({ option, handleClick }) => {
  const { title, description, prompt } = option;
  return (
    <div className="bg-white rounded shadow-md mb-4 cursor-pointer text-left flex justify-between">
      <div className="p-4">
        <div className="text-xl font-bold mb-2">{title}</div>
        <div className="text-gray-600 text-sm whitespace-pre text-wrap ">{description}</div>
      </div>
      <div className=" flex-col items-start text-center p-4">
        <button
          className={`px-1.5 py-1 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-sm`}
          onClick={() => handleClick(prompt)}
        >
          Summarize
        </button>
        <div className=" text-sm">Token: 8</div>
      </div>
    </div>
  );
};

const OptionField = ({ handleClick }) => {
  return (
    <div className="flex flex-col mx-6 my-4">
      <div className="p-2 text-start ">Summary Options：</div>
      {summarizeOptions.map((option, index) => {
        return (
          <OptionCard option={option} key={index} handleClick={handleClick} />
        );
      })}
    </div>
  );
};

export default OptionField;
