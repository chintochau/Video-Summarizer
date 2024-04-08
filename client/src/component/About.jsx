import React from "react";

const InfoCard = ({ title, description }) => {
  return (
    <div className="w-full sm:flex-1 md:w-1/3 mb-8 shadow-lg m-3 px-14 py-16 rounded-3xl">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

const About = () => {
  const steps = [
    {
      title: "Step 1: Get Video URL",
      description: "Get and copy video URL from youtube.com.",
    },
    {
      title: "Step 2: Paste Video URL",
      description:
        'Paste URL into the field above and hit "Generate Summary" button.',
    },
    {
      title: "Step 3: Generate Summary",
      description: "You can get YouTube transcripts and summary with AI.",
    },
  ];

  return (
    <div className=" w-full bg-white py-14 px-8 md:px-10">
      <div className="container mx-auto px-4 max-w-[1280px] ">
        <h2 className="text-3xl font-bold mb-8">
          How to Summarize YouTube Videos?
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          You can easily summarize the youtube videos use NoteGPT with just 3
          simple steps
        </p>
        <div className="flex flex-wrap -mx-4 mt-10">
          {steps.map((step, index) => (
            <InfoCard
              key={index}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
