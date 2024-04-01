import { createContext, useContext, useState } from "react";

const CheckoutContext = createContext();

export const useCheckout = () => useContext(CheckoutContext);

export const CheckoutProvider = ({ children }) => {
  const [selectedPlan, setSelectedPlan] = useState({});
  const value = { selectedPlan, setSelectedPlan }; //{id:credits, amount:200, price:5} or {id:tier-professional, amount:12, price:129.99}

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const tiers = [
  {
    name: "Youtube lover",
    id: "credits",
    itemName: "Fusion AI Credits",
    price: { monthly: "$0", annually: "$0" },
    priceOptions: [
      {
        price: 5,
        value: 200,
        featureList: [
          "Youtube Quick Summaries",
          "Youtube Transcription",
          `200 Credits on purchase \n - up to 200 hours Quick summarization \n - up to 6 hours video Transcription`,
          "SRT Editor",
          "Summary History",
        ],
      },
      {
        price: 10,
        value: 500,
        featureList: [
          "Youtube Quick Summaries",
          "Youtube Transcription",
          `500 Credits on purchase \n - up to 500 hours Quick summarization \n - up to 12 hours video Transcription`,
          "SRT Editor",
          "Summary History",
        ],
      },
    ],
    description: "Best for Youtube lovers",
    features: ["error"],
    mostPopular: false,
    available: true,
  },
  {
    name: "Professional",
    id: "tier-professional",
    itemName: "Fusion AI Professional Plan",
    price: { monthly: 12.99, annually: 119.99 },
    description: "A plan for corporate professionals",
    features: [
      "Youtube Quick Summaries",
      "Youtube Detail Summaries",
      "Youtube Transcription",
      "Upload Video/Audio Quick Summaries",
      "Upload Video/Audio Detail Summaries",
      "Upload Video/Audio Transcription",
      `800 Credits / month \n - up to 800 hours Quick summarization \n - up to 400 hours Detail summarization \n - up to 24 hours Video Transcription`,
      "SRT Editor",
      "Summary History",
    ],
    mostPopular: true,
    available: true,
  },
  {
    name: "Mastermind",
    id: "tier-mastermind",
    itemName: "Fusion AI Mastermind Plan",
    price: { monthly: 19.99, annually: 189.99 },
    description: "Save Videos in your mind",
    features: [
      "Youtube Quick Summaries",
      "Youtube Detail Summaries",
      "Youtube Transcription",
      "Upload Video/Audio Quick Summaries",
      "Upload Video/Audio Detail Summaries",
      "Upload Video/Audio Transcription",
      `800 Credits / month \n - up to 800 hours Quick summarization \n - up to 400 hours Detail summarization \n - up to 24 hours Video Transcription`,
      "SRT Editor",
      "Summary History",
      "RAG Database",
    ],
    mostPopular: false,
    available: false,
  },
];
