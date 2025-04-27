import React from 'react';
import { Upload, Text, Globe } from 'lucide-react';

interface InstructionStepProps {
  step: number;
  title: string;
  icon: 'upload' | 'text' | 'globe';
}

const InstructionStep: React.FC<InstructionStepProps> = ({ step, title, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case 'upload':
        return <Upload size={32} className="text-blue-400" />;
      case 'text':
        return <Text size={32} className="text-blue-400" />;
      case 'globe':
        return <Globe size={32} className="text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center p-6 rounded-lg bg-slate-800/50 border border-slate-700 transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-800/80">
      <div className="bg-slate-700/50 rounded-full w-14 h-14 flex items-center justify-center mb-4">
        {getIcon()}
      </div>
      <div className="text-sm font-semibold text-blue-400 mb-2">Step {step}</div>
      <h3 className="text-lg font-medium text-center">{title}</h3>
    </div>
  );
};

export default InstructionStep;