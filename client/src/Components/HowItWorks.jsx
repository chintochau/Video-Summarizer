import React from 'react';
// Assuming you have these icons in your project. If not, you can replace them with any icons of your choice.
import UploadIcon from '@mui/icons-material/Upload';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import NotesIcon from '@mui/icons-material/Notes';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <UploadIcon className="h-12 w-12 mb-4 mx-auto text-blue-500"/>,
      title: 'Upload Your Video',
      description: 'Simply upload the video you want to summarize.',
    },
    {
      id: 2,
      icon: <AutorenewIcon className="h-12 w-12 mb-4 mx-auto text-green-500"/>,
      title: 'Processing',
      description: 'Our AI analyzes the video to extract key information.',
    },
    {
      id: 3,
      icon: <NotesIcon className="h-12 w-12 mb-4 mx-auto text-yellow-500"/>,
      title: 'Get Your Notes',
      description: 'Receive concise, actionable notes from your video.',
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">How Video Notes Taker Works</h2>
        <p className="text-lg mt-4">Just three simple steps to go from video to summarized notes.</p>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-around items-center">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center mb-8 md:mb-0 md:w-1/3 px-4">
              {step.icon}
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-center">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">        
        <Link to="summarizer">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">Start Summarizing</button>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
