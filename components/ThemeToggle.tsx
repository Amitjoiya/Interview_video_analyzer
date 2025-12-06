import React from 'react';
import { useTheme } from '../ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative p-2.5 rounded-xl transition-all duration-300 
        ${isDark 
          ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-700' 
          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm'
        }
        group overflow-hidden
      `}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background glow effect */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
        ${isDark 
          ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10' 
          : 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10'
        }
      `} />
      
      {/* Icon container with rotation animation */}
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </div>
    </button>
  );
};
