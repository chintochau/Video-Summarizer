import React from "react";

const GeneralButton = ({ onClick, children, type = 'button', className }) => {
  return (
    <button
      className={`px-3.5 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};


export const OutlinedButton = ({ onClick, children, type = 'button', className }) => {
  return (
    <button
      className={`px-3.5 py-2.5 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};


export default GeneralButton;
