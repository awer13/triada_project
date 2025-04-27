import React, { useState } from 'react';
import { TextInputProps } from '../types';

const TextInput: React.FC<TextInputProps> = ({ onTextSubmit, placeholder }) => {
  const [textValue, setTextValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!textValue.trim()) {
      return;
    }
    
    onTextSubmit(textValue);
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder={placeholder}
          className="input min-h-[120px] resize-y"
          rows={4}
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!textValue.trim()}
          >
            Analyze
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextInput;