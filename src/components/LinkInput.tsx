import React, { useState } from 'react';
import { Link } from 'lucide-react';
import { LinkInputProps } from '../types';

const LinkInput: React.FC<LinkInputProps> = ({ onLinkSubmit, placeholder }) => {
  const [linkValue, setLinkValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!linkValue.trim()) {
      return;
    }
    
    try {
      const url = new URL(linkValue);
      if (!url.protocol.startsWith('http')) {
        throw new Error('Invalid URL protocol');
      }
      
      setError(null);
      onLinkSubmit(linkValue);
    } catch (err) {
      setError('Please enter a valid URL (e.g., https://example.com)');
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Link className="text-slate-400" size={20} />
          </div>
          <input
            type="text"
            value={linkValue}
            onChange={(e) => {
              setLinkValue(e.target.value);
              if (error) setError(null);
            }}
            placeholder={placeholder}
            className="input pl-10 pr-24"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 rounded-md transition-colors duration-200"
            disabled={!linkValue.trim()}
          >
            Analyze
          </button>
        </div>
        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
      </form>
      <div className="mt-2 text-xs text-slate-400">
        Supported platforms: TikTok, Telegram, Instagram, and others
      </div>
    </div>
  );
};

export default LinkInput;