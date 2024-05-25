import React from 'react';
import { Button } from '../ui/button';

const FinalCTA = () => {
  return (
    <div className="bg-indigo-500 text-center py-20">
     <div className='container'>
        <h2 className="text-3xl font-bold mb-4 text-white">Ready to Get Started?</h2>
        <p className="mb-8 text-gray-100">Join thousands of satisfied users transforming their video content into knowledge. Sign up today and experience efficiency like never before.</p>
        <Button variant="outline"  >Sign Up Now</Button>
     </div>
    </div>
  );
};

export default FinalCTA;
