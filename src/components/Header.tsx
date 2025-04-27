import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-700 mb-8 pb-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="text-blue-500 mr-3" size={32} />
          <h1 className="text-2xl font-bold text-glow">{title}</h1>
        </div>
        
        {showBackButton && (
          <button 
            onClick={() => navigate('/')}
            className="btn btn-secondary text-sm py-2 px-4"
          >
            ← Back to Home
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;