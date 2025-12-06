import React, { useState, useRef } from 'react';
import { 
  FileText, ArrowLeft, Sparkles, Copy, Download, Check, Loader2, 
  AlertCircle, Upload, Briefcase, Building, MessageSquare, Lightbulb,
  CheckCircle2, Target, Wand2, X
} from 'lucide-react';
import { generateCoverLetter, CoverLetterInput, CoverLetterResult, extractTextFromDocument, getAcceptedFileTypes, isSupportedFileType } from '../services/aiWriterService';

interface CoverLetterGeneratorProps {
  onBack: () => void;
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ onBack }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [tone, setTone] = useState<'professional' | 'creative' | 'casual'>('professional');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    } catch (err: any) {
      setError(err.message || 'Failed to read file. Please paste your resume text instead.');
    } finally {
      setUploadingResume(false);
    }
  };

  const clearUploadedFile = () => {
    setUploadedFileName(null);
    setResumeText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobDescription.trim() || !companyName.trim() || !jobTitle.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const input: CoverLetterInput = {
        resumeText,
        jobDescription,
        companyName,
        jobTitle,
        tone,
        additionalNotes: additionalNotes || undefined
      };
      const response = await generateCoverLetter(input);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.coverLetter) {
      navigator.clipboard.writeText(result.coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadAsText = () => {
    if (result?.coverLetter) {
      const blob = new Blob([result.coverLetter], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Cover_Letter_${companyName.replace(/\s+/g, '_')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const tones = [
    { id: 'professional', name: 'Professional', desc: 'Formal & Corporate', color: 'from-blue-500 to-indigo-500' },
    { id: 'creative', name: 'Creative', desc: 'Engaging & Unique', color: 'from-purple-500 to-pink-500' },
    { id: 'casual', name: 'Casual', desc: 'Friendly & Warm', color: 'from-green-500 to-teal-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              AI Cover Letter Generator
            </h1>
            <p className="text-slate-400 mt-1">Create personalized cover letters tailored to each job</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-5">
            {/* Resume Input */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-400" />
                  Your Resume / Background *
                </label>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept={getAcceptedFileTypes()} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <div className="flex items-center gap-2">
                  {uploadedFileName && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-violet-500/20 text-violet-300 rounded-lg text-xs">
                      <FileText className="w-3 h-3" />
                      <span className="max-w-[100px] truncate">{uploadedFileName}</span>
                      <button onClick={clearUploadedFile} className="ml-1 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={uploadingResume}
                    className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 disabled:opacity-50"
                  >
                    {uploadingResume ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" /> Extracting...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3" /> Upload File
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="text-xs text-slate-500 mb-2">
                Supports: PDF, Word (.doc, .docx), PowerPoint (.ppt, .pptx), Text (.txt)
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content, skills, experience, and achievements here..."
                className="w-full h-40 bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none text-sm"
              />
            </div>

            {/* Job Description */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-5">
              <label className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-amber-400" />
                Job Description *
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here..."
                className="w-full h-32 bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none text-sm"
              />
            </div>

            {/* Company & Job Title */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4">
                <label className="text-sm font-medium text-white flex items-center gap-2 mb-2">
                  <Building className="w-4 h-4 text-emerald-400" />
                  Company Name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Google"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 outline-none text-sm"
                />
              </div>
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4">
                <label className="text-sm font-medium text-white flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-rose-400" />
                  Job Title *
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* Tone Selection */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-5">
              <label className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                Writing Tone
              </label>
              <div className="grid grid-cols-3 gap-3">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id as any)}
                    className={`p-3 rounded-xl border transition-all text-left ${
                      tone === t.id
                        ? 'bg-gradient-to-br ' + t.color + ' border-transparent text-white'
                        : 'bg-slate-900/50 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className={`text-xs ${tone === t.id ? 'text-white/80' : 'text-slate-500'}`}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-5">
              <label className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Additional Notes (Optional)
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any specific points you want to highlight, achievements to mention, or style preferences..."
                className="w-full h-20 bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none text-sm"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !resumeText || !jobDescription || !companyName || !jobTitle}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
                loading || !resumeText || !jobDescription || !companyName || !jobTitle
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/25'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Cover Letter...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Cover Letter
                </>
              )}
            </button>
          </div>

          {/* Result Section */}
          <div className="space-y-5">
            {result ? (
              <>
                {/* Cover Letter */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-violet-400" />
                      Your Cover Letter
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={downloadAsText}
                        className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-5 max-h-[400px] overflow-y-auto">
                    <pre className="text-slate-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {result.coverLetter}
                    </pre>
                  </div>
                </div>

                {/* Matched Skills */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-5">
                  <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Matched Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedSkills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Highlights */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-5">
                  <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-amber-400" />
                    Key Highlights
                  </h3>
                  <ul className="space-y-2">
                    {result.keyHighlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <span className="text-amber-400 mt-0.5">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggestions */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-5">
                  <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Improvement Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {result.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <span className="text-yellow-400 mt-0.5">💡</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Your Cover Letter Will Appear Here</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                  Fill in your resume details and job information, then click generate to create a personalized cover letter.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
