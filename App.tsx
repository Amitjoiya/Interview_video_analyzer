import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { analyzeInterviewVideo } from './services/geminiService';
import { AnalysisResponse, AppState } from './types';
import { AlertTriangle, RefreshCw, Sparkles, Target, Brain, Mic, Eye, Scan, Fingerprint, Radio, Activity, Shield, Award, ChevronRight } from 'lucide-react';

// Intro Screen Component
const IntroScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
      setTimeout(() => setPhase(5), 4500),
      setTimeout(() => onComplete(), 6000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex items-center justify-center overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'grid-scroll 20s linear infinite'
        }}></div>
      </div>
      
      {/* Scanning Lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan-horizontal"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-scan-horizontal-reverse"></div>
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-indigo-500 to-transparent animate-scan-vertical"></div>
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-pink-500 to-transparent animate-scan-vertical-reverse"></div>
      </div>
      
      {/* Central Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-[600px] h-[600px] rounded-full bg-gradient-radial from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl transition-all duration-1000 ${phase >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>
      </div>
      
      {/* Orbiting Particles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className={`absolute w-2 h-2 rounded-full transition-all duration-1000 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: `linear-gradient(135deg, ${['#818cf8', '#a78bfa', '#f472b6', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#60a5fa'][i]}, transparent)`,
              animation: `orbit ${8 + i * 2}s linear infinite`,
              animationDelay: `${i * 0.5}s`,
              transformOrigin: 'center center',
              left: '50%',
              top: '50%',
              marginLeft: '-4px',
              marginTop: '-4px',
            }}
          ></div>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        {/* Logo/Icon */}
        <div className={`mb-8 transition-all duration-1000 ${phase >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-2xl opacity-50 animate-pulse-slow"></div>
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 rounded-3xl shadow-2xl">
              <Brain className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h1 className={`text-6xl md:text-7xl font-black mb-4 transition-all duration-1000 ${phase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            APEX-7
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className={`text-xl md:text-2xl text-slate-400 mb-2 font-light tracking-widest transition-all duration-1000 ${phase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          INTERVIEW ANALYSIS SYSTEM
        </p>
        
        {/* Version Tag */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700 mb-8 transition-all duration-1000 ${phase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm text-slate-400 tracking-wide">NEURAL CORE ONLINE</span>
        </div>
        
        {/* Feature Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-10 transition-all duration-1000 ${phase >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {[
            { icon: Eye, label: 'FACS Analysis', color: 'from-cyan-500 to-blue-500' },
            { icon: Activity, label: 'Vocal Forensics', color: 'from-purple-500 to-pink-500' },
            { icon: Shield, label: 'Deception AI', color: 'from-orange-500 to-red-500' },
            { icon: Award, label: 'Hire Prediction', color: 'from-green-500 to-emerald-500' },
          ].map((feature, i) => (
            <div 
              key={i}
              className="bg-slate-800/30 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50 transition-all duration-500 hover:scale-105"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${feature.color} mb-2`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">{feature.label}</p>
            </div>
          ))}
        </div>
        
        {/* Loading Bar */}
        <div className={`max-w-md mx-auto transition-all duration-1000 ${phase >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-center gap-3 text-slate-400 mb-4">
            <span className="text-sm tracking-widest">INITIALIZING</span>
            <ChevronRight className="w-4 h-4 animate-pulse" />
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>
      
      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 opacity-30">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
          SYS.INIT_COMPLETE
        </div>
      </div>
      <div className="absolute top-8 right-8 opacity-30">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          v7.0.2-STABLE
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        </div>
      </div>
      <div className="absolute bottom-8 left-8 opacity-30">
        <div className="text-xs text-slate-500 font-mono">
          NEURAL_NET: ACTIVE
        </div>
      </div>
      <div className="absolute bottom-8 right-8 opacity-30">
        <div className="text-xs text-slate-500 font-mono">
          CONFIDENCE: 94.7%
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState('');

  const analysisSteps = [
    { step: 'Extracting video frames...', icon: 'scan' },
    { step: 'Running FACS analysis...', icon: 'eye' },
    { step: 'Detecting micro-expressions...', icon: 'fingerprint' },
    { step: 'Processing vocal biometrics...', icon: 'radio' },
    { step: 'Analyzing body language...', icon: 'target' },
    { step: 'Computing psychological profile...', icon: 'brain' },
    { step: 'Running deception analysis...', icon: 'shield' },
    { step: 'Calculating hire probability...', icon: 'sparkles' },
  ];

  const handleFileSelect = async (file: File) => {
    setAppState(AppState.ANALYZING);
    setError(null);
    setAnalysisProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        const newProgress = prev + Math.random() * 8;
        const stepIndex = Math.floor((newProgress / 100) * analysisSteps.length);
        if (stepIndex < analysisSteps.length) {
          setCurrentAnalysisStep(analysisSteps[stepIndex].step);
        }
        return newProgress >= 90 ? 90 : newProgress;
      });
    }, 500);

    try {
      const result = await analyzeInterviewVideo(file);
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setCurrentAnalysisStep('Analysis complete!');
      
      setTimeout(() => {
        setAnalysisResult(result);
        setAppState(AppState.SUCCESS);
      }, 500);
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error(err);
      setError(err.message || "Something went wrong during analysis.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setAnalysisResult(null);
    setError(null);
    setAnalysisProgress(0);
    setCurrentAnalysisStep('');
  };

  if (showIntro) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl animate-float-slow-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-cyan-500/5 via-blue-500/3 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}></div>
        
        {/* Floating Particles */}
        <div className="absolute w-1 h-1 bg-indigo-500/30 rounded-full animate-float-particle" style={{ left: '10%', top: '20%', animationDelay: '0s' }}></div>
        <div className="absolute w-1 h-1 bg-purple-500/30 rounded-full animate-float-particle" style={{ left: '30%', top: '40%', animationDelay: '2s' }}></div>
        <div className="absolute w-1 h-1 bg-cyan-500/30 rounded-full animate-float-particle" style={{ left: '70%', top: '30%', animationDelay: '4s' }}></div>
        <div className="absolute w-1 h-1 bg-pink-500/30 rounded-full animate-float-particle" style={{ left: '80%', top: '60%', animationDelay: '6s' }}></div>
        <div className="absolute w-1 h-1 bg-indigo-500/30 rounded-full animate-float-particle" style={{ left: '20%', top: '70%', animationDelay: '8s' }}></div>
        <div className="absolute w-1 h-1 bg-purple-500/30 rounded-full animate-float-particle" style={{ left: '60%', top: '80%', animationDelay: '10s' }}></div>
        
        {/* Scanning Lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent animate-scan-horizontal-slow"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-scan-horizontal-slow-reverse"></div>
      </div>

      <Header />
      
      <main className="container mx-auto px-4 relative z-10">
        
        {appState === AppState.IDLE && (
           <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
             <div className="text-center max-w-3xl mx-auto mb-10">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6 animate-bounce-subtle">
                 <Sparkles className="w-4 h-4 text-indigo-400" />
                 <span className="text-sm font-semibold text-indigo-300">APEX-7 Neural Analysis Engine</span>
               </div>
               <h2 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                 Master Your Interview
                 <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                   With Predictive AI
                 </span>
               </h2>
               <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                 Upload your practice video for <span className="font-semibold text-indigo-400">comprehensive psychological analysis</span>, micro-expression detection, and executive-level feedback.
               </p>
             </div>
             
             {/* Feature highlights */}
             <div className="flex flex-wrap justify-center gap-4 mb-8">
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                 <Eye className="w-5 h-5 text-cyan-400" />
                 <span className="text-sm font-medium text-slate-300">FACS Analysis</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                 <Brain className="w-5 h-5 text-purple-400" />
                 <span className="text-sm font-medium text-slate-300">Neural Processing</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                 <Activity className="w-5 h-5 text-pink-400" />
                 <span className="text-sm font-medium text-slate-300">Vocal Forensics</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                 <Shield className="w-5 h-5 text-green-400" />
                 <span className="text-sm font-medium text-slate-300">Authenticity AI</span>
               </div>
             </div>
             
             <UploadSection onFileSelect={handleFileSelect} isAnalyzing={false} />
           </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="relative w-full max-w-2xl mx-auto">
              {/* Animated outer rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border border-indigo-500/20 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                <div className="absolute w-56 h-56 border border-purple-500/15 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
                <div className="absolute w-48 h-48 border border-cyan-500/10 rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>
              </div>
              
              {/* Center content */}
              <div className="relative flex flex-col items-center py-16">
                {/* Scanning animation */}
                <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-10 animate-ping"></div>
                  <div className="absolute inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Scan className="w-12 h-12 text-white animate-pulse" />
                  </div>
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan"></div>
                  </div>
                </div>
                
                {/* Progress */}
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {Math.round(analysisProgress)}%
                  </p>
                  <p className="text-lg font-medium text-slate-300">{currentAnalysisStep || 'Initializing...'}</p>
                </div>
                
                {/* Progress bar */}
                <div className="w-full max-w-md">
                  <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                
                {/* Analysis steps indicators */}
                <div className="flex flex-wrap justify-center gap-2 mt-8">
                  {analysisSteps.map((step, i) => (
                    <div 
                      key={i}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                        (analysisProgress / 100) * analysisSteps.length > i 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20' 
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {step.icon === 'scan' && <Scan className="w-3 h-3" />}
                      {step.icon === 'eye' && <Eye className="w-3 h-3" />}
                      {step.icon === 'fingerprint' && <Fingerprint className="w-3 h-3" />}
                      {step.icon === 'radio' && <Radio className="w-3 h-3" />}
                      {step.icon === 'target' && <Target className="w-3 h-3" />}
                      {step.icon === 'brain' && <Brain className="w-3 h-3" />}
                      {step.icon === 'shield' && <Shield className="w-3 h-3" />}
                      {step.icon === 'sparkles' && <Sparkles className="w-3 h-3" />}
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-slate-500 mt-6">APEX-7 analyzing 200+ performance dimensions...</p>
              </div>
            </div>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center max-w-md text-center">
               <div className="bg-gradient-to-br from-red-500/20 to-rose-500/20 p-4 rounded-2xl mb-4 border border-red-500/20">
                 <AlertTriangle className="w-10 h-10 text-red-400" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Analysis Failed</h3>
               <p className="text-slate-400 mb-6">{error}</p>
               <button 
                onClick={handleReset}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25"
               >
                 Try Again
               </button>
            </div>
          </div>
        )}

        {appState === AppState.SUCCESS && analysisResult && (
          <div className="pt-8 animate-fade-in-up">
            <div className="flex justify-end mb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-all bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-700 hover:border-indigo-500/50"
              >
                <RefreshCw className="w-4 h-4" />
                Analyze Another Video
              </button>
            </div>
            <AnalysisDashboard data={analysisResult} />
          </div>
        )}

      </main>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-slow-delayed {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-30px) translateX(20px); opacity: 0.6; }
          50% { transform: translateY(-50px) translateX(-10px); opacity: 0.2; }
          75% { transform: translateY(-20px) translateX(-20px); opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes scan {
          0% { top: 0; opacity: 1; }
          50% { opacity: 0.5; }
          100% { top: 100%; opacity: 1; }
        }
        @keyframes scan-horizontal {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes scan-horizontal-reverse {
          0% { transform: translateX(100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes scan-vertical {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes scan-vertical-reverse {
          0% { transform: translateY(100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes grid-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }
        @keyframes loading-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-scan { animation: scan 2s ease-in-out infinite; }
        .animate-scan-horizontal { animation: scan-horizontal 3s ease-in-out infinite; }
        .animate-scan-horizontal-reverse { animation: scan-horizontal-reverse 3s ease-in-out infinite 1.5s; }
        .animate-scan-vertical { animation: scan-vertical 3s ease-in-out infinite; }
        .animate-scan-vertical-reverse { animation: scan-vertical-reverse 3s ease-in-out infinite 1.5s; }
        .animate-scan-horizontal-slow { animation: scan-horizontal 8s ease-in-out infinite; }
        .animate-scan-horizontal-slow-reverse { animation: scan-horizontal-reverse 8s ease-in-out infinite 4s; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-slow-delayed { animation: float-slow-delayed 9s ease-in-out infinite 1s; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle 15s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-loading-bar { animation: loading-bar 1.5s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default App;