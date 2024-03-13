export const summarizeOptions = [
  {
    id:1,
    title: "Custom Prompt:",
    description: "",
  },
  {
    id:2,
    title: "Quick:Summary",
    description: `Summary
  Analogy
  Notes
  Q&A`,
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
  
  Create 10 bullet points (each with an appropriate emoji) that summarize the key points or important moments from the video's transcription.
  
  In addition to the bullet points, give several questions and answers based on the video content
  
  In Q&A section, give 3 questions with answers based on the video content, helping the read think and understand more about the video.
  the video transcript is as follows
  
  Please ensure that the summary, bullet points, and explanations fit within the 330-word limit, while still offering a comprehensive and clear understanding of the video's content. Use the text above: {{Title}} {{Transcript}}.`,
  },
  {
    id:3,
    title: "Quick:Essay",
    description: `Explore a topic from multiple perspectives and reach a conclusion.
  
  Introduction
  perspectives
  Conclusion
  Q&A
  `,
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
  5. ### Q&A
  
  You are given a script from the video, it can be any type of video. You task is to write an summarize article based on the video content, and use the above template.
  
  When writing the summary, you must refer to the content from the provided video transcript. for every 2 mins of the video length, you must provide 1 perspective.
  
  For part 1, state what the video is about and the background. Introduction must be clear, ignore all promotional contents
  
  For the part 2, you must list out the main perspectives and the title of that from the author. according to the timpstamp,  for each perspective, you must give supporting information why the author suggest that perspective, the supporting info can be example, fact, etc. for each of the perspective, you must refer the timestamp in the video
  
  For conclusion part, briefly summary the video
  
  In Q&A section, give 5 questions with answers based on the video content, helping the read think and understand more about the video.
  the video transcript is as follows`,
  },
  {
    id:4,
    title: "Quick:Rewrite",
    description: `Rewrite the script into a well structure article.`,
    prompt: `You are an SEO expert, You are given a script from the video, it can be any type of video. You task is to write an article based on the video content, that i can use to post on my blog. The article must provide title, and grab the main points of the script, for each main point, wrtie a subtitle for that, and explain the idea in detail. provide as much main point as possible, also provide a conslution, and 3Q&A based on the contents using the below format
      ### Title
      abstract of the whole article
      #### 1. Subtitle
      main idea 1
      #### 2. Subtitle
      main idea 2
      #### 3. Subittle
      ...
      ### Conclusion
      ###Q&A
  
      `,
  },
  {
    id:5,
    title: "Quick:List",
    description: "Summarize the text in a list",
    prompt: `Summarize the text, give a title of the script, a brief about the script, then, List out all the keypoint for the video transcript in a list format, as much key point as possible, for each point, give a timestamp reference. drop all unrelated info, such as advertising
  `,
  },
  {
    id:6,
    title: "Detail:Summary",
    description: `Summarize a large text.`,
    prompt:`below is a part of a large script, summarize it and give a related title for this part. write your summary as if this is a article in a blog. the format should be return as below
    
    ### Title mm:ss - mm:ss
    [content]`
  },
];
