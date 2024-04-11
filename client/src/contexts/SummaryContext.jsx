import { createContext, useContext, useState } from "react";

const SummaryContext = createContext();

export const useSummaryContext = () => useContext(SummaryContext);

export const defaultNewSummary = { summary: "", summaryType: "New Summary" }

export const SummaryProvider = ({ children }) => {
  const [summaries, setSummaries] = useState([defaultNewSummary])

  const value = {
    summaries,
    setSummaries,
  };

  return (
    <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>
  );
};
