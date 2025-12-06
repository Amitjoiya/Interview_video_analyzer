import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Sparkles, ChevronDown, ChevronUp, BookOpen, AlertTriangle, MessageCircle, Loader2, Copy, Check } from 'lucide-react';
import { generateInterviewQuestions, InterviewQAResult, InterviewQAInput } from '../services/aiWriterService';
import { useTheme } from '../ThemeContext';

interface InterviewQABankProps {
  onBack: () => void;
}

export const InterviewQABank: React.FC<InterviewQABankProps> = ({ onBack }) => {
  const { isDark } = useTheme();
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [company, setCompany] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<InterviewQAInput['experienceLevel']>('mid');
  const [interviewType, setInterviewType] = useState<InterviewQAInput['interviewType']>('mixed');
  const [result, setResult] = useState<InterviewQAResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set([0, 1, 2]));
  const [copied, setCopied] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleGenerate = async () => {
    if (!jobTitle.trim()) {
      setError('Please enter a job title');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const questions = await generateInterviewQuestions({
        jobTitle,
        jobDescription: jobDescription || undefined,
        company: company || undefined,
        experienceLevel,
        interviewType,
      });
      setResult(questions);
      setExpandedQuestions(new Set([0, 1, 2]));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (index: number) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-400';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400';
      case 'hard': return 'bg-red-500/10 text-red-400';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Behavioral': 'from-blue-500 to-indigo-500',
      'Technical': 'from-purple-500 to-pink-500',
      'Situational': 'from-amber-500 to-orange-500',
      'Culture Fit': 'from-green-500 to-emerald-500',
      'Leadership': 'from-red-500 to-rose-500',
    };
    return colors[category] || 'from-slate-500 to-slate-600';
  };

  const categories = result 
    ? ['all', ...new Set(result.questions.map(q => q.category))]
    : [];

  const filteredQuestions = result?.questions.filter(
    q => filterCategory === 'all' || q.category === filterCategory
  ) || [];

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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Interview Q&A Bank</h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>AI-generated practice questions with sample answers</p>
            </div>
          </div>
        </div>

        {!result ? (
          /* Input Form */
          <div className={`rounded-3xl border p-6 sm:p-8 ${
            isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
          }`}>
            <div className="space-y-6">
              {/* Job Title */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Job Title *
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-500'
                  }`}
                />
              </div>

              {/* Experience Level & Interview Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Experience Level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['entry', 'mid', 'senior', 'executive'] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => setExperienceLevel(level)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                          experienceLevel === level
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500 shadow-lg shadow-purple-500/30'
                            : isDark
                              ? 'bg-slate-800 text-slate-300 border-transparent hover:bg-slate-700 hover:border-slate-600'
                              : 'bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Interview Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['behavioral', 'technical', 'mixed', 'case'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setInterviewType(type)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                          interviewType === type
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500 shadow-lg shadow-purple-500/30'
                            : isDark
                              ? 'bg-slate-800 text-slate-300 border-transparent hover:bg-slate-700 hover:border-slate-600'
                              : 'bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Optional: Company & JD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g., Google, Microsoft"
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Job Description (Optional - for more targeted questions)
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description for more tailored questions..."
                  className={`w-full h-32 px-4 py-3 rounded-xl border resize-none transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-500'
                  }`}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading || !jobTitle.trim()}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  loading || !jobTitle.trim()
                    ? 'bg-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Interview Questions
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Header with Reset */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {filteredQuestions.length} Questions Generated
                </h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  For {jobTitle} • {experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)} Level
                </p>
              </div>
              <button
                onClick={() => setResult(null)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-900 shadow-sm'
                }`}
              >
                New Search
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filterCategory === cat
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.map((q, i) => (
                <div key={i} className={`rounded-2xl border overflow-hidden ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <button
                    onClick={() => toggleQuestion(i)}
                    className={`w-full px-6 py-4 flex items-start gap-4 text-left ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getCategoryColor(q.category)} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <span className="text-white text-sm font-bold">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{q.question}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                          {q.category}
                        </span>
                      </div>
                    </div>
                    {expandedQuestions.has(i) ? <ChevronUp className="w-5 h-5 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 flex-shrink-0" />}
                  </button>
                  
                  {expandedQuestions.has(i) && (
                    <div className={`px-6 pb-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <div className="pt-4 space-y-4">
                        {/* Sample Answer */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>Sample Answer</p>
                            <button
                              onClick={() => handleCopy(q.sampleAnswer, `answer-${i}`)}
                              className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}
                            >
                              {copied === `answer-${i}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{q.sampleAnswer}</p>
                          </div>
                        </div>

                        {/* Tips */}
                        <div>
                          <p className={`text-sm font-medium mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Tips</p>
                          <ul className="space-y-1">
                            {q.tips.map((tip, j) => (
                              <li key={j} className={`text-sm flex items-start gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                <span className="text-amber-400 mt-1">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Follow-up Questions */}
                        {q.followUpQuestions.length > 0 && (
                          <div>
                            <p className={`text-sm font-medium mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Possible Follow-ups</p>
                            <ul className="space-y-1">
                              {q.followUpQuestions.map((fq, j) => (
                                <li key={j} className={`text-sm flex items-start gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                  <span className="text-purple-400 mt-1">→</span>
                                  {fq}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* General Tips & Questions to Ask */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* General Tips */}
              <div className={`rounded-2xl border p-6 ${
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>General Tips</h3>
                </div>
                <ul className="space-y-2">
                  {result.generalTips.map((tip, i) => (
                    <li key={i} className={`text-sm flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <span className="text-blue-400 mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Questions to Ask */}
              <div className={`rounded-2xl border p-6 ${
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Questions to Ask</h3>
                </div>
                <ul className="space-y-2">
                  {result.questionsToAsk.map((q, i) => (
                    <li key={i} className={`text-sm flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <span className="text-green-400 mt-1">?</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Red Flags */}
            <div className={`rounded-2xl border p-6 ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Red Flags to Watch</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.redFlagsToWatch.map((flag, i) => (
                  <div key={i} className={`flex items-start gap-2 p-3 rounded-xl ${isDark ? 'bg-red-500/5' : 'bg-red-50'}`}>
                    <span className="text-red-400 mt-0.5">⚠</span>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{flag}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
