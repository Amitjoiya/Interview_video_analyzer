import React, { useState } from 'react';
import { ArrowLeft, IndianRupee, Sparkles, TrendingUp, Target, MessageSquare, AlertTriangle, Zap, Copy, Check, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { getSalaryNegotiationAdvice, SalaryNegotiationResult, SalaryNegotiationInput } from '../services/aiWriterService';
import { useTheme } from '../ThemeContext';

interface SalaryCoachProps {
  onBack: () => void;
}

export const SalaryCoach: React.FC<SalaryCoachProps> = ({ onBack }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<Partial<SalaryNegotiationInput>>({
    yearsExperience: 3,
  });
  const [result, setResult] = useState<SalaryNegotiationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['market', 'scripts', 'benefits']));

  const handleChange = (field: keyof SalaryNegotiationInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGetAdvice = async () => {
    if (!formData.jobTitle || !formData.offeredSalary || !formData.targetSalary || !formData.location || !formData.skills) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const advice = await getSalaryNegotiationAdvice(formData as SalaryNegotiationInput);
      setResult(advice);
      setExpandedSections(new Set(['market', 'scripts', 'benefits']));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get advice');
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
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Salary Negotiation Coach</h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>AI-powered negotiation strategies and scripts</p>
            </div>
          </div>
        </div>

        {!result ? (
          /* Input Form */
          <div className={`rounded-3xl border p-6 sm:p-8 ${
            isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
          }`}>
            <div className="space-y-6">
              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle || ''}
                    onChange={(e) => handleChange('jobTitle', e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-green-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-green-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="e.g., Mumbai, Delhi, Bangalore / Remote"
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-green-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-green-500'
                    }`}
                  />
                </div>
              </div>

              {/* Experience & Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.yearsExperience || 0}
                    onChange={(e) => handleChange('yearsExperience', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-green-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-green-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Company Size (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.companySize || ''}
                    onChange={(e) => handleChange('companySize', e.target.value)}
                    placeholder="e.g., Startup, Mid-size, Enterprise"
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-green-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-green-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Key Skills *
                </label>
                <input
                  type="text"
                  value={formData.skills || ''}
                  onChange={(e) => handleChange('skills', e.target.value)}
                  placeholder="e.g., Python, Machine Learning, 5 years leading teams"
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-green-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-green-500'
                  }`}
                />
              </div>

              {/* Salary Details */}
              <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-green-50'}`}>
                <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-green-400' : 'text-green-700'}`}>💰 Salary Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Current Salary (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.currentSalary || ''}
                      onChange={(e) => handleChange('currentSalary', e.target.value)}
                      placeholder="e.g., ₹12,00,000"
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-green-500'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-green-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Offered Salary *
                    </label>
                    <input
                      type="text"
                      value={formData.offeredSalary || ''}
                      onChange={(e) => handleChange('offeredSalary', e.target.value)}
                      placeholder="e.g., ₹14,00,000"
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-green-500'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-green-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Target Salary *
                    </label>
                    <input
                      type="text"
                      value={formData.targetSalary || ''}
                      onChange={(e) => handleChange('targetSalary', e.target.value)}
                      placeholder="e.g., ₹18,00,000"
                      className={`w-full px-4 py-3 rounded-xl border transition-all ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-green-500'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-green-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Optional: Other offers & concerns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Other Offers (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.otherOffers || ''}
                    onChange={(e) => handleChange('otherOffers', e.target.value)}
                    placeholder="e.g., Competing offer at ₹16 LPA"
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-green-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-green-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Concerns (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.concerns || ''}
                    onChange={(e) => handleChange('concerns', e.target.value)}
                    placeholder="e.g., Relocating, need signing bonus"
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-green-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-green-500'
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
                onClick={handleGetAdvice}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? 'bg-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/25'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Get Negotiation Strategy
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Confidence Booster */}
            <div className={`rounded-3xl border p-6 ${
              isDark ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-800/50' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-lg font-bold mb-2 ${isDark ? 'text-green-300' : 'text-green-800'}`}>You've Got This! 💪</h2>
                  <p className={`text-sm ${isDark ? 'text-green-200' : 'text-green-700'}`}>{result.confidenceBooster}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setResult(null)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-900 shadow-sm'
                  }`}
                >
                  Start Over
                </button>
              </div>
            </div>

            {/* Market Analysis */}
            <div className={`rounded-3xl border overflow-hidden ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <button
                onClick={() => toggleSection('market')}
                className={`w-full px-6 py-4 flex items-center justify-between ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Market Analysis</span>
                </div>
                {expandedSections.has('market') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.has('market') && (
                <div className={`px-6 pb-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="pt-4 space-y-4">
                    {/* Salary Range */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                        <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Low</p>
                        <p className={`text-lg font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{result.marketAnalysis.salaryRange.low}</p>
                      </div>
                      <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
                        <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>Median</p>
                        <p className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{result.marketAnalysis.salaryRange.median}</p>
                      </div>
                      <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                        <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>High</p>
                        <p className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{result.marketAnalysis.salaryRange.high}</p>
                      </div>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{result.marketAnalysis.analysis}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Negotiation Scripts */}
            <div className={`rounded-3xl border overflow-hidden ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <button
                onClick={() => toggleSection('scripts')}
                className={`w-full px-6 py-4 flex items-center justify-between ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Negotiation Scripts</span>
                </div>
                {expandedSections.has('scripts') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.has('scripts') && (
                <div className={`px-6 pb-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="pt-4 space-y-4">
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Approach: {result.negotiationStrategy.approach}
                    </p>
                    
                    {/* Scripts */}
                    {Object.entries(result.negotiationStrategy.scripts).map(([key, script]) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                          <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                            {key.replace('_', ' ')}
                          </p>
                          <button
                            onClick={() => handleCopy(script, `script-${key}`)}
                            className={`p-1.5 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}
                          >
                            {copied === `script-${key}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                          <p className={`text-sm italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>"{script}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Leverage Points */}
            <div className={`rounded-3xl border overflow-hidden ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <button
                onClick={() => toggleSection('leverage')}
                className={`w-full px-6 py-4 flex items-center justify-between ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Your Leverage Points</span>
                </div>
                {expandedSections.has('leverage') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.has('leverage') && (
                <div className={`px-6 pb-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="pt-4 space-y-2">
                    {result.leveragePoints.map((point, i) => (
                      <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
                        <span className="text-amber-400 font-bold">✓</span>
                        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Non-Salary Benefits */}
            <div className={`rounded-3xl border overflow-hidden ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <button
                onClick={() => toggleSection('benefits')}
                className={`w-full px-6 py-4 flex items-center justify-between ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 text-white" />
                  </div>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Non-Salary Benefits to Negotiate</span>
                </div>
                {expandedSections.has('benefits') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.has('benefits') && (
                <div className={`px-6 pb-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className="pt-4 space-y-4">
                    {result.nonSalaryBenefits.map((benefit, i) => (
                      <div key={i} className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{benefit.benefit}</span>
                          <span className={`text-sm px-2 py-0.5 rounded-full ${isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'}`}>
                            ~{benefit.value}
                          </span>
                        </div>
                        <p className={`text-sm italic ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>"{benefit.script}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Common Mistakes */}
            <div className={`rounded-3xl border p-6 ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Mistakes to Avoid</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.commonMistakes.map((mistake, i) => (
                  <div key={i} className={`flex items-start gap-2 p-3 rounded-xl ${isDark ? 'bg-red-900/10' : 'bg-red-50'}`}>
                    <span className="text-red-400">✗</span>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{mistake}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Plan */}
            <div className={`rounded-3xl border p-6 ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>📋 Your Action Plan</h3>
              <div className="space-y-3">
                {result.actionPlan.map((step, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                    <span className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{step}</p>
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
