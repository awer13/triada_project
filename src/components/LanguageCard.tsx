import React from 'react';
import { LanguageOption } from '../types';
import { Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LanguageCardProps {
  language: LanguageOption;
}

const LanguageCard: React.FC<LanguageCardProps> = ({ language }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="card card-hover cursor-pointer w-64 h-60 p-6"
      onClick={() => navigate(language.route)}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 pulse">
          <Globe className="text-blue-400" size={40} />
        </div>
        <h3 className="text-2xl font-bold mb-3 text-glow">
          {language.nativeName}
        </h3>
        <p className="text-lg text-slate-400">
          {language.name}
        </p>
      </div>
    </div>
  );
  
  
};

export default LanguageCard;