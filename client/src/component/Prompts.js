export const defaultModels = [
  {
    name: "Claude 3(preferred)",
    id: "claude3h",
    model: "claude-3-haiku-20240307",
    available: true,
  },
  {
    name: "GPT-3.5",
    id: "gpt35",
    model: "gpt-3.5-turbo-0125",
    available: true,
  },
];

export const summarizeOptions = [
  {
    id: 2,
    title: "Quick Summary",
    description: `General summary of the text`,
    prompt: `Your output should use the following template:
  ### Summary
  ### Analogy
  ### Notes
  - [Emoji] Bulletpoint
  ### Q&A
  - 
  
  You have been tasked with creating a concise summary of a YouTube video using its transcription to supply college student notes to use himself. You are to act like an expert in the subject the transcription is written about.
  
  Make a summary of the transcript. Use keywords from the transcript. Don't explain them. Keywords will be explained later.
  
  Additionally make a short complex analogy to give context and/or analogy from day-to-day life from the transcript.
  
  Create 10 bullet points (each with an appropriate emoji and refer to the timestamp) that summarize the key points or important moments from the video's transcription. 
  
  In addition to the bullet points, give several questions and answers based on the video content
  
  In Q&A section, give 3 questions with answers based on the video content, helping the read think and understand more about the video.
  the video transcript is as follows
  
  Please ensure that the summary, bullet points, and explanations fit within the 330-word limit, while still offering a comprehensive and clear understanding of the video's content. Use the text above: {{Title}} {{Transcript}}.`,
  },
  {
    id: 3,
    title: "Quick Table",
    description: `Explore the video content in a table format`,
    prompt: `List out the key items in the video in a table format, the table should include the item name, description, the timestamp, and price if it is available`,
  },
  {
    id: 3,
    title: "Quick Essay",
    description: `Explore a topic from multiple perspectives and reach a conclusion.`,
    prompt: `Your output should use the following template:
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
  
  You are given a script from the video, it can be any type of video. You task is to write an summarize article based on the video content, and use the above template.
  
  When writing the summary, you must refer to the content from the provided video transcript. for every 2 mins of the video length, you must provide 1 perspective. for the content of the perspective,
  
  For part 1, state what the video is about and the background. Introduction must be clear, ignore all promotional contents
  
  For the part 2, you must list out the main perspectives and the title of that from the author. according to the timpstamp,  for each perspective, you must give supporting information why the author suggest that perspective, the supporting info can be example, fact, etc. for each of the perspective, you must refer the timestamp in the video
  
  For conclusion part, briefly summary the video`,
  },
  {
    id: 5,
    title: "Quick List",
    description: "Summarize the text in a list",
    prompt: `Summarize the text, give a title of the script, a brief about the script, then, List out at least 15 keypoints for the video transcript in a list format, as much key point as possible, for each point, give a starting timestamp reference. drop all unrelated info/ promotional info, such as advertising
 
    use the template
    #### Title
    summary
    list
  `,
  },
  {
    id: 1,
    title: "Detail Summary: Auto",
    description: "Generate a detail summary by time section",
    prompt: `prompt controled by backend`,
  },
  {
    id: 6,
    title: "Detail Summary: by Length",
    description: `Explain the ideas in detail.`,
    prompt: `below is a part of a large script, rewrite the key ideas of the text in short paragraphs, bold the keywords, and give a related title for this part. write your paragraph as in a precise manor, and summarize. the format should be return as below.
    
    ***Template***
    ### Title 
    ##### mm:ss - mm:ss
    [rewritten paragraph]
    ******
    `,
  },
  {
    id: 7,
    title: "Meeting minutes",
    description: "testing",
    prompt: ``,
  },
];
