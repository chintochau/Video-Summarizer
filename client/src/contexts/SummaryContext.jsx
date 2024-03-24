import { createContext, useContext, useState } from "react";

export const SummaryContext = createContext();

export const useSummaryContext = () => useContext(SummaryContext);

export const SummaryProvider = ({ children }) => {
  const [parentText, setParentText] = useState("");
  const [parentSrtText, setParentSrtText] = useState("");
  const [transcriptCredits, setTranscriptCredits] = useState(0);

  const value = {
    parentText,
    setParentSrtText,
    parentSrtText,
    setParentText,
    transcriptCredits,
    setTranscriptCredits,
  };

  return (
    <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>
  );
};
