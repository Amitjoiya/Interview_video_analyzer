import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Search, Loader2, AlertCircle, CheckCircle2, Target, 
  Briefcase, Code, MapPin, DollarSign, Users, Building, Upload, X,
  Lightbulb, AlertTriangle, BookOpen, Sparkles, Copy, Check, FileText,
  TrendingUp, Zap, MessageSquare, Award, ClipboardList
} from 'lucide-react';
import { 
  analyzeJobDescription, 
  analyzeJobWithResume, 
  JobAnalysisResult, 
  JobResumeComparisonResult,
  extractTextFromDocument,
  getAcceptedFileTypes,
  isSupportedFileType
} from '../services/aiWriterService';

interface JobAnalyzerProps {
  onBack: () => void;
}

export const JobAnalyzer: React.FC<JobAnalyzerProps> = ({ onBack }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JobAnalysisResult | JobResumeComparisonResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [includeResume, setIncludeResume] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isComparisonResult = (r: JobAnalysisResult | JobResumeComparisonResult): r is JobResumeComparisonResult => {
    return 'matchScore' in r;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSupportedFileType(file)) {
      setError('Unsupported file type. Please upload PDF, Word, PowerPoint, or text files.');
      return;
    }

    setUploadingResume(true);
    setError(null);
    
    try {
      const text = await extractTextFromDocument(file);
      setResumeText(text);
      setUploadedFileName(file.name);
      setIncludeResume(true);
    } catch (err: any) {
      setError(err.message || 'Failed to read file. Please paste your resume text instead.');
    } finally {
      setUploadingResume(false);
    }
  };

  const clearUploadedFile = () => {
    setUploadedFileName(null);
    setResumeText('');
    setIncludeResume(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description to analyze');
      return;
    }

    if (includeResume && !resumeText.trim()) {
      setError('Please upload or paste your resume to compare');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let analysisResult;
      if (includeResume && resumeText.trim()) {
        analysisResult = await analyzeJobWithResume(jobDescription, resumeText);
      } else {
        analysisResult = await analyzeJobDescription(jobDescription);
      }
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze job description');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setJobDescription('');
    setResumeText('');
    setResult(null);
    setError(null);
    setUploadedFileName(null);
    setIncludeResume(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-amber-500';
    if (score >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <div className="min-h-[80vh] animate-fade-in">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-24 left-4 sm:left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      <div className="max-w-6xl mx-auto pt-16 px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6 animate-bounce-subtle">
            <Search className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">AI Job Description Analyzer</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Decode Any
            <span className="block bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Job Posting
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Extract key skills, requirements, red flags, and compare with your resume
          </p>
        </div>

        {!result ? (
          /* Input Section */
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Job Description */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 sm:p-8">
              <label className="block text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                Paste Job Description *
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here... Include job title, responsibilities, requirements, qualifications, etc."
                rows={10}
                className="w-full p-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 resize-none font-mono text-sm"
              />
            </div>

            {/* Resume Upload Section */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-violet-400" />
                  Compare with Your Resume
                  <span className="text-xs font-normal text-slate-400 ml-2">(Optional but recommended)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeResume}
                    onChange={(e) => setIncludeResume(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 text-violet-500 focus:ring-violet-500 bg-slate-800"
                  />
                  <span className="text-sm text-slate-400">Include Resume Comparison</span>
                </label>
              </div>

              {includeResume && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <input 
                      ref={fileInputRef} 
                      type="file" 
                      accept={getAcceptedFileTypes()} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      disabled={uploadingResume}
                      className="flex items-center gap-2 px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 rounded-xl transition-all disabled:opacity-50"
                    >
                      {uploadingResume ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Extracting Text...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" /> Upload Resume
                        </>
                      )}
                    </button>
                    {uploadedFileName && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-violet-500/20 text-violet-300 rounded-xl text-sm">
                        <FileText className="w-4 h-4" />
                        <span className="max-w-[200px] truncate">{uploadedFileName}</span>
                        <button onClick={clearUploadedFile} className="ml-1 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <span className="text-xs text-slate-500">
                      Supports: PDF, Word, PowerPoint, Text
                    </span>
                  </div>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Or paste your resume content here..."
                    rows={6}
                    className="w-full p-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none font-mono text-sm"
                  />
                </div>
              )}

              {!includeResume && (
                <div className="p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-600/50 text-center">
                  <p className="text-slate-400 text-sm">
                    Enable resume comparison to get a match score, personalized tips, predicted interview questions, and more!
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || !jobDescription.trim()}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {includeResume ? 'Analyzing & Comparing...' : 'Analyzing Job Description...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {includeResume ? 'Analyze & Compare with Resume' : 'Analyze Job Description'}
                </>
              )}
            </button>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Analyze Another
              </button>
              <button
                onClick={() => handleCopy(JSON.stringify(result, null, 2))}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy All'}
              </button>
            </div>

            {/* Match Score (if resume comparison) */}
            {isComparisonResult(result) && (
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5 text-amber-400" />
                      Match Score
                    </h3>
                    <p className="text-slate-400 text-sm max-w-xl">{result.overallAssessment}</p>
                  </div>
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${getScoreColor(result.matchScore)}`}>
                      {result.matchScore}%
                    </div>
                    <div className={`text-sm mt-1 bg-gradient-to-r ${getScoreBg(result.matchScore)} bg-clip-text text-transparent font-medium`}>
                      {result.matchScore >= 80 ? 'Excellent Match' : result.matchScore >= 60 ? 'Good Match' : result.matchScore >= 40 ? 'Fair Match' : 'Low Match'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Job Overview */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                Job Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-700/30 p-4 rounded-xl">
                  <div className="text-sm text-slate-400 mb-1">Job Title</div>
                  <div className="text-white font-medium">{result.jobTitle || 'Not specified'}</div>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-xl">
                  <div className="text-sm text-slate-400 mb-1">Company</div>
                  <div className="text-white font-medium">{result.company || 'Not specified'}</div>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-xl">
                  <div className="text-sm text-slate-400 mb-1">Location</div>
                  <div className="text-white font-medium">{result.location || 'Not specified'}</div>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-xl">
                  <div className="text-sm text-slate-400 mb-1">Experience Level</div>
                  <div className="text-white font-medium">{result.experienceLevel || 'Not specified'}</div>
                </div>
              </div>
            </div>

            {/* Skills Comparison (if resume comparison) */}
            {isComparisonResult(result) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-900/30 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-green-500/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Skills You Have ({result.matchedSkills?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedSkills?.map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-green-500/20 text-green-300 rounded-lg text-sm font-medium">
                        ✓ {skill}
                      </span>
                    )) || <span className="text-slate-500">None identified</span>}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-900/30 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-red-500/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Skills to Develop ({result.missingSkills?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills?.map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded-lg text-sm font-medium">
                        ✗ {skill}
                      </span>
                    )) || <span className="text-slate-500">None identified</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Skills Required */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-400" />
                  Technical Skills Required
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.technicalSkills?.map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-medium">{skill}</span>
                  )) || <span className="text-slate-500">None extracted</span>}
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  Soft Skills Required
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.softSkills?.map((skill, index) => (
                    <span key={index} className="px-3 py-1.5 bg-green-500/20 text-green-300 rounded-lg text-sm font-medium">{skill}</span>
                  )) || <span className="text-slate-500">None extracted</span>}
                </div>
              </div>
            </div>

            {/* Action Plan (if resume comparison) */}
            {isComparisonResult(result) && result.actionPlan && result.actionPlan.length > 0 && (
              <div className="bg-gradient-to-br from-violet-900/30 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-violet-500/30 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-violet-400" />
                  Your Action Plan
                </h3>
                <ul className="space-y-3">
                  {result.actionPlan.map((action, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-300">
                      <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0 text-sm font-medium">{index + 1}</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Predicted Interview Questions */}
            {isComparisonResult(result) && result.interviewQuestionsPredicted && result.interviewQuestionsPredicted.length > 0 && (
              <div className="bg-gradient-to-br from-amber-900/30 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-amber-500/30 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  Predicted Interview Questions
                </h3>
                <ul className="space-y-3">
                  {result.interviewQuestionsPredicted.map((question, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-300 p-3 bg-slate-800/50 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 text-sm font-medium">Q{index + 1}</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Resume Suggestions */}
            {isComparisonResult(result) && result.resumeSuggestions && result.resumeSuggestions.length > 0 && (
              <div className="bg-gradient-to-br from-cyan-900/30 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-cyan-400" />
                  Resume Improvement Suggestions
                </h3>
                <ul className="space-y-2">
                  {result.resumeSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Responsibilities */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Key Responsibilities
              </h3>
              <ul className="space-y-2">
                {result.responsibilities?.map((resp, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                )) || <li className="text-slate-500">No responsibilities extracted</li>}
              </ul>
            </div>

            {/* Qualifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Required Qualifications
                </h3>
                <ul className="space-y-2">
                  {result.requiredQualifications?.map((qual, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                      <span>{qual}</span>
                    </li>
                  )) || <li className="text-slate-500">None specified</li>}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Preferred Qualifications
                </h3>
                <ul className="space-y-2">
                  {result.preferredQualifications?.map((qual, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                      <span>{qual}</span>
                    </li>
                  )) || <li className="text-slate-500">None specified</li>}
                </ul>
              </div>
            </div>

            {/* Red Flags */}
            {result.redFlags && result.redFlags.length > 0 && (
              <div className="bg-gradient-to-br from-red-900/30 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-red-500/30 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Potential Red Flags
                </h3>
                <ul className="space-y-2">
                  {result.redFlags.map((flag, index) => (
                    <li key={index} className="flex items-start gap-3 text-red-300">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preparation Tips */}
            <div className="bg-gradient-to-br from-indigo-900/30 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-indigo-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-indigo-400" />
                Interview Preparation Tips
              </h3>
              <ul className="space-y-3">
                {result.preparationTips?.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 text-sm font-medium">{index + 1}</span>
                    <span>{tip}</span>
                  </li>
                )) || <li className="text-slate-500">No tips generated</li>}
              </ul>
            </div>

            {/* Salary Insights */}
            {result.salaryInsights && (
              <div className="bg-gradient-to-br from-emerald-900/30 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-emerald-500/30 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Salary Insights
                </h3>
                <p className="text-slate-300">{result.salaryInsights}</p>
              </div>
            )}

            {/* Keywords to Use */}
            {result.keywordsToUse && result.keywordsToUse.length > 0 && (
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  Keywords to Use in Your Application
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywordsToUse.map((keyword, index) => (
                    <span key={index} className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-cyan-500/30 transition-colors" onClick={() => handleCopy(keyword)}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobAnalyzer;
