import React from 'react';

const LoadingSpinner = ({ size = "md" }) => {
  const dimensions = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div 
        className={`${dimensions[size] || dimensions.md} rounded-full border-t-indigo-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin`}
      ></div>
      <span className="text-xs font-medium tracking-widest text-slate-500 uppercase animate-pulse">
        Analyzing
      </span>
    </div>
  );
};

export default LoadingSpinner;
