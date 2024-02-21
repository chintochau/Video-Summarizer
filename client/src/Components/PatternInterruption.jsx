import React from 'react';

const PatternInterruption = () => {
  // Placeholder for video URL or interactive demo link
  const demoVideoUrl = 'https://www.youtube.com/embed/L9lZPW98Ou4';

  return (
    <div className="py-16 bg-indigo-600 text-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">See It in Action</h2>
        <p className="mb-8">Experience the magic of turning video into notes with our live demo. No sign-up required.</p>
        {/* Embedding a video for demonstration. Adjust the `src` attribute as needed. */}
        <div className="aspect-w-16 aspect-h-9 mb-8 mx-auto">
          <iframe
            src={demoVideoUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Demo Video"
            className="w-full aspect-video"
          ></iframe>
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">Try Demo Now</button>
      </div>
    </div>
  );
};

export default PatternInterruption;
