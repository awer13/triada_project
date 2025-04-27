import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
        <div className="absolute inset-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-400 animate-spin" style={{ animationDirection: 'reverse', opacity: 0.6 }}></div>
      </div>
      <p className="mt-4 text-slate-400 font-medium text-lg">Analyzing content...</p>
      <p className="mt-2 text-slate-500 text-sm">This may take a moment</p>
    </div>
  );
};

export default Loader;