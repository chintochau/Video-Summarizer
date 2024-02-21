import React from 'react';

const testimonials = [
  {
    id: 1,
    quote: "This app has revolutionized how I consume educational content.",
    author: "Jane Doe, Student",
  },
  {
    id: 2,
    quote: "A game-changer for professionals looking to streamline their learning process.",
    author: "John Smith, Product Manager",
  },
  // Add more testimonials as needed
];

const SocialProof = () => {
  return (
    <div className="py-12 bg-white">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Trusted by Professionals and Content Creators Worldwide</h2>
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-gray-100 p-6 rounded-lg shadow">
            <p className="text-lg italic">"{testimonial.quote}"</p>
            <p className="text-right mt-4 font-semibold">{testimonial.author}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">Join Them</button>
      </div>
    </div>
  );
};

export default SocialProof;
