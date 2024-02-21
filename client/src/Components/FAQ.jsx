import React, { useState } from 'react';

const faqs = [
  {
    question: 'Can I upload videos of any length?',
    answer: 'Yes, our app supports videos up to 2 hours long.'
  },
  {
    question: 'Is there a limit to how many videos I can summarize?',
    answer: 'The limit depends on your subscription plan. Please refer to our pricing plans for details.'
  },
  // Add more FAQs as needed
];

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="py-12 bg-white">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
      </div>
      <div className="max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <button
              className="flex justify-between items-center w-full p-5 bg-gray-100 text-left text-gray-700 font-medium rounded-lg focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span>{activeIndex === index ? '-' : '+'}</span>
            </button>
            {activeIndex === index && (
              <div className="p-4 bg-gray-200 rounded-b-lg">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
