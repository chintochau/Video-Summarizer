import React from 'react';

const pricingPlans = [
  {
    id: 1,
    name: 'Basic',
    price: 'Free',
    features: [
      'Up to 5 video summaries',
      'Basic analytics',
      'Email support',
    ],
    isRecommended: false,
  },
  {
    id: 2,
    name: 'Professional',
    price: '$9.99/month',
    features: [
      'Unlimited video summaries',
      'Advanced analytics',
      'Priority email support',
    ],
    isRecommended: true,
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 'Contact us',
    features: [
      'Custom video summaries',
      'Dedicated support',
      'Custom integrations',
    ],
    isRecommended: false,
  },
];

const PricingPlans = () => {
  return (
    <div className="py-16 bg-gray-50 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Flexible Plans for Everyone</h2>
        <p className="mt-4">Choose the plan that best fits your needs.</p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <div key={plan.id} className={`p-6 bg-white rounded-lg shadow ${plan.isRecommended ? 'border-2 border-blue-500' : ''}`}>
            <h3 className={`text-xl font-semibold mb-4 ${plan.isRecommended ? 'text-blue-500' : ''}`}>{plan.name}</h3>
            <p className="text-lg font-bold mb-4">{plan.price}</p>
            <ul className="mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="mb-2">{feature}</li>
              ))}
            </ul>
            <button className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${plan.isRecommended ? 'bg-blue-600 hover:bg-blue-800' : ''} transition duration-300`}>
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
