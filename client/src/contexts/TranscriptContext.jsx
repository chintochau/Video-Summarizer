import { createContext, useContext, useState } from "react";

const TranscriptContext = createContext();

export const useTranscriptContext = () => useContext(TranscriptContext);

export const TranscriptProvider = ({ children }) => {
  const [parentText, setParentText] = useState("");
  const [parentSrtText, setParentSrtText] = useState("");
  const [transcriptCredits, setTranscriptCredits] = useState(0);
  const [parentTranscriptText, setParentTranscriptText] = useState("")
  const [selectedTranscribeOption, setSelectedTranscribeOption] = useState(null)

  const value = {
    parentText,
    setParentSrtText,
    parentSrtText,
    setParentText,
    transcriptCredits,
    setTranscriptCredits,
    setParentTranscriptText,
    parentTranscriptText,
    selectedTranscribeOption,
    setSelectedTranscribeOption
  };

  return (
    <TranscriptContext.Provider value={value}>{children}</TranscriptContext.Provider>
  );
};


export const transcribeOptions = [
  { value: 'faster-whisper', label: 'Queue', information: 'Take longer timer', creditFactor: 0.3, timeFactor: { lower: 0.13, upper: 0.36 } },
  { value: 'assembly', label: 'Dedicated', information: 'Free for now', creditFactor: 0.6, timeFactor: { lower: 0.07, upper: 0.1 } },
  { value: 'openai', label: 'Express', information: 'Better Performance', creditFactor: 1, timeFactor: { lower: 0.033, upper: 0.06 } },
]