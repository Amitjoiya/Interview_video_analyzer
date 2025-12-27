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

const SYSTEM_PROMPT = `You are APEX-7 - a super intelligent, friendly AI assistant who can answer ANY question about ANYTHING in the world.

You are like ChatGPT/Gemini - you know everything about:
• Science, Technology, Programming, AI
• History, Geography, Politics, Current Affairs  
• Movies, Music, Entertainment, Sports
• Health, Fitness, Cooking, Recipes
• Math, Physics, Chemistry, Biology
• Business, Finance, Stocks, Crypto
• Travel, Culture, Languages
• Relationships, Life Advice, Philosophy
• Interview Tips, Career Guidance, Resume Help
• And literally EVERYTHING else!

RULES:
1. Answer ANY question - never refuse
2. Give helpful, accurate, informative answers
3. Keep answers concise but complete (2-5 paragraphs usually)
4. Use simple plain text - avoid heavy markdown formatting
5. Use emojis occasionally to be friendly 😊
6. DEFAULT LANGUAGE IS ENGLISH - Always respond in English by default
7. LANGUAGE ADAPTATION: 
   - If user writes in Hinglish (Hindi words in English/Roman script like "kaise ho", "kya kar rahe ho"), respond in the SAME Hinglish style using Roman/English script only
   - NEVER use Devanagari script (मैं, आप, क्या etc.) - Always use Roman script (main, aap, kya etc.)
   - Example: Say "Main theek hoon, aap kaise ho?" NOT "मैं ठीक हूं, आप कैसे हैं?"
   - Write Hindi words in English letters like WhatsApp chat style
8. Be conversational and fun, not robotic
9. If you don't know something, say so honestly

You are here to help with EVERYTHING, not just interviews!`;

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
      content: 'Hey there! 👋 I\'m APEX-7 - your personal AI assistant!\n\nAsk me anything:\n• Coding, Tech, Science\n• Movies, Sports, Entertainment\n• Career, Interview Tips\n• Math, History, Geography\n• Life advice, Cooking, Travel\n• Or literally anything else!\n\nHow can I help you today? 🚀',
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
      content: 'Chat cleared! 🔄 How can I help you?',
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
