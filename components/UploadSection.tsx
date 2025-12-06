import React, { useRef, useState } from 'react';
import { UploadCloud, FileVideo, AlertCircle, Loader2, Sparkles, Target, TrendingUp } from 'lucide-react';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onFileSelect, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert("Please upload a valid video file.");
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      alert("Please upload a video smaller than 200MB.");
      return;
    }
    setFileName(file.name);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 p-6">
      <div 
        className={`relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-3xl transition-all duration-300 ease-out overflow-hidden
          ${dragActive ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" : "border-slate-700 bg-slate-900/50 backdrop-blur-sm"}
          ${isAnalyzing ? "opacity-50 pointer-events-none" : "cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/50 hover:scale-[1.01]"}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5"></div>
        
        {/* Corner decorations */}
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-500/30 rounded-tr-xl"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-indigo-500/30 rounded-bl-xl"></div>
        
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          accept="video/*" 
          onChange={handleChange} 
          disabled={isAnalyzing}
        />

        {isAnalyzing ? (
          <div className="relative flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-5 rounded-full">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Analyzing Performance...
              </p>
              <p className="text-sm text-slate-400">Processing verbal, visual & vocal patterns</p>
            </div>
            
            {/* Analysis indicators */}
            <div className="flex gap-3 mt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 animate-pulse">
                <Target className="w-3 h-3 text-indigo-400" />
                <span className="text-xs text-indigo-300">FACS Engine</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20 animate-pulse" style={{ animationDelay: '0.2s' }}>
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-300">Neural AI</span>
              </div>
            </div>
          </div>
        ) : fileName ? (
          <div className="relative flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/30 rounded-full blur-lg animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-full shadow-lg">
                <FileVideo className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-white">{fileName}</p>
              <p className="text-sm text-slate-400 mt-1">Ready for analysis • Click to change</p>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col items-center gap-4 text-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl group-hover:bg-indigo-500/30 transition-all"></div>
              <div className="relative bg-slate-800 p-5 rounded-full border border-slate-700 group-hover:border-indigo-500/50 transition-all duration-300">
                <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-white">Drop your interview video</p>
              <p className="text-sm text-slate-400">or click to browse (MP4, WebM, MOV)</p>
            </div>
            
            {/* Features preview */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
                <TrendingUp className="w-3 h-3" />
                <span>Score Prediction</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
                <Target className="w-3 h-3" />
                <span>Body Language AI</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
                <Sparkles className="w-3 h-3" />
                <span>Voice Analysis</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-3 text-xs text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
              <AlertCircle className="w-3 h-3" />
              <span>Max 200MB for optimal processing</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
