import React from 'react';
import { AnalysisResponse } from '../types';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AnalysisResultProps {
  result: AnalysisResponse;
  language: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, language }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'text-green-500';
    if (confidence >= 0.4) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 slide-up">
      <div className="flex items-center mb-6">
        {result.confidence >= 0.7 ? (
          <CheckCircle className="text-green-500 mr-3" size={24} />
        ) : (
          <AlertCircle className="text-yellow-500 mr-3" size={24} />
        )}
        <h2 className="text-xl font-bold">{result.result}</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-slate-400 mb-2">
          Confidence Score
        </h3>
        <div className="flex items-center">
          <div className="w-full bg-slate-700 rounded-full h-2.5 mr-2">
            <div 
              className={`h-2.5 rounded-full ${
                result.confidence >= 0.7 ? 'bg-green-500' : 
                result.confidence >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>
          <span className={`font-semibold ${getConfidenceColor(result.confidence)}`}>
            {Math.round(result.confidence * 100)}%
          </span>
        </div>
      </div>

      {result.details && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Details</h3>
          <p className="text-slate-300">{result.details}</p>
        </div>
      )}

      {result.recommendations && result.recommendations.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-2">
            Recommendations
          </h3>
          <ul className="space-y-2">
            {result.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <Info className="text-blue-400 mr-2 flex-shrink-0 mt-0.5" size={16} />
                <span className="text-slate-300">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;