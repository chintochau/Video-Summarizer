
export const defaultModels = [
  {
    name: "Claude3",
    id: "claude3h",
    model: "claude-3-haiku-20240307",
    available: true,
  },
  {
    name: "ChatGPT",
    id: "gpt35",
    model: "gpt-3.5-turbo-0125",
    available: true,
  },
  {
    name: "Llama3",
    id: "llama3",
    model: "llama-3-20240307",
    available: true,
  },
];

export const summarizeOptions = {
  // The detail summary options are displayed in the OptionField component
  detailSummaryOptions: [
    {
      id: "meeting-minutes",
      title: "Meeting minutes",
      description: "testing",
      prompt: ``,
      premimum: true,
      type: 'detail-summary'
    },
    {
      id: "summary",
      title: "Long Summary",
      description: "Summarize the main ideas, insights, and key messages from the TED Talk video.",
      prompt: `Your output should use the following template, provide timestamp (in the form hh:mm:ss) for each perspective:

      ### Main Body
        #### perspective - title
        - 
        - 
        ...
        #### perspective - title
        - 
        - 
        ...
        ……
      ### Conclusion for this part
      ### call to action from author for this part
        
        You are given a script from the video, it can be any type of video. You task is to write an summarize article based on the video content, and use the above template.
        
        When writing the summary, you must refer to the content from the provided video transcript. for every 2 mins of the video length, you must provide 1 perspective. for the content of the perspective,
        
        For part 1, state what the video is about and the background. Introduction must be clear, ignore all promotional contents
        
        For the part 2, you must list out the main perspectives and the title of that from the author. according to the timpstamp,  for each perspective, you must give supporting information why the author suggest that perspective, the supporting info can be example, fact, etc. for each of the perspective, you must refer the timestamp in the video
        
        For conclusion part, briefly summary the video`,
      premimum: true,
      type: 'detail-summary'
    },
    {
      id: "detail-summary",
      title: "Summary: Auto",
      description: "Generate a detail summary by time section",
      prompt: `prompt controled by backend`,
      premimum: true,
      type: 'detail-summary'
    },
    {
      id: "detail-summary-length",
      title: "Summary: by Length",
      description: `Explain the ideas in detail.`,
      prompt: `below is a part of a large script, rewrite the key ideas of the text in short paragraphs, bold the keywords, and give a related title for this part. write your paragraph as in a precise manor, and summarize. the format should be return as below.
    
    ***Template***
    ### Title 
    ##### mm:ss - mm:ss
    [rewritten paragraph]
    ******
    `,
      premimum: true,
      type: 'detail-summary'
    },

  ],
  // The quick summary options are displayed in the OptionField component
  quickSummaryOptions: [
    {
      id: "quick-essay",
      title: "Summary",
      description: `Analyze the video content from multiple angles and perspectives, then synthesize the information into a balanced, well-reasoned summary.`,
      prompt: `Your output should use the following template, provide timestamp (in the form hh:mm:ss) for each perspective:
### Introduction
### Main Body
  #### perspective - title
  - 
  - 
  ...
  #### perspective - title
  - 
  - 
  ...
  ……
### Conclusion
### call to action from author
  
  You are given a script from the video, it can be any type of video. You task is to write an summarize article based on the video content, and use the above template.
  
  When writing the summary, you must refer to the content from the provided video transcript. for every 2 mins of the video length, you must provide 1 perspective. for the content of the perspective,
  
  For part 1, state what the video is about and the background. Introduction must be clear, ignore all promotional contents
  
  For the part 2, you must list out the main perspectives and the title of that from the author. according to the timpstamp,  for each perspective, you must give supporting information why the author suggest that perspective, the supporting info can be example, fact, etc. for each of the perspective, you must refer the timestamp in the video
  
  For conclusion part, briefly summary the video`
      , type: "quick-summary"
    },
    {
      id: "quick-table",
      title: "Table",
      description: `Organize the important details from the transcript into a structured table format, making it easy for users to quickly reference the key information.`,
      prompt: `List out the key items in the video in a table format, the table should include the item name, description, the timestamp (in the form hh:mm:ss), and price if it is available`
      , type: "quick-summary"
    },
    {
      id: "quick-list",
      title: "List",
      description: "Summarize the essential points from the video in a clean, easy-to-scan bulleted list format.",
      prompt: `Summarize the text, give a title of the script, a brief about the script, then, List out at least 15 keypoints for the video transcript in a list format, as much key point as possible, for each point, give a starting timestamp reference. drop all unrelated info/ promotional info, such as advertising
 
    use the template
    #### Title
    summary
    list
  ` , type: "quick-summary"
    },
    {
      id: "how-to",
      title: "How to",
      description: "Distill the step-by-step instructions or process demonstrated in the video into a clear, actionable summary.",
      prompt: `Please provide a concise summary of the key steps and instructions outlined in the video script. Highlight the main actions and techniques that are demonstrated in the video, and provide enough detail to allow someone to understand the core process being taught, without reproducing any verbatim text from the original script. Focus on outlining the step-by-step procedure in your own words, and include any important safety considerations or tips mentioned. The goal is to give the reader a high-level overview of the method covered in the video, not a complete transcript. for each step, provide the timestamp (hh:mm:ss) from the transcript`
      , type: "quick-summary"
    }, {
      id: "product-review",
      title: "Product Review",
      description: "Highlight the main features, pros, cons, and overall assessment of the product or service covered in the video.",
      prompt: `Here is a prompt to summarize a video script of a product review:

Please review the provided video script transcript and provide a concise summary of the key points, including:
1. A high-level overview of the product being reviewed and the main takeaways from the review.
2. A list of the pros and cons mentioned in the video, along with the timestamp from the transcript where each point is discussed.
3. Any other important details or insights from the video that would be helpful for the viewer to know.
Please ensure your summary does not reproduce any copyrighted material from the transcript, bold the key words. Provide your summary a title, Paraphrase and summarize the key information in your own words. Provide the transcript timestamp references so the viewer can refer back to the full details in the source material.`
      , type: "quick-summary"
    }, {
      id: "cooking",
      title: "Cooking",
      description: "Summarize the recipe, cooking techniques, and any other relevant information presented in the culinary video.",
      prompt: `Please provide a summary of the key cooking steps, important tips, and relevant timestamps from the video transcript. Highlight the essential information a viewer would need to successfully recreate the dish, including:

      The main ingredients and their preparation
      The step-by-step cooking instructions, with timestamps for the key steps
      Any important tips or techniques mentioned that would help the dish turn out well
      A brief overview of the final dish and any serving suggestions
      Please do not reproduce any verbatim text from the transcript, but summarize the information in your own words. Cite the timestamp for any key details you include so the viewer can refer back to the original source.`
      , type: "quick-summary"
    },
    {
      id: "travel",
      title: "Travel",
      description: "Provide an overview of the destination, must-see attractions, practical tips, and other key takeaways from the travel guide video.",
      prompt: `Based on the provided video transcript, please summarize the key highlights of the travel guide, including the best aspects of the destination, important tips for visitors, and relevant timestamp (in format: hh:mm:ss) references from the transcript. Ensure your summary does not reproduce any copyrighted material verbatim. If there are any gaps or missing sections in the transcript, note where those occur and provide the summary to the best of your ability based on the available information.`

      , type: "quick-summary"
    },
    {
      id: "meeting-short",
      title: "Meeting",
      description: "Capture the main discussion points, action items, and conclusions from the meeting or presentation covered in the video.",
      prompt: `Your task is to review the provided meeting notes and create a concise summary that captures the essential information, focusing on key takeaways and action items assigned to specific individuals or departments during the meeting. Use clear and professional language, and organize the summary in a logical manner using appropriate formatting such as headings, subheadings, and bullet points. Ensure that the summary is easy to understand and provides a comprehensive but succinct overview of the meeting's content, with a particular focus on clearly indicating who is responsible for each action item. For each takeaways, provide the timestamp from the transcript`
      , type: "quick-summary"
    },
    {
      id: "ted-talk",
      title: "TED Talk",
      description: "Summarize the main ideas, insights, and key messages from the TED Talk video.",
      prompt: `Distill the core message, key arguments, and impactful moments from the TED talk. Outline the speaker's main thesis or central theme, supporting evidence or examples provided, and any memorable quotes or anecdotes. Include timestamp (hh:mm:ss) references from the talk transcript to allow the user to revisit specific sections of interest.`
      , type: "quick-summary"
    }
  ]
}