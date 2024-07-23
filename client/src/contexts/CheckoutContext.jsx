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
    name: "Fusion AI Credits",
    id: "credits",
    itemName: "Fusion AI Credits",
    description: "Pay as You Go, When You Need It.",
    price: { monthly: "$0", annually: "$0" },
    priceOptions: [
      {
        price: 5,
        value: 200,
        featureList: [
          `200 Credits on purchase \n - up to 300 hours Quick summarization \n - up to 20 hours Precise Transcription for Videos and Audios`,
          "SRT Editor",
          "Summary History",
        ],
      },
      {
        price: 10,
        value: 500,
        featureList: [
          `500 Credits on purchase \n - up to 750 hours Quick summarization \n - up to 40 hours Precise Transcription for Videos and Audios`,
          "SRT Editor",
          "Summary History",
        ],
      },
    ],
    features: ["error"],
    mostPopular: false,
    available: true,
  },
  {
    name: "Fusion AI Professional Plan",
    id: "tier-professional",
    itemName: "Fusion AI Professional Plan",
    price: { monthly: 12.99, annually: 119.99 },
    description: "Unleash Your Full Potential.",
    features: [
      "Unlimited Summaries",
      "Unlimited Precise Transcription", 
      "SRT Editor",
      "Summary History",
    ],
    mostPopular: false,
    available: true,
    hide:true
  },
  // {
  //   name: "Mastermind",
  //   id: "tier-mastermind",
  //   itemName: "Fusion AI Mastermind Plan",
  //   price: { monthly: 19.99, annually: 189.99 },
  //   description: "Save Videos in your mind",
  //   features: [
  //     "Youtube Quick Summaries",
  //     "Youtube Detail Summaries",
  //     "Youtube Transcription",
  //     "Upload Video/Audio Quick Summaries",
  //     "Upload Video/Audio Detail Summaries",
  //     "Upload Video/Audio Transcription",
  //     `800 Credits / month \n - up to 800 hours Quick summarization \n - up to 400 hours Detail summarization \n - up to 24 hours Video Transcription`,
  //     "SRT Editor",
  //     "Summary History",
  //     "RAG Database",
  //   ],
  //   mostPopular: false,
  //   available: false,
  //   hide:true
  // },
];
