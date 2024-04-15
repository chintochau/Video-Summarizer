import React from 'react';
// You might want to replace these with actual icons or images

import MicrophoneIcon from '@heroicons/react/24/outline/MicrophoneIcon'
import LanguageIcon from '@heroicons/react/24/outline/LanguageIcon'
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon'


const features = [
  {
    id: 1,
    icon: <MicrophoneIcon className="h-6 w-6 text-blue-500" />,
    title: 'YouTube Link Processing',
    description: 'Input any YouTube link and let our AI extract meaningful content to summarize.',
  },
  {
    id: 2,
    icon:<LanguageIcon className="h-6 w-6 text-green-500" />
    ,
    title: 'Automatic Summarization',
    description: 'Our advanced algorithms provide concise summaries of lengthy videos.',
  },
  {
    id: 3,
    icon: <DocumentTextIcon className="h-6 w-6 text-yellow-500" />,
    title: 'Keyword Extraction',
    description: 'Instantly find key phrases and terms within any video content.',
  },
  // Add more features as needed
];

const FeaturesAndBenefits = () => {
  return (
    <div className="py-12 bg-gray-50 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Powerful Features Designed for Efficiency</h2>
        <p className="mt-4">Explore the features that make our app the perfect choice for processing and summarizing video content.</p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div key={feature.id} className="flex flex-col items-center bg-white shadow-lg p-6 rounded-lg">
            {feature.icon}
            <h3 className="mt-5 mb-2 text-xl font-semibold">{feature.title}</h3>
            <p className="text-center">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesAndBenefits;
