import { createContext, useContext, useState } from "react";

const TranscriptContext = createContext();

export const useTranscriptContext = () => useContext(TranscriptContext);

export const TranscriptProvider = ({ children }) => {
  const [parentText, setParentText] = useState("");
  const [parentSrtText, setParentSrtText] = useState("");
  const [transcriptCredits, setTranscriptCredits] = useState(0);
  const [parentTranscriptText, setParentTranscriptText] = useState("")

  const value = {
    parentText,
    setParentSrtText,
    parentSrtText,
    setParentText,
    transcriptCredits,
    setTranscriptCredits,
    setParentTranscriptText,
    parentTranscriptText
  };

  return (
    <TranscriptContext.Provider value={value}>{children}</TranscriptContext.Provider>
  );
};
