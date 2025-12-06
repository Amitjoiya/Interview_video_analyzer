import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  CheckCircle2, AlertTriangle, Eye, Mic, Brain, TrendingUp, User, Quote,
  Target, Zap, Award, BarChart3, Sparkles, Activity, Clock, Volume2,
  ThumbsUp, ThumbsDown, Star, ChevronRight, Lightbulb, Gauge, Shield,
  Heart, Users, Flame, AlertCircle, Play, Timer, MessageSquare,
  Crown, Diamond, Rocket, Focus, Waves, Fingerprint, Scan, Radio,
  PieChart, TrendingDown, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { AnalysisResponse } from '../types';

interface AnalysisDashboardProps {
  data: AnalysisResponse;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deep-dive' | 'psychology' | 'action-plan'>('overview');

  const mainChartData = [
    { name: 'Content', score: data.analysis.content_quality.score * 10, fill: '#6366f1' },
    { name: 'Body Language', score: data.analysis.body_language.score * 10, fill: '#8b5cf6' },
    { name: 'Voice & Tone', score: data.analysis.voice_and_tone.score * 10, fill: '#f59e0b' },
    { name: 'Presence', score: data.analysis.professional_presence.score * 10, fill: '#10b981' },
  ];

  const radarData = [
    { subject: 'Clarity', value: data.key_metrics_dashboard.clarity_index, fullMark: 100 },
    { subject: 'Confidence', value: data.key_metrics_dashboard.confidence_score, fullMark: 100 },
    { subject: 'Engagement', value: data.key_metrics_dashboard.engagement_level, fullMark: 100 },
    { subject: 'Authenticity', value: data.key_metrics_dashboard.authenticity_rating, fullMark: 100 },
    { subject: 'Professionalism', value: data.key_metrics_dashboard.professionalism_score, fullMark: 100 },
    { subject: 'Likability', value: data.key_metrics_dashboard.likability_factor, fullMark: 100 },
    { subject: 'Exec Presence', value: data.key_metrics_dashboard.executive_presence, fullMark: 100 },
    { subject: 'Communication', value: data.key_metrics_dashboard.communication_effectiveness, fullMark: 100 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getHireColor = (recommendation: string) => {
    if (recommendation.includes('Strong Hire')) return 'bg-green-500';
    if (recommendation.includes('Hire')) return 'bg-emerald-500';
    if (recommendation.includes('Maybe')) return 'bg-yellow-500';
    if (recommendation.includes('Strong No')) return 'bg-red-600';
    return 'bg-red-500';
  };

  const getTierGradient = (tier: string) => {
    switch(tier?.toLowerCase()) {
      case 'exceptional': return 'from-yellow-400 via-amber-500 to-orange-500';
      case 'strong': return 'from-green-400 to-emerald-600';
      case 'competent': return 'from-blue-400 to-indigo-600';
      case 'developing': return 'from-yellow-500 to-orange-500';
      default: return 'from-red-400 to-rose-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Cinematic Hero Section */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
          </div>
          {/* Animated particles */}
          <div className="absolute top-10 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-float-particle opacity-60"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-float-particle-delayed opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-float-particle opacity-50"></div>
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-pink-400 rounded-full animate-pulse-slow opacity-60"></div>
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTU5IDFoLTF2NThoMVYxem0tMiAwSDJ2NThoNTVWMXoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-50"></div>
        </div>

        <div className="relative p-8 lg:p-12">
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold text-white ${getHireColor(data.executive_summary.hire_recommendation)} shadow-lg`}>
              {data.executive_summary.hire_recommendation}
            </div>
            <div className={`px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getTierGradient(data.executive_summary.performance_tier)} shadow-lg`}>
              <span className="flex items-center gap-1">
                <Crown className="w-3 h-3" />
                {data.executive_summary.performance_tier}
              </span>
            </div>
            <div className="px-4 py-1.5 rounded-full text-sm font-medium text-indigo-200 bg-white/10 backdrop-blur-sm border border-white/20">
              {data.executive_summary.percentile_ranking}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Score */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center">
              <div className="relative">
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${getScoreBg(data.executive_summary.overall_score)} rounded-full blur-2xl opacity-40 animate-pulse-glow scale-110`}></div>
                
                <svg className="relative w-48 h-48 transform -rotate-90">
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="50%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-white/10"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    strokeDasharray={553}
                    strokeDashoffset={553 - (553 * data.executive_summary.overall_score) / 100}
                    style={{ transition: 'stroke-dashoffset 2s ease-out' }}
                  />
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black text-white tracking-tight">{data.executive_summary.overall_score}</span>
                  <span className="text-indigo-300 text-sm font-medium mt-1">OVERALL SCORE</span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-2xl font-bold text-white">{data.executive_summary.hire_probability_percentage}%</p>
                <p className="text-indigo-300 text-sm">Hire Probability</p>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="lg:col-span-5 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#6366f1" strokeOpacity={0.3} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#a5b4fc', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6366f1', fontSize: 9 }} />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="#a78bfa"
                    fill="url(#radarGradient)"
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Stats */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <StatCard icon={<Target className="w-4 h-4" />} label="First Impression" value={`${data.first_impression_analysis.score}/10`} color="indigo" />
              <StatCard icon={<Brain className="w-4 h-4" />} label="Content" value={`${data.analysis.content_quality.score}/10`} color="blue" />
              <StatCard icon={<Eye className="w-4 h-4" />} label="Body Language" value={`${data.analysis.body_language.score}/10`} color="purple" />
              <StatCard icon={<Mic className="w-4 h-4" />} label="Voice & Tone" value={`${data.analysis.voice_and_tone.score}/10`} color="orange" />
              <StatCard icon={<Star className="w-4 h-4" />} label="Presence" value={`${data.analysis.professional_presence.score}/10`} color="emerald" />
              <StatCard icon={<Heart className="w-4 h-4" />} label="Likability" value={`${data.key_metrics_dashboard.likability_factor}%`} color="pink" />
              <StatCard icon={<Shield className="w-4 h-4" />} label="Stress Mgmt" value={`${data.key_metrics_dashboard.stress_management}%`} color="cyan" />
              <StatCard icon={<Rocket className="w-4 h-4" />} label="Interview Ready" value={`${data.key_metrics_dashboard.interview_readiness}%`} color="amber" />
            </div>
          </div>

          {/* Verdict */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Quote className="w-6 h-6 text-indigo-400" />
                  <span className="text-indigo-300 text-sm font-medium uppercase tracking-wider">Expert Verdict</span>
                </div>
                <p className="text-xl text-white font-medium leading-relaxed">{data.executive_summary.one_line_verdict}</p>
              </div>
              <div className="flex gap-2">
                {data.executive_summary.three_word_impression?.split(' ').map((word, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white font-semibold text-sm border border-white/20">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: <PieChart className="w-4 h-4" /> },
          { id: 'deep-dive', label: 'Deep Analysis', icon: <Scan className="w-4 h-4" /> },
          { id: 'psychology', label: 'Psychology', icon: <Fingerprint className="w-4 h-4" /> },
          { id: 'action-plan', label: 'Action Plan', icon: <Rocket className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap
              ${activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-lg' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Question & Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{data.question_category} Question</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">"{data.question_identified}"</h3>
              </div>
            </div>
          </div>

          {/* First Impression Card */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <Timer className="w-6 h-6" />
                <h3 className="font-bold text-lg">First 7 Seconds Impact</h3>
                <span className="ml-auto text-3xl font-black">{data.first_impression_analysis.score}/10</span>
              </div>
              <p className="text-white/90 mb-4">{data.first_impression_analysis.first_7_seconds_impact}</p>
              <div className="flex flex-wrap gap-2">
                {data.first_impression_analysis.instant_credibility_signals?.map((signal, i) => (
                  <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    ✓ {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Performance Breakdown
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mainChartData} layout="vertical" margin={{ top: 0, right: 30, left: 100, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 13, fill: '#475569', fontWeight: 600 }} width={100} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px -5px rgb(0 0 0 / 0.15)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={28}>
                    {mainChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Moment-by-Moment Highlights */}
          {data.moment_by_moment_highlights?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-indigo-500" />
                Key Moments Timeline
              </h3>
              <div className="space-y-3">
                {data.moment_by_moment_highlights.slice(0, 6).map((moment, i) => (
                  <div key={i} className={`p-4 rounded-xl border-l-4 ${
                    moment.type === 'Strength' ? 'bg-green-50 border-green-500' :
                    moment.type === 'Weakness' ? 'bg-red-50 border-red-500' :
                    'bg-amber-50 border-amber-500'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-white rounded text-xs font-mono font-bold text-slate-700">
                        {moment.timestamp}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        moment.type === 'Strength' ? 'bg-green-200 text-green-800' :
                        moment.type === 'Weakness' ? 'bg-red-200 text-red-800' :
                        'bg-amber-200 text-amber-800'
                      }`}>
                        {moment.category}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium">{moment.observation}</p>
                    {moment.recommendation && (
                      <p className="text-slate-500 text-sm mt-1 flex items-start gap-1">
                        <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {moment.recommendation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Wins & Competitive Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Wins
              </h3>
              <ul className="space-y-3">
                {data.quick_wins?.map((win, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{win}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                Competitive Position
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">vs Hired Candidates</p>
                  <p className="font-semibold text-slate-800 flex items-center gap-2">
                    {data.competitive_analysis.comparison_to_hired_candidates === 'Above' && <ArrowUpRight className="w-4 h-4 text-green-500" />}
                    {data.competitive_analysis.comparison_to_hired_candidates === 'Below' && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                    {data.competitive_analysis.comparison_to_hired_candidates === 'At' && <Minus className="w-4 h-4 text-yellow-500" />}
                    {data.competitive_analysis.comparison_to_hired_candidates} typical hire level
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Key Differentiator</p>
                  <p className="font-medium text-indigo-600">{data.competitive_analysis.differentiation_factor}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deep Dive Tab */}
      {activeTab === 'deep-dive' && (
        <div className="space-y-6 animate-fade-in">
          {/* Content Quality */}
          <DetailCard
            title="Content Quality Analysis"
            icon={<Brain className="w-5 h-5" />}
            score={data.analysis.content_quality.score}
            gradient="from-blue-500 to-indigo-600"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <MiniMetric label="STAR Method" value={`${data.analysis.content_quality.star_method_adherence}%`} />
              <MiniMetric label="Opening Impact" value={`${data.analysis.content_quality.opening_impact_score}/10`} />
              <MiniMetric label="Closing Strength" value={`${data.analysis.content_quality.closing_strength_score}/10`} />
              <MiniMetric label="Specificity" value={`${data.analysis.content_quality.specificity_index}%`} />
            </div>
            
            {data.analysis.content_quality.golden_quote && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-amber-700 font-medium flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4" /> Golden Quote
                </p>
                <p className="text-amber-900 italic">"{data.analysis.content_quality.golden_quote}"</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-semibold text-green-600 mb-2 flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" /> Strengths
                </p>
                <ul className="space-y-2">
                  {data.analysis.content_quality.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-slate-600 bg-green-50 p-2 rounded-lg">{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-red-500 mb-2 flex items-center gap-1">
                  <ThumbsDown className="w-4 h-4" /> Weaknesses
                </p>
                <ul className="space-y-2">
                  {data.analysis.content_quality.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-slate-600 bg-red-50 p-2 rounded-lg">{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {data.analysis.content_quality.power_words_used?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-600 mb-2">Power Words Used</p>
                <div className="flex flex-wrap gap-2">
                  {data.analysis.content_quality.power_words_used.map((word, i) => (
                    <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium">{word}</span>
                  ))}
                </div>
              </div>
            )}

            {data.analysis.content_quality.weak_language_detected?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-600 mb-2">Weak Language Detected</p>
                <div className="flex flex-wrap gap-2">
                  {data.analysis.content_quality.weak_language_detected.map((phrase, i) => (
                    <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">"{phrase}"</span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-700">{data.analysis.content_quality.feedback}</p>
            </div>
          </DetailCard>

          {/* Body Language */}
          <DetailCard
            title="Body Language Analysis"
            icon={<Eye className="w-5 h-5" />}
            score={data.analysis.body_language.score}
            gradient="from-purple-500 to-violet-600"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <MiniMetric label="Eye Contact" value={`${data.analysis.body_language.eye_contact_percentage}%`} />
              <MiniMetric label="Posture" value={`${data.analysis.body_language.posture_consistency}%`} />
              <MiniMetric label="Hand Visibility" value={`${data.analysis.body_language.hand_visibility_score}%`} />
              <MiniMetric label="Virtual Presence" value={`${data.analysis.body_language.virtual_presence_score}/10`} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <InfoBadge label="Gaze Pattern" value={data.analysis.body_language.gaze_pattern} />
              <InfoBadge label="Posture" value={data.analysis.body_language.posture} />
              <InfoBadge label="Smile Type" value={data.analysis.body_language.smile_authenticity} />
              <InfoBadge label="Fidgeting" value={data.analysis.body_language.fidget_frequency} />
            </div>

            {/* Micro Expressions */}
            {data.analysis.body_language.micro_expressions_detected?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-purple-600 mb-3 flex items-center gap-1">
                  <Scan className="w-4 h-4" /> Micro-Expressions Detected
                </p>
                <div className="space-y-2">
                  {data.analysis.body_language.micro_expressions_detected.map((me, i) => (
                    <div key={i} className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs bg-purple-200 px-2 py-0.5 rounded">{me.timestamp}</span>
                        <span className="font-semibold text-purple-800">{me.expression}</span>
                        <span className="text-xs text-purple-600">({me.duration})</span>
                      </div>
                      <p className="text-sm text-slate-600">{me.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-700">{data.analysis.body_language.facial_expressions}</p>
            </div>
          </DetailCard>

          {/* Voice & Tone */}
          <DetailCard
            title="Voice & Tone Analysis"
            icon={<Mic className="w-5 h-5" />}
            score={data.analysis.voice_and_tone.score}
            gradient="from-orange-500 to-amber-500"
          >
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
              <MiniMetric label="WPM" value={data.analysis.voice_and_tone.words_per_minute_estimate.toString()} />
              <MiniMetric label="Authority" value={`${data.analysis.voice_and_tone.tone_authority}/10`} />
              <MiniMetric label="Warmth" value={`${data.analysis.voice_and_tone.tone_warmth}/10`} />
              <MiniMetric label="Enthusiasm" value={`${data.analysis.voice_and_tone.enthusiasm_quotient}/10`} />
              <MiniMetric label="Clarity" value={`${data.analysis.voice_and_tone.articulation_clarity}%`} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <InfoBadge label="Pace" value={data.analysis.voice_and_tone.pace} />
              <InfoBadge label="Volume" value={data.analysis.voice_and_tone.volume_level} />
              <InfoBadge label="Pitch" value={data.analysis.voice_and_tone.pitch_analysis} />
              <InfoBadge label="Endings" value={data.analysis.voice_and_tone.sentence_strength} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-semibold text-red-500 mb-2">Filler Words ({data.analysis.voice_and_tone.filler_word_count} total)</p>
                <div className="flex flex-wrap gap-2">
                  {data.analysis.voice_and_tone.filler_words_detected?.map((word, i) => (
                    <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">"{word}"</span>
                  ))}
                  {(!data.analysis.voice_and_tone.filler_words_detected || data.analysis.voice_and_tone.filler_words_detected.length === 0) && (
                    <span className="text-green-600 text-sm">None detected!</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-600 mb-2">Power Phrases</p>
                <div className="flex flex-wrap gap-2">
                  {data.analysis.voice_and_tone.power_phrases_used?.map((phrase, i) => (
                    <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">"{phrase}"</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-700">{data.analysis.voice_and_tone.feedback}</p>
            </div>
          </DetailCard>

          {/* Professional Presence */}
          <DetailCard
            title="Professional Presence"
            icon={<Star className="w-5 h-5" />}
            score={data.analysis.professional_presence.score}
            gradient="from-emerald-500 to-teal-500"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <MiniMetric label="Gravitas" value={`${data.analysis.professional_presence.gravitas_score}/10`} />
              <MiniMetric label="Conviction" value={`${data.analysis.professional_presence.conviction_level}/10`} />
              <MiniMetric label="Rapport" value={`${data.analysis.professional_presence.rapport_building_ability}/10`} />
              <MiniMetric label="Cultural IQ" value={`${data.analysis.professional_presence.cultural_intelligence}/10`} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <InfoBadge label="Exec Level" value={data.analysis.professional_presence.executive_presence_level} />
              <InfoBadge label="Composure" value={data.analysis.professional_presence.composure_rating} />
              <InfoBadge label="Authenticity" value={data.analysis.professional_presence.authenticity} />
              <InfoBadge label="Confidence" value={data.analysis.professional_presence.confidence_trajectory} />
            </div>

            {data.analysis.professional_presence.memorable_moments?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-emerald-600 mb-2">Memorable Moments</p>
                <ul className="space-y-1">
                  {data.analysis.professional_presence.memorable_moments.map((m, i) => (
                    <li key={i} className="text-sm text-slate-600 bg-emerald-50 p-2 rounded-lg">{m}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-700">{data.analysis.professional_presence.overall_impression}</p>
            </div>
          </DetailCard>
        </div>
      )}

      {/* Psychology Tab */}
      {activeTab === 'psychology' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTU5IDFoLTF2NThoMVYxem0tMiAwSDJ2NThoNTVWMXoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-50"></div>
            <div className="relative">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Fingerprint className="w-7 h-7" />
                Psychological Profile Analysis
              </h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-purple-200 text-xs mb-1">Baseline Anxiety</p>
                  <p className="font-bold">{data.analysis.psychological_insights.baseline_anxiety_level}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-purple-200 text-xs mb-1">Emotional Regulation</p>
                  <p className="font-bold">{data.analysis.psychological_insights.emotional_regulation_quality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-purple-200 text-xs mb-1">Thinking Style</p>
                  <p className="font-bold">{data.analysis.psychological_insights.thinking_style}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-purple-200 text-xs mb-1">Authenticity</p>
                  <p className="font-bold text-sm">{data.analysis.psychological_insights.authenticity_assessment?.slice(0, 50)}...</p>
                </div>
              </div>

              {/* Big Five */}
              <h3 className="font-semibold text-lg mb-4">Personality Indicators (Big Five)</h3>
              <div className="space-y-3">
                <PersonalityBar label="Extraversion" description={data.analysis.psychological_insights.personality_indicators.extraversion_signals} />
                <PersonalityBar label="Conscientiousness" description={data.analysis.psychological_insights.personality_indicators.conscientiousness_signals} />
                <PersonalityBar label="Openness" description={data.analysis.psychological_insights.personality_indicators.openness_signals} />
                <PersonalityBar label="Agreeableness" description={data.analysis.psychological_insights.personality_indicators.agreeableness_signals} />
                <PersonalityBar label="Emotional Stability" description={data.analysis.psychological_insights.personality_indicators.emotional_stability_signals} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                Leadership Markers
              </h3>
              <ul className="space-y-2">
                {data.analysis.psychological_insights.leadership_markers?.map((marker, i) => (
                  <li key={i} className="text-sm text-slate-600 bg-amber-50 p-3 rounded-lg">{marker}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Growth Mindset Indicators
              </h3>
              <ul className="space-y-2">
                {data.analysis.psychological_insights.growth_mindset_indicators?.map((indicator, i) => (
                  <li key={i} className="text-sm text-slate-600 bg-green-50 p-3 rounded-lg">{indicator}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Plan Tab */}
      {activeTab === 'action-plan' && (
        <div className="space-y-6 animate-fade-in">
          {/* Final Verdict */}
          <div className={`rounded-2xl shadow-lg p-6 ${data.final_verdict.ready_for_interview ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-amber-500 to-orange-500'} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">Interview Readiness Assessment</h3>
                <p className="text-white/90">{data.final_verdict.assessor_notes}</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black">{data.final_verdict.ready_for_interview ? 'READY' : 'NOT YET'}</p>
                <p className="text-sm text-white/80">Recommended: {data.final_verdict.recommended_preparation_time}</p>
              </div>
            </div>
          </div>

          {/* Improvement Plan */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-500" />
              Prioritized Improvement Plan
            </h3>
            <div className="space-y-4">
              {data.improvement_plan?.map((step, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-5 border-l-4 border-indigo-500">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {step.priority}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 mb-1">{step.area}</h4>
                      <p className="text-sm text-slate-600 mb-3">{step.action}</p>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                        <div className="bg-white p-2 rounded-lg">
                          <span className="text-slate-500">Current:</span>
                          <span className="block text-slate-700 font-medium truncate">{step.current_state}</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg">
                          <span className="text-slate-500">Target:</span>
                          <span className="block text-slate-700 font-medium truncate">{step.target_state}</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg">
                          <span className="text-slate-500">Practice:</span>
                          <span className="block text-slate-700 font-medium truncate">{step.practice_method}</span>
                        </div>
                        <div className="bg-green-100 p-2 rounded-lg">
                          <span className="text-green-600">Impact:</span>
                          <span className="block text-green-700 font-medium truncate">{step.expected_impact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Exercises */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Flame className="w-6 h-6" />
              Practice Exercises
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data.practice_exercises?.map((exercise, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <h4 className="font-bold mb-2">{exercise.exercise_name}</h4>
                  <p className="text-sm text-white/80 mb-3">{exercise.instructions}</p>
                  <div className="flex gap-3 text-xs">
                    <span className="px-2 py-1 bg-white/20 rounded">{exercise.duration}</span>
                    <span className="px-2 py-1 bg-white/20 rounded">{exercise.frequency}</span>
                    <span className="px-2 py-1 bg-indigo-400/40 rounded">{exercise.target_skill}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Long Term Development */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-purple-500" />
              Long-Term Development Areas
            </h3>
            <ul className="space-y-2">
              {data.long_term_development?.map((item, i) => (
                <li key={i} className="flex items-start gap-3 bg-purple-50 p-4 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};

// Helper Components
const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => {
  const colorClasses: Record<string, string> = {
    indigo: 'bg-indigo-500/20 text-indigo-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/20 text-orange-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    pink: 'bg-pink-500/20 text-pink-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
    amber: 'bg-amber-500/20 text-amber-400',
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
      <div className="flex items-center gap-2 mb-1">
        <div className={`p-1.5 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <span className="text-xs text-slate-300">{label}</span>
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
};

const DetailCard: React.FC<{ title: string; icon: React.ReactNode; score: number; gradient: string; children: React.ReactNode }> = ({ title, icon, score, gradient, children }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
    <div className={`bg-gradient-to-r ${gradient} p-5`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl text-white">{icon}</div>
          <h3 className="font-bold text-white text-lg">{title}</h3>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-white">{score}</span>
          <span className="text-white/80">/10</span>
        </div>
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const MiniMetric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-slate-100 rounded-lg p-3 text-center">
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <p className="font-bold text-slate-800">{value}</p>
  </div>
);

const InfoBadge: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="font-semibold text-slate-800 text-sm truncate">{value}</p>
  </div>
);

const PersonalityBar: React.FC<{ label: string; description: string }> = ({ label, description }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
    <div className="flex items-center justify-between mb-1">
      <span className="font-medium text-sm">{label}</span>
    </div>
    <p className="text-white/80 text-xs">{description}</p>
  </div>
);
