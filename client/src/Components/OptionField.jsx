import React, { useEffect, useState } from "react";
import { summarizeOptions } from "./Prompts";

const OptionCard = ({
  option,
  handleClick,
  creditCount,
  setInterval,
  interval,
}) => {
  const [customPrompt, setCustomPrompt] = useState("");
  const { id, title, description, prompt } = option;
  const [adjustableCreditCount, setAdjustableCreditCount] = useState(0);

  useEffect(() => {
    const factor = 7.5 / (interval / 60); // = 3 ~ 5
    setAdjustableCreditCount((creditCount * factor).toFixed(1));
  }, [creditCount, interval]);

  const credit = () => {
    switch (id) {
      case 1:
        return <span>{creditCount * 1.8}</span>;
      case 6:
        return <span>{adjustableCreditCount}</span>;
      default:
        return <span>{creditCount}</span>;
    }
  };

  return (
    <div className="bg-white rounded shadow-md mb-4 text-left flex justify-between">
      <div className="p-4 w-full ">
        <div className="text-xl font-bold mb-2 ">{title}</div>
        <div className="text-gray-600 text-sm text-wrap w-full">
          {description}
        </div>
        {id === 6 && (
          <div>
            <div className="flex justify-between w-1/2">
              <div>Shorter</div>
              <div>Longer</div>
            </div>

            <input
              className="w-1/2 bg-indigo-400"
              type="range"
              step={30}
              min={-300}
              max={-180}
              value={-interval}
              onChange={(e) => setInterval(-e.target.value)}
            />
          </div>
        )}
      </div>
      <div className=" flex-col items-start text-center p-4">
        <button
          className={`px-1.5 py-1 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-sm`}
          onClick={() =>
            handleClick({
              id,
              title,
              description,
              prompt: id === 1 ? customPrompt : prompt,
            })
          }
        >
          Summarize
        </button>
        <div className=" text-sm ">Credit: {credit()}</div>
      </div>
    </div>
  );
};

const OptionField = ({ handleClick, creditCount, setInterval, interval }) => {
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
            interval={interval}
          />
        );
      })}
    </div>
  );
};

export default OptionField;
