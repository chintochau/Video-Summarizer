import { get_encoding } from "tiktoken";

export const calculateVideoCredits = (videoDuration) => {
  // $0.006(cost/min) * mins(Time) * 100(credits factor) *1.5(profit factor)
  return (0.006 * (videoDuration / 60) * 60 * 1.5).toFixed(1);
};

export const checkCredits = (userCredits, creditAmount) => {
  try {
    if (userCredits < creditAmount) {
      throw new Error("Insufficient credits");
    }

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Function to calculate credit based on transcript, model, and output count.
 * @param {object} options - Object containing transcript, model, and outputCount
 * @returns {number} - Calculated credit based on the specified model
 */
export const calculateCredit = ({
  transcript,
  model,
  outputCount,
  duration,
}) => {
  const encoding = get_encoding("cl100k_base");
  const tokens = encoding.encode(transcript);
  const output = outputCount || 1;
  const factor = 2;

  switch (model) {
    case "claude3h":
      return (
        (((tokens.length * 0.00025 + output * 1000 * 0.00125) * factor) /
          1000) *
        100
      ).toFixed(1);
    case "gpt4":
      return (
        (((tokens.length * 0.01 + 1000 * 0.03) * factor) / 1000) *
        100
      ).toFixed(1);
    default:
      // GPT35 (input/1000*0.0005 + output/1000*0.0015)*1.5*100
      // return tokens.length // comment out to to return token length
      return (
        (((tokens.length * 0.0005 + 800 * 0.0015) * factor) / 1000) *
        100
      ).toFixed(1);
  }
};
