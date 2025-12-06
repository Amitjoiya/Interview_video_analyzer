import React, { useState } from 'react';
import { ArrowLeft, Linkedin, Sparkles, Target, Users, TrendingUp, MessageSquare, Award, Copy, Check, ChevronDown, ChevronUp, Briefcase, Loader2 } from 'lucide-react';
import { optimizeLinkedIn, LinkedInOptimizationResult, extractTextFromFile } from '../services/aiWriterService';
import { useTheme } from '../ThemeContext';

interface LinkedInOptimizerProps {
  onBack: () => void;
}

export const LinkedInOptimizer: React.FC<LinkedInOptimizerProps> = ({ onBack }) => {
  const { isDark } = useTheme();
  const [profileText, setProfileText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [careerGoals, setCareerGoals] = useState('');
  const [result, setResult] = useState<LinkedInOptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['headline', 'about', 'priority']));
  const [fileUploading, setFileUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileUploading(true);
    setError(null);

    try {
      const text = await extractTextFromFile(file);
      setProfileText(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract text from file');
    } finally {
      setFileUploading(false);
    }
  };

  const handleOptimize = async () => {
    if (!profileText.trim()) {
      setError('Please paste your LinkedIn profile content');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const optimizationResult = await optimizeLinkedIn({
        currentProfile: profileText,
        targetRole: targetRole || undefined,
        industry: industry || undefined,
        careerGoals: careerGoals || undefined,
      });
      setResult(optimizationResult);
      setExpandedSections(new Set(['headline', 'about', 'priority']));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to optimize profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl transition-all ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-900 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Linkedin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>LinkedIn Optimizer</h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>AI-powered profile optimization for maximum visibility</p>
            </div>
          </div>
        </div>

        {!result ? (
          /* Input Form */
          <div className={`rounded-3xl border p-6 sm:p-8 ${
            isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
          }`}>
            <div className="space-y-6">
              {/* Profile Content */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Your LinkedIn Profile Content *
                </label>
                <p className={`text-xs mb-3 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  Copy your entire LinkedIn profile (headline, about, experience, skills) or upload a PDF export
                </p>
                <div className="flex gap-2 mb-3">
                  <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    isDark 
                      ? 'border-slate-700 hover:border-blue-500/50 bg-slate-800/50' 
                      : 'border-slate-300 hover:border-blue-500/50 bg-slate-50'
                  } ${fileUploading ? 'opacity-50' : ''}`}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={fileUploading}
                    />
                    {fileUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                    ) : (
                      <>
                        <Linkedin className="w-5 h-5 text-blue-400" />
                        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Upload Profile PDF</span>
                      </>
                    )}
                  </label>
                </div>
                <textarea
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                  placeholder="Paste your LinkedIn profile content here...

Example:
Headline: Senior Software Engineer | AI/ML Enthusiast | Building the Future

About: I'm a passionate software engineer with 5+ years of experience...

Experience:
- Senior Software Engineer at TechCorp (2022-Present)
- Software Engineer at StartupXYZ (2019-2022)

Skills: Python, JavaScript, Machine Learning, React, Node.js..."
                  className={`w-full h-64 px-4 py-3 rounded-xl border resize-none transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                  }`}
                />
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Target Role
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., Product Manager"
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Industry
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Technology, Finance"
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Career Goals
                  </label>
                  <input
                    type="text"
                    value={careerGoals}
                    onChange={(e) => setCareerGoals(e.target.value)}
                    placeholder="e.g., Leadership role, Remote work"
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleOptimize}
                disabled={loading || !profileText.trim()}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  loading || !profileText.trim()
                    ? 'bg-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/25'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Optimize My LinkedIn
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Score Card */}
            <div className={`rounded-3xl border p-6 ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getScoreBg(result.overallScore)} p-1`}>
                    <div className={`w-full h-full rounded-full flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                      <div className="text-center">
                        <span className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>{result.overallScore}</span>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Profile Score</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {result.overallScore >= 80 ? 'Excellent Profile!' : result.overallScore >= 60 ? 'Good Foundation!' : 'Needs Improvement'}
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {result.overallScore >= 80 
                      ? 'Your profile is well-optimized. Focus on the tweaks below to reach perfection.'
                      : result.overallScore >= 60 
                      ? 'Your profile has good elements but needs optimization to stand out.'
                      : 'Follow the priority actions below to significantly improve your visibility.'}
                  </p>
                </div>
                <button
                  onClick={() => setResult(null)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  Start Over
                </button>
              </div>
            </div>

            {/* Priority Actions */}
            <div className={`rounded-3xl border overflow-hidden ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <button
                onClick={() => toggleSection('priority')}
                className={`w-full px-6 py-4 flex items-center justify-between ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Priority Actions</span>
                </div>
                {expandedSections.has('priority') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.has('priority') && (
                <div className={`px-6 pb-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="pt-4 space-y-3">
                    {result.priorityActions.map((action, i) => (
                      <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                        <span className="w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </span>
                        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Headline Optimization */}
            <div className={`rounded-3xl border overflow-hidden ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <button
                onClick={() => toggleSection('headline')}
                className={`w-full px-6 py-4 flex items-center justify-between ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Headline Optimization</span>
                </div>
                {expandedSections.has('headline') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.has('headline') && (
                <div className={`px-6 pb-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="pt-4 space-y-4">
                    <div>
                      <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Current Headline</p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{result.headline.current}</p>
                    </div>
                    <div>
                      <p className={`text-xs uppercase tracking-wide mb-3 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Optimized Headlines</p>
                      <div className="space-y-2">
                        {result.headline.optimized.map((headline, i) => (
                          <div key={i} className={`flex items-center justify-between gap-2 p-3 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                            <p className={`text-sm flex-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{headline}</p>
                            <button
                              onClick={() => handleCopy(headline, `headline-${i}`)}
                              className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}
                            >
                              {copied === `headline-${i}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* About Section */}
            <div className={`rounded-3xl border overflow-hidden ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <button
                onClick={() => toggleSection('about')}
                className={`w-full px-6 py-4 flex items-center justify-between ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Optimized About Section</span>
                </div>
                {expandedSections.has('about') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.has('about') && (
                <div className={`px-6 pb-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="pt-4">
                    <div className={`relative p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      <p className={`text-sm whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{result.about.optimized}</p>
                      <button
                        onClick={() => handleCopy(result.about.optimized, 'about')}
                        className={`absolute top-2 right-2 p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}
                      >
                        {copied === 'about' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className={`rounded-3xl border overflow-hidden ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <button
                onClick={() => toggleSection('skills')}
                className={`w-full px-6 py-4 flex items-center justify-between ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Skills Optimization</span>
                </div>
                {expandedSections.has('skills') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.has('skills') && (
                <div className={`px-6 pb-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className={`text-xs uppercase tracking-wide mb-3 ${isDark ? 'text-green-400' : 'text-green-600'}`}>Add These Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {result.skills.recommended.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs uppercase tracking-wide mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Trending Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {result.skills.trending.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs uppercase tracking-wide mb-3 ${isDark ? 'text-red-400' : 'text-red-600'}`}>Consider Removing</p>
                      <div className="flex flex-wrap gap-2">
                        {result.skills.toRemove.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Keywords */}
            <div className={`rounded-3xl border overflow-hidden ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <button
                onClick={() => toggleSection('keywords')}
                className={`w-full px-6 py-4 flex items-center justify-between ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Keywords to Use</span>
                </div>
                {expandedSections.has('keywords') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.has('keywords') && (
                <div className={`px-6 pb-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="pt-4 space-y-4">
                    <div>
                      <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Must-Have Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {result.keywords.mustHave.map((kw, i) => (
                          <span key={i} className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-medium">{kw}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Nice-to-Have</p>
                      <div className="flex flex-wrap gap-2">
                        {result.keywords.niceToHave.map((kw, i) => (
                          <span key={i} className={`px-3 py-1 rounded-full text-xs ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{kw}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Networking Tips */}
            <div className={`rounded-3xl border overflow-hidden ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <button
                onClick={() => toggleSection('networking')}
                className={`w-full px-6 py-4 flex items-center justify-between ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Networking & Content</span>
                </div>
                {expandedSections.has('networking') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.has('networking') && (
                <div className={`px-6 pb-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Networking Tips</p>
                      <ul className="space-y-2">
                        {result.networking.tips.map((tip, i) => (
                          <li key={i} className={`text-sm flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <span className="text-cyan-400 mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Content Ideas</p>
                      <ul className="space-y-2">
                        {result.networking.contentIdeas.map((idea, i) => (
                          <li key={i} className={`text-sm flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <span className="text-blue-400 mt-1">•</span>
                            {idea}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
