import React from 'react';
import { Brain, Activity, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="relative bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl"></div>
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-xl"></div>
        
        {/* Moving gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-sm opacity-50"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-2.5 rounded-xl shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                APEX-7
                <span className="text-xs bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text font-semibold">v7.0</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Interview Analysis System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-300 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700">
              <Activity className="w-4 h-4 text-green-400" />
              <span>Neural Core Active</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-slate-300 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Predictive AI</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};