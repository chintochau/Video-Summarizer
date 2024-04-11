import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="text-center bg-gray-50 py-20 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Turn Video Content into Actionable Notes Instantly</h1>
        <p className="mb-8">Effortlessly extract and summarize key points from any video, saving you hours of note-taking. Perfect for students, professionals, and content creators.</p>
        <Link to="summarizer">
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300">Try It Free</button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
