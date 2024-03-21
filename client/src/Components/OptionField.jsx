import React, { useContext, useEffect, useState } from "react";
import { summarizeOptions } from "./Prompts";
import { VideoContext } from "../contexts/VideoContext";
import { formatDuration } from "./Utils";

const OptionCard = ({ option, handleClick, creditCount }) => {
  const { videoDuration } = useContext(VideoContext);
  const { id, title, description, prompt } = option;
  const [adjustableCreditCount, setAdjustableCreditCount] = useState(0);
  const [interval, setInterval] = useState(600);

  useEffect(() => {
    let factor;
    switch (id) {
      case 6:
        factor = Math.max(1, 8 / (interval / 60)); // = 3 ~ 5
        setAdjustableCreditCount((creditCount * factor).toFixed(1));
        break;
      case 7:
        factor = Math.max(1, 1.3 * (videoDuration / interval));
        setAdjustableCreditCount((creditCount * factor).toFixed(1));
        break;
      default:
        setAdjustableCreditCount(creditCount);
    }
  }, [creditCount, interval]);

  const showAdjustedCredit = () => {
    switch (id) {
      case 1:
        return <span>{(creditCount * 2).toFixed(1)}</span>;
      case 6:
        return <span>{adjustableCreditCount}</span>;
      case 7:
        return <span>{adjustableCreditCount}</span>;
      default:
        return <span>{creditCount}</span>;
    }
  };

  const showModifiedDescription = () => {
    switch (id) {
      case 6:
        return (
          <div className=" whitespace-pre-wrap">
            {`Video length: ${formatDuration(
              videoDuration
            )}\nBreakdown the video into ${Math.ceil(
              videoDuration / interval
            )} Parts\nof ${formatDuration(interval)} each `}
          </div>
        );
      case 7:
        return (
          <div className=" whitespace-pre-wrap">
            {`Video length: ${formatDuration(
              videoDuration
            )}\nBreakdown the video into ${Math.ceil(
              videoDuration / interval
            )} Parts\nof ${formatDuration(interval)} each `}
          </div>
        );
      default:
        return description;
    }
  };

  const addSlider = () => {
    switch (id) {
      case 6:
        return (
          <input
            className="w-2/3 bg-indigo-400"
            type="range"
            step={60}
            min={-600}
            max={-180}
            value={-interval}
            onChange={(e) => setInterval(-e.target.value)}
          />
        );
      case 7:
        return (
          <input
            className="w-2/3 bg-indigo-400"
            type="range"
            step={300}
            min={-1200}
            max={-600}
            value={-interval}
            onChange={(e) => setInterval(-e.target.value)}
          />
        );

      default:
        break;
    }
  };

  return (
    <div className="bg-white rounded shadow-md mb-4 text-left flex justify-between">
      <div className="p-4 w-full ">
        <div className="text-xl font-bold mb-2 ">{title}</div>
        <div className="text-gray-600 text-sm text-wrap w-full">
          {showModifiedDescription()}
        </div>
        {addSlider()}
      </div>
      <div className=" flex-col items-start text-center p-4">
        <button
          className={`px-1.5 py-1 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-sm`}
          onClick={() =>
            handleClick({
              id,
              title,
              description,
              prompt: prompt,
              interval, creditAmount: adjustableCreditCount
            })
          }
        >
          Summarize
        </button>
        <div className=" text-sm ">Credit: {showAdjustedCredit()}</div>
      </div>
    </div>
  );
};

const OptionField = ({ handleClick, creditCount, setInterval }) => {
  return (
    <div className="flex flex-col mx-6 my-4">
      <div className="p-2 text-start ">Summary Options：</div>
      {summarizeOptions.map((option, index) => {
        return (
          <OptionCard
            option={option}
            key={index}
            handleClick={handleClick}
            creditCount={creditCount}
            setInterval={setInterval}
          />
        );
      })}
    </div>
  );
};

export default OptionField;
