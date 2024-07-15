import { createContext, useContext, useState } from "react";

const SummaryContext = createContext();

export const useSummaryContext = () => useContext(SummaryContext);

export const defaultNewSummary = { summary: "", summaryType: "New Summary" }

export const SummaryProvider = ({ children }) => {
  const [summaries, setSummaries] = useState([defaultNewSummary])
  const [selectedSections, setSelectedSections] = useState([]) // [{id:1, start:0, end:540}, {id:2, start:540, end:1080},...]
  const [availableSections, setAvailableSections] = useState([]) // [{id:1, start:0, end:540}, {id:2, start:540, end:1080},...]
  const resetSummaries = () => {
    setSummaries([defaultNewSummary])
  }

  const value = {
    summaries,
    setSummaries,
    resetSummaries,
    selectedSections,
    setSelectedSections,
    availableSections,
    setAvailableSections,
  };

  return (
    <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>
  );
};
