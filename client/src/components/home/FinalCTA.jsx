import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const FinalCTA = () => {
  return (
    <div className=" text-center py-20">
      <div className='container'>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Get Started?</h2>
        <p className="mb-8 text-gray-900">Join thousands of satisfied users transforming their video content into knowledge. Sign up today and experience efficiency like never before.</p>
        <Button variant="outline"   >
          <Link to="/login">
            Sign Up Now
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FinalCTA;
