import React, { useEffect, useState } from "react";

const JsonSummaryField = (params) => {
  const { summary, handleTimestampClick } = params;

  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [content, setContent] = useState([]);
  const [conclusion, setConclusion] = useState("");
  const [cta, setCta] = useState("");

  useEffect(() => {
    let partialData = summary;

    try {
      const json = JSON.parse(partialData);
      if (json.title) setTitle(json.title);
      if (json.introduction) setIntroduction(json.introduction);
      if (json.content) setContent(json.content);
      if (json.conclusion) setConclusion(json.conclusion);
      if (json.cta) setCta(json.cta);

      // Clear partialData after successful parsing
      partialData = "";
    } catch (error) {
      // If error, continue accumulating partialData
      console.error("JsonSummaryField", error);
    }
  }, [summary]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-left text-primary">{title}</h1>
      <div>
        <h2 className="text-xl font-bold text-left text-secondary">
          Introduction
        </h2>
        <p>{introduction}</p>
      </div>
      {content.map((section, index) => (
        <div key={index}>
          <div className="flex items-center gap-x-2">
            <h2 className="text-lg font-bold text-left text-secondary">
              {section.title}
            </h2>
            <a
              className="text-sm text-left text-blue-500 underline cursor-pointer"
              onClick={() => handleTimestampClick(section.timestamp)}
            >
              {section.timestamp}
            </a>
          </div>

          <ul className=" list-disc px-4">
            {section.content.map((paragraph, idx) => (
              <li key={idx}>{paragraph}</li>
            ))}
          </ul>
        </div>
      ))}
      {conclusion !== "" && (
        <div id="conclusion">
          <h2 className="text-xl font-bold text-left text-secondary">
            Conclusion
          </h2>
          <p>{conclusion}</p>
        </div>
      )}
      {cta !== "" && (
        <div id="cta">
          <h2 className="text-xl font-bold text-left text-secondary">
            Call to Action
          </h2>
          <p>{cta}</p>
        </div>
      )}
    </div>
  );
};

export default JsonSummaryField;
