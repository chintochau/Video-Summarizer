import { parseSRTToArray } from "@/components/Utils";
import { createContext, useContext, useEffect, useState } from "react";


const TranscriptContext = createContext();

export const useTranscriptContext = () => useContext(TranscriptContext);

export const TranscriptProvider = ({ children }) => {
  const [parentSrtText, setParentSrtText] = useState(null);
  const [parentTranscriptText, setParentTranscriptText] = useState(null)
  const [transcriptCredits, setTranscriptCredits] = useState(0);
  const [loadingTranscript, setLoadingTranscript] = useState(true)
  const [transcriptAvailable, setTranscriptAvailable] = useState(false)
  const [selectedTranscribeOption, setSelectedTranscribeOption] = useState(null)
  const [editableTranscript, setEditableTranscript] = useState([])
  const [generatingTranscriptWithAI, setGeneratingTranscriptWithAI] = useState(false)
  const [selectedTranscriptionLanguage, setSelectedTranscriptionLanguage] = useState("en")

  const setupTranscriptWithInputSRT = (srt) => {
    const transcriptArray = parseSRTToArray(srt);
    setParentSrtText(srt);
    setEditableTranscript(transcriptArray.map((entry) => ({ ...entry }))); // used for SRT editor
    setTranscriptAvailable(true);
    setGeneratingTranscriptWithAI(false);
    setParentTranscriptText(transcriptArray
      .map(({ start, text }) => start.split(",")[0] + " " + text)
      .join("\n")
    );
    setLoadingTranscript(false);
  }

  const resetTranscript = () => {
    setParentTranscriptText(null);
    setGeneratingTranscriptWithAI(false);
    setTranscriptCredits(0);
    setTranscriptAvailable(false);
    setParentSrtText(null);
    setEditableTranscript([]);
  }

  const value = {
    setParentSrtText,
    parentSrtText,
    transcriptCredits,
    setTranscriptCredits,
    setParentTranscriptText,
    parentTranscriptText,
    selectedTranscribeOption,
    setSelectedTranscribeOption,
    loadingTranscript,
    setLoadingTranscript,
    transcriptAvailable,
    setTranscriptAvailable,
    editableTranscript,
    setEditableTranscript,
    generatingTranscriptWithAI,
    setGeneratingTranscriptWithAI,
    selectedTranscriptionLanguage,
    setSelectedTranscriptionLanguage,
    
    setupTranscriptWithInputSRT,
    resetTranscript,
  };

  return (
    <TranscriptContext.Provider value={value}>{children}</TranscriptContext.Provider>
  );
};


export const transcribeOptions = [
  { value: 'faster-whisper', label: 'Queue', information: 'Take longer timer', creditFactor: 0.3, timeFactor: { lower: 0.13, upper: 0.36 }, available:true},
  { value: 'assembly', label: 'Dedicated', information: 'Free for now', creditFactor: 0.6, timeFactor: { lower: 0.07, upper: 0.1 } , available:false},
  { value: 'openai', label: 'Express', information: 'Better Performance', creditFactor: 1, timeFactor: { lower: 0.033, upper: 0.06 } , available:false},
]
