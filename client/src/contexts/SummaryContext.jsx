import { createContext, useContext, useState } from "react";

const SummaryContext = createContext();

export const useSummaryContext = () => useContext(SummaryContext);

export const defaultNewSummary = { summary: "", summaryType: "New Summary" }

export const SummaryProvider = ({ children }) => {
  const [summaries, setSummaries] = useState([defaultNewSummary])

  const resetSummaries = () => {
    setSummaries([defaultNewSummary])
  }

  const value = {
    summaries,
    setSummaries,
    resetSummaries
  };

  return (
    <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>
  );
};
