import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ResumeDashboard } from './components/ResumeDashboard';
import { PDFTools } from './components/PDFTools';
import { CoverLetterGenerator } from './components/CoverLetterGenerator';
import { JobAnalyzer } from './components/JobAnalyzer';
import { EmailWriter } from './components/EmailWriter';
import { LinkedInOptimizer } from './components/LinkedInOptimizer';
import { InterviewQABank } from './components/InterviewQABank';
import { SalaryCoach } from './components/SalaryCoach';
import { analyzeInterviewVideo, AnalysisOptions, clearAnalysisCache } from './services/geminiService';
import { analyzeResume } from './services/resumeService';
import { AnalysisResponse, AppState, InterviewMode, ResumeAnalysis } from './types';
import { INTERVIEW_MODES } from './constants';
import { useLanguage } from './LanguageContext';
import { 
  AlertTriangle, RefreshCw, Sparkles, Target, Brain, Mic, Eye, Scan, Fingerprint, Radio, 
  Activity, Shield, Award, ChevronRight, Briefcase, Code, TrendingUp, Heart, Scale, 
  DollarSign, Palette, Globe, Check, ArrowRight, Zap, Languages, FileText, Video, Upload,
  Play, Camera, Menu, X, PenTool, Search, Mail, Linkedin, MessageSquare, BadgeDollarSign
} from 'lucide-react';

// Icon mapping for interview modes
const ModeIcons: Record<string, React.FC<{ className?: string }>> = {
  Briefcase, Code, TrendingUp, Heart, Target, Scale, DollarSign, Palette
};

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
  const { t } = useLanguage(); // Get translations
  // Show intro only if user hasn't seen it before
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('apex7_intro_seen');
    }
    return true;
  });
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState('');
  
  // State for mode selection (language is auto-detected from video)
  const [selectedMode, setSelectedMode] = useState<InterviewMode>('general');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [forceRefresh, setForceRefresh] = useState(false); // For bypassing cache
  
  // Resume Checker States
  const [resumeResult, setResumeResult] = useState<ResumeAnalysis | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  // Feature Selection
  const [selectedFeature, setSelectedFeature] = useState<'video' | 'resume' | 'pdf' | 'coverletter' | 'jobanalyzer' | 'emailwriter' | 'linkedin' | 'qabank' | 'salarycoach' | null>(null);

  // Browser History Support - Handle back/forward buttons
  useEffect(() => {
    // Set initial state in history
    if (!window.location.hash) {
      window.history.replaceState({ page: 'home' }, '', '#home');
    }
    
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state?.page === 'home' || !state) {
        setSelectedFeature(null);
        setAppState(AppState.IDLE);
        setAnalysisResult(null);
        setResumeResult(null);
      } else if (state?.page === 'video') {
        setSelectedFeature('video');
        setAppState(AppState.IDLE);
      } else if (state?.page === 'resume') {
        setSelectedFeature('resume');
        setAppState(AppState.IDLE);
      } else if (state?.page === 'pdf') {
        setSelectedFeature('pdf');
        setAppState(AppState.IDLE);
      } else if (state?.page === 'coverletter') {
        setSelectedFeature('coverletter');
        setAppState(AppState.IDLE);
      } else if (state?.page === 'jobanalyzer') {
        setSelectedFeature('jobanalyzer');
        setAppState(AppState.IDLE);
      } else if (state?.page === 'emailwriter') {
        setSelectedFeature('emailwriter');
        setAppState(AppState.IDLE);
      } else if (state?.page === 'linkedin') {
        setSelectedFeature('linkedin');
        setAppState(AppState.IDLE);
      } else if (state?.page === 'qabank') {
        setSelectedFeature('qabank');
        setAppState(AppState.IDLE);
      } else if (state?.page === 'salarycoach') {
        setSelectedFeature('salarycoach');
        setAppState(AppState.IDLE);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // Update URL when feature changes
  const navigateToFeature = (feature: 'video' | 'resume' | 'pdf' | 'coverletter' | 'jobanalyzer' | 'emailwriter' | 'linkedin' | 'qabank' | 'salarycoach') => {
    setSelectedFeature(feature);
    window.history.pushState({ page: feature }, '', `#${feature}`);
  };
  
  // Navigate back to home
  const navigateToHome = () => {
    setSelectedFeature(null);
    setAppState(AppState.IDLE);
    setAnalysisResult(null);
    setResumeResult(null);
    setSelectedFile(null);
    setResumeFile(null);
    window.history.pushState({ page: 'home' }, '', '#home');
  };

  const analysisSteps = [
    { step: t.analyzing.extractingFrames, icon: 'scan' },
    { step: t.analyzing.facsAnalysis, icon: 'eye' },
    { step: t.analyzing.microExpressions, icon: 'fingerprint' },
    { step: t.analyzing.vocalBiometrics, icon: 'radio' },
    { step: t.analyzing.bodyLanguage, icon: 'target' },
    { step: t.analyzing.psychProfile, icon: 'brain' },
    { step: t.analyzing.deceptionAnalysis, icon: 'shield' },
    { step: t.analyzing.hireProbability, icon: 'sparkles' },
  ];

  // When file is selected, go to mode selection
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAppState(AppState.MODE_SELECT);
  };

  // Start analysis with selected options
  const startAnalysis = async (forceRefresh: boolean = false) => {
    if (!selectedFile) return;
    
    setAppState(AppState.ANALYZING);
    setError(null);
    setAnalysisProgress(0);

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
      const options: AnalysisOptions = {
        mode: selectedMode,
        forceRefresh: forceRefresh // Pass force refresh flag
      };
      const result = await analyzeInterviewVideo(selectedFile, options);
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setCurrentAnalysisStep(t.analyzing.complete);
      
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
    navigateToHome();
    setError(null);
    setAnalysisProgress(0);
    setCurrentAnalysisStep('');
    setSelectedMode('general');
  };
  
  // Handle resume file upload
  const handleResumeUpload = async (file: File) => {
    setResumeFile(file);
    setAppState(AppState.RESUME_ANALYZING);
    setAnalysisProgress(0);
    
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 90 ? 90 : newProgress;
      });
    }, 200);
    
    try {
      const result = await analyzeResume(file);
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setTimeout(() => {
        setResumeResult(result);
        setAppState(AppState.RESUME_RESULT);
      }, 500);
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error(err);
      setError(err.message || "Resume analysis failed");
      setAppState(AppState.ERROR);
    }
  };

  if (showIntro) {
    return <IntroScreen onComplete={() => {
      localStorage.setItem('apex7_intro_seen', 'true');
      setShowIntro(false);
    }} />;
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
           <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in px-4">
             <div className="text-center max-w-4xl mx-auto mb-10">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6 animate-bounce-subtle">
                 <Sparkles className="w-4 h-4 text-indigo-400" />
                 <span className="text-sm font-semibold text-indigo-300">APEX-7 Neural Analysis Engine</span>
               </div>
               <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                 Your AI-Powered
                 <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                   Interview Success Partner
                 </span>
               </h2>
               <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                 Choose a feature to get started. Our advanced AI will help you <span className="font-semibold text-indigo-400">ace your next interview</span>.
               </p>
             </div>
             
             {/* Feature Selection Cards - Row 1 */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
               {/* Video Analysis Card */}
               <button
                 onClick={() => navigateToFeature('video')}
                 className="group relative p-6 sm:p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20 text-left"
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative">
                   <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                     <Video className="w-8 h-8 text-white" />
                   </div>
                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Video Analysis</h3>
                   <p className="text-slate-400 text-sm sm:text-base mb-4">Upload your practice interview video for comprehensive AI analysis with facial expression detection, voice analysis, and executive feedback.</p>
                   <div className="flex flex-wrap gap-2">
                     <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg">FACS Analysis</span>
                     <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg">Voice Biometrics</span>
                     <span className="text-xs px-2 py-1 bg-pink-500/20 text-pink-300 rounded-lg">12 Modules</span>
                   </div>
                 </div>
                 <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
               </button>
               
               {/* Resume Checker Card */}
               <button
                 onClick={() => navigateToFeature('resume')}
                 className="group relative p-6 sm:p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20 text-left"
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative">
                   <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                     <FileText className="w-8 h-8 text-white" />
                   </div>
                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Resume Checker</h3>
                   <p className="text-slate-400 text-sm sm:text-base mb-4">Get AI-powered resume analysis with ATS compatibility score, section-by-section feedback, and improvement suggestions.</p>
                   <div className="flex flex-wrap gap-2">
                     <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg">ATS Score</span>
                     <span className="text-xs px-2 py-1 bg-teal-500/20 text-teal-300 rounded-lg">10 Sections</span>
                     <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg">Keywords</span>
                   </div>
                 </div>
                 <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
               </button>
               
               {/* PDF Tools Card */}
               <button
                 onClick={() => navigateToFeature('pdf')}
                 className="group relative p-6 sm:p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 hover:border-red-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/20 text-left"
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative">
                   <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                     <FileText className="w-8 h-8 text-white" />
                   </div>
                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">PDF Tools</h3>
                   <p className="text-slate-400 text-sm sm:text-base mb-4">All-in-one PDF toolkit. Merge, split, compress, add watermarks, page numbers, rotate, extract and more.</p>
                   <div className="flex flex-wrap gap-2">
                     <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded-lg">Merge</span>
                     <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-300 rounded-lg">Split</span>
                     <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded-lg">Compress</span>
                   </div>
                 </div>
                 <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-slate-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
               </button>
             </div>
             
             {/* Feature Selection Cards - Row 2 (AI Writing Tools) */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto mt-6">
               {/* Cover Letter Generator Card */}
               <button
                 onClick={() => navigateToFeature('coverletter')}
                 className="group relative p-6 sm:p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 text-left"
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative">
                   <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                     <PenTool className="w-8 h-8 text-white" />
                   </div>
                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Cover Letter Generator</h3>
                   <p className="text-slate-400 text-sm sm:text-base mb-4">Generate tailored cover letters instantly using AI. Just paste your resume and job description.</p>
                   <div className="flex flex-wrap gap-2">
                     <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg">AI Powered</span>
                     <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg">4 Tones</span>
                     <span className="text-xs px-2 py-1 bg-sky-500/20 text-sky-300 rounded-lg">Instant</span>
                   </div>
                 </div>
                 <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
               </button>
               
               {/* Job Analyzer Card */}
               <button
                 onClick={() => navigateToFeature('jobanalyzer')}
                 className="group relative p-6 sm:p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 hover:border-amber-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20 text-left"
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative">
                   <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                     <Search className="w-8 h-8 text-white" />
                   </div>
                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Job Description Analyzer</h3>
                   <p className="text-slate-400 text-sm sm:text-base mb-4">Decode any job posting. Extract key skills, requirements, and get preparation tips.</p>
                   <div className="flex flex-wrap gap-2">
                     <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded-lg">Skill Extract</span>
                     <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg">Red Flags</span>
                     <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-300 rounded-lg">Prep Tips</span>
                   </div>
                 </div>
                 <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
               </button>
               
               {/* Email Writer Card */}
               <button
                 onClick={() => navigateToFeature('emailwriter')}
                 className="group relative p-6 sm:p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 hover:border-violet-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/20 text-left"
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative">
                   <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
                     <Mail className="w-8 h-8 text-white" />
                   </div>
                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">AI Email Writer</h3>
                   <p className="text-slate-400 text-sm sm:text-base mb-4">Write professional job-related emails. Follow-ups, thank you notes, negotiations & more.</p>
                   <div className="flex flex-wrap gap-2">
                     <span className="text-xs px-2 py-1 bg-violet-500/20 text-violet-300 rounded-lg">5 Types</span>
                     <span className="text-xs px-2 py-1 bg-fuchsia-500/20 text-fuchsia-300 rounded-lg">Professional</span>
                     <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg">Instant</span>
                   </div>
                 </div>
                 <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
               </button>
             </div>
             
             {/* Feature Selection Cards - Row 3 (Career Advancement Tools) */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto mt-6">
               {/* LinkedIn Optimizer Card */}
               <button
                 onClick={() => navigateToFeature('linkedin')}
                 className="group relative p-6 sm:p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 hover:border-sky-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-sky-500/20 text-left"
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative">
                   <div className="w-16 h-16 bg-gradient-to-br from-sky-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform">
                     <Linkedin className="w-8 h-8 text-white" />
                   </div>
                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">LinkedIn Optimizer</h3>
                   <p className="text-slate-400 text-sm sm:text-base mb-4">Optimize your LinkedIn profile for recruiters. Get headline, summary, and keyword suggestions.</p>
                   <div className="flex flex-wrap gap-2">
                     <span className="text-xs px-2 py-1 bg-sky-500/20 text-sky-300 rounded-lg">Profile Score</span>
                     <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg">Keywords</span>
                     <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg">Headlines</span>
                   </div>
                 </div>
                 <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
               </button>
               
               {/* Interview Q&A Bank Card */}
               <button
                 onClick={() => navigateToFeature('qabank')}
                 className="group relative p-6 sm:p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 hover:border-rose-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-rose-500/20 text-left"
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative">
                   <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                     <MessageSquare className="w-8 h-8 text-white" />
                   </div>
                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Interview Q&A Bank</h3>
                   <p className="text-slate-400 text-sm sm:text-base mb-4">Get role-specific interview questions with model answers. Behavioral, technical & situational.</p>
                   <div className="flex flex-wrap gap-2">
                     <span className="text-xs px-2 py-1 bg-rose-500/20 text-rose-300 rounded-lg">50+ Questions</span>
                     <span className="text-xs px-2 py-1 bg-pink-500/20 text-pink-300 rounded-lg">STAR Format</span>
                     <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded-lg">Tips</span>
                   </div>
                 </div>
                 <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
               </button>
               
               {/* Salary Coach Card */}
               <button
                 onClick={() => navigateToFeature('salarycoach')}
                 className="group relative p-6 sm:p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20 text-left"
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative">
                   <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                     <BadgeDollarSign className="w-8 h-8 text-white" />
                   </div>
                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Salary Negotiation Coach</h3>
                   <p className="text-slate-400 text-sm sm:text-base mb-4">Get market salary insights and negotiation scripts. Counter-offer strategies & email templates.</p>
                   <div className="flex flex-wrap gap-2">
                     <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg">Market Data</span>
                     <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-lg">Scripts</span>
                     <span className="text-xs px-2 py-1 bg-teal-500/20 text-teal-300 rounded-lg">Templates</span>
                   </div>
                 </div>
                 <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
               </button>
             </div>
             
             {/* Feature highlights */}
             <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-10">
               <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                 <Eye className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400" />
                 <span className="text-xs sm:text-sm font-medium text-slate-300">FACS Analysis</span>
               </div>
               <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                 <Brain className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />
                 <span className="text-xs sm:text-sm font-medium text-slate-300">Neural Processing</span>
               </div>
               <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                 <Activity className="w-4 sm:w-5 h-4 sm:h-5 text-pink-400" />
                 <span className="text-xs sm:text-sm font-medium text-slate-300">Vocal Forensics</span>
               </div>
               <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                 <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-green-400" />
                 <span className="text-xs sm:text-sm font-medium text-slate-300">Authenticity AI</span>
               </div>
             </div>
           </div>
        )}
        
        {/* Video Analysis - Upload Section */}
        {selectedFeature === 'video' && appState === AppState.IDLE && (
           <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in px-4">
             <button
               onClick={navigateToHome}
               className="absolute top-24 left-4 sm:left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20"
             >
               <ArrowRight className="w-4 h-4 rotate-180" />
               <span className="text-sm">Back</span>
             </button>
             <div className="text-center max-w-3xl mx-auto mb-10">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6 animate-bounce-subtle">
                 <Video className="w-4 h-4 text-indigo-400" />
                 <span className="text-sm font-semibold text-indigo-300">Video Interview Analysis</span>
               </div>
               <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                 Upload Your
                 <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                   Practice Video
                 </span>
               </h2>
               <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                 Upload your practice video for <span className="font-semibold text-indigo-400">comprehensive psychological analysis</span>, micro-expression detection, and executive-level feedback.
               </p>
             </div>
             
             {/* Feature highlights */}
             <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
               <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                 <Eye className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400" />
                 <span className="text-xs sm:text-sm font-medium text-slate-300">FACS Analysis</span>
               </div>
               <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                 <Brain className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />
                 <span className="text-xs sm:text-sm font-medium text-slate-300">Neural Processing</span>
               </div>
               <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                 <Activity className="w-4 sm:w-5 h-4 sm:h-5 text-pink-400" />
                 <span className="text-xs sm:text-sm font-medium text-slate-300">Vocal Forensics</span>
               </div>
               <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                 <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-green-400" />
                 <span className="text-xs sm:text-sm font-medium text-slate-300">Authenticity AI</span>
               </div>
             </div>
             
             <UploadSection onFileSelect={handleFileSelect} isAnalyzing={false} />
           </div>
        )}
        
        {/* Resume Checker - Upload Section */}
        {selectedFeature === 'resume' && appState === AppState.IDLE && (
           <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in px-4">
             <button
               onClick={navigateToHome}
               className="absolute top-24 left-4 sm:left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20"
             >
               <ArrowRight className="w-4 h-4 rotate-180" />
               <span className="text-sm">Back</span>
             </button>
             <div className="text-center max-w-3xl mx-auto mb-10">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6 animate-bounce-subtle">
                 <FileText className="w-4 h-4 text-emerald-400" />
                 <span className="text-sm font-semibold text-emerald-300">AI Resume Checker</span>
               </div>
               <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                 Upload Your
                 <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                   Resume for Analysis
                 </span>
               </h2>
               <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                 Get instant AI feedback on your resume with <span className="font-semibold text-emerald-400">ATS compatibility score</span>, section analysis, and actionable improvements.
               </p>
             </div>
             
             {/* Feature highlights */}
             <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
               <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                 <Target className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
                 <span className="text-xs sm:text-sm font-medium text-slate-300">ATS Compatibility</span>
               </div>
               <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                 <Briefcase className="w-4 sm:w-5 h-4 sm:h-5 text-teal-400" />
                 <span className="text-xs sm:text-sm font-medium text-slate-300">10 Section Analysis</span>
               </div>
               <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                 <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400" />
                 <span className="text-xs sm:text-sm font-medium text-slate-300">Keyword Optimization</span>
               </div>
             </div>
             
             {/* Resume Upload Zone */}
             <div className="w-full max-w-xl">
               <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-emerald-500/30 rounded-3xl bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 cursor-pointer transition-all duration-300 group">
                 <input
                   type="file"
                   accept=".pdf,.doc,.docx"
                   onChange={(e) => e.target.files?.[0] && handleResumeUpload(e.target.files[0])}
                   className="hidden"
                 />
                 <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                   <FileText className="w-10 h-10 text-white" />
                 </div>
                 <p className="text-lg font-semibold text-white mb-2">Drop your resume here</p>
                 <p className="text-sm text-slate-400 mb-4">or click to browse</p>
                 <div className="flex gap-2">
                   <span className="text-xs px-3 py-1 bg-slate-700/50 text-slate-400 rounded-lg">PDF</span>
                   <span className="text-xs px-3 py-1 bg-slate-700/50 text-slate-400 rounded-lg">DOC</span>
                   <span className="text-xs px-3 py-1 bg-slate-700/50 text-slate-400 rounded-lg">DOCX</span>
                 </div>
               </label>
             </div>
           </div>
        )}
        
        {/* Resume Analyzing */}
        {appState === AppState.RESUME_ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border border-emerald-500/20 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                <div className="absolute w-56 h-56 border border-teal-500/15 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
              </div>
              
              <div className="relative flex flex-col items-center py-16">
                <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-10 animate-ping"></div>
                  <div className="absolute inset-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <FileText className="w-12 h-12 text-white animate-pulse" />
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                    {Math.round(analysisProgress)}%
                  </p>
                  <p className="text-lg font-medium text-slate-300">Analyzing Resume...</p>
                </div>
                
                <div className="w-full max-w-md">
                  <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 mt-6">Scanning 10 key sections & ATS compatibility...</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Resume Result */}
        {appState === AppState.RESUME_RESULT && resumeResult && (
          <div className="pt-8 animate-fade-in-up px-4">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4 max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-white">Resume Analysis Results</h2>
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-all bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-700 hover:border-emerald-500/50"
              >
                <RefreshCw className="w-4 h-4" />
                Analyze Another Resume
              </button>
            </div>
            <ResumeDashboard data={resumeResult} />
          </div>
        )}
        
        {/* PDF Tools */}
        {selectedFeature === 'pdf' && (
          <PDFTools onBack={navigateToHome} />
        )}
        
        {/* Cover Letter Generator */}
        {selectedFeature === 'coverletter' && (
          <CoverLetterGenerator onBack={navigateToHome} />
        )}
        
        {/* Job Description Analyzer */}
        {selectedFeature === 'jobanalyzer' && (
          <JobAnalyzer onBack={navigateToHome} />
        )}
        
        {/* AI Email Writer */}
        {selectedFeature === 'emailwriter' && (
          <EmailWriter onBack={navigateToHome} />
        )}
        
        {/* LinkedIn Optimizer */}
        {selectedFeature === 'linkedin' && (
          <LinkedInOptimizer onBack={navigateToHome} />
        )}
        
        {/* Interview Q&A Bank */}
        {selectedFeature === 'qabank' && (
          <InterviewQABank onBack={navigateToHome} />
        )}
        
        {/* Salary Negotiation Coach */}
        {selectedFeature === 'salarycoach' && (
          <SalaryCoach onBack={navigateToHome} />
        )}

        {appState === AppState.MODE_SELECT && selectedFile && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
            <div className="text-center max-w-4xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-300">{t.modeSelect.configureTitle}</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                {t.modeSelect.configureTitle}
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {t.modeSelect.configureSubtitle}
                </span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-2">
                {t.modeSelect.selectMode}. Language will be auto-detected from your video.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-slate-400">{t.modeSelect.fileSelected}: {selectedFile.name}</span>
              </div>
            </div>

            {/* Interview Mode Selection */}
            <div className="w-full max-w-5xl mx-auto mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                {t.modeSelect.selectMode}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {INTERVIEW_MODES.map((mode) => {
                  const IconComponent = ModeIcons[mode.icon] || Briefcase;
                  const isSelected = selectedMode === mode.id;
                  // Get translated mode info if available
                  const modeKey = mode.id as keyof typeof t.modes;
                  const translatedMode = t.modes[modeKey] || { name: mode.name, description: mode.description };
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id as InterviewMode)}
                      className={`relative group p-4 rounded-2xl border transition-all duration-300 text-left ${
                        isSelected
                          ? 'bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border-indigo-500/50 shadow-lg shadow-indigo-500/20'
                          : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/50'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <Check className="w-4 h-4 text-green-400" />
                        </div>
                      )}
                      <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${mode.gradient} mb-3`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-white mb-1">{translatedMode.name}</h4>
                      <p className="text-xs text-slate-400 mb-2">{translatedMode.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {mode.focusAreas.slice(0, 2).map((area, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-700/50 text-slate-400 rounded">
                            {area}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Auto Language Detection Info */}
            <div className="w-full max-w-5xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                    <Languages className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      {t.modeSelect.selectLanguage}
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Auto</span>
                    </h4>
                    <p className="text-sm text-slate-400 mb-3">
                      Our AI automatically detects the language(s) spoken in your video. Whether you speak Hindi, English, Hinglish (Hindi-English mix), or any other language - we'll detect it and provide feedback in the same language.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['🇮🇳 Hindi', '🇺🇸 English', '🇮🇳 Hinglish', '🇪🇸 Spanish', '🇫🇷 French', '🇩🇪 German', '🇨🇳 中文', '🇯🇵 日本語', '🇸🇦 العربية'].map((lang, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-slate-800/50 text-slate-300 rounded-lg border border-slate-700/50">
                          {lang}
                        </span>
                      ))}
                      <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30">
                        + Many More
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Analysis Button */}
            <div className="flex flex-col items-center gap-4">
              {/* Force Refresh Toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={forceRefresh}
                    onChange={(e) => setForceRefresh(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {t.modeSelect.forceRefresh}
                </span>
              </label>
              
              <button
                onClick={() => startAnalysis(forceRefresh)}
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl font-semibold text-white text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  {t.modeSelect.startAnalysis}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity -z-10"></div>
              </button>
              
              {/* Consistency info */}
              <div className="text-center max-w-md">
                <p className="text-xs text-slate-500">
                  {forceRefresh 
                    ? `⚡ ${t.modeSelect.freshAnalysis}` 
                    : `🔒 ${t.modeSelect.consistentScoring}`}
                </p>
              </div>
              
              <button
                onClick={handleReset}
                className="text-sm text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Choose Different File
              </button>
            </div>
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
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Detected Language Display */}
              {analysisResult.detectedLanguages && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <Languages className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-purple-300 font-medium">
                      {t.results.languageDetected}: {analysisResult.detectedLanguages.primary}
                      {analysisResult.detectedLanguages.secondary && analysisResult.detectedLanguages.secondary.length > 0 && 
                        ` + ${analysisResult.detectedLanguages.secondary.join(', ')}`}
                    </span>
                    <span className="text-[10px] text-purple-400/70">
                      ({Math.round(analysisResult.detectedLanguages.confidence * 100)}%)
                    </span>
                  </div>
                  {analysisResult.detectedLanguages.notes && (
                    <span className="text-xs text-slate-500 hidden md:inline">
                      {analysisResult.detectedLanguages.notes}
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex gap-3">
                {/* Re-analyze button */}
                <button 
                  onClick={() => {
                    if (selectedFile) {
                      setAppState(AppState.MODE_SELECT);
                    }
                  }}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-purple-400 transition-all bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-700 hover:border-purple-500/50"
                  title="Re-analyze with different settings or force new analysis"
                >
                  <Zap className="w-4 h-4" />
                  {t.results.reanalyze}
                </button>
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-all bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-700 hover:border-indigo-500/50"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t.results.analyzeAnother}
                </button>
              </div>
            </div>
            {/* Consistency indicator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">{t.results.consistentEnabled}</span>
              </div>
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