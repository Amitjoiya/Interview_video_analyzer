import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, X, Send, Bot, User, Sparkles, 
  Loader2, Minimize2, Maximize2, Trash2, Volume2, VolumeX
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatBotProps {
  context?: {
    type: 'video-analysis' | 'resume-analysis' | 'general';
    data?: any;
  };
}

const SYSTEM_PROMPT = `You are APEX-7 Support Assistant - the official AI assistant for the AI Interview Coach platform.

YOUR ROLE:
You are a professional customer support chatbot. You ONLY help with questions about this website and its features.

ABOUT THE PLATFORM - AI Interview Coach (APEX-7):
This is an AI-powered career development platform with these features:

1. VIDEO ANALYSIS - Upload practice interview videos for AI analysis
   • FACS facial expression detection
   • Voice tone and clarity analysis
   • Body language assessment
   • Content quality evaluation
   • 12-module comprehensive feedback
   • Overall interview score out of 100

2. RESUME CHECKER - AI-powered resume analysis
   • ATS compatibility score
   • Section-by-section feedback
   • Keyword optimization
   • 10 sections analyzed
   • Improvement suggestions

3. PDF TOOLS - Complete PDF toolkit
   • Merge multiple PDFs
   • Split PDF pages
   • Compress file size
   • Add watermarks
   • Add page numbers
   • Rotate pages
   • Extract pages

4. COVER LETTER GENERATOR - AI-generated cover letters
   • Tailored to job descriptions
   • 4 different tones (Professional, Creative, Confident, Friendly)
   • Based on your resume

5. JOB DESCRIPTION ANALYZER - Decode any job posting
   • Extract key skills required
   • Identify red flags
   • Get preparation tips
   • Match your qualifications

6. AI EMAIL WRITER - Professional job-related emails
   • Follow-up emails
   • Thank you notes
   • Salary negotiation
   • Interview requests
   • Decline offers professionally

7. LINKEDIN OPTIMIZER - Profile enhancement
   • Profile score assessment
   • Keyword suggestions
   • Headline optimization
   • Summary improvement

8. INTERVIEW Q&A BANK - Role-specific questions
   • 50+ questions per role
   • Model answers (STAR format)
   • Behavioral questions
   • Technical questions
   • Situational questions

9. SALARY NEGOTIATION COACH
   • Market salary insights
   • Negotiation scripts
   • Counter-offer strategies
   • Email templates

PRICING & CREDITS:
• Free Plan: 50 credits/month
• Pro Plan: ₹499/month - 500 credits
• Enterprise Plan: ₹1499/month - Unlimited credits

Credit costs per feature:
• Resume Analysis: 2 credits
• Video Analysis: 5 credits
• Cover Letter: 3 credits
• Job Analysis: 1 credit
• Email Writing: 1 credit
• LinkedIn Optimization: 2 credits
• Q&A Generation: 2 credits
• Salary Research: 2 credits

STRICT RULES:
1. ONLY answer questions about this website, its features, pricing, and how to use them
2. For ANY off-topic question (coding, general knowledge, personal advice, etc.), politely redirect:
   "I'm APEX-7 Support Assistant, designed specifically to help you with AI Interview Coach features. I can answer questions about our video analysis, resume checker, cover letter generator, and other career tools. How can I help you with these features today? 😊"
3. Be friendly, professional, and helpful
4. Keep answers concise and focused
5. Use emojis sparingly for friendliness
6. If user writes in Hinglish, respond in Hinglish (Roman script only, no Devanagari)
7. Guide users to try different features based on their career needs
8. For technical issues, suggest refreshing the page or checking their internet connection

EXAMPLE OFF-TOPIC HANDLING:
User: "What is the capital of France?"
You: "I'm here to help you with AI Interview Coach! 😊 I can assist with resume analysis, interview preparation, cover letters, and more. Would you like to know how to use any of our features?"

User: "Write Python code for sorting"
You: "I specialize in helping you ace your interviews and career development! I can guide you through our video analysis, resume checker, or interview Q&A bank. What would you like help with?"`;

// Helper to clean markdown formatting from response
const cleanMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove bold **text**
    .replace(/\*(.+?)\*/g, '$1')       // Remove italic *text*
    .replace(/#{1,6}\s*/g, '')         // Remove headers
    .replace(/`(.+?)`/g, '$1')         // Remove inline code
    .replace(/^\s*[-*]\s+/gm, '• ')    // Convert bullets to simple dots
    .replace(/^\s*\d+\.\s+/gm, '')     // Remove numbered lists
    .replace(/\n{3,}/g, '\n\n')        // Max 2 newlines
    .trim();
};

export const AIChatBot: React.FC<AIChatBotProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! 👋 I\'m APEX-7 Support Assistant.\n\nI can help you with:\n• Video Interview Analysis\n• Resume Checker & ATS Score\n• Cover Letter Generator\n• Job Description Analysis\n• LinkedIn Profile Optimization\n• Interview Q&A Preparation\n• Salary Negotiation Tips\n• PDF Tools\n\nHow can I assist you today? 🚀',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE) || 'http://localhost:5001';

      // Build context message if available
      let contextMessage = '';
      if (context?.data) {
        if (context.type === 'video-analysis') {
          contextMessage = `\n\n[CONTEXT: User's video analysis - Overall Score: ${context.data.executive_summary?.overall_score}/100, 
          Content: ${context.data.analysis?.content_quality?.score}/10, 
          Body Language: ${context.data.analysis?.body_language?.score}/10,
          Voice: ${context.data.analysis?.voice_and_tone?.score}/10,
          Verdict: ${context.data.executive_summary?.one_line_verdict}]`;
        } else if (context.type === 'resume-analysis') {
          contextMessage = `\n\n[CONTEXT: User's resume analysis - Overall Score: ${context.data.overall_score}/100,
          ATS Score: ${context.data.ats_compatibility_score}/100,
          Strengths: ${context.data.strengths?.join(', ')},
          Weaknesses: ${context.data.weaknesses?.join(', ')}]`;
        }
      }

      // Build conversation history as a single text prompt - keep only last 4 for speed
      const recentMessages = messages.slice(-4);
      let conversationText = recentMessages.map(m => 
        `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
      ).join('\n\n');
      
      const fullPrompt = `${SYSTEM_PROMPT}\n\n--- CONVERSATION ---\n${conversationText}\n\nUser: ${input.trim()}${contextMessage}\n\nAssistant:`;

      const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-2.5-flash',
          prompt: fullPrompt,
          config: {
            temperature: 0.7,
            topP: 0.8,
            maxOutputTokens: 8000
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const rawText = data.text || 'Sorry, I couldn\'t generate a response. Please try again.';
      const cleanedText = cleanMarkdown(rawText);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanedText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Sorry, I\'m having trouble connecting. Please make sure the server is running and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Chat cleared! 🔄\n\nI\'m here to help with AI Interview Coach features:\n• Resume Analysis\n• Video Interview Feedback\n• Cover Letters & Emails\n• Interview Preparation\n\nWhat would you like to know?',
      timestamp: new Date()
    }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-110 group"
        aria-label="Open AI Chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          APEX-7 🤖
        </span>
      </button>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setIsMinimized(false)}>
          <Bot className="w-5 h-5 text-white" />
          <span className="text-white font-medium">APEX-7</span>
          <div className="flex gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full chat window
  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-scale-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center gap-3">
        <div className="relative">
          <div className="p-2 bg-white/20 rounded-xl">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-indigo-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-sm">APEX-7</h3>
          <p className="text-indigo-200 text-xs">Ask me anything! 🌍</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={clearChat}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user' 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}>
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Sparkles className="w-4 h-4 text-white" />
              )}
            </div>
            <div className={`max-w-[75%] ${message.role === 'user' ? 'text-right' : ''}`}>
              <div className={`px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-md'
                  : 'bg-white text-slate-800 shadow-md border border-slate-100 rounded-bl-md'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
              <div className={`flex items-center gap-2 mt-1 ${message.role === 'user' ? 'justify-end' : ''}`}>
                <span className="text-xs text-slate-400">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {message.role === 'assistant' && (
                  <button
                    onClick={() => isSpeaking ? stopSpeaking() : speakMessage(message.content)}
                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                    title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                  >
                    {isSpeaking ? (
                      <VolumeX className="w-3 h-3 text-slate-400" />
                    ) : (
                      <Volume2 className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-md border border-slate-100">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                <span className="text-sm text-slate-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-slate-100 flex gap-2 overflow-x-auto">
        {[
          '� Coding help',
          '🎬 Suggest a movie',
          '📚 Tell me something interesting',
          '🚀 Interview tips',
          '🧠 GK question'
        ].map((action) => (
          <button
            key={action}
            onClick={() => setInput(action.split(' ').slice(1).join(' '))}
            className="flex-shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-medium text-slate-600 transition-colors"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything... 🚀"
            className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-xl transition-all transform hover:scale-105 disabled:scale-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;
