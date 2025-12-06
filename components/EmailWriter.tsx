import React, { useState } from 'react';
import { generateEmail, EmailType } from '../services/aiWriterService';
import { ArrowLeft } from 'lucide-react';

interface EmailWriterProps {
  onBack: () => void;
}

interface EmailContext {
  recipientName?: string;
  companyName?: string;
  position?: string;
  interviewDate?: string;
  specificPoints?: string;
  currentOffer?: string;
  desiredSalary?: string;
  otherBenefits?: string;
  relevantExperience?: string;
  keySkills?: string;
  rejectionReason?: string;
  continuedInterest?: string;
}

const emailTypeConfig: Record<EmailType, { icon: string; color: string; fields: (keyof EmailContext)[] }> = {
  'follow-up': {
    icon: '📬',
    color: 'from-blue-500 to-blue-600',
    fields: ['recipientName', 'companyName', 'position', 'interviewDate', 'specificPoints']
  },
  'thank-you': {
    icon: '🙏',
    color: 'from-green-500 to-green-600',
    fields: ['recipientName', 'companyName', 'position', 'interviewDate', 'specificPoints']
  },
  'negotiation': {
    icon: '💼',
    color: 'from-purple-500 to-purple-600',
    fields: ['recipientName', 'companyName', 'position', 'currentOffer', 'desiredSalary', 'otherBenefits']
  },
  'application': {
    icon: '📝',
    color: 'from-orange-500 to-orange-600',
    fields: ['recipientName', 'companyName', 'position', 'relevantExperience', 'keySkills']
  },
  'rejection-response': {
    icon: '💪',
    color: 'from-pink-500 to-pink-600',
    fields: ['recipientName', 'companyName', 'position', 'rejectionReason', 'continuedInterest']
  }
};

const fieldLabels: Record<keyof EmailContext, { label: string; placeholder: string; multiline?: boolean }> = {
  recipientName: { label: 'Recipient Name', placeholder: 'e.g., John Smith' },
  companyName: { label: 'Company Name', placeholder: 'e.g., Google Inc.' },
  position: { label: 'Position/Role', placeholder: 'e.g., Senior Software Engineer' },
  interviewDate: { label: 'Interview Date', placeholder: 'e.g., March 15, 2024' },
  specificPoints: { label: 'Specific Discussion Points', placeholder: 'Key topics discussed during the interview...', multiline: true },
  currentOffer: { label: 'Current Offer', placeholder: 'e.g., $120,000 base salary + benefits' },
  desiredSalary: { label: 'Desired Salary', placeholder: 'e.g., $140,000' },
  otherBenefits: { label: 'Other Benefits to Negotiate', placeholder: 'e.g., Remote work, signing bonus, stock options', multiline: true },
  relevantExperience: { label: 'Relevant Experience', placeholder: 'Brief summary of your relevant experience...', multiline: true },
  keySkills: { label: 'Key Skills', placeholder: 'e.g., React, Node.js, Python, AWS', multiline: true },
  rejectionReason: { label: 'Rejection Reason (if known)', placeholder: 'e.g., Position filled internally' },
  continuedInterest: { label: 'Why You\'re Still Interested', placeholder: 'Your reasons for staying interested...', multiline: true }
};

export const EmailWriter: React.FC<EmailWriterProps> = ({ onBack }) => {
  const [selectedType, setSelectedType] = useState<EmailType>('follow-up');
  const [context, setContext] = useState<EmailContext>({});
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const emailTypes: { type: EmailType; name: string; description: string }[] = [
    { type: 'follow-up', name: 'Follow-up Email', description: 'Check on application status' },
    { type: 'thank-you', name: 'Thank You Email', description: 'Post-interview gratitude' },
    { type: 'negotiation', name: 'Salary Negotiation', description: 'Negotiate your offer' },
    { type: 'application', name: 'Job Application', description: 'Apply for a position' },
    { type: 'rejection-response', name: 'Rejection Response', description: 'Respond professionally to rejection' }
  ];

  const handleTypeChange = (type: EmailType) => {
    setSelectedType(type);
    setContext({});
    setGeneratedEmail('');
    setError('');
  };

  const handleContextChange = (field: keyof EmailContext, value: string) => {
    setContext(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    const config = emailTypeConfig[selectedType];
    const requiredFields = config.fields.slice(0, 3); // First 3 fields are usually required
    
    const missingFields = requiredFields.filter(field => !context[field]?.trim());
    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.map(f => fieldLabels[f].label).join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedEmail('');

    try {
      const result = await generateEmail(selectedType, context);
      setGeneratedEmail(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedEmail], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedType}-email.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setContext({});
    setGeneratedEmail('');
    setError('');
  };

  const currentConfig = emailTypeConfig[selectedType];

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

      <div className="max-w-6xl mx-auto pt-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6 animate-bounce-subtle">
            <span className="text-lg">✉️</span>
            <span className="text-sm font-semibold text-violet-300">AI Email Writer</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Write Professional
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Job-Related Emails
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Generate professional job-related emails instantly with AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            {/* Email Type Selection */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span>📋</span> Select Email Type
              </h2>
              <div className="grid gap-3">
                {emailTypes.map((email) => {
                  const config = emailTypeConfig[email.type];
                  return (
                    <button
                      key={email.type}
                      onClick={() => handleTypeChange(email.type)}
                      className={`p-4 rounded-xl text-left transition-all duration-200 ${
                        selectedType === email.type
                          ? `bg-gradient-to-r ${config.color} text-white shadow-lg scale-[1.02]`
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{config.icon}</span>
                        <div>
                          <div className="font-medium">{email.name}</div>
                          <div className={`text-sm ${selectedType === email.type ? 'text-white/80' : 'text-gray-500'}`}>
                            {email.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Context Fields */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span>📝</span> Email Details
              </h2>
              <div className="space-y-4">
                {currentConfig.fields.map((field, index) => {
                  const fieldInfo = fieldLabels[field];
                  const isRequired = index < 3;
                  
                  return (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {fieldInfo.label}
                        {isRequired && <span className="text-red-400 ml-1">*</span>}
                      </label>
                      {fieldInfo.multiline ? (
                        <textarea
                          value={context[field] || ''}
                          onChange={(e) => handleContextChange(field, e.target.value)}
                          placeholder={fieldInfo.placeholder}
                          rows={3}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={context[field] || ''}
                          onChange={(e) => handleContextChange(field, e.target.value)}
                          placeholder={fieldInfo.placeholder}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className={`flex-1 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    isLoading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : `bg-gradient-to-r ${currentConfig.color} hover:shadow-lg hover:shadow-purple-500/25`
                  } text-white`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Generate Email</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
                >
                  🗑️ Clear
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Generated Email */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span>✉️</span> Generated Email
              </h2>
              {generatedEmail && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-gray-300'
                    }`}
                  >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg text-sm font-medium transition-all"
                  >
                    💾 Download
                  </button>
                </div>
              )}
            </div>

            {generatedEmail ? (
              <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10 min-h-[500px]">
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-200 text-base leading-relaxed">
                    {generatedEmail}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-800/30 rounded-xl border-2 border-dashed border-white/10">
                <span className="text-6xl mb-4 opacity-50">✉️</span>
                <p className="text-gray-500 text-center">
                  Your AI-generated email will appear here
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Fill in the details and click Generate
                </p>
              </div>
            )}

            {/* Email Tips */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
              <h3 className="text-sm font-semibold text-purple-300 mb-2">💡 Pro Tips</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Always personalize the email with specific details from your interaction</li>
                <li>• Send follow-up emails within 24-48 hours of the interview</li>
                <li>• Keep negotiation emails professional and backed by research</li>
                <li>• Review and edit the generated email before sending</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailWriter;
