import { parseSRTToArray } from "@/utils/Utils";
import { createContext, useContext, useEffect, useState } from "react";


const TranscriptContext = createContext();

export const useTranscriptContext = () => useContext(TranscriptContext);

export const TranscriptProvider = ({ children }) => {
  const [parentSrtText, setParentSrtText] = useState(null);
  const [parentTranscriptText, setParentTranscriptText] = useState(null)
  const [loadingTranscript, setLoadingTranscript] = useState(true)
  const [transcriptAvailable, setTranscriptAvailable] = useState(false)
  const [selectedTranscribeOption, setSelectedTranscribeOption] = useState(transcribeOptions[0])
  const [editableTranscript, setEditableTranscript] = useState([])
  const [generatingTranscriptWithAI, setGeneratingTranscriptWithAI] = useState(false)
  const [speakerIdentification, setSpeakerIdentification] = useState(false)
  const [utterances, setUtterances] = useState([])
  const [speakers, setSpeakers] = useState([])
  const [transcriptId, setTranscriptId] = useState(null)
  const [transcriptCredits, setTranscriptCredits] = useState(0);
  const [selectedTranscriptionLanguage, setSelectedTranscriptionLanguage] = useState("auto")

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
    setUtterances([]);
    setSpeakers([]);
    setTranscriptId(null);
  }

  const setupVideoTranscript = (video) => {
    setupTranscriptWithInputSRT(video.originalTranscript)
    setUtterances(video.utterances)
    setSpeakers(video.speakers)
    setTranscriptId(video._id)
  }

  const calculateTranscriptCredits = (videoCredits, factor) => {
    return (videoCredits * factor).toFixed(2);
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
    speakerIdentification, setSpeakerIdentification,
    utterances, setUtterances,
    speakers, setSpeakers,
    transcriptId, setTranscriptId,
    
    setupTranscriptWithInputSRT,
    resetTranscript,
    setupVideoTranscript,
    calculateTranscriptCredits,
  };

  return (
    <TranscriptContext.Provider value={value}>{children}</TranscriptContext.Provider>
  );
};


export const transcribeOptions = [
  { value: 'base', label: 'Quick', accuracy:1, information: 'Optimized for speed, ideal for English.', creditFactor: 0.3, timeFactor: { lower: 0.04, upper: 0.08 }, available:true},
  { value: 'medium', label: 'Balanced', accuracy:2, information: 'Balances speed and accuracy for multilingual tasks.', creditFactor: 0.32, timeFactor: { lower: 0.08, upper: 0.16 }, available:true},
  { value: 'large-v3', label: 'Accurate', accuracy:3, information: 'Delivers superior accuracy for various languages.', creditFactor: 0.34, timeFactor: { lower: 0.13, upper: 0.26 }, available:true},
  // { value: 'dedicated', label: 'Dedicated Server', accuracy:3, information: 'Dedicated resources for optimized performance.', creditFactor: 0.6, timeFactor: { lower: 0.07, upper: 0.1 } , available:false},
]

export const otherTranscribeOptions = [
  // { value: 'assembly', label: 'Balanced, Identify Speakers', accuracy:3, information: 'Highest speed and accuracy for critical tasks.', creditFactor: 0.4, timeFactor: { lower: 0.033, upper: 0.06 } , available:true},
  { value: 'assembly', label: 'Accurate, Identify Speakers', accuracy:3, information: 'Highest speed and accuracy for critical tasks.', creditFactor: 0.77, timeFactor: { lower: 0.033, upper: 0.06 } , available:true}
]