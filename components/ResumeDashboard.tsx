import React from 'react';
import { ResumeAnalysis } from '../types';
import {
  FileText, CheckCircle, AlertTriangle, XCircle, Target, Briefcase,
  TrendingUp, Award, Zap, BookOpen, DollarSign, Star, ArrowRight,
  AlertCircle, Lightbulb, BarChart3
} from 'lucide-react';

interface ResumeDashboardProps {
  data: ResumeAnalysis;
}

// Score color helper
const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
};

const getScoreBg = (score: number): string => {
  if (score >= 80) return 'from-green-500 to-emerald-600';
  if (score >= 60) return 'from-yellow-500 to-orange-500';
  if (score >= 40) return 'from-orange-500 to-red-500';
  return 'from-red-500 to-rose-600';
};

const getScoreLabel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 50) return 'Needs Work';
  return 'Poor';
};

export const ResumeDashboard: React.FC<ResumeDashboardProps> = ({ data }) => {
  const sections = data.sections ? Object.values(data.sections) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Header with Overall Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Overall Score Card */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Overall Resume Score</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64" cy="64" r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-slate-700"
                />
                <circle
                  cx="64" cy="64" r="56"
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(data.overall_score / 100) * 352} 352`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${getScoreColor(data.overall_score)}`}>
                  {data.overall_score}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>
            <div className="flex-1">
              <p className={`text-2xl font-bold ${getScoreColor(data.overall_score)} mb-1`}>
                {getScoreLabel(data.overall_score)}
              </p>
              <p className="text-sm text-slate-400">
                Your resume is {data.overall_score >= 70 ? 'well-optimized' : 'needs improvement'} for ATS systems
              </p>
            </div>
          </div>
        </div>

        {/* ATS Compatibility Score */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700/50 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">ATS Compatibility</h2>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-400">ATS Scan Score</span>
              <span className={`text-lg font-bold ${getScoreColor(data.ats_compatibility_score)}`}>
                {data.ats_compatibility_score}%
              </span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getScoreBg(data.ats_compatibility_score)} transition-all duration-1000 rounded-full`}
                style={{ width: `${data.ats_compatibility_score}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-slate-400">
            {data.ats_compatibility_score >= 80 
              ? '✅ Your resume will pass most ATS filters'
              : data.ats_compatibility_score >= 60
              ? '⚠️ Some improvements needed for better ATS compatibility'
              : '❌ Significant changes required to pass ATS systems'}
          </p>
        </div>
      </div>

      {/* Section Scores */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700/50 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Section Analysis</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section, index) => (
            <div key={index} className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/30">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-white text-sm">{section.name}</h3>
                <span className={`text-lg font-bold ${getScoreColor(section.score)}`}>
                  {section.score}
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
                <div 
                  className={`h-full bg-gradient-to-r ${getScoreBg(section.score)} rounded-full`}
                  style={{ width: `${section.score}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mb-2">{section.feedback}</p>
              {section.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {section.suggestions.slice(0, 2).map((suggestion, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full">
                      {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Keyword Analysis */}
      {data.keyword_analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-900/30 to-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-green-500/20">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h3 className="font-bold text-white">Found Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.keyword_analysis.found_keywords.map((keyword, i) => (
                <span key={i} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-900/30 to-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-red-500/20">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h3 className="font-bold text-white">Missing Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.keyword_analysis.missing_keywords.map((keyword, i) => (
                <span key={i} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30">
                  + {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-white">Strengths</h3>
          </div>
          <div className="space-y-2">
            {data.strengths.map((strength, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-white">Areas to Improve</h3>
          </div>
          <div className="space-y-2">
            {data.weaknesses.map((weakness, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <span>{weakness}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Issues */}
      {data.critical_issues && data.critical_issues.length > 0 && (
        <div className="bg-gradient-to-br from-red-900/20 to-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-red-500/30 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-white">Critical Issues to Fix</h3>
          </div>
          <div className="space-y-3">
            {data.critical_issues.map((issue, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-300">{issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Improvements */}
      {data.improvement_priority && data.improvement_priority.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-white">Priority Improvements</h3>
          </div>
          <div className="space-y-4">
            {data.improvement_priority.map((item, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                item.priority === 'high' 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : item.priority === 'medium'
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-blue-500/10 border-blue-500/30'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    item.priority === 'high' 
                      ? 'bg-red-500/30 text-red-300' 
                      : item.priority === 'medium'
                      ? 'bg-yellow-500/30 text-yellow-300'
                      : 'bg-blue-500/30 text-blue-300'
                  }`}>
                    {item.priority.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-white">{item.issue}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-400">
                  <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>{item.fix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Industry Fit */}
      {data.industry_fit && (
        <div className="bg-gradient-to-br from-indigo-900/30 to-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-indigo-500/30 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white">Industry Fit Analysis</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Best Fit Roles</p>
              <div className="flex flex-wrap gap-1">
                {data.industry_fit.best_fit_roles.map((role, i) => (
                  <span key={i} className="text-sm font-medium text-indigo-300">{role}{i < data.industry_fit.best_fit_roles.length - 1 ? ', ' : ''}</span>
                ))}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Experience Level</p>
              <p className="text-sm font-medium text-white">{data.industry_fit.experience_level}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Salary Range Estimate</p>
              <p className="text-sm font-medium text-green-400 flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {data.industry_fit.salary_range_estimate}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Items */}
      {data.action_items && data.action_items.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white">Action Items</h3>
          </div>
          <div className="space-y-2">
            {data.action_items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
                <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-purple-300">{i + 1}</span>
                </div>
                <span className="text-sm text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewritten Summary */}
      {data.rewritten_summary && (
        <div className="bg-gradient-to-br from-green-900/20 to-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-green-500/30">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="font-bold text-white">AI-Improved Summary</h3>
            <span className="text-xs px-2 py-0.5 bg-green-500/30 text-green-300 rounded-full">Suggested</span>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
            <p className="text-sm text-slate-300 leading-relaxed italic">"{data.rewritten_summary}"</p>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" />
            Copy this improved summary to replace your current one
          </p>
        </div>
      )}
    </div>
  );
};
